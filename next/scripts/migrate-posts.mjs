import os from "os";
import fs from "fs";
import fspromises from "node:fs/promises";
import path from "path";
import { spawnSync } from "child_process";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeParse from "rehype-parse";
import remarkStringify from "remark-stringify";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

import puppeteer from "puppeteer";
// Instructions
// Export medium data from medium.com
// Add the .zip file under next/ as `medium-export.zip`
// Create a folder `mkdir medium-export`
// Unzip with `unzip medium-export.zip -d medium-export`

const MEDIUM_FOLDER = path.join(process.cwd(), "medium-export");
const POSTS_DIR = path.join(MEDIUM_FOLDER, "posts");

const BIN_MEDIUM_2_MD = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  "medium-2-md",
);

const OUTPUT_DIR_MD_FILES = path.join(MEDIUM_FOLDER, "md");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getImageExtension(url) {
  // sleep
  await delay(3000);

  const res = await fetch(url, {
    headers: {
      Cookie:
        "uid=lo_f0a02592ae59; sid=1:5GDMD2nmEN7NSBEwN7HkLYTfXYCZhMzxPsy1zAM2JhyuLa+PyxFIUz8T/p9v0ude; _ga=GA1.1.1786719431.1722653287; _ga_7JY7T788PK=GS1.1.1722734223.3.0.1722734232.0.0.0; _cfuvid=sxegz10DIvDwu.k0ZTNnmikEXryXR4aDMWu1odShB0g-1723937913464-0.0.1.1-604800000; cf_clearance=krBGHgDKhTH_fjPFWewy3dCDepJeDIaWqWTKIJJFsr0-1723937915-1.2.1.1-a7heicaMiK3An09rzm0cBKkJZ2R.dUOgy7OWSeYWy2p1PIjBNZPVEYU2z96bL0r.VO4D4iukd7qIuo6z6qGXXQzARsUpmQEViohKBytQhVO8EV0feAXYiIRDLxqX.x6YWlxo.cXvHb0XXo4EqXKUQnR6A22V8w0VwWeCX_..TfrmCuw.hV5aQcTX5dsEzQVsUwL_ZbuuOmjlKFZkQU.B9dtlql80XsgO0nCbtCqtyaYdpWId4wBAc9Jy4AYpCDSEG23S7bbT.Vz0dwIUrxlbz8pGH.Vntpnjq4Y6i2IFwnIxdzV6hyiKMqi1v7odN2Z5RafehBTk0LEvUoBhmUZzq7KsYB6RASmBwXohdNV8jyRHa7MFq23h2ESyTo4Y6SyM",
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (res.status === 429) {
    console.warn("Response 409");
    await delay(5000);
    return getImageExtension(url);
  }

  const contentType = res.headers.get("content-type");

  const imageUrlPattern = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;

  if (imageUrlPattern.test(url)) {
    return url.split(".").at(-1);
  } else if (contentType === "image/jpeg") {
    return "jpg";
  } else if (contentType === "image/png") {
    return "png";
  } else if (contentType === "image/gif") {
    return "gif";
  } else {
    console.log(res);
    throw new Error(`Invalid ${url}`);
  }
}

const getExtensionFromContentType = (contentType) => {
  if (contentType === "image/jpeg") {
    return "jpg";
  } else if (contentType === "image/png") {
    return "png";
  } else if (contentType === "image/gif") {
    return "gif";
  } else {
    throw new Error(`Invalid ${contentType}`);
  }
};

function removeFigureTag() {
  const processorHtml = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeStringify);

  fs.readdirSync(POSTS_DIR).forEach((file) => {
    const filepath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filepath, "utf8");
    const tree = processorHtml.parse(content);

    visit(
      tree,
      (node) =>
        node.tagName === "figure" &&
        node.children.some((n) => n.tagName === "img"),
      (node) => {
        const img = node.children[0];
        node.tagName = "img";
        // img node dont have children
        node.children = [];
        node.properties = img.properties;
      },
    );
    fs.writeFileSync(filepath, processorHtml.stringify(tree), "utf8");
  });
}

// removeFigureTag();

// Convert html files to markdown
function html2md() {
  if (!fs.existsSync(OUTPUT_DIR_MD_FILES)) {
    fs.mkdirSync(OUTPUT_DIR_MD_FILES);
  }

  const spawn = spawnSync(BIN_MEDIUM_2_MD, [
    "convertLocal",
    POSTS_DIR,
    "-dfi",
    "--path",
    OUTPUT_DIR_MD_FILES,
    "--timeout",
    5000,
  ]);

  if (spawn.status !== 0) {
    throw new Error(`Failed to convert html files to markdown`, {
      cause: spawn.stderr.toString(),
    });
  }
}

// console.log("Converting posts to markdown");
// html2md();

// const IGNORE_FILES = "";
const mdFiles = fs
  .readdirSync(OUTPUT_DIR_MD_FILES)
  .filter((file) => file.endsWith(".md"));

function convertToSlug(title) {
  return title
    .toLowerCase() // Convert to lowercase
    .normalize("NFD") // Normalize the string
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim() // Trim leading and trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove multiple hyphens
}

const browser = await puppeteer.launch({
  headless: false,
});

const downloadImage = async (url, filePath) => {
  const page = await browser.newPage();

  const response = await page.goto(url);

  const contentType = response.headers()["content-type"];

  const ext = getExtensionFromContentType(contentType);

  const buf = await response.buffer();

  fs.writeFile(`${filePath}.${ext}`, buf, (err) => {
    if (err) {
      throw new Error(err);
    }
  });

  await page.close();
};

const processor = unified()
  .use(remarkParse, { gfm: true })
  .use(remarkStringify);

const extract = mdFiles
  .map((file) => {
    const content = fs.readFileSync(path.join(OUTPUT_DIR_MD_FILES, file));
    const metadata = matter(content);
    return { metadata, file };
  })
  .filter(({ metadata, file }) => {
    const isEmpty = metadata.content.trim() === "";
    if (isEmpty) {
      console.warn(`Removing ${file} because is empty`);
    }
    return !isEmpty;
  })
  .map(async ({ metadata, file }) => {
    const tree = processor.parse(metadata.content);

    // Collect images by post
    const images = [];
    // const rawImagesUrls = [];

    visit(tree, "image", (node) => {
      images.push(node);
      // rawImagesUrls.push(node.url);
    });
    const slug = convertToSlug(metadata.data.title);
    const imgDir = path.join(OUTPUT_DIR_MD_FILES, "blog", slug);

    if (!fs.existsSync(imgDir)) {
      fs.mkdirSync(imgDir);
    }

    if (false) {
      await Promise.all(
        images.map(async ({ url }, i) => {
          await downloadImage(url, path.join(imgDir, `image_${i}`));
        }),
      );
    }

    // console.log(`Download images for ${file}`);
    // images.forEach((node, index) => {
    //   const ext = imagesExtensions[index];
    //   if (ext.url !== node.url) {
    //     throw new Error();
    //   }
    //   const output_file = path.join(
    //     imgDir,
    //     `image_${index + 1}.${ext.extension}`,
    //   );
    //   const args = [node.url, "-O", output_file];
    //   spawnSync("wget", args);
    // });

    visit(tree, "image", (node) => {
      const index = images.findIndex((v) => v.url === node.url);
      // const index = imagesExtensions.indexOf(node.url) + 1;
      if (index === -1) {
        throw new Error(`Failed to find image ${node.url} at ${images}`);
      }
      // const lastFragment = node.url.split("/").at(-1);
      // const hasExt = lastFragment.split(".").length > 1;
      // const extension = hasExt ? lastFragment.split(".").at(-1) : "";
      // if (extension === undefined) {
      //   throw new Error();
      // }
      // const newExt = hasExt ? `.${extension}` : "";
      const imagesFiles = fs.readdirSync(path.join(imgDir));

      const imgTarget = imagesFiles.find((s) => s.startsWith(`image_${index}`));

      if (imgTarget === undefined) {
        throw new Error();
      }

      const fullPathImage = `https://storage.googleapis.com/basedosdados-website/blog/${slug}/${imgTarget}`;

      node.url = fullPathImage;
    });

    const newContent = processor.stringify(tree);

    return {
      slug,
      file,
      metadata,
      newContent,
      images: images.map((i) => i.url),
    };
  });

console.log("\nPosts without images:");
// 2022-03-09_Nota-sobre-divulga--o-dos-dados-do-Inep-9168291dbca0.md
// 2024-03-20_Vale-lembrar-que-na-Base-os-Dados-voc--encontra-muitos-dados-do--gov-96eb15c68a9a.md
// 2024-04-08_Poxa--faltou-a-Base-dos-Dados-a---918edca4d83e.md
// extract.forEach(({ images, file }) => {
//   if (images.length === 0) {
//     console.log(file);
//   }
// });

const result = await Promise.all(extract);
console.log(result);

await browser.close();
// extract.forEach(({ images, slug }) => {
//   if (images.length > 0) {
//   }
// });

result.forEach(({ slug, metadata, newContent }) => {
  const postFile = path.join(process.cwd(), "blog", `${slug}.mdx`);

  fs.writeFileSync(
    postFile,
    `---${metadata.matter}\n---\n${newContent}`,
    "utf-8",
  );
});

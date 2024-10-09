import fs from "fs";
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

removeFigureTag();

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

console.log("Converting posts to markdown");
html2md();

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

    visit(tree, "image", (node) => {
      images.push(node);
    });

    const slug = convertToSlug(metadata.data.title);
    const imgDir = path.join(OUTPUT_DIR_MD_FILES, "blog", slug);

    if (!fs.existsSync(imgDir)) {
      fs.mkdirSync(imgDir);
    }

    await Promise.all(
      images.map(async ({ url }, i) => {
        await downloadImage(url, path.join(imgDir, `image_${i}`));
      }),
    );

    visit(tree, "image", (node) => {
      const index = images.findIndex((v) => v.url === node.url);

      if (index === -1) {
        throw new Error(`Failed to find image ${node.url} at ${images}`);
      }

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

const result = await Promise.all(extract);
console.log(result);

await browser.close();

result.forEach(({ slug, metadata, newContent }) => {
  const postFile = path.join(process.cwd(), "blog", `${slug}.mdx`);

  fs.writeFileSync(
    postFile,
    `---${metadata.matter}\n---\n${newContent}`,
    "utf-8",
  );
});

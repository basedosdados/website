import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { fromMarkdown } from "mdast-util-from-markdown";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";

const root = process.cwd();

export async function getAllDocs(locale = 'pt') {
  const docsDir = path.join(root, `content/docs/${locale}`)

  try {
    const postsDir = await fs.readdir(docsDir, "utf-8");

    const posts = (
      await Promise.all(
        postsDir.map(async (file) => {
          const fullpath = path.join(docsDir, file);
          const content = await fs.readFile(fullpath, "utf-8");
          const { data } = matter(content);

          return {
            slug: file.replace(".md", ""),
            frontmatter: data,
          };
        })
      )
    ).filter(Boolean); 

    posts.sort((a, b) => {
      const orderA = a.frontmatter?.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.frontmatter?.order ?? Number.MAX_SAFE_INTEGER;
    
      return orderA - orderB;
    });

    return posts;
  } catch (error) {
    console.error("Error reading document post:", error);
    return []
  }
}

export async function getDocsBySlug(slug, locale = 'pt') {
  try {
    const docsDir = path.join(root, `content/docs/${locale}`)
    const filepath = path.join(docsDir, `${slug}.md`);
    return await fs.readFile(filepath, "utf-8");
  } catch (error) {
    return null;
  }
}

const remarkPluginCaption = () => (tree) =>
  visit(
    tree,
    (node) =>
      ["Image",
        "Video",
        "Embed",
        "Blockquote",
        "Button",
        "Warning",
        "Tip",
        "Accordion",
        "PDF"
      ].includes(node.name) &&
      node.attributes.find(({ name }) => name === "caption"),
    (node) => {
      const caption = node.attributes.filter(({ name }) => name === "caption");
      const tree = fromMarkdown(caption[0].value);
      const children = tree.children.map((node) => ({
        ...node,
        type: "figcaption",
      }));

      if (node.name === "Embed") {
        // Since Embed component has a children (`iframe`), set children as children of iframe
        // React does not support two children, should be nested childrens
        node.children[0].children = children;
      } else if (node.name === "Blockquote" || node.name === "Tip") {
        node.children = [...children, ...node.children];
      } else if (node.name === "PDF") {
        node.children = [{ type: "element", tagName: "figcaption", children }];
      } else {
        node.children = children;
      }

      // Remove caption attributes
      node.attributes = node.attributes.filter(
        ({ name }) => name !== "caption",
      );
    },
  );

const rehypeExtractHeadings =
  ({ headings }) =>
  (tree) => {
    visit(
      tree,
      (node) => ["h1", "h2", "h3", "h4", "h5", "h6"].includes(node.tagName),
      (node) => {
        if (node?.properties?.id) {
          headings.push({
            title: toString(node),
            level: Number(node.tagName.replace("h", "")) - 2,
            id: node.properties.id.toString() ?? null,
          });
        }
      },
    );
  };

export async function serializeDoc(content) {
  const headings = [];
  const mdxSource = await serialize(content, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkPluginCaption],
      rehypePlugins: [rehypeSlug, [rehypeExtractHeadings, { headings }]],
    },
  });
  return { mdxSource, headings };
}

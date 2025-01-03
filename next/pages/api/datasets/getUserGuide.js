import path from "path";
import fs from "fs/promises";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { fromMarkdown } from "mdast-util-from-markdown";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";

const root = process.cwd();

export async function getUserGuide(slug, locale = 'pt') {
  try {
    const userGuideDir = path.join(root, `content/userGuide/${locale}`)
    const filepath = path.join(userGuideDir, `${slug}.md`);
    return await fs.readFile(filepath, "utf-8");
  } catch (error) {
    return null;
  }
}

const remarkPluginCaption = () => (tree) =>
  visit(
    tree,
    (node) =>
      ["Blockquote"].includes(node.name) &&
      node.attributes.find(({ name }) => name === "caption"),
    (node) => {
      const caption = node.attributes.filter(({ name }) => name === "caption");
      const tree = fromMarkdown(caption[0].value);
      const children = tree.children.map((node) => ({
        ...node,
        type: "figcaption",
      }));

      if (node.name === "Blockquote") {
        node.children = [...children, ...node.children];
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
            id: node.properties?.id?.toString() ?? null,
          });
        }
      }
    );
  };

export async function serializeUserGuide(content) {
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

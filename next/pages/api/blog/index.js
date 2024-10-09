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
const blogpostsDir = path.join(root, "blog");

export async function getAllPosts() {
  const postsDir = await fs.readdir(blogpostsDir, "utf-8");
  const posts = await Promise.all(
    postsDir.map(async (file) => {
      const fullpath = path.join(blogpostsDir, file);
      const content = await fs.readFile(fullpath, "utf-8");
      const { data } = matter(content);
      return {
        slug: file.replace(".md", ""),
        frontmatter: data,
      };
    }),
  );

  posts.sort(
    (a, b) =>
      new Date(b.frontmatter.date.created) -
      new Date(a.frontmatter.date.created),
  );

  return posts;
}

export async function getPostBySlug(slug) {
  const filepath = path.join(blogpostsDir, `${slug}.md`);
  return await fs.readFile(filepath, "utf-8");
}

export async function getPostsByCategory(category) {
  const posts = await getAllPosts();
  return posts.filter(({ frontmatter }) =>
    frontmatter?.categories?.includes(category),
  );
}

const remarkPluginCaption = () => (tree) =>
  visit(
    tree,
    (node) =>
      ["Image", "Video", "Embed", "Blockquote"].includes(node.name) &&
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
      } else if (node.name === "Blockquote") {
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
      (node) => ["h2", "h3", "h4", "h5", "h6"].includes(node.tagName),
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

export async function serializePost(content) {
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

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

export async function getAllPosts(locale = 'pt') {
  const blogpostsDir = path.join(root, `blog/${locale}`)
  try {
    const postsDir = await fs.readdir(blogpostsDir, "utf-8");

    const posts = (
      await Promise.all(
        postsDir.map(async (file) => {
          const fullpath = path.join(blogpostsDir, file);
          const content = await fs.readFile(fullpath, "utf-8");
          const { data } = matter(content);

          if (data.published) {
            return {
              slug: file.replace(".md", ""),
              frontmatter: data,
            };
          }
          return null;
        })
      )
    ).filter(Boolean); 

    posts.sort((a, b) => {
      const orderA = a.frontmatter?.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.frontmatter?.order ?? Number.MAX_SAFE_INTEGER;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      const dateA = new Date(a.frontmatter.date.created);
      const dateB = new Date(b.frontmatter.date.created);
      return dateB - dateA;
    });

    return posts;
  } catch (error) {
    console.error("Error reading posts:", error);
    return []
  }
}

export async function getPostBySlug(slug, locale = 'pt') {
  try {
    const blogpostsDir = path.join(root, `blog/${locale}`)
    const filepath = path.join(blogpostsDir, `${slug}.md`);
    return await fs.readFile(filepath, "utf-8");
  } catch (error) {
    return null;
  }
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

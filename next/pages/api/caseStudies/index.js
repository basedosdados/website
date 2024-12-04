import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { fromMarkdown } from "mdast-util-from-markdown";
import { visit } from "unist-util-visit";

const root = process.cwd();

export async function getAllCaseStudies(locale = 'pt') {
  const caseStudiesDirRoot = path.join(root, `content/caseStudies/${locale}`);
  const caseStudiesDir = await fs.readdir(caseStudiesDirRoot, "utf-8");

  const caseStudies = await Promise.all(
    caseStudiesDir.map(async (file) => {
      const fullpath = path.join(caseStudiesDirRoot, file);
      const content = await fs.readFile(fullpath, "utf-8");

      const { data: metadata, content: caseStudiesContent } = matter(content);

      return {
        ...metadata,
        content: caseStudiesContent,
      };
    }),
  );

  return caseStudies;
}

export async function getCaseStudiesById(id, locale = 'pt') {
  const caseStudiesDirRoot = path.join(root, `content/caseStudies/${locale}`);

  const filepath = path.join(caseStudiesDirRoot, `${id}.md`);
  return await fs.readFile(filepath, "utf-8");
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
        node.children[0].children = children;
      } else if (node.name === "Blockquote") {
        node.children = [...children, ...node.children];
      } else {
        node.children = children;
      }

      node.attributes = node.attributes.filter(
        ({ name }) => name !== "caption",
      );
    },
  );

export async function serializeCaseStudies(content) {
  const mdxSource = await serialize(content, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm, remarkPluginCaption],
      rehypePlugins: [rehypeSlug],
    },
  });
  return mdxSource;
}

import path from "path";
import fs from "fs";
import matter from "gray-matter";

const root = process.cwd();
const blogpostsDir = path.join(root, "blog");

export function getAllPosts() {
  const postsDir = fs.readdirSync(blogpostsDir, "utf-8");
  return postsDir.map((folder) => {
    const fullpath = path.join(blogpostsDir, folder);
    const content = fs.readFileSync(fullpath, "utf-8");
    const { data } = matter(content);
    return {
      slug: folder.replace(".mdx", ""),
      frontmatter: data,
    };
  });
}

export function getPostBySlug(slug) {
  const filepath = path.join(blogpostsDir, `${slug}.mdx`);
  return fs.readFileSync(filepath, "utf-8");
}

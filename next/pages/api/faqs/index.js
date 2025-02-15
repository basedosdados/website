import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";

const root = process.cwd();

export async function getAllFAQs(locale = "pt") {
  const faqsDirRoot = path.join(root, `content/FAQ/${locale}`);
  try {
    const faqsDir = await fs.readdir(faqsDirRoot, "utf-8");

    const faqs = await Promise.all(
      faqsDir.map(async (file) => {
        const fullpath = path.join(faqsDirRoot, file);
        const content = await fs.readFile(fullpath, "utf-8");

        const { data: metadata, content: faqContent } = matter(content);

        return {
          ...metadata,
          content: faqContent,
        };
      }),
    );

    return faqs;
  } catch (error) {
    return [];
  }
}

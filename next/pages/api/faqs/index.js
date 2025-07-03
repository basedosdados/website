import path from "path";
import fs from "fs/promises";
import matter from "gray-matter";

const root = process.cwd();

export async function getAllFAQs(locale = 'pt', dir = 'FAQ') {
  const faqsDirRoot = path.join(root, `content/${dir}/${locale}`);
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

    const categoryOrder = [
      'Dados',
      'Planos Pagos',
      'BigQuery',
      'BD Lab',
      'BD Edu',
      'Institucional'
    ];

    faqs.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      } else if (a.order !== undefined) {
        return -1;
      } else if (b.order !== undefined) {
        return 1;
      } else {
        const getCategoryIndex = (faq) => {
          if (!faq.categories) return Infinity;
          const cat = Array.isArray(faq.categories) ? faq.categories[0] : faq.categories;
          const idx = categoryOrder.indexOf(cat);
          return idx === -1 ? Infinity : idx;
        };
        const idxA = getCategoryIndex(a);
        const idxB = getCategoryIndex(b);
        if (idxA !== idxB) return idxA - idxB;

        return (a.question || '').localeCompare(b.question || '');
      }
    });

    return faqs;
  } catch (error) {
    return []
  }
}

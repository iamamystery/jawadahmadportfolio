import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readingTime: string;
};

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const words = content.split(/\s+/).length;
      return {
        slug: file.replace(/\.mdx$/, ""),
        title: data.title ?? "Untitled",
        description: data.description ?? "",
        category: data.category ?? "General",
        date: data.date ?? "",
        readingTime: `${Math.max(1, Math.round(words / 200))} min read`,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug: string) {
  const file = path.join(ARTICLES_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  return { meta: data as Omit<ArticleMeta, "slug" | "readingTime">, content };
}

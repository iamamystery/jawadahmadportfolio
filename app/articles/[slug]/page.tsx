import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { getAllArticles, getArticle } from "@/lib/articles";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.meta.title,
    description: article.meta.description,
    openGraph: {
      title: article.meta.title,
      description: article.meta.description,
      type: "article",
    },
  };
}

const mdxComponents = {
  h2: (props: { children?: ReactNode }) => (
    <h2 className="font-display font-bold text-2xl md:text-3xl mt-12 mb-4 text-ink" {...props} />
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3 className="font-display font-semibold text-xl mt-9 mb-3 text-ink" {...props} />
  ),
  p: (props: { children?: ReactNode }) => (
    <p className="text-ink/70 leading-[1.85] mb-5" {...props} />
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="space-y-2.5 mb-6 pl-1" {...props} />
  ),
  ol: (props: { children?: ReactNode }) => (
    <ol className="space-y-2.5 mb-6 pl-5 list-decimal marker:text-gold/70" {...props} />
  ),
  li: (props: { children?: ReactNode }) => (
    <li className="text-ink/70 leading-relaxed" {...props} />
  ),
  strong: (props: { children?: ReactNode }) => (
    <strong className="text-ink font-semibold" {...props} />
  ),
  code: (props: { children?: ReactNode }) => (
    <code className="font-mono text-[0.9em] text-gold bg-surface px-1.5 py-0.5" {...props} />
  ),
  blockquote: (props: { children?: ReactNode }) => (
    <blockquote className="border-l-2 border-gold/50 pl-5 my-6 text-ink/60 italic" {...props} />
  ),
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <main className="min-h-screen px-6 md:px-12 py-16 md:py-24">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/#knowledge"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest2 uppercase text-gold/70 hover:text-gold transition-colors"
        >
          <ArrowLeft size={13} aria-hidden /> Knowledge hub
        </Link>

        <header className="mt-10 mb-12 pb-10 border-b border-gold/10">
          <p className="font-mono text-[10px] tracking-widest2 uppercase text-ember/80">
            {article.meta.category} · {article.meta.date}
          </p>
          <h1 className="mt-4 font-display font-bold text-3xl md:text-5xl leading-[1.1]">
            {article.meta.title}
          </h1>
          <p className="mt-5 text-ink/55 text-lg leading-relaxed">
            {article.meta.description}
          </p>
        </header>

        <MDXRemote source={article.content} components={mdxComponents} />

        <footer className="mt-16 pt-8 border-t border-gold/10">
          <Link
            href="/#knowledge"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest2 uppercase text-gold/70 hover:text-gold transition-colors"
          >
            <ArrowLeft size={13} aria-hidden /> Back to all articles
          </Link>
        </footer>
      </article>
    </main>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-xs tracking-widest2 uppercase text-ember">Signal lost</p>
      <h1 className="font-display font-bold text-5xl md:text-7xl">404</h1>
      <p className="text-ink/55 max-w-sm">
        This route doesn&apos;t exist in the ecosystem. Return to headquarters.
      </p>
      <Link
        href="/"
        className="mt-2 font-mono text-xs tracking-widest2 uppercase text-gold border border-gold/40 px-8 py-4 hover:bg-gold/5 transition-colors"
      >
        Back to HQ
      </Link>
    </main>
  );
}

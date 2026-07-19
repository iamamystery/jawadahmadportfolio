"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#core", label: "Core" },
  { href: "#expertise", label: "Expertise" },
  { href: "#projects", label: "Projects" },
  { href: "#systems", label: "Systems" },
  { href: "#vault", label: "Vault" },
  { href: "#phantex", label: "Phantex" },
  { href: "#knowledge", label: "Knowledge" },
  { href: "#journey", label: "Journey" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -70, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-night/75 border-b border-gold/10"
          aria-label="Primary"
        >
          <div className="mx-auto max-w-7xl px-6 md:px-12 h-14 flex items-center justify-between">
            <a href="#top" className="font-display font-bold tracking-wide text-sm">
              MJA<span className="text-gold">.</span>HQ
            </a>
            <div className="hidden lg:flex items-center gap-7">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="font-mono text-[11px] tracking-widest2 uppercase text-ink/60 hover:text-gold transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <button
              className="lg:hidden text-ink/80"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden border-t border-gold/10 bg-night/95"
              >
                <div className="px-6 py-4 flex flex-col gap-4">
                  {links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="font-mono text-xs tracking-widest2 uppercase text-ink/70 hover:text-gold transition-colors"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

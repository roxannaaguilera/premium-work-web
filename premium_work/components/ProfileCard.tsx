"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ProfileCard({
  name,
  initials,
  badge = "Top Independent",
  specialties = ["Brand Designer", "Logo Designer"],
}: {
  name: string;
  initials: string;
  badge?: string;
  specialties?: [string, string] | string[];
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="w-[320px] md:w-[360px]"
    >
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-[36px] bg-white px-8 pb-12 pt-12 text-center shadow-[0_48px_100px_-24px_rgba(0,0,0,.6)]"
      >
        <div className="mx-auto flex size-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-400 to-orange-300 shadow-[0_16px_36px_-10px_rgba(139,92,246,.55)]">
          <span className="display text-4xl font-bold text-white">{initials}</span>
        </div>

        <div className="mt-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[.1em] text-violet-700">
            <span aria-hidden="true">✦</span> {badge}
          </span>
        </div>

        <p className="display mt-4 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 bg-clip-text text-[2.6rem] leading-[1.05] text-transparent">
          {name}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {specialties.map((specialty) => (
            <span
              key={specialty}
              className="rounded-full border border-[#e2e2e8] bg-white px-4 py-1.5 text-xs font-bold text-[#4a5264]"
            >
              {specialty}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-[230px] space-y-3" aria-hidden="true">
          <div className="h-2.5 rounded-full bg-[#f1f1f5]" />
          <div className="mx-auto h-2.5 w-2/3 rounded-full bg-[#f1f1f5]" />
        </div>
      </motion.div>
    </motion.div>
  );
}

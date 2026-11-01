"use client";

import React from "react";
import { siteConfig } from "@/data/siteConfig";

export const TechMarquee: React.FC = () => {
  // Multiply array to guarantee seamless infinite scroll across all resolutions
  const items = [...siteConfig.techStack, ...siteConfig.techStack, ...siteConfig.techStack];

  const separators = ["///", "[★]", "::", "⚡", ">>", "▰"];

  return (
    <section className="w-full bg-black text-white border-y-4 border-black overflow-hidden select-none py-3 shadow-[0px_4px_0px_0px_#000]">
      <div className="relative w-full flex items-center">
        {/* Left and Right Vintage Bevel Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

        {/* Marquee Ticker Track */}
        <div className="animate-marquee flex items-center gap-6 whitespace-nowrap font-mono text-xs sm:text-sm uppercase font-black tracking-wider">
          {items.map((tech, index) => {
            const sep = separators[index % separators.length];
            return (
              <div
                key={`${tech.name}-${index}`}
                className="flex items-center gap-6 group cursor-default"
              >
                <div className="flex items-center gap-2 bg-zinc-900 group-hover:bg-amber-400 group-hover:text-black transition-colors px-3 py-1 border border-zinc-700">
                  <span className="text-zinc-500 group-hover:text-black text-[10px] font-bold">
                    {tech.category} {"//"}
                  </span>
                  <span className="text-amber-300 group-hover:text-black font-extrabold">
                    {tech.name}
                  </span>
                  <span className="text-emerald-400 group-hover:text-black text-[10px] bg-black group-hover:bg-white text-white group-hover:text-black px-1 border border-zinc-700">
                    {tech.tag}
                  </span>
                </div>

                <span className="text-zinc-600 font-extrabold text-amber-400/70 select-none">
                  {sep}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

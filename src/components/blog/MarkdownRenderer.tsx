"use client";

import React, { useState, useEffect, useId, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { BlogTheme } from "@/types/blog";
import {
  Copy,
  Check,
  Info,
  Lightbulb,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  theme?: BlogTheme;
  className?: string;
  suppressLeadingH1?: boolean;
}

// Convert numbers like 1., 2. to Roman numerals (I., II., III.)
const toRoman = (num: number): string => {
  const lookup: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
  ];
  let res = "";
  for (const [v, r] of lookup) {
    while (num >= v) {
      res += r;
      num -= v;
    }
  }
  return res;
};

export const formatIeeeSection = (text: string): string => {
  if (!text) return "";
  const trimmed = text.trim();
  // Check if it already begins with Roman numerals (e.g., "I.", "II.", "III.", "IV.", "V.", etc.)
  if (/^[IVXLCDM]+\.\s+/i.test(trimmed)) return trimmed;
  // Check if it begins with Roman numeral without dot (e.g., "I ", "II ")
  if (/^[IVXLCDM]+\s+/i.test(trimmed)) {
    const rMatch = trimmed.match(/^([IVXLCDM]+)\s+(.*)$/i);
    if (rMatch) return `${rMatch[1].toUpperCase()}. ${rMatch[2]}`;
  }
  // Check if it begins with Arabic numbers like "1. ", "2. ", "1 ", "2 "
  const match = trimmed.match(/^(\d+)[\.\s]+(.*)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    return `${toRoman(num)}. ${match[2]}`;
  }
  return trimmed;
};

// Deterministic heading slugifier for anchor linking
export const slugifyHeading = (text: string): string => {
  return String(text || "")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents for clean ASCII anchor
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Recursive text extractor from React nodes
export const extractNodeText = (node: React.ReactNode): string => {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractNodeText).join("");
  if (React.isValidElement(node) && (node.props as { children?: React.ReactNode }).children) {
    return extractNodeText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
};

// Helper to remove any stray Mermaid v12 error containers injected directly into document.body
const cleanupStrayMermaidNodes = (id?: string) => {
  try {
    if (typeof document === "undefined") return;
    if (id) {
      const specific = document.getElementById(`d${id}`);
      if (specific) specific.remove();
    }
    const strayContainers = document.querySelectorAll(
      'body > div[id^="dmermaid"], body > div[id^="dm_"], body > [id*="mermaid"]'
    );
    strayContainers.forEach((el) => {
      if (
        el.id &&
        (el.id.startsWith("dm_") ||
          el.id.startsWith("dmermaid") ||
          el.querySelector('svg[aria-roledescription="error"]'))
      ) {
        el.remove();
      }
    });
    const errorSvgs = document.querySelectorAll('body > svg[aria-roledescription="error"]');
    errorSvgs.forEach((svg) => svg.remove());
  } catch {
    // Ignore in non-browser environment
  }
};

// Client-safe Mermaid Diagram Component
const MermaidBlock: React.FC<{ chart: string }> = ({ chart }) => {
  const [svgHtml, setSvgHtml] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false);
  const rawId = useId();
  const safeId = "m_" + rawId.replace(/[^a-zA-Z0-9]/g, "_");

  useEffect(() => {
    let isMounted = true;
    const cleanCode = (chart || "")
      .replace(/^```(?:mermaid)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .replace(/```(?:mermaid)?/gi, "")
      .replace(/^mermaidgraph\b/i, "graph")
      .trim();

    const elementId = `${safeId}_${Date.now()}`;

    const renderChart = async () => {
      if (!cleanCode) {
        if (isMounted) {
          setSvgHtml("");
          setHasError(false);
        }
        return;
      }

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          suppressErrorRendering: true,
          securityLevel: "loose",
          theme: "neutral",
          fontFamily: "var(--font-sans), sans-serif",
        });

        // Pre-validate syntax before calling render to prevent Mermaid v12 error bomb DOM injection
        let isValid = false;
        try {
          const parsed = await mermaid.parse(cleanCode, { suppressErrors: true });
          isValid = parsed !== false;
        } catch {
          isValid = false;
        }

        if (!isValid) {
          cleanupStrayMermaidNodes(elementId);
          if (isMounted) {
            setHasError(true);
          }
          return;
        }

        const { svg } = await mermaid.render(elementId, cleanCode);
        if (isMounted) {
          setSvgHtml(svg);
          setHasError(false);
        }
      } catch {
        cleanupStrayMermaidNodes(elementId);
        if (isMounted) {
          setHasError(true);
        }
      } finally {
        cleanupStrayMermaidNodes(elementId);
      }
    };

    renderChart();

    return () => {
      isMounted = false;
      cleanupStrayMermaidNodes(elementId);
    };
  }, [chart, safeId]);

  if (hasError) {
    return (
      <div className="my-4 p-3.5 text-xs font-mono bg-slate-50 text-slate-600 border border-slate-300 rounded-sm flex items-center gap-2">
        <span className="text-amber-500">⏳</span>
        <span>Cú pháp sơ đồ Mermaid đang được chỉnh sửa...</span>
      </div>
    );
  }

  if (!svgHtml) {
    return (
      <div className="my-4 p-3 text-xs font-mono text-slate-500 animate-pulse bg-slate-50 border border-slate-200 rounded-sm">
        ⏳ Đang kết xuất sơ đồ phần cứng...
      </div>
    );
  }

  return (
    <figure className="my-6 overflow-x-auto flex flex-col items-center p-4 sm:p-6 bg-white border border-slate-200 shadow-sm rounded-sm break-inside-avoid">
      <div
        className="w-full flex justify-center"
        dangerouslySetInnerHTML={{ __html: svgHtml }}
      />
      <figcaption className="text-[11px] font-serif italic text-slate-500 mt-3 block uppercase tracking-wider text-center">
        Fig. [Hardware Architecture &amp; Dataflow Diagram]
      </figcaption>
    </figure>
  );
};

// Pure IEEE Academic Code block with copy button
const CodeBlockWithCopy: React.FC<{
  language: string;
  code: string;
}> = ({ language, code }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 overflow-hidden font-mono text-xs border border-slate-300 rounded-sm shadow-sm bg-[#0B1528] break-inside-avoid print:break-inside-avoid print:border print:border-slate-300 print:shadow-none">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#002855] border-b border-slate-700 text-slate-200 select-none print:bg-slate-100 print:text-slate-800 print:border-b print:border-slate-300">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#41B6E6] print:text-slate-800">
          {language || "CODE"} {"//"} LISTING
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#00629B] hover:bg-[#004e7c] text-white text-[10px] font-semibold rounded cursor-pointer transition-colors print:hidden"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-300" />
              <span className="text-emerald-300">COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>COPY CODE</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[12.5px] leading-[1.65] font-mono whitespace-pre-wrap break-words bg-[#0B1221] text-emerald-300 print:bg-slate-50 print:text-slate-900 print:whitespace-pre-wrap print:break-words print:text-[11px]">
        <code className="whitespace-pre-wrap break-words font-mono">{code}</code>
      </pre>
    </div>
  );
};

// Helper function to strip callout marker [!TIP], [!NOTE], etc. from children text
const stripCalloutMarker = (nodes: React.ReactNode): React.ReactNode => {
  return React.Children.map(nodes, (child) => {
    if (typeof child === "string") {
      return child.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i, "");
    }
    if (React.isValidElement(child) && (child.props as { children?: React.ReactNode })?.children) {
      const childElement = child as React.ReactElement<{ children?: React.ReactNode }>;
      return React.cloneElement(childElement, undefined, stripCalloutMarker(childElement.props.children));
    }
    return child;
  });
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
  suppressLeadingH1 = true,
}) => {
  // Strip leading redundant top-level # Title line if present
  const sanitizedContent = useMemo(() => {
    if (!content) return "";
    if (suppressLeadingH1) {
      // Strips leading `# Title` and following empty lines
      return content.replace(/^\s*#\s+[^\n]+(?:\r?\n)*/, "");
    }
    return content;
  }, [content, suppressLeadingH1]);

  if (!sanitizedContent.trim()) {
    return (
      <div className="p-6 text-center text-slate-400 font-mono text-xs">
        [KHÔNG CÓ NỘI DUNG / NO CONTENT]
      </div>
    );
  }

  return (
    <div className={`markdown-body ieee-article-body text-slate-900 font-sans ${className} space-y-4 leading-relaxed`}>
      <ReactMarkdown
        urlTransform={(url) => url}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        components={{
          // Code & Mermaid handler
          code(props) {
            const { inline, className: codeClassName, children, ...rest } = props as {
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
            };
            const match = /language-(\w+)/.exec(codeClassName || "");
            const codeString = String(children || "").replace(/\n$/, "");

            if (!inline && match && match[1] === "mermaid") {
              return <MermaidBlock chart={codeString} />;
            }

            if (!inline) {
              return (
                <CodeBlockWithCopy
                  language={match ? match[1] : "plaintext"}
                  code={codeString}
                />
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 mx-0.5 font-mono text-[11px] font-semibold bg-slate-100 text-[#00629B] border border-slate-200 rounded break-words print:bg-slate-50 print:text-slate-900 print:border-slate-300"
                {...rest}
              >
                {children}
              </code>
            );
          },

          pre({ children }) {
            return <>{children}</>;
          },

          // Academic Headings with deterministic IDs & scroll margin
          // Top-level # Heading in markdown body is suppressed to prevent duplicating the IEEE Paper Header Title
          h1() {
            return null;
          },

          h2({ children, ...props }) {
            let formattedTitle = children;
            if (typeof children === "string") {
              formattedTitle = formatIeeeSection(children);
            } else if (Array.isArray(children) && typeof children[0] === "string") {
              formattedTitle = [formatIeeeSection(children[0]), ...children.slice(1)];
            }
            const rawText = extractNodeText(children);
            const id = slugifyHeading(rawText);
            return (
              <h2
                id={id}
                className="text-lg sm:text-xl font-bold font-serif text-slate-900 uppercase tracking-wide mt-7 mb-3 pb-1 border-b border-slate-200 scroll-mt-24 break-after-avoid"
                {...props}
              >
                {formattedTitle}
              </h2>
            );
          },

          h3({ children, ...props }) {
            const rawText = extractNodeText(children);
            const id = slugifyHeading(rawText);
            return (
              <h3
                id={id}
                className="text-sm sm:text-base font-bold font-serif text-[#002855] mt-5 mb-2 scroll-mt-24 break-after-avoid"
                {...props}
              >
                {children}
              </h3>
            );
          },

          // Paragraph (renders div to safely allow block elements like figures without HTML nesting violations)
          p({ children }) {
            return (
              <div className="my-3 text-sm leading-relaxed text-slate-800 text-justify">
                {children}
              </div>
            );
          },

          // Blockquote & Obsidian Callout Parser (Zero raw string leaks)
          blockquote({ children }) {
            // Extract text to detect callout
            const rawText = React.Children.toArray(children)
              .map((child) => {
                if (typeof child === "string") return child;
                if (React.isValidElement(child) && (child.props as { children?: React.ReactNode }).children) {
                  return String((child.props as { children?: React.ReactNode }).children);
                }
                return "";
              })
              .join(" ");

            const calloutMatch = rawText.match(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

            if (calloutMatch) {
              const type = calloutMatch[1].toUpperCase();

              let bg = "bg-sky-50/70 border-[#00629B] text-slate-900";
              let titleColor = "text-[#00629B]";
              let icon = <Info className="w-4 h-4 text-[#00629B]" />;

              if (type === "TIP") {
                bg = "bg-emerald-50/70 border-emerald-600 text-slate-900";
                titleColor = "text-emerald-800";
                icon = <Lightbulb className="w-4 h-4 text-emerald-700" />;
              } else if (type === "IMPORTANT") {
                bg = "bg-amber-50/70 border-amber-600 text-slate-900";
                titleColor = "text-amber-800";
                icon = <AlertCircle className="w-4 h-4 text-amber-700" />;
              } else if (type === "WARNING" || type === "CAUTION") {
                bg = "bg-rose-50/70 border-rose-600 text-slate-900";
                titleColor = "text-rose-800";
                icon = <AlertTriangle className="w-4 h-4 text-rose-700" />;
              }

              // Recursively strip [!TIP], [!NOTE], etc. from children so it never prints twice
              const cleanedChildren = stripCalloutMarker(children);

              return (
                <div className={`my-4 p-4 border-l-4 border rounded-sm shadow-sm break-inside-avoid ${bg}`}>
                  <div className={`flex items-center gap-1.5 font-mono text-xs font-bold uppercase mb-1.5 tracking-wider ${titleColor}`}>
                    {icon}
                    <span>{type}</span>
                  </div>
                  <div className="font-sans text-xs sm:text-sm leading-relaxed text-slate-800">
                    {cleanedChildren}
                  </div>
                </div>
              );
            }

            return (
              <blockquote className="my-4 pl-4 border-l-4 border-slate-400 py-1.5 pr-3 font-serif text-sm italic bg-slate-50 text-slate-700 break-inside-avoid">
                {children}
              </blockquote>
            );
          },

          // Pure IEEE Transactions Tables
          table({ children }) {
            return (
              <div className="my-6 overflow-x-auto max-w-full border-t-2 border-b-2 border-slate-900 shadow-sm bg-white break-inside-avoid print:shadow-none print:border-slate-900 print:break-inside-avoid">
                <table className="w-full text-left font-serif text-xs border-collapse">
                  {children}
                </table>
              </div>
            );
          },

          thead({ children }) {
            return (
              <thead className="font-sans text-[11px] uppercase font-bold text-slate-900 border-b border-slate-900 bg-slate-50">
                {children}
              </thead>
            );
          },

          tbody({ children }) {
            return (
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {children}
              </tbody>
            );
          },

          th({ children }) {
            return (
              <th className="p-2.5 font-sans text-[11px] uppercase tracking-wider font-bold text-slate-900">
                {children}
              </th>
            );
          },

          td({ children }) {
            return (
              <td className="p-2.5 border-r border-slate-100 last:border-r-0 text-xs text-slate-800">
                {children}
              </td>
            );
          },

          // Academic Figures with de-duplicated caption prefix
          img({ src, alt }) {
            if (!src) return null;
            const rawAlt = (alt || "").trim();
            // Strip any leading Figure, Fig, Hình, Hinh prefix (including duplicate variations like Fig. Figure:)
            const cleanAlt = rawAlt
              .replace(/^((figure|fig\.?|hình|hinh)\s*[:.]?\s*)+/i, "")
              .trim();

            const captionText = cleanAlt || rawAlt || "Hardware Waveform / Circuit Figure";

            return (
              <figure className="my-6 text-center break-inside-avoid">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={captionText}
                  className="max-w-full mx-auto p-1 bg-white border border-slate-300 shadow-sm rounded-sm"
                  loading="lazy"
                />
                <figcaption className="mt-2 text-xs text-slate-600 italic font-serif">
                  Fig. {captionText}
                </figcaption>
              </figure>
            );
          },

          ul({ children }) {
            return (
              <ul className="my-3 space-y-1 pl-5 list-disc text-sm font-sans leading-relaxed text-slate-800">
                {children}
              </ul>
            );
          },

          ol({ children }) {
            return (
              <ol className="my-3 space-y-1 pl-5 list-decimal text-sm font-sans leading-relaxed text-slate-800">
                {children}
              </ol>
            );
          },

          hr() {
            return <hr className="my-6 border-t border-slate-300" />;
          },
        }}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
};

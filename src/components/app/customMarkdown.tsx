/* eslint-disable @next/next/no-img-element */
import React from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

import { CodeBlock } from "./CodeBlock";
import { CitationTooltip } from "./citations/citationTooltip";
import "katex/dist/katex.min.css";
import { FaviconImage } from "./FaviconImage";

interface EnhancedMarkdownProps {
  children: string;
  sources?: Array<{ url: string; title: string }>;
}

// Helper function to safely convert children to text
const childrenToText = (children: React.ReactNode): string => {
  return React.Children.toArray(children)
    .map((child) => (typeof child === "string" ? child : ""))
    .join("");
};

const createMarkdownComponents = (
  sources?: Array<{ url: string; title: string }>,
): Partial<Components> => ({
  p: ({ children }) => (
    <p className="text-foreground pb-4 text-left text-base leading-6 font-light">
      {children}
    </p>
  ),
  hr: ({ }) => <hr className="border-border pb-4" />,
  pre: ({ children }) => {
    // Handle code blocks
    const child = React.Children.toArray(children)[0] as React.ReactElement;
    if (
      child?.props &&
      typeof child.props === "object" &&
      child.props !== null &&
      "className" in child.props &&
      typeof child.props.className === "string"
    ) {
      const language = child.props.className.replace("language-", "");
      const code =
        "children" in child.props ? (child.props.children as string) : "";
      return <CodeBlock language={language}>{code}</CodeBlock>;
    }
    return (
      <div className="bg-muted my-4 overflow-x-auto rounded-lg p-4">
        <pre className="font-mono text-sm">{children}</pre>
      </div>
    );
  },
  code: ({ children, className, ...props }) => {
    const isInline = !className;

    if (isInline) {
      return <CodeBlock inline>{children as string}</CodeBlock>;
    }

    return <code {...props}>{children}</code>;
  },
  img: ({ src, alt, ...props }) => {
    if (!src) return null;
    return (
      <img
        src={src}
        alt={alt ?? ""}
        className="my-4 max-w-full rounded-lg shadow-md"
        {...props}
      />
    );
  },
  ol: ({ children, ...props }) => (
    <ol className="mb-4 ml-4 list-outside list-decimal space-y-2" {...props}>
      {children}
    </ol>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mb-4 ml-4 list-outside list-disc space-y-2" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }) => (
    <li className="text-foreground" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <span className="text-foreground font-semibold" {...props}>
      {children}
    </span>
  ),
  em: ({ children, ...props }) => (
    <em className="text-foreground italic" {...props}>
      {children}
    </em>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-primary bg-muted/50 my-4 rounded-r-lg border-l-4 py-2 pl-4"
      {...props}
    >
      <div className="text-muted-foreground italic">{children}</div>
    </blockquote>
  ),
  a: ({ children, ...props }) => {
    const childrenString = childrenToText(children);

    if (childrenString === "INLINE_CITATION" && sources) {
      const normalizedHref = props.href?.replace(/\/+$/, "");
      const sourceIndex = sources.findIndex(
        (source) => source.url.replace(/\/+$/, "") === normalizedHref,
      );
      if (sourceIndex !== -1 && sources[sourceIndex]) {
        return (
          <CitationTooltip index={sourceIndex} sources={sources[sourceIndex]} />
        );
      }
      return (
        <a
          href={props.href}
          className="text-primary hover:text-primary/80 underline transition-colors"
          {...props}
        >
          <FaviconImage url={props.href ?? ""} />
        </a>
      );
    }

    return (
      <a
        className="text-primary hover:text-primary/80 underline transition-colors"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  h1: ({ children, ...props }) => {
    const text = childrenToText(children);
    const anchor = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return (
      <h1
        id={anchor}
        className="text-foreground mt-8 mb-6 scroll-mt-20 text-left text-3xl font-bold md:text-4xl"
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    const text = childrenToText(children);
    const anchor = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return (
      <h2
        id={anchor}
        className="text-foreground mt-6 mb-4 scroll-mt-20 text-left text-2xl font-semibold md:text-3xl"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    const text = childrenToText(children);
    const anchor = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return (
      <h3
        id={anchor}
        className="text-foreground mt-5 mb-3 scroll-mt-20 text-left text-xl font-medium md:text-2xl"
        {...props}
      >
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => (
    <h4
      className="text-foreground mt-4 mb-2 text-left text-lg font-medium"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5
      className="text-foreground mt-3 mb-2 text-left text-base font-medium"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6
      className="text-foreground mt-3 mb-2 text-left text-sm font-medium"
      {...props}
    >
      {children}
    </h6>
  ),
  table: ({ children, ...props }) => (
    <div className="border-border my-6 w-full overflow-auto rounded-lg border">
      <table className="w-full border-collapse text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th
      className="border-border text-foreground border-b px-4 py-3 font-semibold"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-border text-foreground border-b px-4 py-3" {...props}>
      {children}
    </td>
  ),
  tr: ({ children, ...props }) => (
    <tr className="hover:bg-accent/50 transition-colors" {...props}>
      {children}
    </tr>
  ),
});

export const CustomMarkdown: React.FC<EnhancedMarkdownProps> = ({
  children,
  sources,
}) => {
  const components = createMarkdownComponents(sources);

  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );};

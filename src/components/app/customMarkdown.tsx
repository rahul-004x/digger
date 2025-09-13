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
    .map(child => typeof child === 'string' ? child : '')
    .join('');
};

const createMarkdownComponents = (
  sources?: Array<{ url: string; title: string }>,
): Partial<Components> => ({
  p: ({ children }) => (
    <p className="pb-4 text-left text-base leading-6 font-light text-foreground">
      {children}
    </p>
  ),
  hr: ({ }) => <hr className="pb-4 border-border" />,
  pre: ({ children }) => {
    // Handle code blocks
    const child = React.Children.toArray(children)[0] as React.ReactElement;
    if (child?.props && 'className' in child.props && typeof child.props.className === 'string') {
      const language = child.props.className.replace('language-', '');
      const code = 'children' in child.props ? child.props.children as string : '';
      return <CodeBlock language={language}>{code}</CodeBlock>;
    }
    return (
      <div className="bg-muted p-4 rounded-lg my-4 overflow-x-auto">
        <pre className="text-sm font-mono">{children}</pre>
      </div>
    );
  },
  code: ({ children, className, ...props }) => {
    const language = className?.replace('language-', '');
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
        className="max-w-full rounded-lg shadow-md my-4" 
        {...props} 
      />
    );
  },
  ol: ({ children, ...props }) => (
    <ol className="ml-4 list-outside list-decimal space-y-2 mb-4" {...props}>
      {children}
    </ol>
  ),
  ul: ({ children, ...props }) => (
    <ul className="ml-4 list-outside list-disc space-y-2 mb-4" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }) => (
    <li className="text-foreground" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <span className="font-semibold text-foreground" {...props}>
      {children}
    </span>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-foreground" {...props}>
      {children}
    </em>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/50 rounded-r-lg" {...props}>
      <div className="text-muted-foreground italic">
        {children}
      </div>
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
        className="mb-6 mt-8 text-left text-3xl md:text-4xl font-bold text-foreground scroll-mt-20"
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
        className="mb-4 mt-6 text-left text-2xl md:text-3xl font-semibold text-foreground scroll-mt-20"
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
        className="mb-3 mt-5 text-left text-xl md:text-2xl font-medium text-foreground scroll-mt-20"
        {...props}
      >
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => (
    <h4 className="mb-2 mt-4 text-left text-lg font-medium text-foreground" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="mb-2 mt-3 text-left text-base font-medium text-foreground" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="mb-2 mt-3 text-left text-sm font-medium text-foreground" {...props}>
      {children}
    </h6>
  ),
  table: ({ children, ...props }) => (
    <div className="w-full overflow-auto my-6 rounded-lg border border-border">
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
    <th className="border-b border-border px-4 py-3 font-semibold text-foreground" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-border px-4 py-3 text-foreground" {...props}>
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
  );
};

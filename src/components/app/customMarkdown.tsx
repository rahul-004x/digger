import React from "react";
import remarkGfm from "remark-gfm";

import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { FaviconImage } from "./FaviconImage";
import { CitationTooltip } from "./citations/citationTooltip";

interface CustomMarkdownProps {
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
    <p className="pb-4 text-left text-base leading-6 font-light text-[#0f172b]">
      {children}
    </p>
  ),
  hr: ({ }) => <hr className="pb-4" />,
  pre: ({ children }) => <>{children}</>,
  img: ({ src, alt, ...props }) => {
    if (!src) return null;
    // For external images, we'll use regular img with proper alt text
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ""} className="max-w-full rounded-lg" {...props} />;
  },
  ol: ({ children, ...props }) => {
    return (
      <ol className="ml-4 list-outside list-decimal" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ children, ...props }) => {
    return (
      <ul className="ml-4 list-outside list-decimal" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
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
          className="text-blue-500 hover:underline"
          {...props}
        >
          <FaviconImage url={props.href ?? ""} />
        </a>
      );
    }

    return (
      // @ts-expect-error - Link component expects href prop from markdown-parsed anchor tags
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
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
        className="mb-2 text-left text-[28px] leading-[48px] font-medium text-[#0f172b] md:text-[40px]"
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
        className="mb-2 text-left text-2xl font-medium text-[#0f172b] md:text-[28px]"
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
        className="mb-2 text-left text-[18px] text-[#0f172b] md:text-xl"
        {...props}
      >
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => {
    return (
      <h4 className="mb-2 text-left text-lg text-[#0f172b]" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ children, ...props }) => {
    return (
      <h5 className="mb-2 text-left text-base text-[#0f172b]" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ children, ...props }) => {
    return (
      <h6 className="mb-2 text-left text-sm text-[#0f172b]" {...props}>
        {children}
      </h6>
    );
  },
  table: ({ children, ...props }) => {
    return (
      <div className="w-full overflow-auto">
        <table
          className="my-4 w-full border-collapse overflow-hidden rounded-lg text-left text-sm"
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },
  thead: ({ children, ...props }) => {
    return (
      <thead className="bg-muted" {...props}>
        {children}
      </thead>
    );
  },
  th: ({ children, ...props }) => {
    return (
      <th
        className="text-foreground border-border border-b px-4 py-2 font-semibold"
        {...props}
      >
        {children}
      </th>
    );
  },
  td: ({ children, ...props }) => {
    return (
      <td className="border-border border-b px-4 py-2" {...props}>
        {children}
      </td>
    );
  },
  tr: ({ children, ...props }) => {
    return (
      <tr className="hover:bg-accent transition-colors" {...props}>
        {children}
      </tr>
    );
  },
});

export const CustomMarkdown: React.FC<CustomMarkdownProps> = ({
  children,
  sources,
}) => {
  const components = createMarkdownComponents(sources);

  // TODO: Consider sanitizing HTML output for security if user input is rendered
  return (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {children}
    </ReactMarkdown>
  );
};

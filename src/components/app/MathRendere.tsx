import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  math: string;
  displayMode?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ 
  math, 
  displayMode = false 
}) => {
  try {
    if (displayMode) {
      return <BlockMath math={math} />;
    }
    return <InlineMath math={math} />;
  } catch (error) {
    console.error('KaTeX rendering error:', error);
    return (
      <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
        {displayMode ? `$$${math}$$` : `$${math}$`}
      </code>
    );
  }
};

import React from 'react';
import { CustomMarkdown } from './customMarkdown';

const mathExample = `
# LaTeX Math Example

Here's an example of inline math: $E = mc^2$

And here's a block math equation:

$$
\\frac{d}{dx}\\left( \\int_{0}^{x} f(u)\\,du\\right)=f(x)
$$

You can also use the Quadratic Formula:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

Here's Maxwell's Equations:

$$
\\begin{aligned}
\\nabla \\times \\vec{\\mathbf{B}} -\\, \\frac{1}{c}\\, \\frac{\\partial\\vec{\\mathbf{E}}}{\\partial t} & = \\frac{4\\pi}{c}\\vec{\\mathbf{j}} \\\\
\\nabla \\cdot \\vec{\\mathbf{E}} & = 4 \\pi \\rho \\\\
\\nabla \\times \\vec{\\mathbf{E}}\\, +\\, \\frac{1}{c}\\, \\frac{\\partial\\vec{\\mathbf{B}}}{\\partial t} & = \\vec{\\mathbf{0}} \\\\
\\nabla \\cdot \\vec{\\mathbf{B}} & = 0
\\end{aligned}
$$

And finally, a statistical formula:

$$
P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}
$$
`;

export default function MathExample() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <CustomMarkdown>{mathExample}</CustomMarkdown>
    </div>
  );
}

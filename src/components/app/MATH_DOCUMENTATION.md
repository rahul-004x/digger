# Math Rendering in Custom Markdown

The CustomMarkdown component supports LaTeX math rendering through KaTeX. This allows you to include mathematical formulas and equations in your markdown content.

## Usage

### Inline Math
Use single dollar signs `$` to denote inline math:

```markdown
Einstein's famous equation: $E = mc^2$
```

### Block Math
Use double dollar signs `$$` to denote block (display) math:

```markdown
$$
\frac{d}{dx}\left( \int_{0}^{x} f(u)\,du\right)=f(x)
$$
```

## Examples

The MathExample.tsx component demonstrates various mathematical formulas that can be rendered:

- Basic equations like $E = mc^2$
- The quadratic formula: $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$
- Complex equations like Maxwell's Equations
- Statistical formulas like Bayes' Theorem

## Implementation

The implementation uses:
- remark-math: Parses LaTeX math in markdown
- rehype-katex: Renders the math expressions using KaTeX
- react-katex: React components for KaTeX rendering
- KaTeX CSS: Required styles for proper math rendering

## Features

- Fast rendering
- Supports a wide range of LaTeX commands
- Works with both inline and block math syntax
- Proper alignment for multi-line equations

## Resources

- [KaTeX Documentation](https://katex.org/docs/supported.html) for supported functions
- [LaTeX Math Symbols](https://en.wikibooks.org/wiki/LaTeX/Mathematics) for reference

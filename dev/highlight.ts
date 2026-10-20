import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import tsx from 'shiki/langs/tsx.mjs';
import typescript from 'shiki/langs/typescript.mjs';
import light from 'shiki/themes/github-light.mjs';
import dark from 'shiki/themes/github-dark.mjs';

const highlighter = createHighlighterCore({
  langs: [tsx, typescript],
  themes: [light, dark],
  engine: createJavaScriptRegexEngine(),
});

const contrastInk: Record<string, Record<string, string>> = {
  '--shiki-light': {
    '#6a737d': 'var(--u-muted)',
    '#22863a': 'var(--u-accent-text)',
    '#d73a49': 'var(--u-danger)',
    '#e36209': 'var(--u-warning)',
    '#fafbfc': 'var(--u-ink)',
    '#f6f8fa': 'var(--u-ink)',
  },
  '--shiki-dark': {
    '#6a737d': 'var(--u-muted)',
    '#24292e': 'var(--u-ink)',
    '#2f363d': 'var(--u-ink)',
  },
};

export async function highlight(code: string, language: 'tsx' | 'typescript') {
  const { tokens } = (await highlighter).codeToTokens(code, {
    lang: language,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  });
  // Substitute semantic ink where the upstream palette is too faint against
  // the showcase's cream and olive backgrounds.
  for (const line of tokens)
    for (const token of line) {
      if (!token.htmlStyle) continue;
      for (const [key, replacements] of Object.entries(contrastInk)) {
        const replacement =
          replacements[token.htmlStyle[key]?.toLowerCase() ?? ''];
        if (replacement) token.htmlStyle[key] = replacement;
      }
    }
  return tokens;
}

import { Fragment, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { highlight } from './highlight.js';
import { Button } from '../src/components/button.js';
import { Glyph } from './glyph.js';

export function CodeBlock({
  code,
  language = 'tsx',
}: {
  code: string;
  language?: 'tsx' | 'typescript';
}) {
  const [feedback, setFeedback] = useState('');
  const [highlighted, setHighlighted] = useState<{
    code: string;
    language: string;
    tokens: Awaited<ReturnType<typeof highlight>>;
  } | null>(null);
  useEffect(() => {
    let current = true;
    void import('./highlight.js')
      .then((module) => module.highlight(code, language))
      .then((tokens) => {
        if (current) setHighlighted({ code, language, tokens });
      })
      .catch(() => {
        if (current) setHighlighted(null);
      });
    return () => {
      current = false;
    };
  }, [code, language]);
  const tokens =
    highlighted?.code === code && highlighted.language === language
      ? highlighted.tokens
      : null;
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setFeedback('Copied');
    } catch {
      setFeedback('Select the snippet to copy');
    }
  }
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{language === 'typescript' ? 'TS' : 'TSX'}</span>
        <Button size="sm" variant="ghost" onClick={copy}>
          <Glyph name="copy" size={14} />
          Copy
        </Button>
      </div>
      <pre data-highlighted={tokens ? 'true' : undefined}>
        <code>
          {tokens
            ? tokens.map((line, index) => (
                <Fragment key={index}>
                  {index > 0 ? '\n' : ''}
                  {line.map((token, index) => (
                    <span
                      key={index}
                      className="syntax-token"
                      style={token.htmlStyle as CSSProperties}
                    >
                      {token.content}
                    </span>
                  ))}
                </Fragment>
              ))
            : code}
        </code>
      </pre>
      <span className="copy-feedback" role="status">
        {feedback}
      </span>
    </div>
  );
}

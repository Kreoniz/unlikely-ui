import { Fragment, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { highlight } from './highlight.js';
import { Button } from '../src/components/button.js';
import { ScrollArea } from '../src/components/scroll-area.js';
import { Glyph } from './glyph.js';

export function CodeBlock({
  code,
  language = 'tsx',
  label,
  checkout = true,
}: {
  code: string;
  language?: 'tsx' | 'typescript' | 'text';
  label?: string;
  checkout?: boolean;
}) {
  const [feedback, setFeedback] = useState<{
    code: string;
    message: string;
  } | null>(null);
  const [highlighted, setHighlighted] = useState<{
    code: string;
    language: string;
    tokens: Awaited<ReturnType<typeof highlight>>;
  } | null>(null);
  useEffect(() => {
    if (language === 'text') return;
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
      setFeedback({ code, message: 'Copied' });
    } catch {
      setFeedback({ code, message: 'Select the snippet to copy' });
    }
  }
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>
          {label ??
            (language === 'typescript'
              ? 'TS'
              : language === 'text'
                ? 'Text'
                : 'TSX')}
        </span>
        {checkout && (
          <a className="code-availability" href="#quick-start">
            Checkout source
          </a>
        )}
        <Button size="sm" variant="ghost" onClick={copy}>
          <Glyph name="copy" size={14} />
          Copy
        </Button>
      </div>
      <ScrollArea.Root className="code-scroll-area">
        <ScrollArea.Viewport
          className="code-viewport"
          role="group"
          aria-label={`${label ?? (language === 'typescript' ? 'TypeScript' : language === 'text' ? 'Text' : 'TSX')} code example`}
        >
          <ScrollArea.Content>
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
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar />
        <ScrollArea.Scrollbar orientation="horizontal" />
        <ScrollArea.Corner />
      </ScrollArea.Root>
      <span className="copy-feedback" role="status">
        {feedback?.code === code ? feedback.message : ''}
      </span>
    </div>
  );
}

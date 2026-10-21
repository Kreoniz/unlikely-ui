import { useRef, useState } from 'react';
import { ScrollArea } from '../../src/components/scroll-area.js';
import { Button } from '../../src/components/button.js';
import { Theme } from '../../src/theme.js';
import { CheckControl } from '../controls.js';
import { CodeBlock } from '../code-block.js';

export function ScrollAreaExamples() {
  const [expanded, setExpanded] = useState(true);
  const [rtl, setRtl] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  return (
    <>
      <section className="specimen">
        <div className="specimen-heading">
          <h2>Vertical scrolling</h2>
        </div>
        <div className="state-row">
          <CheckControl checked={expanded} onCheckedChange={setExpanded}>
            Long list
          </CheckControl>
          <Button
            variant="secondary"
            onClick={() => viewport.current?.scrollTo({ top: 0 })}
          >
            Back to start
          </Button>
        </div>
        <ScrollArea.Root
          className="scroll-example"
          data-testid="vertical-scroll-area"
        >
          <ScrollArea.Viewport
            ref={viewport}
            role="region"
            aria-label="Resource list"
          >
            <ScrollArea.Content>
              <ul className="scroll-example-list">
                {Array.from({ length: expanded ? 24 : 2 }, (_, i) => (
                  <li key={i}>
                    <span>Resource {String(i + 1).padStart(2, '0')}</span>
                    <span className="scroll-example-meta">Guide</span>
                  </li>
                ))}
              </ul>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
        <p className="specimen-note">
          Scroll with a wheel, trackpad, touch, or the keyboard. The scrollbar
          disappears when the content fits.
        </p>
      </section>
      <section className="specimen">
        <div className="specimen-heading">
          <h2>Both axes</h2>
        </div>
        <div className="state-row">
          <CheckControl checked={rtl} onCheckedChange={setRtl}>
            Right-to-left
          </CheckControl>
        </div>
        <Theme dir={rtl ? 'rtl' : 'ltr'}>
          <ScrollArea.Root
            className="scroll-example scroll-example-wide"
            data-testid="both-scroll-area"
          >
            <ScrollArea.Viewport role="region" aria-label="Wide resource table">
              <ScrollArea.Content>
                <table className="scroll-example-table">
                  <caption>Resource overview</caption>
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th>Format</th>
                      <th>Updated</th>
                      <th>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 16 }, (_, i) => (
                      <tr key={i}>
                        <td>Resource {i + 1}</td>
                        <td>Document</td>
                        <td>21 October 2026</td>
                        <td>120 KB</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar />
            <ScrollArea.Scrollbar orientation="horizontal" />
            <ScrollArea.Corner />
          </ScrollArea.Root>
        </Theme>
        <p className="specimen-note">
          Content stays inside the panel on narrow screens. The corner keeps the
          two tracks from overlapping.
        </p>
      </section>
      <CodeBlock
        code={`import { ScrollArea } from 'unlikely-ui/scroll-area';

<ScrollArea.Root style={{ height: 240 }}>
  <ScrollArea.Viewport role="region" aria-label="Resources">
    <ScrollArea.Content>{/* Long content */}</ScrollArea.Content>
  </ScrollArea.Viewport>
  <ScrollArea.Scrollbar />
</ScrollArea.Root>`}
      />
    </>
  );
}

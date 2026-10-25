import { useEffect, useRef, useState } from 'react';
import type { Appearance } from '../src/theme.js';
import { Button } from '../src/components/button.js';
import { Badge } from '../src/components/badge.js';
import { Checkbox } from '../src/components/checkbox.js';
import { CodeBlock } from './code-block.js';
import { AppearanceComparison } from './appearance-comparison.js';
import contrast from '../docs/foundations/contrast.json' with { type: 'json' };

const roles = [
  'canvas',
  'surface',
  'surface-raised',
  'well',
  'ink',
  'muted',
  'line-soft',
  'line',
  'accent',
  'accent-soft',
  'focus',
] as const;

export function Foundations({ appearance }: { appearance: Appearance }) {
  const root = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    if (root.current) {
      const computed = getComputedStyle(root.current);
      setValues(
        Object.fromEntries(
          roles.map((role) => [
            role,
            computed.getPropertyValue(`--u-${role}`).trim(),
          ]),
        ),
      );
    }
  }, [appearance]);
  return (
    <div ref={root}>
      <div className="page-intro">
        <span className="eyebrow">FOUNDATIONS</span>
        <h1>Design tokens</h1>
        <p>
          Semantic colors, typography, spacing, and geometry used by the
          components.
        </p>
      </div>
      <section className="specimen">
        <div className="specimen-heading">
          <h2>Semantic colors</h2>
          <span className="quiet-label">SCOPED CSS VARIABLES</span>
        </div>
        <div className="token-grid">
          {roles.map((role) => (
            <div className="token-swatch" key={role}>
              <div style={{ background: `var(--u-${role})` }} />
              <code>--u-{role}</code>
              <small>{values[role]}</small>
            </div>
          ))}
        </div>
      </section>
      <div className="two-column">
        <section className="specimen">
          <div className="specimen-heading">
            <h2>Type &amp; rhythm</h2>
          </div>
          <p className="type-heading">Typography sample</p>
          <div className="type-specimens">
            <p className="type-body-role">
              Body · 16 / 24
              <br />
              Build something useful for the people who use it.
            </p>
            <p className="type-small-role">
              Controls · 14 / 20
              <br />
              Project name · Save changes · 12 projects
            </p>
            <p className="type-caption-role">
              Metadata · 12 / 16
              <br />
              Updated 19 October 2026 · 14:30
            </p>
          </div>
          <div className="spacing-scale">
            {[4, 8, 12, 16, 24, 32].map((n) => (
              <div key={n}>
                <span style={{ width: n, height: n }} />
                <code>{n}</code>
              </div>
            ))}
          </div>
        </section>
        <section className="specimen">
          <div className="specimen-heading">
            <h2>Categories & geometry</h2>
          </div>
          <div className="category-row">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <span key={n} style={{ background: `var(--u-category-${n})` }}>
                Group {String.fromCharCode(64 + n)}
              </span>
            ))}
          </div>
          <p className="specimen-note">
            Category fills keep their identity. Status, selection and primary
            actions have their own meanings.
          </p>
          <div className="radius-row">
            {[6, 8, 12].map((n, i) => (
              <div key={n}>
                <span style={{ borderRadius: n }} />
                <small>
                  {['Control', 'Card', 'Dialog'][i]} · {n}
                </small>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="specimen" aria-label="Semantic color roles">
        <div className="specimen-heading">
          <h2>Color in context</h2>
          <span className="quiet-label">SEPARATE MEANINGS</span>
        </div>
        <div className="semantic-pairs">
          <div>
            <Button>Create project</Button>
            <code>accent + accent-ink</code>
            <small>
              {
                contrast.pairs.find(
                  (pair) =>
                    pair.appearance === appearance &&
                    pair.foreground === '--u-accent-ink' &&
                    pair.background === '--u-accent',
                )?.ratio
              }
              :1 · text contrast
            </small>
          </div>
          <div>
            <label className="selected-specimen">
              <Checkbox defaultChecked /> Selected project
            </label>
            <code>selection + selection-ink</code>
          </div>
          <div>
            <Badge tone="success">Saved successfully</Badge>
            <code>success + success-soft</code>
          </div>
          <div>
            <Badge category={2}>Design</Badge>
            <code>category-2 + category-ink</code>
          </div>
        </div>
        <p className="specimen-note">
          Ratios come from the generated palette report. Palette checks do not
          establish complete component accessibility.
        </p>
      </section>
      <AppearanceComparison />
      <CodeBlock
        code={`import { Theme } from 'unlikely-ui/theme';\nimport 'unlikely-ui/styles.css';\n\n<Theme appearance="dark">\n  <YourApp />\n</Theme>`}
      />
    </div>
  );
}

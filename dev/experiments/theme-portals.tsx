import { CheckControl } from '../controls.js';
import { useState } from 'react';
import { Popover } from '@base-ui/react/popover';
import { Theme } from '../../src/theme.js';
import type { ThemeTokens } from '../../src/theme.js';
import { Button } from '../../src/components/button.js';
import { Glyph } from '../glyph.js';

const peach: ThemeTokens = {
  '--u-accent': '#f7d6ac',
  '--u-accent-hover': '#edc99a',
  '--u-accent-pressed': '#dfb783',
  '--u-accent-ink': '#342414',
  '--u-accent-text': '#72502d',
  '--u-accent-soft': '#fff0db',
  '--u-accent-border': '#8b6133',
  '--u-focus': '#72502d',
  '--u-radius': '9999px',
};

export function ThemePortalExperiment() {
  const [reverse, setReverse] = useState(false);
  const [rtl, setRtl] = useState(false);
  return (
    <section className="specimen" aria-label="Theme and portal experiment">
      <div className="specimen-heading">
        <h2>Portal theme inheritance</h2>
        <span className="status-tag experimental">Experimental</span>
      </div>
      <p className="specimen-note">
        A Base UI popover specimen testing inherited settings. This is not a
        published Popover component.
      </p>
      <div className="experiment-controls">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setReverse((value) => !value)}
        >
          Reverse appearances
        </Button>
        <CheckControl checked={rtl} onCheckedChange={setRtl}>
          Inner RTL
        </CheckControl>
      </div>
      <Theme
        appearance={reverse ? 'light' : 'dark'}
        className="outer-scope"
        data-testid="outer-theme"
      >
        <p className="scope-caption">
          OUTER SCOPE · {reverse ? 'LIGHT' : 'DARK'}
        </p>
        <Theme
          appearance={reverse ? 'dark' : 'light'}
          tokens={{
            ...peach,
            '--u-accent-text': reverse ? '#f7d6ac' : '#72502d',
            '--u-focus': reverse ? '#f7d6ac' : '#72502d',
          }}
          dir={rtl ? 'rtl' : 'ltr'}
          className="inner-scope"
          data-testid="inner-theme"
        >
          <p className="scope-caption">
            INNER SCOPE · {reverse ? 'DARK' : 'LIGHT'}
          </p>
          <h3>Nested theme</h3>
          <p>A different accent and softer corners, in a local theme.</p>
          <Popover.Root>
            <Popover.Trigger render={<Button />}>
              Open themed popover
              <Glyph name="arrow" size={16} />
            </Popover.Trigger>
            <Popover.Portal>
              <Theme data-testid="portal-theme" className="portal-scope">
                <Popover.Positioner
                  positionMethod="fixed"
                  sideOffset={10}
                  className="experiment-positioner"
                >
                  <Popover.Popup className="u-popover experiment-popup">
                    <span className="quiet-label">PORTAL SPECIMEN</span>
                    <Popover.Title>Inherited theme settings</Popover.Title>
                    <Popover.Description>
                      The popup keeps the inner appearance, token overrides and
                      direction.
                    </Popover.Description>
                    <Popover.Close render={<Button size="sm" />}>
                      Got it
                      <Glyph name="check" size={16} />
                    </Popover.Close>
                  </Popover.Popup>
                </Popover.Positioner>
              </Theme>
            </Popover.Portal>
          </Popover.Root>
        </Theme>
      </Theme>
    </section>
  );
}

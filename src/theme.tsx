'use client';

import { createContext, useContext, useMemo } from 'react';
import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { DirectionProvider } from '@base-ui/react/direction-provider';
import type { ThemeToken } from './token-names.js';

export type { ThemeToken } from './token-names.js';
export type Appearance = 'light' | 'dark';
export type ThemeTokens = Partial<Record<ThemeToken, string>>;

interface ThemeSettings {
  appearance: Appearance;
  tokens: ThemeTokens;
  dir?: 'ltr' | 'rtl';
  lang?: string;
}

const ThemeContext = createContext<ThemeSettings>({
  appearance: 'light',
  tokens: {},
});

export interface ThemeProps extends Omit<
  ComponentPropsWithRef<'div'>,
  'dir' | 'lang'
> {
  /** Scoped appearance; inherits the parent, with light at the outermost scope. */
  appearance?: Appearance;
  /** Semantic CSS token overrides, merged with the parent and inherited by portals. */
  tokens?: ThemeTokens;
  /** Text direction, also forwarded to Base UI and portaled descendants. */
  dir?: 'ltr' | 'rtl';
  /** HTML language tag, inherited by nested themes and portals; does not change the document locale. */
  lang?: string;
}

/** A local theme boundary. An empty Theme inside a portal inherits its opener's settings. */
export function Theme({
  appearance,
  tokens,
  dir,
  lang,
  className,
  style,
  children,
  ...props
}: ThemeProps) {
  const parent = useContext(ThemeContext);
  const value = useMemo<ThemeSettings>(
    () => ({
      appearance: appearance ?? parent.appearance,
      dir: dir ?? parent.dir,
      lang: lang ?? parent.lang,
      tokens: { ...parent.tokens, ...tokens },
    }),
    [appearance, dir, lang, tokens, parent],
  );

  const scope = (
    <div
      {...props}
      className={['u-theme', className].filter(Boolean).join(' ')}
      data-appearance={value.appearance}
      dir={value.dir}
      lang={value.lang}
      style={{ ...value.tokens, ...style } as CSSProperties}
    >
      {children}
    </div>
  );

  return (
    <ThemeContext value={value}>
      {value.dir ? (
        <DirectionProvider direction={value.dir}>{scope}</DirectionProvider>
      ) : (
        scope
      )}
    </ThemeContext>
  );
}

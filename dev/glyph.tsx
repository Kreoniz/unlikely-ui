import type { CSSProperties } from 'react';

export type GlyphName =
  | 'grid'
  | 'layers'
  | 'flask'
  | 'search'
  | 'sun'
  | 'moon'
  | 'arrow'
  | 'plus'
  | 'check'
  | 'copy'
  | 'sliders';
const paths: Record<GlyphName, string[]> = {
  grid: ['M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z'],
  layers: ['m12 3 10 5-10 5L2 8z', 'm2 12 10 5 10-5', 'm2 16 10 5 10-5'],
  flask: [
    'M9 3h6 M10 3v7l-6 9a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-9V3',
    'M7 15h10',
  ],
  search: ['M20 20l-5-5', 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0'],
  sun: [
    'M12 3V1 M12 23v-2 M3 12H1 M23 12h-2 M5.6 5.6 4.2 4.2 M19.8 19.8l-1.4-1.4 M5.6 18.4l-1.4 1.4 M19.8 4.2l-1.4 1.4',
    'M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
  ],
  moon: ['M20.5 13.5A9 9 0 0 1 10.5 3a9 9 0 1 0 10 10.5Z'],
  arrow: ['M5 12h14 M13 6l6 6-6 6'],
  plus: ['M12 5v14 M5 12h14'],
  check: ['m5 12 4 4L19 6'],
  copy: ['M8 8h12v12H8z', 'M4 16H3V3h13v1'],
  sliders: [
    'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-3 M20 14V3',
    'M1 10h6 M9 12h6 M17 18h6',
  ],
};
export function Glyph({
  name,
  size = 18,
  style,
}: {
  name: GlyphName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={style}
    >
      {paths[name].map((d, i) => (
        <path d={d} key={i} />
      ))}
    </svg>
  );
}

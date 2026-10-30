interface CatalogEntry {
  id: string;
  name: string;
  category: string;
  status: 'preview' | 'planned';
  description: string;
  aliases?: readonly string[];
  unreleased?: boolean;
}

export const catalog: readonly CatalogEntry[] = [
  {
    id: 'alert',
    name: 'Alert',
    category: 'Feedback',
    status: 'preview',
    description: 'Inline messages and recovery actions.',
  },
  {
    id: 'badge',
    name: 'Badge',
    category: 'Feedback',
    status: 'preview',
    description: 'Status and category labels.',
  },
  {
    id: 'button',
    name: 'Button',
    category: 'Actions',
    status: 'preview',
    description:
      'Actions with standard, outline, secondary, ghost, destructive, and link variants.',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    category: 'Forms',
    status: 'preview',
    description: 'Single-date selection, localization, and week highlighting.',
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Layout',
    status: 'preview',
    description: 'Content panels and an empty-state recipe.',
    aliases: ['empty state', 'panel'],
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'Forms',
    status: 'preview',
    description: 'Independent choices, including mixed and disabled states.',
  },
  {
    id: 'combobox',
    name: 'Combobox',
    category: 'Forms',
    status: 'preview',
    description: 'Searchable options with async loading and empty states.',
  },
  {
    id: 'date-picker',
    name: 'DatePicker',
    category: 'Forms',
    status: 'preview',
    description: 'A calendar in a popover, with a Today action.',
    aliases: ['date picker', 'due date'],
  },
  {
    id: 'dialog',
    name: 'Dialog',
    category: 'Overlays',
    status: 'preview',
    description: 'Modal content with focus containment and dismissal.',
    aliases: ['modal'],
  },
  {
    id: 'field',
    name: 'Field',
    category: 'Forms',
    status: 'preview',
    description: 'Labels, descriptions, controls, and associated errors.',
  },
  {
    id: 'input',
    name: 'Input',
    category: 'Forms',
    status: 'preview',
    description: 'Single-line editing with predictable states.',
  },
  {
    id: 'menu',
    name: 'Menu',
    category: 'Overlays',
    status: 'preview',
    description:
      'Contextual action lists with keyboard navigation and focus return.',
    aliases: ['DropdownMenu', 'dropdown menu', 'actions'],
  },
  {
    id: 'physical-button',
    name: 'PhysicalButton',
    category: 'Expressive',
    status: 'preview',
    description:
      'A domed button with customizable materials, press depth, and a front light.',
  },
  {
    id: 'popover',
    name: 'Popover',
    category: 'Overlays',
    status: 'preview',
    description: 'Contextual content, close to its trigger.',
  },
  {
    id: 'radio-group',
    name: 'RadioGroup',
    category: 'Forms',
    status: 'preview',
    description: 'A single choice from a visible set of options.',
  },
  {
    id: 'scroll-area',
    name: 'ScrollArea',
    category: 'Layout',
    status: 'preview',
    description: 'Native scrolling with consistent, draggable scrollbars.',
  },
  {
    id: 'select',
    name: 'Select',
    category: 'Forms',
    status: 'preview',
    description: 'An option list with keyboard navigation and typeahead.',
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    category: 'Feedback',
    status: 'preview',
    description: 'Placeholders for content that is loading.',
  },
  {
    id: 'spinner',
    name: 'Spinner',
    category: 'Feedback',
    status: 'preview',
    description: 'An accessible progress indicator.',
  },
  {
    id: 'switch',
    name: 'Switch',
    category: 'Forms',
    status: 'preview',
    description: 'Immediately applied on/off settings with native form values.',
    aliases: ['toggle'],
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'Navigation',
    status: 'preview',
    description: 'Related panels with manual or automatic keyboard activation.',
    aliases: [],
  },
  {
    id: 'textarea',
    name: 'Textarea',
    category: 'Forms',
    status: 'preview',
    description:
      'Multiline editing with labels, validation, and resize support.',
  },
  {
    id: 'theme',
    name: 'Theme',
    category: 'Foundations',
    status: 'preview',
    description: 'Scoped appearance and token overrides.',
  },
  {
    id: 'toast',
    name: 'Toast',
    category: 'Feedback',
    status: 'preview',
    description: 'Dismissible notifications with actions and managed timing.',
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'Overlays',
    status: 'preview',
    description: 'Supplementary text on hover or keyboard focus.',
  },
];

/** Checkout-only experiments; deliberately separate from package components. */
export const experiments = [
  {
    id: 'allocation-bar-study',
    name: 'Allocation bar',
    description:
      'A reference-led material allocation editor with fixed totals and amount locks.',
    status: 'experimental',
  },
  {
    id: 'guarded-action-study',
    name: 'Guarded action',
    description:
      'A protective hinged cover over a separate coral action button.',
    status: 'experimental',
  },
  {
    id: 'radial-menu-study',
    name: 'Radial menu',
    description:
      'Six contextual wedge sectors with real note actions and a list alternative.',
    status: 'experimental',
  },
  {
    id: 'receipt-study',
    name: 'Receipt',
    description:
      'An olive output slot issuing a keepable receipt after a real export.',
    status: 'experimental',
  },
  {
    id: 'split-flap-study',
    name: 'Split-flap',
    description:
      'A mechanical three-digit tally with folding leaves and hinge hardware.',
    status: 'experimental',
  },
  {
    id: 'xy-pad-study',
    name: 'XY pad',
    description:
      'Signed CSS offsets with a coral puck, exact entry and live shadow preview.',
    status: 'experimental',
  },
] as const;

import { useState } from 'react';
import { Button, buttonVariants } from '../../src/components/button.js';
import type { ButtonVariant } from '../../src/components/button.js';
import { Field, FieldLabel } from '../../src/components/field.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../src/components/select.js';
import {
  RadioGroup,
  RadioGroupItem,
} from '../../src/components/radio-group.js';
import { CheckControl } from '../controls.js';
import { Glyph } from '../glyph.js';
import { CodeBlock } from '../code-block.js';

const variants = [
  'default',
  'outline',
  'secondary',
  'ghost',
  'destructive',
  'link',
] as const;
const sizes = ['xs', 'sm', 'default', 'lg'] as const;

export function ButtonExamples() {
  const [variant, setVariant] = useState<ButtonVariant>('default');
  const [size, setSize] = useState<'xs' | 'sm' | 'default' | 'lg'>('default');
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actions, setActions] = useState(0);
  return (
    <>
      <section className="specimen" aria-label="Interactive button playground">
        <div className="specimen-heading">
          <h2>Playground</h2>
          <span className="quiet-label">LIVE COMPONENT</span>
        </div>
        <div className="playground-stage">
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            loading={loading}
            onClick={() => setActions((n) => n + 1)}
          >
            Create project
            <Glyph name="arrow" />
          </Button>
          <p className="playground-feedback" role="status">
            {actions
              ? `Action triggered ${actions} ${actions === 1 ? 'time' : 'times'}.`
              : 'Activate with a click, Enter, or Space.'}
          </p>
        </div>
        <div className="playground-controls">
          <Field className="variant-control">
            <FieldLabel>Variant</FieldLabel>
            <Select
              value={variant}
              onValueChange={(v) => {
                if (v) setVariant(v);
              }}
              items={variants.map((value) => ({ value, label: value }))}
            >
              <SelectTrigger size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {variants.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <fieldset className="size-control">
            <legend>Size</legend>
            <RadioGroup aria-label="Size" value={size} onValueChange={setSize}>
              {sizes.map((value) => (
                <label key={value} className="choice-label">
                  <RadioGroupItem value={value} />
                  {value}
                </label>
              ))}
            </RadioGroup>
          </fieldset>
          <CheckControl checked={disabled} onCheckedChange={setDisabled}>
            Disabled
          </CheckControl>
          <CheckControl checked={loading} onCheckedChange={setLoading}>
            Loading
          </CheckControl>
        </div>
      </section>
      <CodeBlock
        code={`import { Button } from 'unlikely-ui/button';\n\n<Button variant="${variant}" size="${size}"${disabled ? ' disabled' : ''}${loading ? ' loading' : ''}>\n  Create project\n</Button>`}
      />
      <section className="specimen">
        <div className="specimen-heading">
          <h2>Variants</h2>
        </div>
        <div className="variant-grid">
          {variants.map((value) => (
            <div className="variant-example" key={value}>
              <Button variant={value} onClick={() => setActions((n) => n + 1)}>
                {value === 'destructive' ? 'Delete project' : 'Create project'}
              </Button>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="specimen" aria-label="Icon buttons">
        <div className="specimen-heading">
          <h2>Icon-only buttons</h2>
          <span className="quiet-label">SAME BUTTON API</span>
        </div>
        <div className="state-row">
          {(['icon-sm', 'icon', 'icon-lg'] as const).map((value) => (
            <Button
              key={value}
              size={value}
              aria-label={`Add project (${value})`}
              variant="secondary"
              onClick={() => setActions((n) => n + 1)}
            >
              <Glyph name="plus" />
            </Button>
          ))}
        </div>
        <p className="specimen-note">
          Use an icon size for a square action. Supply aria-label or
          aria-labelledby. Buttons with an icon and visible text use the regular
          sizes.
        </p>
      </section>
      <CodeBlock
        code={`<Button size="icon" variant="secondary" aria-label="Add project">\n  <PlusIcon />\n</Button>`}
      />
      <section className="specimen">
        <div className="specimen-heading">
          <h2>States &amp; composition</h2>
        </div>
        <div className="state-row">
          <Button disabled>Unavailable</Button>
          <Button loading>Saving project</Button>
          <a
            href="#devspace"
            className={buttonVariants({ variant: 'secondary' })}
          >
            Explore devspace
            <Glyph name="arrow" />
          </a>
        </div>
        <p className="specimen-note">
          Loading retains its accessible name and size. Link composition keeps
          native link semantics.
        </p>
      </section>
    </>
  );
}

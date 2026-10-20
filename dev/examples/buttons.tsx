import { useState } from 'react';
import { Button } from '../../src/components/button.js';
import type { ButtonVariant } from '../../src/components/button.js';
import { Field } from '../../src/components/field.js';
import { Select } from '../../src/components/select.js';
import { RadioGroup } from '../../src/components/radio-group.js';
import { CheckControl } from '../controls.js';
import { Glyph } from '../glyph.js';
import { CodeBlock } from '../code-block.js';

const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

export function ButtonExamples() {
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
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
          <Field.Root className="variant-control">
            <Field.Label>Variant</Field.Label>
            <Select.Root
              value={variant}
              onValueChange={(v) => {
                if (v) setVariant(v);
              }}
              items={variants.map((value) => ({ value, label: value }))}
            >
              <Select.Trigger size="sm">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {variants.map((value) => (
                  <Select.Item key={value} value={value}>
                    {value}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Field.Root>
          <fieldset className="size-control">
            <legend>Size</legend>
            <RadioGroup.Root
              aria-label="Size"
              value={size}
              onValueChange={setSize}
            >
              {sizes.map((value) => (
                <label key={value} className="choice-label">
                  <RadioGroup.Item value={value} />
                  {value}
                </label>
              ))}
            </RadioGroup.Root>
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
                {value === 'danger' ? 'Delete project' : 'Create project'}
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
          <Button
            variant="secondary"
            render={<a href="#devspace" />}
            nativeButton={false}
          >
            Explore devspace
            <Glyph name="arrow" />
          </Button>
        </div>
        <p className="specimen-note">
          Loading retains its accessible name and size. Link composition keeps
          native link semantics.
        </p>
      </section>
    </>
  );
}

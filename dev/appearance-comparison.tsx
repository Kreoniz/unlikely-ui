import { useState } from 'react';
import { Theme } from '../src/theme.js';
import { Button } from '../src/components/button.js';
import { Input } from '../src/components/input.js';
import { Field } from '../src/components/field.js';
import { RadioGroup } from '../src/components/radio-group.js';
import { CheckControl } from './controls.js';

export function AppearanceComparison() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  return (
    <section className="specimen" aria-label="Appearance comparison">
      <div className="specimen-heading">
        <h2>Compare appearances</h2>
      </div>
      <div className="playground-controls">
        <RadioGroup.Root
          variant="segmented"
          aria-label="Comparison size"
          value={size}
          onValueChange={setSize}
        >
          {(['sm', 'md', 'lg'] as const).map((value) => (
            <RadioGroup.Item key={value} value={value}>
              {value}
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>
        <CheckControl checked={loading} onCheckedChange={setLoading}>
          Loading actions
        </CheckControl>
        <CheckControl checked={disabled} onCheckedChange={setDisabled}>
          Disabled controls
        </CheckControl>
      </div>
      <div className="appearance-pair">
        {(['light', 'dark'] as const).map((appearance) => (
          <Theme
            key={appearance}
            appearance={appearance}
            className="appearance-sample"
          >
            <span className="eyebrow">{appearance}</span>
            <Field.Root disabled={disabled}>
              <Field.Label>Project name ({appearance})</Field.Label>
              <Input size={size} defaultValue="Garden journal" />
              <Field.Description>
                Compare the same state and geometry.
              </Field.Description>
            </Field.Root>
            <Button size={size} loading={loading} disabled={disabled}>
              Create project ({appearance})
            </Button>
          </Theme>
        ))}
      </div>
    </section>
  );
}

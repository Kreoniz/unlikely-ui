import { useEffect, useRef, useState } from 'react';
import { PhysicalButton } from '../../src/components/physical-button.js';
import type {
  PhysicalButtonColors,
  PhysicalButtonProps,
} from '../../src/components/physical-button.js';
import { Button } from '../../src/components/button.js';
import { Input } from '../../src/components/input.js';
import { Field } from '../../src/components/field.js';
import { RadioGroup } from '../../src/components/radio-group.js';
import { Select } from '../../src/components/select.js';
import { Theme } from '../../src/theme.js';
import { CheckControl } from '../controls.js';
import { CodeBlock } from '../code-block.js';

const slots = [
  ['cap', 'Cap', '--u-physical-cap'],
  ['capText', 'Label', '--u-physical-ink'],
  ['casing', 'Casing', '--u-physical-casing'],
  ['plate', 'Plate', '--u-physical-plate'],
  ['stripe', 'Stripe', '--u-physical-stripe'],
  ['indicator', 'Light', '--u-physical-indicator'],
] as const;
const mint: PhysicalButtonColors = {
  cap: '#88f19e',
  capText: '#102818',
  casing: '#263126',
  plate: '#414d3c',
  stripe: '#c9ebbb',
  indicator: '#88f19e',
};
const blue: PhysicalButtonColors = {
  cap: '#92bde6',
  capText: '#142016',
  casing: '#202a37',
  plate: '#35445b',
  stripe: '#cbdcf5',
  indicator: '#8ecbff',
};
function PowerIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 3v8m-5-6a8 8 0 1 0 10 0" />
    </svg>
  );
}

export function PhysicalButtonExamples() {
  const ref = useRef<HTMLButtonElement>(null);
  const defaults = useRef<PhysicalButtonColors>({});
  const [colors, setColors] = useState<PhysicalButtonColors>({});
  const [size, setSize] =
    useState<NonNullable<PhysicalButtonProps['size']>>('md');
  const [shape, setShape] =
    useState<NonNullable<PhysicalButtonProps['shape']>>('round');
  const [pattern, setPattern] =
    useState<NonNullable<PhysicalButtonProps['pattern']>>('hazard');
  const [depth, setDepth] =
    useState<NonNullable<PhysicalButtonProps['depth']>>('medium');
  const [label, setLabel] = useState('Push');
  const [disabled, setDisabled] = useState(false);
  const [icon, setIcon] = useState(false);
  const [indicator, setIndicator] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [count, setCount] = useState(0);
  const [powered, setPowered] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const style = getComputedStyle(ref.current);
    const initial = Object.fromEntries(
      slots.map(([key, , token]) => [
        key,
        style.getPropertyValue(token).trim(),
      ]),
    );
    defaults.current = initial;
    setColors(initial);
  }, []);
  const markup = `<PhysicalButton size="${size}" shape="${shape}"
  pattern="${pattern}" depth="${depth}"${indicator ? '\n  indicator' : ''}
  colors={${JSON.stringify(colors, null, 2)}}
  ${toggle ? 'aria-pressed={pressed}\n  onClick={() => setPressed((value) => !value)}' : 'onClick={handleAction}'}${disabled ? '\n  disabled' : ''}${icon || !label.trim() ? '\n  aria-label="Activate physical button"' : ''}>
  ${icon ? '<PowerIcon />' : label ? `{${JSON.stringify(label)}}` : ''}
</PhysicalButton>`;
  const code = `${toggle ? "import { useState } from 'react';\n" : ''}import { PhysicalButton } from 'unlikely-ui/physical-button';\n\n${
    toggle
      ? `export function Example() {
  const [pressed, setPressed] = useState(false);
  return (
${markup
  .split('\n')
  .map((line) => `    ${line}`)
  .join('\n')}
  );
}`
      : markup
  }`;
  return (
    <>
      <section className="specimen" aria-label="Physical button playground">
        <div className="specimen-heading">
          <h2>Playground</h2>
          <span className="quiet-label">PRESS & RELEASE</span>
        </div>
        <div className="physical-playground">
          <div className="playground-stage physical-stage">
            <PhysicalButton
              ref={ref}
              colors={colors}
              size={size}
              shape={shape}
              pattern={pattern}
              depth={depth}
              indicator={indicator}
              disabled={disabled}
              aria-pressed={toggle ? pressed : undefined}
              aria-label={
                icon || !label.trim() ? 'Activate physical button' : undefined
              }
              onClick={() => {
                setCount((n) => n + 1);
                if (toggle) setPressed((value) => !value);
              }}
            >
              {icon ? <PowerIcon /> : label}
            </PhysicalButton>
            <p className="playground-feedback" role="status">
              {toggle
                ? pressed
                  ? 'On'
                  : 'Off'
                : count
                  ? `Activated ${count} ${count === 1 ? 'time' : 'times'}.`
                  : 'Click, tap, or use Enter and Space.'}
            </p>
          </div>
          <div className="physical-settings">
            <Field.Root>
              <Field.Label>Cap label</Field.Label>
              <Input
                size="sm"
                value={label}
                maxLength={12}
                placeholder="Blank for no label"
                onValueChange={setLabel}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label>Preset</Field.Label>
              <Select.Root
                defaultValue="industrial"
                items={{ industrial: 'Industrial', mint: 'Mint', blue: 'Blue' }}
                onValueChange={(value) => {
                  setColors(
                    value === 'mint'
                      ? mint
                      : value === 'blue'
                        ? blue
                        : defaults.current,
                  );
                  setPattern(value === 'industrial' ? 'hazard' : 'plain');
                }}
              >
                <Select.Trigger size="sm">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="industrial">Industrial</Select.Item>
                  <Select.Item value="mint">Mint</Select.Item>
                  <Select.Item value="blue">Blue</Select.Item>
                </Select.Content>
              </Select.Root>
            </Field.Root>
            <fieldset className="physical-setting-wide">
              <legend>Size</legend>
              <RadioGroup.Root
                variant="segmented"
                aria-label="Physical button size"
                value={size}
                onValueChange={setSize}
              >
                {(['sm', 'md', 'lg'] as const).map((value) => (
                  <RadioGroup.Item key={value} value={value}>
                    {value}
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </fieldset>
            <Field.Root>
              <Field.Label>Shape</Field.Label>
              <Select.Root
                value={shape}
                onValueChange={(v) => v && setShape(v)}
                items={{ round: 'Round', square: 'Square' }}
              >
                <Select.Trigger size="sm">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="round">Round</Select.Item>
                  <Select.Item value="square">Square</Select.Item>
                </Select.Content>
              </Select.Root>
            </Field.Root>
            <Field.Root>
              <Field.Label>Press depth</Field.Label>
              <Select.Root
                value={depth}
                onValueChange={(v) => v && setDepth(v)}
                items={{ low: 'Low', medium: 'Medium', high: 'High' }}
              >
                <Select.Trigger size="sm">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {(['low', 'medium', 'high'] as const).map((v) => (
                    <Select.Item key={v} value={v}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Field.Root>
            <div className="physical-colors physical-setting-wide">
              {slots.map(([key, title]) => (
                <label className="physical-color" key={key}>
                  <span>{title}</span>
                  <input
                    type="color"
                    aria-label={`${title} color`}
                    value={colors[key] ?? '#000000'}
                    onChange={(event) =>
                      setColors({ ...colors, [key]: event.currentTarget.value })
                    }
                  />
                  <code aria-hidden="true">{colors[key]}</code>
                </label>
              ))}
            </div>
            <div className="physical-setting-wide physical-toggles">
              <CheckControl
                checked={toggle}
                onCheckedChange={(checked) => {
                  setToggle(checked);
                  setPressed(false);
                }}
              >
                Toggle mode
              </CheckControl>
              <CheckControl checked={indicator} onCheckedChange={setIndicator}>
                Front light
              </CheckControl>
              <CheckControl
                checked={pattern === 'hazard'}
                onCheckedChange={(checked) =>
                  setPattern(checked ? 'hazard' : 'plain')
                }
              >
                Hazard stripes
              </CheckControl>
              <CheckControl checked={icon} onCheckedChange={setIcon}>
                Icon only
              </CheckControl>
              <CheckControl checked={disabled} onCheckedChange={setDisabled}>
                Disabled
              </CheckControl>
            </div>
          </div>
        </div>
        <p className="specimen-note">
          An expressive action for games, demos, and playful product moments.
          Color does not determine behavior. Custom colors should retain
          readable label contrast.
        </p>
      </section>
      <CodeBlock code={code} />
      <section className="specimen" aria-label="Physical button examples">
        <div className="specimen-heading">
          <h2>Appearances & behavior</h2>
        </div>
        <div className="physical-example-grid">
          <Theme appearance="light" className="physical-example">
            <PhysicalButton
              size="sm"
              aria-label="Activate industrial button"
              onClick={() => setCount((n) => n + 1)}
            />
            <span>Industrial · Light</span>
          </Theme>
          <Theme appearance="dark" className="physical-example">
            <PhysicalButton
              size="sm"
              pattern="plain"
              colors={mint}
              aria-label="Activate mint button"
              onClick={() => setCount((n) => n + 1)}
            >
              <PowerIcon />
            </PhysicalButton>
            <span>Mint · Dark</span>
          </Theme>
          <div className="physical-example">
            <PhysicalButton
              size="sm"
              pattern="plain"
              colors={blue}
              indicator
              aria-pressed={powered}
              aria-label="Power"
              onClick={() => setPowered(!powered)}
            >
              <PowerIcon />
            </PhysicalButton>
            <span role="status">{powered ? 'Power on' : 'Power off'}</span>
          </div>
          <div className="physical-example">
            <PhysicalButton size="sm" disabled>
              Locked
            </PhysicalButton>
            <span>Disabled</span>
          </div>
        </div>
        <p className="specimen-note">
          The power button is an app-controlled toggle using aria-pressed. The
          front light follows its on/off state; momentary buttons light only
          while held. The component adds no sound or vibration.
        </p>
      </section>
      <div className="example-actions">
        <Button
          variant="secondary"
          onClick={() => {
            setCount(0);
            setPowered(false);
            setPressed(false);
          }}
        >
          Reset examples
        </Button>
      </div>
    </>
  );
}

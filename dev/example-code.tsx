import { useState } from 'react';
import { RadioGroup } from '../src/components/radio-group.js';
import { CodeBlock } from './code-block.js';

/** Show the source used by the preview with public package imports. */
export function consumerSource(source: string) {
  return source
    .replace(/\.\.\/\.\.\/src\/components\/([\w-]+)\.js/g, 'unlikely-ui/$1')
    .replace(/\.\.\/\.\.\/src\/theme\.js/g, 'unlikely-ui/theme');
}

export function ExampleCode({
  code,
  complete,
}: {
  code: string;
  complete?: string;
}) {
  const [view, setView] = useState('snippet');
  return (
    <div className="example-code">
      {complete && (
        <RadioGroup.Root
          className="code-view-picker"
          variant="segmented"
          aria-label="Code detail"
          value={view}
          onValueChange={setView}
        >
          <RadioGroup.Item value="snippet">Snippet</RadioGroup.Item>
          <RadioGroup.Item value="complete">Complete example</RadioGroup.Item>
        </RadioGroup.Root>
      )}
      <CodeBlock code={view === 'complete' && complete ? complete : code} />
    </div>
  );
}

import { CodeBlock } from './code-block.js';
import { consumerSource } from './example-code.js';
import { RecoverableSettings } from './examples/recoverable-settings.js';
import { DueDateForm } from './examples/due-date-form.js';
import settingsSource from './examples/recoverable-settings.tsx?raw';
import dateSource from './examples/due-date-form.tsx?raw';

export function Workflows() {
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">RECIPES</span>
        <h1>Complete workflows</h1>
        <p>
          Working compositions with their full source. Requests, validation
          policy, and local-date serialization belong to your app.
        </p>
      </div>
      <section
        className="specimen"
        id="settings-recipe"
        aria-label="Save and recover recipe"
      >
        <div className="specimen-heading">
          <h2>Save, preserve, retry</h2>
          <a href="#recipes?recipe=settings-recipe">Link to recipe</a>
        </div>
        <div className="form-stage">
          <RecoverableSettings />
        </div>
        <p className="specimen-note">
          The first save simulates a failure. Retry succeeds without discarding
          the draft.
        </p>
      </section>
      <CodeBlock code={consumerSource(settingsSource)} />
      <section
        className="specimen"
        id="due-date-recipe"
        aria-label="Date picker form recipe"
      >
        <div className="specimen-heading">
          <h2>Submit a required due date</h2>
          <a href="#recipes?recipe=due-date-recipe">Link to recipe</a>
        </div>
        <div className="form-stage">
          <DueDateForm />
        </div>
        <p className="specimen-note">
          The hidden input supplies FormData. Explicit application validation
          supplies the required-date behavior.
        </p>
      </section>
      <CodeBlock code={consumerSource(dateSource)} />
    </>
  );
}

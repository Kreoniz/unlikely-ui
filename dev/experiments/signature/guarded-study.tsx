import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../src/components/button.js';
import { Textarea } from '../../../src/components/textarea.js';
import { GuardedAction } from './guarded-action.js';
import './guarded.css';

const initialDraft = {
  note: 'Try the warmer paper theme. Keep the compact navigation. Review the new empty state.',
  changes: ['Warmer paper theme', 'Compact navigation', 'New empty state'],
};
type SandboxDraft = typeof initialDraft;

/** Local application scene; reset, delay, failure and recovery belong to this demo. */
export function GuardedActionStudy() {
  const [draft, setDraft] = useState<SandboxDraft>(initialDraft);
  const [recovery, setRecovery] = useState<SandboxDraft | null>(null);
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState(500);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const [delay, setDelay] = useState(false);
  const [message, setMessage] = useState(
    'Your local draft has 3 queued changes.',
  );
  const noteInput = useRef<HTMLTextAreaElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const changeNumber = useRef(3);
  useEffect(() => () => clearTimeout(timeout.current), []);

  function resetSandbox() {
    setError('');
    const snapshot = { note: draft.note, changes: [...draft.changes] };
    const shouldFail = failNext;
    const finish = () => {
      setPending(false);
      if (shouldFail) {
        setFailNext(false);
        setError(
          'The preview blocked this reset. Your draft is unchanged. Try again.',
        );
        setMessage('Reset failed. Your local draft is unchanged.');
        return;
      }
      setRecovery(snapshot);
      setDraft({ note: '', changes: [] });
      setOpen(false);
      setMessage(
        'Sandbox reset. The note and queued changes were cleared. A recovery copy is available.',
      );
    };
    if (delay) {
      setPending(true);
      setMessage(
        'Resetting this local sandbox. Closing the cover will not cancel the reset.',
      );
      timeout.current = setTimeout(finish, 1500);
    } else {
      finish();
    }
  }

  return (
    <section
      className="specimen signature-guarded-study"
      id="guarded-action-study"
      aria-label="Guarded action study"
    >
      <div className="specimen-heading">
        <h2>Guarded action</h2>
        <span className="status-tag experimental">Experimental</span>
      </div>
      <p className="specimen-note">
        Lift the protective cover to reveal the coral button. Opening it changes
        nothing.
      </p>
      <div className="signature-guarded-scene">
        <div className="signature-guarded-sandbox">
          <p className="signature-guarded-eyebrow">Local sandbox / Draft 014</p>
          <h3>Room to try things</h3>
          <label htmlFor="guarded-sandbox-note">Draft note</label>
          <Textarea
            id="guarded-sandbox-note"
            ref={noteInput}
            value={draft.note}
            disabled={pending}
            onChange={(event) =>
              setDraft((value) => ({ ...value, note: event.target.value }))
            }
            placeholder="Your sandbox is clear. Start a new note."
            rows={3}
          />
          <div className="signature-guarded-queue-heading">
            <h4>Queued changes</h4>
            <span>{draft.changes.length}</span>
          </div>
          {draft.changes.length > 0 ? (
            <ul>
              {draft.changes.map((change, index) => (
                <li key={`${index}-${change}`}>{change}</li>
              ))}
            </ul>
          ) : (
            <p className="signature-guarded-empty">No changes queued.</p>
          )}
          <div className="signature-guarded-sandbox-actions">
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() => {
                changeNumber.current += 1;
                setDraft((value) => ({
                  ...value,
                  changes: [
                    ...value.changes,
                    `Trial change ${changeNumber.current}`,
                  ],
                }));
                setMessage('A trial change was added to the local draft.');
              }}
            >
              Add a trial change
            </Button>
            {recovery && (
              <Button
                variant="secondary"
                disabled={pending}
                onClick={() => {
                  setDraft(recovery);
                  setRecovery(null);
                  noteInput.current?.focus();
                  setOpen(false);
                  setError('');
                  setMessage(
                    'Recovery copy restored, including your note and queued changes.',
                  );
                }}
              >
                Restore recovery copy
              </Button>
            )}
          </div>
        </div>
        <GuardedAction
          triggerLabel="Lift cover"
          title="Reset this sandbox?"
          description={
            <>
              <p>
                Clear the draft note and all {draft.changes.length} queued
                changes on this page.
              </p>
              <p>
                A recovery copy stays available until the next reset. Nothing
                outside this page changes.
              </p>
              <p className="signature-guarded-step">
                {open
                  ? '2 / Press the coral button to reset.'
                  : '1 / Lift the cover to reach the reset button.'}
              </p>
            </>
          }
          confirmLabel="Reset sandbox"
          duration={duration}
          open={open}
          onOpenChange={setOpen}
          onConfirm={resetSandbox}
          pending={pending}
          error={error}
          disabled={disabled}
        />
      </div>
      <p className="signature-guarded-feedback" role="status">
        {message}
      </p>
      <details className="signature-guarded-inspect">
        <summary>Inspect action states</summary>
        <div>
          <label
            className="signature-guarded-duration"
            htmlFor="guarded-cover-duration"
          >
            <span>Cover duration (ms)</span>
            <output aria-hidden="true">{duration} ms</output>
            <input
              id="guarded-cover-duration"
              type="range"
              aria-valuetext={`${duration} milliseconds`}
              min={0}
              max={1200}
              step={50}
              value={duration}
              onChange={(event) =>
                setDuration(event.currentTarget.valueAsNumber)
              }
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={disabled}
              onChange={(event) => setDisabled(event.target.checked)}
            />
            Disable reset
          </label>
          <label>
            <input
              type="checkbox"
              checked={delay}
              disabled={pending}
              onChange={(event) => setDelay(event.target.checked)}
            />
            Delay the local reset
          </label>
          <label>
            <input
              type="checkbox"
              checked={failNext}
              disabled={pending}
              onChange={(event) => setFailNext(event.target.checked)}
            />
            Fail the next reset
          </label>
        </div>
      </details>
      <p className="specimen-note">
        Enter or Space lifts the cover; Tab reaches the separate reset button.
        Cancel, the lifted cover, or Escape closes it. This sandbox lives only
        in this page.
      </p>
    </section>
  );
}

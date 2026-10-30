import { useEffect, useId, useState } from 'react';
import { Button } from '../../../src/components/button.js';
import { Receipt, ReceiptRow, ReceiptRows } from './receipt.js';
import { SplitFlap } from './split-flap.js';
import './data.css';

const notes = [
  {
    id: 'launch',
    title: 'Launch checklist',
    text: 'Review the examples, check keyboard navigation, and prepare release notes.',
  },
  {
    id: 'type',
    title: 'Type notes',
    text: 'Use a readable body size, short headings, and tabular figures for counts.',
  },
  {
    id: 'release',
    title: 'Release sketch',
    text: 'Describe the change, record the checks, and keep the next step explicit.',
  },
];

interface PreparedExport {
  text: string;
  url: string;
  count: number;
  bytes: number;
}

export function SignatureDataStudies() {
  const id = useId();
  const [selected, setSelected] = useState(notes.map((note) => note.id));
  const [prepared, setPrepared] = useState<PreparedExport | null>(null);
  const [notice, setNotice] = useState(
    'Choose notes, then prepare your export.',
  );
  const [error, setError] = useState(false);
  const [completed, setCompleted] = useState(42);
  const [countDraft, setCountDraft] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [receiptDuration, setReceiptDuration] = useState(700);
  const [flipDuration, setFlipDuration] = useState(400);

  useEffect(() => {
    return () => {
      if (prepared) URL.revokeObjectURL(prepared.url);
    };
  }, [prepared]);

  function selectNote(id: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, id] : current.filter((entry) => entry !== id),
    );
    setPrepared(null);
    setNotice('Selection changed. Prepare a new export.');
    setError(false);
  }

  function prepareExport() {
    try {
      const included = notes.filter((note) => selected.includes(note.id));
      if (!included.length) return;
      const text =
        [
          '# Studio notes',
          ...included.map((note) => `## ${note.title}\n\n${note.text}`),
        ].join('\n\n') + '\n';
      const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      setPrepared({ text, url, count: included.length, bytes: blob.size });
      setNotice('Export ready. Download the file or copy its contents.');
      setError(false);
    } catch {
      setPrepared(null);
      setNotice('Could not prepare the export. Please try again.');
      setError(true);
    }
  }

  async function copyExport() {
    if (!prepared || copying) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(prepared.text);
      setNotice('Export contents copied to the clipboard.');
      setError(false);
    } catch {
      setNotice('Could not copy to the clipboard. You can download the file.');
      setError(true);
    } finally {
      setCopying(false);
    }
  }

  return (
    <div className="signature-data-studies">
      <section
        id="receipt-study"
        className="specimen signature-data-study"
        aria-label="Receipt study"
      >
        <div className="specimen-heading">
          <h2>Receipt</h2>
          <span className="status-tag experimental">Experimental</span>
        </div>
        <p className="specimen-note">
          A finished job leaves something you can keep.
        </p>
        <div className="signature-data-layout signature-data-receipt-layout">
          <div className="signature-data-side signature-data-receipt-inputs">
            <fieldset className="signature-data-note-picker" disabled={copying}>
              <legend>Export studio notes</legend>
              <p>One Markdown file.</p>
              {notes.map((note) => (
                <label key={note.id}>
                  <input
                    type="checkbox"
                    checked={selected.includes(note.id)}
                    onChange={(event) =>
                      selectNote(note.id, event.target.checked)
                    }
                  />
                  <span>{note.title}</span>
                </label>
              ))}
            </fieldset>
            <Button
              onClick={prepareExport}
              disabled={selected.length === 0 || copying}
            >
              {prepared ? 'Prepare again' : 'Prepare export'}
            </Button>
          </div>
          <div className="signature-data-device-scene">
            <Receipt
              issueKey={prepared?.url ?? 'empty'}
              duration={receiptDuration}
              issued={prepared !== null}
              aria-label="Export receipt"
            >
              <header className="signature-data-receipt-header">
                <span
                  className="signature-data-receipt-check"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="m6 12 4 4 8-9" />
                  </svg>
                </span>
                <h3>Export ready</h3>
                <p>
                  {prepared?.count} {prepared?.count === 1 ? 'note' : 'notes'}
                </p>
              </header>
              <ReceiptRows>
                <ReceiptRow label="Format" value="Markdown" />
                <ReceiptRow label="Size" value={`${prepared?.bytes} B`} />
              </ReceiptRows>
              <footer className="signature-data-receipt-footer">
                studio-notes.md
              </footer>
            </Receipt>
          </div>
          <div className="signature-data-side signature-data-receipt-output">
            <div className="signature-data-export-actions">
              {prepared && (
                <>
                  <a
                    href={prepared.url}
                    download="studio-notes.md"
                    onClick={() => {
                      setNotice('Download requested: studio-notes.md.');
                      setError(false);
                    }}
                  >
                    Download .md
                  </a>
                  <Button
                    variant="secondary"
                    onClick={() => void copyExport()}
                    disabled={copying}
                  >
                    {copying ? 'Copying contents…' : 'Copy contents'}
                  </Button>
                </>
              )}
            </div>
            <label
              className="signature-data-timing"
              htmlFor={`${id}-receipt-duration`}
            >
              <span>Receipt duration (ms)</span>
              <input
                id={`${id}-receipt-duration`}
                type="range"
                min={0}
                max={1400}
                step={50}
                value={receiptDuration}
                onChange={(event) =>
                  setReceiptDuration(event.currentTarget.valueAsNumber)
                }
              />
              <output aria-hidden="true">{receiptDuration} ms</output>
            </label>
            <p
              role="status"
              className="signature-data-operation-status"
              data-error={error || undefined}
            >
              {notice}
            </p>
          </div>
        </div>
      </section>
      <section
        id="split-flap-study"
        className="specimen signature-data-study"
        aria-label="Split-flap study"
      >
        <div className="specimen-heading">
          <h2>Split-flap</h2>
          <span className="status-tag experimental">Experimental</span>
        </div>
        <p className="specimen-note">
          A short changing count, with each new reading taking its place.
        </p>
        <div className="signature-data-layout signature-data-counter-layout">
          <div className="signature-data-counter-scene">
            <span className="signature-data-counter-label">COMPLETED</span>
            <SplitFlap
              value={String(completed).padStart(3, '0')}
              duration={flipDuration}
              role="status"
              aria-label="Completed notes"
            />
            <span className="signature-data-counter-caption">
              SESSION TALLY
            </span>
          </div>
          <div className="signature-data-side signature-data-counter-controls">
            <h3>Keep count.</h3>
            <p>A local tally you can add to, undo, or set directly.</p>
            <div className="signature-data-counter-actions">
              <Button
                onClick={() =>
                  setCompleted((value) => Math.min(999, value + 1))
                }
                disabled={completed === 999}
              >
                Add completion
              </Button>
              <Button
                variant="secondary"
                onClick={() => setCompleted((value) => Math.max(0, value - 1))}
                disabled={completed === 0}
              >
                Undo one
              </Button>
            </div>
            <label
              className="signature-data-timing"
              htmlFor={`${id}-flip-duration`}
            >
              <span>Flip duration (ms)</span>
              <input
                id={`${id}-flip-duration`}
                type="range"
                min={0}
                max={1200}
                step={50}
                value={flipDuration}
                onChange={(event) =>
                  setFlipDuration(event.currentTarget.valueAsNumber)
                }
              />
              <output aria-hidden="true">{flipDuration} ms</output>
            </label>
            <label className="signature-data-count-field">
              <span>Completion count</span>
              <input
                type="number"
                min={0}
                max={999}
                step={1}
                value={countDraft ?? completed}
                onFocus={() => setCountDraft(String(completed))}
                onChange={(event) => {
                  const value = event.target.valueAsNumber;
                  setCountDraft(event.target.value);
                  if (Number.isFinite(value))
                    setCompleted(Math.max(0, Math.min(999, Math.round(value))));
                }}
                onBlur={() => setCountDraft(null)}
              />
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}

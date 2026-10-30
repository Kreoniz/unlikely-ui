import { useState } from 'react';
import { AllocationBar } from './allocation-bar.js';
import type { AllocationPart } from './allocation-bar.js';
import { XYPadStudy } from './xy-pad-study.js';
import './spatial.css';

export function SignatureSpatialStudies() {
  const defaults = {
    percentage: [
      { label: 'Build', value: 45, min: 0, max: 100 },
      { label: 'Study', value: 35, min: 0, max: 100 },
      { label: 'Rest', value: 20, min: 0, max: 100 },
    ],
    hours: [
      { label: 'Build', value: 18, min: 0, max: 40 },
      { label: 'Study', value: 14, min: 0, max: 40 },
      { label: 'Rest', value: 8, min: 0, max: 40 },
    ],
  };
  const [scenario, setScenario] = useState<'percentage' | 'hours'>(
    'percentage',
  );
  const [allocations, setAllocations] =
    useState<Record<'percentage' | 'hours', AllocationPart[]>>(defaults);
  const parts = allocations[scenario];
  const setParts = (next: AllocationPart[]) =>
    setAllocations((current) => ({ ...current, [scenario]: next }));
  return (
    <div className="signature-spatial-studies">
      <section
        id="allocation-bar-study"
        aria-label="Allocation bar study"
        className="specimen signature-spatial-study"
      >
        <div className="specimen-heading">
          <h2>Allocation bar</h2>
          <span className="status-tag experimental">Experimental</span>
        </div>
        <p className="specimen-note">
          One fixed total. Move a divider to make room for something else.
        </p>
        <div className="signature-spatial-body">
          <div className="allocation-demo-toolbar">
            <fieldset>
              <legend>Example</legend>
              <label>
                <input
                  type="radio"
                  name="allocation-example"
                  checked={scenario === 'percentage'}
                  onChange={() => setScenario('percentage')}
                />
                Percentages
              </label>
              <label>
                <input
                  type="radio"
                  name="allocation-example"
                  checked={scenario === 'hours'}
                  onChange={() => setScenario('hours')}
                />
                Weekly hours
              </label>
            </fieldset>
            <button type="button" onClick={() => setParts(defaults[scenario])}>
              Reset allocation
            </button>
          </div>
          <AllocationBar
            parts={parts}
            onChange={setParts}
            unit={scenario === 'percentage' ? '%' : 'h'}
            onLockChange={(index, locked) =>
              setParts(
                parts.map((part, i) =>
                  i === index ? { ...part, locked } : part,
                ),
              )
            }
          />
          <p className="signature-spatial-note">
            Drag a divider or enter an amount. Locks keep amounts fixed while
            the nearest unlocked segments exchange units. Use arrow keys on a
            divider; Home and End reach its limits. Entries apply on leaving the
            field.
          </p>
        </div>
      </section>
      <XYPadStudy />
    </div>
  );
}

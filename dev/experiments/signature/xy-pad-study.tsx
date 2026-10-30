import { useState } from 'react';
import type { CSSProperties } from 'react';
import { formatXYCoordinate, XYPad } from './xy-pad.js';

/** App-owned CSS shadow example; the pad only owns two-coordinate input. */
export function XYPadStudy() {
  const [point, setPoint] = useState({ x: 18, y: -12 });
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  return (
    <section
      id="xy-pad-study"
      aria-label="XY pad study"
      className="specimen signature-spatial-study"
    >
      <div className="specimen-heading">
        <h2>XY pad</h2>
        <span className="status-tag experimental">Experimental</span>
      </div>
      <p className="specimen-note">
        Two signed axes. Position a shadow with a direct surface or exact input.
      </p>
      <div className="signature-spatial-body">
        <div className="signature-xy-sheet">
          <XYPad
            xAxis={{ label: 'X offset', min: -40, max: 40 }}
            yAxis={{ label: 'Y offset', min: -40, max: 40 }}
            value={point}
            onChange={setPoint}
            readOnly={readOnly}
            disabled={disabled}
          >
            {(preview) => (
              <figure
                className="signature-xy-shadow"
                aria-label="Shadow preview"
              >
                <figcaption>Shadow</figcaption>
                <div
                  className="signature-xy-shadow-stage"
                  role="img"
                  aria-label={`Cream square with shadow offset X ${formatXYCoordinate(preview.x)}, Y ${formatXYCoordinate(preview.y)} pixels`}
                  style={
                    {
                      '--xy-shadow-x': `${preview.x}px`,
                      '--xy-shadow-y': `${preview.y}px`,
                    } as CSSProperties
                  }
                >
                  <span className="signature-xy-shadow-card" />
                </div>
              </figure>
            )}
          </XYPad>
          <div className="signature-xy-center-state">
            <span className="signature-xy-center-map" aria-hidden="true">
              <span className="signature-xy-puck" />
            </span>
            <div>
              <span>Centered state</span>
              <bdi dir="ltr">X 0 · Y 0</bdi>
            </div>
            <button
              type="button"
              disabled={disabled || readOnly}
              onClick={() => setPoint({ x: 0, y: 0 })}
            >
              Center shadow
            </button>
          </div>
        </div>
        <div className="signature-xy-options">
          <label>
            <input
              type="checkbox"
              checked={readOnly}
              onChange={(event) => setReadOnly(event.currentTarget.checked)}
            />
            Read-only offsets
          </label>
          <label>
            <input
              type="checkbox"
              checked={disabled}
              onChange={(event) => setDisabled(event.currentTarget.checked)}
            />
            Disable offsets
          </label>
        </div>
        <p className="signature-xy-applied">
          Applied offset:{' '}
          <bdi dir="ltr" data-testid="xy-applied-offset">
            X {formatXYCoordinate(point.x)} · Y {formatXYCoordinate(point.y)}
          </bdi>
        </p>
        <p className="signature-xy-note">
          Drag to preview; release to apply. Cancelled gestures restore the
          applied shadow. Native axis controls work without dragging; exact
          entries apply when you leave the field. Values are CSS pixels from −40
          to 40.
        </p>
      </div>
    </section>
  );
}

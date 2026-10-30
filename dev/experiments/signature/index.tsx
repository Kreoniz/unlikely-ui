import { useEffect, useState } from 'react';
import { experiments } from '../../catalog.js';
import { CheckControl } from '../../controls.js';
import { Theme } from '../../../src/theme.js';
import { SignatureDataStudies } from './data-studies.js';
import { SignatureActionStudies } from './action-studies.js';
import { SignatureSpatialStudies } from './spatial-studies.js';
import './signature.css';

function focusStudy(studyId: string) {
  if (!experiments.some((item) => item.id === studyId)) return;
  const section = document.getElementById(studyId);
  const heading = section?.querySelector('h2');
  if (!heading) return;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  section?.scrollIntoView({ block: 'start', behavior: 'instant' });
}

export function SignatureStudies({ studyId }: { studyId?: string | null }) {
  const [rtl, setRtl] = useState(false);
  useEffect(() => {
    if (studyId) focusStudy(studyId);
  }, [studyId]);
  return (
    <>
      <nav className="example-links" aria-label="Signature experiments">
        {experiments.map((item) => (
          <a
            key={item.id}
            href={`#devspace?study=${item.id}`}
            onClick={(event) => {
              if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              )
                return;
              if (location.hash === event.currentTarget.getAttribute('href')) {
                event.preventDefault();
                focusStudy(item.id);
              }
            }}
          >
            {item.name}
          </a>
        ))}
      </nav>
      <p className="specimen-note">
        Working studies in this checkout, outside the npm package. Their
        contracts and visual direction remain experimental.
      </p>
      <div className="experiment-controls">
        <CheckControl checked={rtl} onCheckedChange={setRtl}>
          RTL layout
        </CheckControl>
      </div>
      <Theme dir={rtl ? 'rtl' : 'ltr'} className="signature-studies-scenes">
        <SignatureDataStudies />
        <SignatureActionStudies />
        <SignatureSpatialStudies />
      </Theme>
    </>
  );
}

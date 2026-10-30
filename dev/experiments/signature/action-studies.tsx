import { GuardedActionStudy } from './guarded-study.js';
import { RadialMenuStudy } from './radial-study.js';

export function SignatureActionStudies() {
  return (
    <>
      <GuardedActionStudy />
      <RadialMenuStudy />
    </>
  );
}

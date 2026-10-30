import { Component } from 'react';
import type { ReactNode } from 'react';
import { Button } from '../src/components/button.js';

/** Gallery-only recovery. React.lazy caches rejected imports, so retry by reload. */
export class StudyBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function StudyUnavailable() {
  return (
    <section className="study-unavailable" role="alert">
      <h2>Study unavailable</h2>
      <p>This study couldn’t load. Reload the page to try again.</p>
      <div className="experiment-controls">
        <Button variant="secondary" onClick={() => location.reload()}>
          Reload page
        </Button>
        <a href="#overview">Back to overview</a>
      </div>
    </section>
  );
}

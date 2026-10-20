import { useState } from 'react';
import { Toast } from '../../src/components/toast.js';
import { Button } from '../../src/components/button.js';
import { Alert } from '../../src/components/alert.js';
import { Badge } from '../../src/components/badge.js';
import { Skeleton } from '../../src/components/skeleton.js';
import { Spinner } from '../../src/components/spinner.js';
import { Card } from '../../src/components/card.js';
import { CheckControl } from '../controls.js';
import { CodeBlock } from '../code-block.js';
import type { StatusTone } from '../../src/components/badge.js';

function ToastControls() {
  const manager = Toast.useToastManager();
  return (
    <div className="state-row">
      <Button
        onClick={() =>
          manager.add({
            title: 'Link copied',
            description: 'The comparison link is ready to share.',
            type: 'success',
          })
        }
      >
        Show success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          manager.add({
            title: 'Schedule unavailable',
            description: 'Try refreshing in a moment.',
            type: 'danger',
            priority: 'high',
            timeout: 7000,
          })
        }
      >
        Show error
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          manager.add({
            title: 'Saved data',
            description: 'Showing the last available schedule.',
            type: 'info',
          })
        }
      >
        Show information
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          manager.add({
            title: 'Update available',
            description: 'This message stays until dismissed.',
            type: 'info',
            timeout: 0,
            actionProps: { children: 'Update', onClick: () => manager.close() },
          })
        }
      >
        Show persistent action
      </Button>
      <Button variant="ghost" onClick={() => manager.close()}>
        Dismiss all
      </Button>
      <Button
        variant="secondary"
        onClick={() => {
          manager.add({
            title: 'Schedule updated',
            description: 'Your saved timetable is up to date.',
            type: 'success',
            timeout: 0,
          });
          manager.add({
            title: 'Comparison link ready',
            description:
              'Share the link with your group to compare schedules and find a time that works for everyone.',
            type: 'info',
            timeout: 0,
          });
          manager.add({
            title: 'Groups saved',
            description: 'Your selected groups are available next time.',
            timeout: 0,
          });
        }}
      >
        Show stack
      </Button>
    </div>
  );
}

export function ToastExamples() {
  return (
    <Toast.Provider timeout={4500} limit={3}>
      <section className="specimen">
        <div className="specimen-heading">
          <h2>Notifications</h2>
          <span className="quiet-label">PAUSES ON HOVER & FOCUS</span>
        </div>
        <ToastControls />
        <p className="specimen-note">
          Notifications stack at the bottom of the viewport. Hover or focus the
          stack to expand it and pause timers. On touch screens, tap the stack.
          Press F6 to focus the notification area. Escape and the dismiss action
          close notifications. Show stack adds three persistent examples.
        </p>
      </section>
      <Toast.Viewport aria-label="Notifications" />
      <CodeBlock
        code={`import { Toast } from 'unlikely-ui/toast';\n\n<Toast.Provider timeout={4500} limit={3}>\n  <App />\n  <Toast.Viewport />\n</Toast.Provider>\n\n// Inside App:\nconst toast = Toast.useToastManager();\ntoast.add({ title: 'Link copied', type: 'success' });`}
      />
    </Toast.Provider>
  );
}

const tones: StatusTone[] = ['neutral', 'success', 'warning', 'danger', 'info'];
export function BadgeExamples() {
  return (
    <>
      <section className="specimen">
        <div className="specimen-heading">
          <h2>Status and categories</h2>
        </div>
        <div className="state-row">
          {tones.map((tone) => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
        </div>
        <div className="state-row">
          {([1, 2, 3, 4, 5, 6] as const).map((n) => (
            <Badge category={n} key={n}>
              Group {n}
            </Badge>
          ))}
        </div>
        <p className="specimen-note">
          Labels retain meaning alongside color. Category assignment remains in
          the app.
        </p>
      </section>
      <CodeBlock
        code={`<Badge tone="warning">Saved data</Badge>\n<Badge category={2}>Group B</Badge>`}
      />
    </>
  );
}

export function AlertExamples() {
  const [retry, setRetry] = useState(false);
  return (
    <>
      <div className="example-form">
        <Alert.Root tone="warning">
          <Alert.Title>Working offline</Alert.Title>
          <Alert.Description>
            Saved schedules are available. They may differ from the current
            timetable.
          </Alert.Description>
        </Alert.Root>
        <Alert.Root tone="danger">
          <Alert.Title>
            {retry ? 'Retry requested' : 'Some schedules are unavailable'}
          </Alert.Title>
          <Alert.Description>
            {retry
              ? 'The example retry action was triggered.'
              : 'Try loading the missing schedules again.'}
          </Alert.Description>
          <Alert.Actions>
            <Button variant="secondary" onClick={() => setRetry(true)}>
              Retry
            </Button>
          </Alert.Actions>
        </Alert.Root>
        <Alert.Root tone="info">
          <Alert.Title>Application update available</Alert.Title>
          <Alert.Description>
            Reload when you are ready to use the new version.
          </Alert.Description>
        </Alert.Root>
      </div>
      <CodeBlock
        code={`<Alert.Root tone="warning">\n  <Alert.Title>Working offline</Alert.Title>\n  <Alert.Description>Saved schedules are available.</Alert.Description>\n</Alert.Root>`}
      />
    </>
  );
}

export function LoadingExamples({ spinner = false }: { spinner?: boolean }) {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <section className="specimen">
        <div className="specimen-heading">
          <h2>{spinner ? 'Progress indication' : 'Loading placeholders'}</h2>
        </div>
        <div className="form-stage example-form">
          <CheckControl checked={loading} onCheckedChange={setLoading}>
            Loading example
          </CheckControl>
          {spinner ? (
            <div className="state-row">
              {loading ? (
                <>
                  <Spinner size="sm" label="Loading groups" />
                  <Spinner label="Loading schedules" />
                  <Spinner size="lg" label="Updating schedule" />
                </>
              ) : (
                <Badge tone="success">Ready</Badge>
              )}
            </div>
          ) : (
            <Card.Root
              role="region"
              aria-busy={loading}
              aria-label="Schedule preview"
            >
              <Card.Content>
                {loading ? (
                  <div className="skeleton-example">
                    <Skeleton style={{ width: '55%', height: 20 }} />
                    <Skeleton style={{ height: 64 }} />
                    <Skeleton style={{ width: '80%' }} />
                  </div>
                ) : (
                  <>
                    <strong>Schedule loaded</strong>
                    <p>Three classes are available today.</p>
                  </>
                )}
              </Card.Content>
            </Card.Root>
          )}
          <p role="status" className="playground-feedback">
            {loading ? 'Loading the example…' : 'The example is ready.'}
          </p>
        </div>
      </section>
      <CodeBlock
        code={
          spinner
            ? `<Spinner label="Loading schedules" />\n<Spinner label={null} /> // Decorative; nearby text provides status.`
            : `<section aria-busy={loading} aria-label="Schedule">\n  {loading ? <Skeleton style={{ height: 64 }} /> : <Schedule />}\n</section>`
        }
      />
    </>
  );
}

export function CardExamples() {
  const [joined, setJoined] = useState(false);
  return (
    <>
      <Card.Root>
        <Card.Header>
          <Card.Title>Study group</Card.Title>
          <Card.Description>
            A composition of presentation and action components.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Badge category={2}>Group B</Badge>
          <p>Wednesday · 14:00–16:00</p>
        </Card.Content>
        <Card.Footer>
          <Button onClick={() => setJoined(!joined)}>
            {joined ? 'Leave group' : 'Join group'}
          </Button>
          <span role="status">{joined ? 'Joined the example group.' : ''}</span>
        </Card.Footer>
      </Card.Root>
      <CodeBlock
        code={`<Card.Root>\n  <Card.Header>\n    <Card.Title>Study group</Card.Title>\n    <Card.Description>Meeting details</Card.Description>\n  </Card.Header>\n  <Card.Content>Wednesday · 14:00–16:00</Card.Content>\n  <Card.Footer><Button>Join group</Button></Card.Footer>\n</Card.Root>`}
      />
    </>
  );
}

export function EmptyStateExample() {
  const [added, setAdded] = useState(false);
  return (
    <>
      <Card.Root>
        <Card.Content className="empty-state-recipe">
          {added ? (
            <>
              <Badge tone="success">Group added</Badge>
              <p>The example now contains a group.</p>
              <Button variant="secondary" onClick={() => setAdded(false)}>
                Reset example
              </Button>
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                width="32"
                height="32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M3 5h18v15H3zM7 3v5m10-5v5M3 10h18" />
              </svg>
              <h2>No groups selected</h2>
              <p>Add a group to view its schedule and compare availability.</p>
              <Button onClick={() => setAdded(true)}>Add a group</Button>
            </>
          )}
        </Card.Content>
      </Card.Root>
      <p className="specimen-note">
        This is a composition recipe using Card, text, and Button. Illustrations
        and product-specific behavior stay with the app.
      </p>
      <CodeBlock
        code={`<Card.Root>\n  <Card.Content>\n    <h2>No groups selected</h2>\n    <p>Add a group to view its schedule.</p>\n    <Button onClick={openGroupPicker}>Add a group</Button>\n  </Card.Content>\n</Card.Root>`}
      />
    </>
  );
}

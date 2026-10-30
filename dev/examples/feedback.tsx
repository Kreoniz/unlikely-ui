import { EmptyState } from './empty-state.js';
import emptyStateSource from './empty-state.tsx?raw';
import { ExampleCode, consumerSource } from '../example-code.js';
import { useState } from 'react';
import { Toast } from '../../src/components/toast.js';
import { Button } from '../../src/components/button.js';
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '../../src/components/alert.js';
import { Badge } from '../../src/components/badge.js';
import { Skeleton } from '../../src/components/skeleton.js';
import { Spinner } from '../../src/components/spinner.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
} from '../../src/components/card.js';
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
        <Alert tone="warning">
          <AlertTitle>Working offline</AlertTitle>
          <AlertDescription>
            Saved schedules are available. They may differ from the current
            timetable.
          </AlertDescription>
        </Alert>
        <Alert tone="danger">
          <AlertTitle>
            {retry ? 'Retry requested' : 'Some schedules are unavailable'}
          </AlertTitle>
          <AlertDescription>
            {retry
              ? 'The example retry action was triggered.'
              : 'Try loading the missing schedules again.'}
          </AlertDescription>
          <AlertActions>
            <Button variant="secondary" onClick={() => setRetry(true)}>
              Retry
            </Button>
          </AlertActions>
        </Alert>
        <Alert tone="info">
          <AlertTitle>Application update available</AlertTitle>
          <AlertDescription>
            Reload when you are ready to use the new version.
          </AlertDescription>
        </Alert>
      </div>
      <CodeBlock
        code={`<Alert tone="warning">\n  <AlertTitle>Working offline</AlertTitle>\n  <AlertDescription>Saved schedules are available.</AlertDescription>\n</Alert>`}
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
            <Card
              role="region"
              aria-busy={loading}
              aria-label="Schedule preview"
            >
              <CardContent>
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
              </CardContent>
            </Card>
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
  const [compact, setCompact] = useState(false);
  return (
    <>
      <CheckControl checked={compact} onCheckedChange={setCompact}>
        Compact panel
      </CheckControl>
      <Card size={compact ? 'sm' : 'default'}>
        <CardHeader>
          <CardTitle>Study group</CardTitle>
          <CardDescription>
            A composition of presentation and action components.
          </CardDescription>
          <CardAction>
            <Button variant="ghost" size="sm" onClick={() => setJoined(false)}>
              Reset
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Badge category={2}>Group B</Badge>
          <p>Wednesday · 14:00–16:00</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setJoined(!joined)}>
            {joined ? 'Leave group' : 'Join group'}
          </Button>
          <span role="status">{joined ? 'Joined the example group.' : ''}</span>
        </CardFooter>
      </Card>
      <CodeBlock
        code={`<Card>\n  <CardHeader>\n    <CardTitle>Study group</CardTitle>\n    <CardDescription>Meeting details</CardDescription>\n  </CardHeader>\n  <CardContent>Wednesday · 14:00–16:00</CardContent>\n  <CardFooter><Button>Join group</Button></CardFooter>\n</Card>`}
      />
    </>
  );
}

export function EmptyStateExample() {
  return (
    <>
      <section className="specimen">
        <div className="specimen-heading">
          <h2>Empty state</h2>
        </div>
        <div className="form-stage">
          <EmptyState />
        </div>
        <p className="specimen-note">
          A Card and Button recipe. Product copy and first-use behavior remain
          in the app.
        </p>
      </section>
      <ExampleCode
        complete={consumerSource(emptyStateSource)}
        code={`import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from 'unlikely-ui/card';\nimport { Button } from 'unlikely-ui/button';\n\n// Supply your application's action. See Complete example for a runnable flow.\n<Card>\n  <CardContent>\n    <h2>No groups selected</h2>\n    <p>Add a group to view its schedule.</p>\n    <Button onClick={openGroupPicker}>Add a group</Button>\n  </CardContent>\n</Card>`}
      />
    </>
  );
}

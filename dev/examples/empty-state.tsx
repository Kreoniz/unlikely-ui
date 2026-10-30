import { useState } from 'react';
import { Card, CardContent } from '../../src/components/card.js';
import { Badge } from '../../src/components/badge.js';
import { Button } from '../../src/components/button.js';

export function EmptyState() {
  const [added, setAdded] = useState(false);
  return (
    <Card>
      <CardContent
        className="empty-state-recipe"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--u-space-4)',
          textAlign: 'center',
        }}
      >
        {added ? (
          <>
            <Badge tone="success">Group added</Badge>
            <p>The example now contains a group.</p>
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
          </>
        )}
        <Button
          variant={added ? 'secondary' : 'primary'}
          onClick={() => setAdded(!added)}
        >
          {added ? 'Reset example' : 'Add a group'}
        </Button>
      </CardContent>
    </Card>
  );
}

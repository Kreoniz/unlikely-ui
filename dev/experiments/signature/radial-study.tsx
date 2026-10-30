import { useRef, useState } from 'react';
import { RadialMenu } from './radial-menu.js';

type Note = {
  id: number;
  title: string;
  body: string;
  pinned: boolean;
  folder: string;
  deleted: boolean;
};
function ActionIcon({ name }: { name: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={name === 'delete' ? 'radial-delete-icon' : undefined}
    >
      {name === 'copy' && (
        <>
          <rect x="8" y="7" width="12" height="14" rx="1" />
          <path d="M16 7V3H4v14h4" />
        </>
      )}
      {name === 'duplicate' && (
        <>
          <rect x="8" y="7" width="12" height="14" rx="1" />
          <path d="M16 7V3H4v14h4M14 11v6m-3-3h6" />
        </>
      )}
      {name === 'move' && (
        <path d="M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4" />
      )}
      {name === 'pin' && <path d="M8 3h8M9 3v6l-4 6h14l-4-6V3M12 15v7" />}
      {name === 'delete' && (
        <>
          <path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7" />
        </>
      )}
      {name === 'more' && (
        <>
          <circle cx="4" cy="12" r="1.3" />
          <circle cx="12" cy="12" r="1.3" />
          <circle cx="20" cy="12" r="1.3" />
        </>
      )}
    </svg>
  );
}
const initial: Note = {
  id: 1,
  title: 'Field notes',
  body: 'Morning light on the river. The bookshop on the corner. One good sentence to bring back.',
  pinned: false,
  folder: 'Inbox',
  deleted: false,
};

export function RadialMenuStudy() {
  const [notes, setNotes] = useState<Note[]>([initial]);
  const [activeId, setActiveId] = useState(1);
  const [list, setList] = useState(false);
  const [details, setDetails] = useState(false);
  const [message, setMessage] = useState(
    'Right-click or long-press the note, or use Open note actions.',
  );
  const restore = useRef<HTMLButtonElement>(null);
  const nextId = useRef(2);
  const note = notes.find((item) => item.id === activeId)!;
  const update = (values: Partial<Note>) =>
    setNotes((current) =>
      current.map((item) =>
        item.id === activeId ? { ...item, ...values } : item,
      ),
    );
  async function action(id: string) {
    if (id === 'copy') {
      try {
        await navigator.clipboard.writeText(note.title + '\n\n' + note.body);
        setMessage('Note contents copied.');
      } catch {
        setMessage('Copy failed. Select the note text and copy it directly.');
      }
    } else if (id === 'duplicate') {
      const copy = {
        ...note,
        id: nextId.current++,
        title: note.title + ' copy',
        pinned: false,
      };
      setNotes((current) => [...current, copy]);
      setMessage(copy.title + ' added to the workspace.');
    } else if (id === 'move') {
      update({ folder: 'Studio' });
      setMessage('Note moved from Inbox to Studio.');
    } else if (id === 'pin') {
      update({ pinned: !note.pinned });
      setMessage(note.pinned ? 'Note unpinned.' : 'Note pinned.');
    } else if (id === 'delete') {
      update({ deleted: true });
      setMessage('Note moved to the local trash. Undo is available.');
    } else if (id === 'more') {
      setDetails(true);
      setMessage('Note details expanded below.');
    }
  }
  const items = [
    { id: 'copy', label: 'Copy' },
    { id: 'duplicate', label: 'Duplicate' },
    { id: 'move', label: 'Move', disabled: note.folder === 'Studio' },
    { id: 'pin', label: note.pinned ? 'Unpin' : 'Pin' },
    { id: 'delete', label: 'Delete' },
    { id: 'more', label: 'More' },
  ].map((item) => ({ ...item, icon: <ActionIcon name={item.id} /> }));
  return (
    <section
      className="specimen"
      id="radial-menu-study"
      aria-label="Radial menu study"
    >
      <div className="specimen-heading">
        <h2>Radial menu</h2>
        <span className="status-tag experimental">Experimental</span>
      </div>
      <p className="specimen-note">
        Six actions unfold around the point where you invoke them.
      </p>
      <div className="radial-study-body">
        <RadialMenu
          label="Open note actions"
          items={items}
          onAction={(id) => {
            void action(id);
          }}
          layout={list ? 'list' : 'auto'}
          disabled={note.deleted}
          finalFocus={note.deleted ? restore : undefined}
        >
          <div className="radial-canvas">
            <article
              className="radial-document"
              data-pinned={note.pinned || undefined}
              aria-label="Selected note"
            >
              <div className="radial-document-meta">
                <span>{note.folder}</span>
                <span>{note.pinned ? 'Pinned' : 'Unpinned'}</span>
              </div>
              <h3>{note.title}</h3>
              {note.deleted ? (
                <>
                  <p>This note is in the local trash.</p>
                  <button
                    ref={restore}
                    type="button"
                    className="radial-undo"
                    onClick={() => {
                      update({ deleted: false });
                      setMessage('Note restored.');
                    }}
                  >
                    Undo delete
                  </button>
                </>
              ) : (
                <p>{note.body}</p>
              )}
            </article>
          </div>
        </RadialMenu>
        <p className="radial-study-feedback" role="status">
          {message}
        </p>
        {notes.length > 1 && (
          <div
            className="radial-copies"
            role="group"
            aria-label="Workspace notes"
          >
            {notes.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={item.id === activeId}
                onClick={() => {
                  setActiveId(item.id);
                  setDetails(false);
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
        )}
        <details
          className="radial-details"
          open={details}
          onToggle={(event) => setDetails(event.currentTarget.open)}
        >
          <summary>Note details</summary>
          <p>
            {note.body.split(/\s+/).length} words · {new Blob([note.body]).size}{' '}
            bytes · Folder: {note.folder}
          </p>
        </details>
        <div className="radial-study-options">
          <label>
            <input
              type="checkbox"
              checked={list}
              onChange={(event) => setList(event.target.checked)}
            />
            Use list layout
          </label>
        </div>
        <p className="specimen-note">
          The six sectors follow clockwise menu order. Use Up/Down or type an
          action name; Escape closes. Move is unavailable once the note is in
          Studio. Actions affect this local workspace.
        </p>
      </div>
    </section>
  );
}

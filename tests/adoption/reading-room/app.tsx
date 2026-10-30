import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Alert, AlertDescription, AlertTitle } from 'unlikely-ui/alert';
import { Badge } from 'unlikely-ui/badge';
import { Button } from 'unlikely-ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'unlikely-ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'unlikely-ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from 'unlikely-ui/field';
import { Input } from 'unlikely-ui/input';
import { RadioGroup, RadioGroupItem } from 'unlikely-ui/radio-group';
import { Switch } from 'unlikely-ui/switch';
import { Textarea } from 'unlikely-ui/textarea';
import { Theme } from 'unlikely-ui/theme';

type Reading = {
  id: number;
  title: string;
  author: string;
  note: string;
  read: boolean;
};
type Filter = 'all' | 'unread' | 'read';
type RefreshState = 'idle' | 'loading' | 'error' | 'success';
type Draft = Pick<Reading, 'title' | 'author' | 'note'>;
type DraftErrors = Partial<Record<'title' | 'author', string>>;

const initialReadings: Reading[] = [
  {
    id: 1,
    title: 'The Art of Noticing',
    author: 'Rob Walker',
    note: 'A reminder to slow down and pay attention to the things I usually walk past.',
    read: false,
  },
  {
    id: 2,
    title: 'On Keeping a Notebook',
    author: 'Joan Didion',
    note: 'For the next quiet afternoon. Bring a notebook of my own.',
    read: true,
  },
  {
    id: 3,
    title: 'A Field Guide to Getting Lost',
    author: 'Rebecca Solnit',
    note: 'A little room for wandering, uncertainty, and finding something unexpected.',
    read: false,
  },
];

const emptyDraft: Draft = { title: '', author: '', note: '' };

export function App() {
  const [dark, setDark] = useState(false);
  const [readings, setReadings] = useState(initialReadings);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [announcement, setAnnouncement] = useState('');
  const [refreshState, setRefreshState] = useState<RefreshState>('idle');
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const shelfRef = useRef<HTMLElement>(null);
  const nextId = useRef(4);
  const refreshTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(refreshTimer.current), []);

  const readCount = readings.filter((reading) => reading.read).length;
  const unreadCount = readings.length - readCount;
  const search = query.trim().toLocaleLowerCase();
  const visibleReadings = readings.filter((reading) => {
    const matchesStatus =
      filter === 'all' || (filter === 'read' ? reading.read : !reading.read);
    const matchesSearch = `${reading.title} ${reading.author} ${reading.note}`
      .toLocaleLowerCase()
      .includes(search);
    return matchesStatus && matchesSearch;
  });

  function updateDraft(key: keyof Draft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
    if (key === 'title' || key === 'author') {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  }

  function addReading(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = draft.title.trim();
    const author = draft.author.trim();
    const nextErrors: DraftErrors = {};
    if (!title) nextErrors.title = 'Enter a title for this reading.';
    if (!author) nextErrors.author = 'Enter an author or write “Unknown”.';
    setErrors(nextErrors);
    if (nextErrors.title || nextErrors.author) {
      if (nextErrors.title) titleRef.current?.focus();
      else authorRef.current?.focus();
      return;
    }
    const id = nextId.current++;
    setReadings((current) => [
      { id, title, author, note: draft.note.trim(), read: false },
      ...current,
    ]);
    setQuery('');
    setFilter('all');
    setDraft(emptyDraft);
    setDialogOpen(false);
    setAnnouncement(`Added “${title}” to your reading list.`);
  }

  function toggleRead(reading: Reading) {
    setReadings((current) =>
      current.map((item) =>
        item.id === reading.id ? { ...item, read: !item.read } : item,
      ),
    );
    setAnnouncement(
      `“${reading.title}” marked ${reading.read ? 'unread' : 'as read'}.`,
    );
    if (filter !== 'all') shelfRef.current?.focus();
  }

  function refreshShelf(succeed: boolean) {
    window.clearTimeout(refreshTimer.current);
    setRefreshState('loading');
    refreshTimer.current = window.setTimeout(() => {
      setRefreshState(succeed ? 'success' : 'error');
    }, 1100);
  }

  function resetFilters() {
    setQuery('');
    setFilter('all');
  }

  return (
    <Theme appearance={dark ? 'dark' : 'light'} className="reading-room">
      <a className="skip-link" href="#reading-list">
        Skip to reading list
      </a>
      <main className="room-layout" aria-labelledby="room-title">
        <header className="room-header">
          <div>
            <p className="eyebrow">A personal shelf</p>
            <h1 id="room-title">Reading room</h1>
            <p className="intro">
              Good things to come back to. One reading at a time.
            </p>
          </div>
          <label className="appearance-control">
            <Switch checked={dark} onCheckedChange={setDark} />
            <span>Dark appearance</span>
          </label>
        </header>

        <div className="room-columns">
          <section
            ref={shelfRef}
            id="reading-list"
            aria-labelledby="list-title"
            className="shelf"
            tabIndex={-1}
          >
            <div className="shelf-heading">
              <div>
                <h2 id="list-title">Your reading list</h2>
                <p className="quiet">
                  {unreadCount} to read · {readCount} finished
                </p>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger render={<Button />}>Add reading</DialogTrigger>
                <DialogContent
                  initialFocus={titleRef}
                  closeLabel="Close Add reading"
                >
                  <DialogHeader>
                    <DialogTitle>Add reading</DialogTitle>
                    <DialogDescription>
                      A title worth saving for later. Title and author are
                      required.
                    </DialogDescription>
                  </DialogHeader>
                  <form className="add-form" noValidate onSubmit={addReading}>
                    <Field name="title" invalid={Boolean(errors.title)}>
                      <FieldLabel htmlFor="reading-title">Title</FieldLabel>
                      <Input
                        id="reading-title"
                        ref={titleRef}
                        value={draft.title}
                        onChange={(event) =>
                          updateDraft('title', event.target.value)
                        }
                        maxLength={140}
                        required
                        autoComplete="off"
                        aria-invalid={Boolean(errors.title)}
                        aria-describedby={
                          errors.title ? 'reading-title-error' : undefined
                        }
                      />
                      {errors.title && (
                        <FieldError id="reading-title-error" match={true}>
                          {errors.title}
                        </FieldError>
                      )}
                    </Field>
                    <Field name="author" invalid={Boolean(errors.author)}>
                      <FieldLabel htmlFor="reading-author">Author</FieldLabel>
                      <Input
                        id="reading-author"
                        ref={authorRef}
                        value={draft.author}
                        onChange={(event) =>
                          updateDraft('author', event.target.value)
                        }
                        maxLength={100}
                        required
                        autoComplete="off"
                        aria-invalid={Boolean(errors.author)}
                        aria-describedby={
                          errors.author ? 'reading-author-error' : undefined
                        }
                      />
                      {errors.author && (
                        <FieldError id="reading-author-error" match={true}>
                          {errors.author}
                        </FieldError>
                      )}
                    </Field>
                    <Field name="note">
                      <FieldLabel htmlFor="reading-note">
                        A note for later{' '}
                        <span className="optional">(optional)</span>
                      </FieldLabel>
                      <Textarea
                        id="reading-note"
                        value={draft.note}
                        onChange={(event) =>
                          updateDraft('note', event.target.value)
                        }
                        maxLength={300}
                        rows={3}
                      />
                      <FieldDescription>
                        What made you want to read this?
                      </FieldDescription>
                    </Field>
                    <p className="draft-note">
                      Closing keeps your draft for this visit.
                    </p>
                    <DialogFooter>
                      <DialogClose
                        render={<Button type="button" variant="outline" />}
                      >
                        Cancel
                      </DialogClose>
                      <Button type="submit">Add to list</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="filter-panel">
              <Field name="search">
                <FieldLabel htmlFor="reading-search">
                  Search your list
                </FieldLabel>
                <Input
                  id="reading-search"
                  type="search"
                  placeholder="Title, author, or a note…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoComplete="off"
                />
              </Field>
              <RadioGroup<Filter>
                variant="segmented"
                aria-label="Reading status"
                value={filter}
                onValueChange={setFilter}
                className="status-filter"
              >
                <RadioGroupItem value="all">All</RadioGroupItem>
                <RadioGroupItem value="unread">To read</RadioGroupItem>
                <RadioGroupItem value="read">Read</RadioGroupItem>
              </RadioGroup>
            </div>

            <p className="result-count" role="status" aria-atomic="true">
              {visibleReadings.length}{' '}
              {visibleReadings.length === 1 ? 'reading' : 'readings'} shown
              {query.trim() ? ` for “${query.trim()}”` : ''}
            </p>

            {visibleReadings.length > 0 ? (
              <ul className="reading-list">
                {visibleReadings.map((reading, index) => (
                  <li key={reading.id}>
                    <article
                      className="reading-entry"
                      aria-labelledby={`reading-${reading.id}`}
                    >
                      <span className="entry-number" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="entry-copy">
                        <h3 id={`reading-${reading.id}`}>{reading.title}</h3>
                        <p className="author">by {reading.author}</p>
                        {reading.note && (
                          <p className="reading-note">{reading.note}</p>
                        )}
                        <div className="entry-actions">
                          <Badge tone={reading.read ? 'success' : 'neutral'}>
                            {reading.read ? 'Read' : 'To read'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleRead(reading)}
                            aria-label={`Mark “${reading.title}” ${reading.read ? 'unread' : 'as read'}`}
                          >
                            {reading.read ? 'Mark unread' : 'Mark as read'}
                          </Button>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            ) : (
              <Card className="empty-state">
                <CardHeader>
                  <CardTitle>
                    {search
                      ? 'No readings found'
                      : filter === 'read'
                        ? 'A fresh chapter awaits'
                        : 'All caught up'}
                  </CardTitle>
                  <CardDescription>
                    {search
                      ? 'Try another title or author, or clear your filters to see the whole shelf.'
                      : filter === 'read'
                        ? 'Mark a reading as read when you finish. It will be waiting here.'
                        : 'You have finished everything on this shelf. Add something new when inspiration finds you.'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={resetFilters}>
                    Show all readings
                  </Button>
                </CardContent>
              </Card>
            )}
            <p className="sr-only" role="status" aria-atomic="true">
              {announcement}
            </p>
          </section>

          <aside className="room-aside" aria-label="About your shelf">
            <Card>
              <CardHeader>
                <p className="eyebrow">Room to wander</p>
                <CardTitle>A small list. An open mind.</CardTitle>
                <CardDescription>
                  Save what catches your attention. There is no deadline to
                  finish it all.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="shelf-stats">
                  <div>
                    <dt>On your shelf</dt>
                    <dd>{readings.length}</dd>
                  </div>
                  <div>
                    <dt>Finished</dt>
                    <dd>{readCount}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refresh your shelf</CardTitle>
                <CardDescription>
                  This sample refresh fails once. Retry it to see your list
                  recover with every change kept.
                </CardDescription>
              </CardHeader>
              <p className="sr-only" role="status" aria-atomic="true">
                {refreshState === 'loading'
                  ? 'Refreshing your shelf. Your list stays available.'
                  : ''}
              </p>
              <CardContent
                className="refresh-content"
                aria-busy={refreshState === 'loading'}
              >
                <div>
                  {refreshState === 'loading' && (
                    <p className="quiet">
                      Your list stays available while refreshing.
                    </p>
                  )}
                  {refreshState === 'error' && (
                    <Alert tone="danger">
                      <AlertTitle>Couldn’t refresh your shelf</AlertTitle>
                      <AlertDescription>
                        Your readings and changes are still here.
                      </AlertDescription>
                    </Alert>
                  )}
                  {refreshState === 'success' && (
                    <Alert tone="success">
                      <AlertTitle>Your shelf is up to date</AlertTitle>
                      <AlertDescription>
                        Every reading and change has been kept.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <Button
                  variant="secondary"
                  loading={refreshState === 'loading'}
                  onClick={() => refreshShelf(refreshState === 'error')}
                >
                  {refreshState === 'loading'
                    ? 'Refreshing…'
                    : refreshState === 'error'
                      ? 'Retry refresh'
                      : refreshState === 'success'
                        ? 'Try demo again'
                        : 'Try refresh demo'}
                </Button>
              </CardContent>
            </Card>
            <p className="visit-note">
              A little space for this visit. Your list stays in this tab;
              reloading starts fresh.
            </p>
          </aside>
        </div>
        <footer className="room-footer">
          Leave a little room for the next good thing.
        </footer>
      </main>
    </Theme>
  );
}

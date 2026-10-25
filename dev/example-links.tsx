import { useEffect, useState } from 'react';

function scrollToExample(id: string, animate: boolean) {
  const heading = document.getElementById(id);
  heading?.focus({ preventScroll: true });
  heading?.scrollIntoView({
    block: 'start',
    behavior:
      animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'smooth'
        : 'instant',
  });
}

/** Local showcase links; headings remain the editable source for example names. */
export function ExampleLinks({ componentId }: { componentId: string }) {
  const [examples, setExamples] = useState<{ name: string; id: string }[]>([]);
  useEffect(() => {
    const headings = document.querySelectorAll<HTMLElement>(
      '.component-examples .specimen-heading h2',
    );
    const counts = new Map<string, number>();
    setExamples(
      Array.from(headings, (heading) => {
        const name = heading.textContent ?? '';
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        const count = (counts.get(slug) ?? 0) + 1;
        counts.set(slug, count);
        const id = `example-${slug}${count > 1 ? `-${count}` : ''}`;
        heading.id = id;
        heading.tabIndex = -1;
        return { name, id };
      }),
    );
    function jump(event?: HashChangeEvent) {
      const params = new URLSearchParams(location.hash.split('?')[1]);
      const target = params.get('example');
      if (target)
        requestAnimationFrame(() => {
          scrollToExample(target, Boolean(event));
        });
    }
    jump();
    window.addEventListener('hashchange', jump);
    return () => window.removeEventListener('hashchange', jump);
  }, [componentId]);
  if (!examples.length) return null;
  return (
    <nav className="example-links" aria-label="On this page">
      <span>On this page</span>
      {examples.map((example) => (
        <a
          key={example.id}
          href={`#components/${componentId}?example=${example.id}`}
          onClick={(event) => {
            if (
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            // Re-selecting the current anchor does not fire hashchange.
            if (location.hash === event.currentTarget.getAttribute('href')) {
              event.preventDefault();
              scrollToExample(example.id, true);
            }
          }}
        >
          {example.name}
        </a>
      ))}
    </nav>
  );
}

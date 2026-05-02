import { useEffect, useRef, useState } from 'react';

type PagefindResultData = {
  url: string;
  excerpt: string;
  meta: { title?: string };
};

type PagefindResult = {
  id: string;
  data: () => Promise<PagefindResultData>;
};

type Pagefind = {
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
};

declare global {
  interface Window {
    __pagefind?: Pagefind;
  }
}

async function loadPagefind(): Promise<Pagefind | null> {
  if (typeof window === 'undefined') return null;
  if (window.__pagefind) return window.__pagefind;
  try {
    const base = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
    const url = `${base}/pagefind/pagefind.js`;
    /* @vite-ignore */
    const mod: Pagefind = await import(/* @vite-ignore */ url);
    window.__pagefind = mod;
    return mod;
  } catch {
    return null;
  }
}

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<PagefindResultData[]>([]);
  const [ready, setReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    loadPagefind().then((p) => setReady(p !== null));
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!q.trim()) {
      setResults([]);
      return;
    }
    (async () => {
      const pf = await loadPagefind();
      if (!pf) return;
      const r = await pf.search(q);
      const data = await Promise.all(r.results.slice(0, 10).map((res) => res.data()));
      if (!cancelled) setResults(data);
    })();
    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div className="search-modal-scrim" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          placeholder={ready ? 'Search the book…' : 'Search index loads after first build…'}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="search-results">
          {results.length === 0 && q && (
            <div className="search-empty">No matches.</div>
          )}
          {results.map((r, i) => (
            <a key={i} href={r.url} className="search-result">
              <div className="meta">{r.meta.title ?? r.url}</div>
              <div
                className="excerpt"
                dangerouslySetInnerHTML={{ __html: r.excerpt }}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

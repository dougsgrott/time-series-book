import { useEffect, useState } from 'react';
import SearchModal from './SearchModal';

export default function SearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        className="search"
        onClick={() => setOpen(true)}
        aria-label="Search the book"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="6" cy="6" r="4.5" />
          <path d="m9.5 9.5 3 3" />
        </svg>
        <span>Find in book…</span>
        <span className="kbd">⌘K</span>
      </button>
      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  );
}

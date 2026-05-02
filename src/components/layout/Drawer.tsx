import { useEffect, useState } from 'react';

export type DrawerSub = { num: string; title: string; href: string };
export type DrawerPart = { roman: string; title: string; subs: DrawerSub[] };

type Props = {
  toc: DrawerPart[];
  activePart: number;
  activeSlug: string;
};

export default function Drawer({ toc, activePart, activeSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number>(activePart);

  useEffect(() => {
    const onToggle = (e: Event) => {
      if ((e.target as HTMLElement).closest('[data-drawer-toggle]')) {
        setOpen((v) => !v);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onToggle);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onToggle);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    const btn = document.getElementById('menuBtn');
    if (btn) btn.classList.toggle('active', open);
  }, [open]);

  return (
    <>
      <div className={`scrim ${open ? 'show' : ''}`} onClick={() => setOpen(false)} />
      <aside className={`drawer ${open ? 'show' : ''}`} aria-label="Contents">
        <div className="drawer-head">
          <div className="lbl">Contents</div>
          <span className="esc">esc</span>
        </div>
        <div className="drawer-toc">
          {toc.map((part, i) => {
            const isExpanded = expanded === i;
            const isActive = activePart === i;
            return (
              <div key={part.roman}>
                <div
                  className={`toc-ch ${isActive ? 'active' : ''}`}
                  onClick={() => setExpanded(isExpanded ? -1 : i)}
                >
                  <div className="ch-row">
                    <span className="ch-num">{part.roman}</span>
                    <span className="ch-title">{part.title}</span>
                    <span className="ch-count">{part.subs.length}</span>
                  </div>
                </div>
                {isExpanded && (
                  <div className="toc-subs">
                    {part.subs.map((s) => (
                      <a
                        key={s.num}
                        className={`toc-sub ${s.href.includes(activeSlug) ? 'active' : ''}`}
                        href={s.href}
                      >
                        <span className="sn">{s.num}</span>
                        {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}

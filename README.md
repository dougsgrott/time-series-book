# Time Series Book

Static-site build of the time-series book mock, using **Astro + MDX + React islands**, deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # builds to dist/ and runs Pagefind to index
npm run preview  # preview the build locally
```

## Project structure

```
src/
├── components/        Layout, primitives, figures, sidenotes
├── content/
│   ├── config.ts      Zod schema for the chapters collection
│   └── chapters/      MDX chapter sources (one file per section)
├── lib/
│   ├── chart.ts       Forecast chart math (ported from hifi.js)
│   ├── arima-mock.ts  Mock series + AIC/BIC
│   └── toc.ts         Drawer/landing/index data from getCollection
├── pages/
│   ├── index.astro    Landing
│   ├── contents.astro Chapter index
│   └── [...slug].astro Reading view (one route per chapter)
└── styles/
    ├── global.css     Element-level baseline
    └── theme.css      Design tokens + component styles
```

## Authoring a chapter

Chapters are MDX files under `src/content/chapters/<part>/<n>-<slug>.mdx`. Each must declare the frontmatter required by `src/content/config.ts`. Slug = path relative to `chapters/` minus the file extension; the page renders at `/<base>/<slug>/`.

Math uses `$inline$` and `$$display$$` blocks (KaTeX). Code uses fenced blocks (Shiki — `github-dark-dimmed`). Interactive figures are React islands imported from `src/components/figures/` and dropped in with `client:visible`.

## Deploy

The `.github/workflows/deploy.yml` workflow builds with `withastro/action@v3` and publishes to GitHub Pages. The site/base URL is read from [`src/config/book.ts`](src/config/book.ts) — set those values to the actual GitHub Pages URL and repo name before the first deploy.

## Forking this template for a new book

This repo is structured to be reusable as a GitHub template. Once the user marks it as one (Settings → Template repository), each new book gets created via "Use this template" → its own repo → its own GH Pages site. The change surface for a new book is concentrated in five places:

1. **[`src/config/book.ts`](src/config/book.ts)** — title, subtitle, tagline, lede, author, hero/ribbon copy, feature cards, footer text, copyright year, version, and the GH Pages `site` + `base`. This is the single source of truth for everything that varies per book; engine code imports from here.
2. **[`src/content/chapters/`](src/content/chapters/)** — replace with the new book's `.mdx` files. Frontmatter (validated by [`src/content/config.ts`](src/content/config.ts)) drives the drawer, landing-page parts grid, and chapter index automatically.
3. **Domain figures and math** — [`src/lib/chart.ts`](src/lib/chart.ts), [`src/lib/arima-mock.ts`](src/lib/arima-mock.ts), and the React islands under [`src/components/figures/`](src/components/figures/) are book-specific. Replace wholesale.
4. **Theme tokens** (optional) — adjust the `:root` CSS variables at the top of [`src/styles/theme.css`](src/styles/theme.css) for a different palette/typography.
5. **`public/`** — favicon and any other static assets.

### Pulling engine updates into an existing book

After cloning a book repo from this template, add the template as a second remote and merge from it whenever the engine ships an improvement:

```bash
git remote add template https://github.com/<owner>/<this-template-repo>.git
git fetch template
git merge template/main
```

Conflicts should stay confined to content files (which the new book has replaced anyway). Engine files no longer contain book-specific strings, so they merge cleanly.


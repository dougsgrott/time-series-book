/**
 * Per-book configuration. This is the only file that should change when
 * forking this template for a new book. Engine code imports from here
 * instead of hardcoding strings.
 *
 * The `as const` cast preserves literal types for consumers.
 */
export const book = {
  // Identity
  title: 'Book Title',
  subtitle: 'An Interactive Book',
  // Short blurb used as the default <meta name="description">.
  tagline: 'A short tagline describing the book.',
  // Long lede used in the landing hero.
  lede: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua — with interactive examples, working code, and meaningful equations.',
  author: 'Author Name',

  // Branding shown in the topbar crumb on routes that don't override
  defaultCrumb: 'Vol. 01',
  defaultCrumbTitle: 'Part Title I → Part Title VII',

  // Hero block on the landing page (see src/pages/index.astro)
  hero: {
    eyebrow: 'An interactive book',
    // Heading line uses {emphasis} for the colored span; the rest renders as-is
    headingPrefix: 'An interactive\nbook about\n',
    headingEmphasis: 'book title',
    headingSuffix: '.',
    figureCaption:
      'Figure caption placeholder text describing what is shown here.',
    figureLabel: 'Fig. 0',
  },

  // Ribbon section heading on the landing page
  ribbon: {
    label: 'Seven parts',
    hint: 'Click a card to dive in',
  },

  // Three feature cards under the ribbon
  features: [
    {
      eyebrow: 'Feature eyebrow 1',
      title: 'Feature title one.',
      body: 'Feature body text one. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    },
    {
      eyebrow: 'Feature eyebrow 2',
      title: 'Feature title two.',
      body: 'Feature body text two. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    },
    {
      eyebrow: 'Feature eyebrow 3',
      title: 'Feature title three.',
      body: 'Feature body text three. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    },
  ],

  // Footer
  copyrightYear: 2026,
  footerNote: 'Read online, free, forever.',
  footerLinks: [
    { label: 'GitHub', href: '#' },
    { label: 'Cite', href: '#' },
    { label: 'Errata', href: '#' },
  ],
  version: '1.0',
  versionDate: 'Month Year',

  // GitHub Pages target
  site: 'https://dougsgrott.github.io',
  base: '/time-series-book',
} as const;

export type Book = typeof book;

/**
 * Single source of truth for content-type tags.
 *
 * To add a new tag (e.g. "In-depth"): append one entry to TAGS, then list the
 * slug in the `tags:` frontmatter array of any chapter that should carry it.
 * The schema, the chapter chips, the contents-page filter pills, the row data
 * attributes, and the row chips all derive from this array.
 */

type TagIcon = 'clock' | 'dot';

export type TagDef = {
  slug: string;
  label: string;
  accent?: boolean;
  icon?: TagIcon;
};

export const TAGS = [
  { slug: 'interactive', label: 'Interactive', accent: true, icon: 'dot' },
  { slug: 'code', label: 'Code' },
  { slug: 'math', label: 'Math' },
] as const satisfies readonly TagDef[];

export type TagSlug = (typeof TAGS)[number]['slug'];

export const TAG_SLUG_TUPLE = TAGS.map((t) => t.slug) as unknown as [
  TagSlug,
  ...TagSlug[],
];

export function getTag(slug: string): TagDef | undefined {
  return TAGS.find((t) => t.slug === slug);
}

export function resolveTags(slugs: readonly string[]): TagDef[] {
  return slugs
    .map((s) => getTag(s))
    .filter((t): t is TagDef => t !== undefined);
}

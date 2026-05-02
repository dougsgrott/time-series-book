import { getCollection, type CollectionEntry } from 'astro:content';

export type Chapter = CollectionEntry<'chapters'>;

export type Part = {
  part: number;
  partTitle: string;
  partRoman: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII';
  chapters: Chapter[];
};

export async function getAllChapters(): Promise<Chapter[]> {
  const all = await getCollection('chapters');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getToc(): Promise<Part[]> {
  const all = await getAllChapters();
  const parts = new Map<number, Part>();
  for (const ch of all) {
    if (!parts.has(ch.data.part)) {
      parts.set(ch.data.part, {
        part: ch.data.part,
        partTitle: ch.data.partTitle,
        partRoman: ch.data.partRoman,
        chapters: [],
      });
    }
    parts.get(ch.data.part)!.chapters.push(ch);
  }
  return [...parts.values()].sort((a, b) => a.part - b.part);
}

export async function getPrevNext(slug: string) {
  const all = await getAllChapters();
  const idx = all.findIndex((c) => c.slug === slug);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null,
    index: idx,
    total: all.length,
  };
}


import { defineCollection, z } from 'astro:content';
import { TAG_SLUG_TUPLE } from '../lib/tags';

const chapters = defineCollection({
  type: 'content',
  schema: z.object({
    part: z.number().int(),
    partTitle: z.string(),
    partRoman: z.enum(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']),
    num: z.string(),
    title: z.string(),
    description: z.string(),
    readMinutes: z.number().int(),
    tags: z.array(z.enum(TAG_SLUG_TUPLE)).default([]),
    order: z.number(),
  }),
});

export const collections = { chapters };

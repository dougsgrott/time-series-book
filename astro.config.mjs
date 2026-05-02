import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { book } from './src/config/book.ts';

export default defineConfig({
  site: book.site,
  base: book.base,
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    mdx(),
    react(),
    tailwind({ applyBaseStyles: false }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: { theme: 'github-dark-dimmed' },
  },
  vite: {
    ssr: {
      noExternal: ['katex'],
    },
  },
});

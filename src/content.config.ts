import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const temas = defineCollection({
  loader: glob({ base: './src/content/temas', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    clase: z.number().int().min(1),
    orden: z.number().int().min(1),
    titulo: z.string(),
    resumen: z.string().default(''),
  }),
});

export const collections = { temas };
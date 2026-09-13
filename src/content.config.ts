import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// English-only variant of the original bilingual schema. The zh-TW / en
// split and the dev-focused relatedJava / relatedSsjs cross-reference
// fields are gone. In their place: two fields that matter to an admin
// reader and that a future coverage tracker (mirroring the original's
// LotusScript class coverage tracker) could report on: which console
// commands and which notes.ini settings a post actually touches.
const posts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/posts',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    slug: z.string(),
    tags: z.array(z.string()).default([]),
    sources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string().url(),
        })
      )
      .default([]),
    cover: z.string().optional(),
    coverStyle: z.string().optional(),

    // Server console commands referenced or demonstrated in the post
    // (e.g. "tell router quit", "load updall -r"). Empty array when the
    // post doesn't touch the console. Feeds a future coverage report the
    // same way relatedJava / relatedSsjs fed the class-coverage tracker
    // on the developer-focused site.
    relatedConsoleCommands: z.array(z.string()).default([]),

    // notes.ini parameters referenced (e.g. "NSF_BUFFER_POOL_SIZE_MB").
    // Same purpose: explicit [] means "checked, none apply", not "forgot".
    notesIniSettings: z.array(z.string()).default([]),

    // Lowest Domino version the post's guidance applies to, when that
    // matters (clustering behavior, DAOS options, etc. have shifted
    // across versions). Optional because most admin topics are stable
    // across the versions still in production.
    minDominoVersion: z.string().optional(),

    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };

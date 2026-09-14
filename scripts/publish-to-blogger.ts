/**
 * CLI entrypoint: publish one already-generated post to Blogger as a draft.
 *
 * Meant to run as its OWN GitHub Actions step, AFTER generate-article.ts's
 * step, not folded into main() there. Reason: generate-article.ts already
 * commits the Markdown file to the repo, that commit is the durable record
 * of the day's post. If the Blogger publish call fails (expired token,
 * Blogger API hiccup, network blip), the article still exists in the repo
 * and this step can just be re-run on its own, nothing about content
 * generation has to happen twice.
 *
 * Deliberately takes the slug as an explicit input (POST_SLUG) rather than
 * scanning src/content/posts/ for "the newest file", so this script always
 * publishes what THIS workflow run generated, never a leftover from a
 * previous failed run that never got cleaned up.
 *
 * Required env: POST_SLUG (e.g. "domino-native-backup-restore", the value
 *               generate-article.ts already writes to $GITHUB_OUTPUT as
 *               `slug`)
 *               BLOGGER_CLIENT_ID, BLOGGER_CLIENT_SECRET,
 *               BLOGGER_REFRESH_TOKEN, BLOGGER_BLOG_ID
 * Optional env: BLOGGER_DRAFT   set to "false" to publish live instead of
 *               as a draft. Defaults to "true" (draft), matching what you
 *               asked for: nothing goes live without you reviewing it in
 *               the Blogger dashboard first.
 */
import { readdir, readFile, appendFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishToBlogger } from './lib/publish-blogger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = join(__dirname, '..', 'src', 'content', 'posts');

function parseFrontmatter(raw: string): { title: string; tags: string[]; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Post file has no --- frontmatter block.');
  const [, fm, body] = match;

  const title = fm.match(/^title:\s*"?([^"\n]+?)"?\s*$/m)?.[1];
  if (!title) throw new Error('Post frontmatter is missing "title".');

  const tagsBlock = fm.match(/^tags:\s*\n((?:\s+-.*\n?)+)/m)?.[1] ?? '';
  const tags = [...tagsBlock.matchAll(/^\s*-\s*"?([^"\n]+?)"?\s*$/gm)].map((m) => m[1].trim());

  return { title, tags, body: body.trim() };
}

async function findPostFile(slug: string): Promise<string> {
  const files = await readdir(POSTS_DIR);
  const match = files.find((f) => f.endsWith(`-${slug}.md`) || f === `${slug}.md`);
  if (!match) {
    throw new Error(`No post file found for slug "${slug}" in ${POSTS_DIR}. Files present: ${files.join(', ')}`);
  }
  return join(POSTS_DIR, match);
}

async function setOutput(key: string, value: string): Promise<void> {
  const path = process.env.GITHUB_OUTPUT;
  if (!path) return;
  await appendFile(path, `${key}<<__CCDEOF__\n${value}\n__CCDEOF__\n`, 'utf8');
}

async function main(): Promise<void> {
  const slug = process.env.POST_SLUG;
  if (!slug) throw new Error('POST_SLUG env var is required (the slug this run generated).');
  const isDraft = process.env.BLOGGER_DRAFT !== 'false';

  const filepath = await findPostFile(slug);
  const raw = await readFile(filepath, 'utf8');
  const { title, tags, body } = parseFrontmatter(raw);

  console.log(`[blogger] Publishing "${title}" (${slug}) to blog.vanessabrooks.com as ${isDraft ? 'DRAFT' : 'LIVE'}...`);
  const result = await publishToBlogger({ title, markdown: body, tags }, { isDraft });
  console.log(`[blogger] Done. ${isDraft ? 'Draft' : 'Post'} URL: ${result.url}`);

  await setOutput('blogger_published', 'true');
  await setOutput('blogger_url', result.url);
  await setOutput('blogger_is_draft', String(isDraft));
}

main().catch((err) => {
  console.error('[blogger] Publish failed:', err);
  process.exit(1);
});

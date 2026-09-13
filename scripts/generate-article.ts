/**
 * Daily HCL Domino ADMINISTRATION article generator.
 *
 * Adapted from the original bilingual, developer-focused generator. Two
 * changes drive everything else in this file:
 *   1. English only. The zh-TW / en split, the language-discipline prompt
 *      sections, and the per-language file writing are gone.
 *   2. Administrator audience, not developer. The content tiers, the tag
 *      taxonomy, the doc roots mined for TIER C deep-dives, and the
 *      persona in the prompt all changed to match someone who runs
 *      Domino servers, not someone who writes code against them.
 *
 * Strict source-grounded flow (unchanged from the original):
 *   1. Load recent post titles to avoid duplicates.
 *   2. Ask OpenAI (with web_search) to find ONE noteworthy story published in
 *      the last 72 hours, citing real sources only.
 *   3. Validate: >=2 real source URLs, body contains >=3 inline links, no
 *      banned placeholder hosts (example.com, etc.), no single URL
 *      dominating the citations.
 *   4. Write Markdown into src/content/posts/YYYY-MM-DD-slug.md.
 *
 * Required env: OPENAI_API_KEY
 * Optional env: OPENAI_MODEL (default gpt-4o)
 */

import { mkdir, readdir, readFile, writeFile, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';
import { verifyAll, extractMarkdownLinks } from './lib/verify-urls.js';
import { reviewArticle, type ReviewIssue, type ReviewResult, type RecentPost } from './lib/review-article.js';
import { generateCoverImage } from './lib/cover-prompt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
// No language subdirectory: this is an English-only site, so posts live
// directly under src/content/posts/YYYY-MM-DD-slug.md.
const POSTS_DIR = join(ROOT, 'src', 'content', 'posts');

const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o';
const SKIP_IMAGE = process.env.SKIP_IMAGE === '1';
const TITLE_LOOKBACK_DAYS = 14;
const COVERS_DIR = join(ROOT, 'public', 'covers');
const DRAFTS_DIR = join(ROOT, '_drafts');

// Tag taxonomy is split across 4 axes, mirrored in src/lib/tags.ts. Pick
// 2-4 tags per article, ideally one from each axis that applies. Avoid
// umbrella tags like "Domino" or "HCL": every post is by definition
// Domino-related, so those add no signal.
const TAGS_PRODUCT = [
  'Domino Server',
  'Notes Client',
  'Domino Directory',
  'ID Vault',
  'Domino REST API',
  'HCL Nomad',
  'Domino IQ',
  'Sametime',
  'HCL Traveler',
] as const;

const TAGS_SUBSYSTEM = [
  'Router',
  'Replicator',
  'HTTP Task',
  'Agent Manager',
  'DAOS',
  'Transaction Logging',
  'Clustering',
  'Directory Assistance',
  'Console Commands',
  'Notes.ini',
  'OIDC',
] as const;

const TAGS_TOPIC = [
  'Security',
  'Performance',
  'Migration',
  'Backup and Recovery',
  'High Availability',
  'Compliance',
  'Licensing',
  'Monitoring',
] as const;

const TAGS_TYPE = ['Release Notes', 'Tutorial', 'News', 'Community', 'Incident Report'] as const;

const ALLOWED_TAGS = [
  ...TAGS_PRODUCT,
  ...TAGS_SUBSYSTEM,
  ...TAGS_TOPIC,
  ...TAGS_TYPE,
] as const;

const BANNED_HOSTS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'foo.com',
  'bar.com',
  'test.com',
  'placeholder.com',
  'yoursite.com',
]);

// Unchanged from the original list. These hosts were already admin-relevant
// (nashcom.de is Daniel Nashed's well-known Domino admin blog; panagenda
// and prominic are admin tooling vendors), so nothing here needed to
// change for the new audience.
const TRUSTED_HOST_HINTS = [
  'hcl-software.com',
  'support.hcl-software.com',
  'hcltechsw.com',
  'hcltech.com',
  'hcl.com',
  'planetlotus.org',
  'collaborationtoday.info',
  'nashcom.de',
  'openntf.org',
  'github.com',
  'github.io',
  'medium.com',
  'wordpress.com',
  'youtube.com',
  'csi-international.com',
  'panagenda.com',
  'prominic.net',
  'belsoft.com',
];

interface Article {
  slug: string;
  tags: string[];
  sources: { title: string; url: string }[];
  relatedConsoleCommands: string[];
  notesIniSettings: string[];
  minDominoVersion?: string;
  title: string;
  description: string;
  markdown: string;
  cover?: string;
  coverStyle?: string;
}

function todayIso(): string {
  // Stamp posts by Taipei calendar day so a 07:00 Taipei publish doesn't
  // get a UTC-yesterday date. Swap the timeZone here if you move the cron
  // to run relative to a different timezone (US-hours publish, say).
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' });
}

function nowTaipeiTimestamp(): string {
  // Full timestamp, e.g. "2026-04-28T18:30:42+08:00". Used as the pubDate
  // so posts are sortable down to the second.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)!.value;
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}+08:00`;
}

function frontmatter(data: Record<string, unknown>): string {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${key}: []`);
        continue;
      }
      if (typeof value[0] === 'object') {
        lines.push(`${key}:`);
        for (const item of value) {
          const entries = Object.entries(item as Record<string, unknown>);
          const [firstKey, firstVal] = entries[0];
          lines.push(`  - ${firstKey}: ${JSON.stringify(firstVal)}`);
          for (const [k, v] of entries.slice(1)) {
            lines.push(`    ${k}: ${JSON.stringify(v)}`);
          }
        }
      } else {
        lines.push(`${key}:`);
        for (const item of value) lines.push(`  - ${JSON.stringify(item)}`);
      }
    } else if (value instanceof Date) {
      lines.push(`${key}: ${value.toISOString()}`);
    } else if (typeof value === 'string') {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push('---', '');
  return lines.join('\n');
}

async function loadRecentPostsMeta(): Promise<RecentPost[]> {
  if (!existsSync(POSTS_DIR)) return [];
  const files = await readdir(POSTS_DIR);
  const cutoff = Date.now() - TITLE_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;
  const posts: RecentPost[] = [];
  for (const f of files) {
    if (!f.endsWith('.md') && !f.endsWith('.mdx')) continue;
    const datePart = f.slice(0, 10);
    const ts = Date.parse(datePart);
    if (Number.isNaN(ts) || ts < cutoff) continue;
    const raw = await readFile(join(POSTS_DIR, f), 'utf8');
    const slug = raw.match(/^slug:\s*"?([^"\n]+?)"?\s*$/m)?.[1]?.trim();
    const title = raw.match(/^title:\s*"?([^"\n]+?)"?\s*$/m)?.[1]?.trim();
    const description = raw.match(/^description:\s*"?([^"\n]+?)"?\s*$/m)?.[1]?.trim();
    if (slug && title) posts.push({ slug, title, description: description ?? '' });
  }
  return posts;
}

/**
 * Read the `coverStyle:` frontmatter field from the N most recent posts
 * (by filename date prefix). Used to seed sampling-without-replacement
 * when generating a new cover so consecutive posts don't repeat styles.
 */
async function loadRecentCoverStyles(n: number): Promise<string[]> {
  if (!existsSync(POSTS_DIR)) return [];
  const files = (await readdir(POSTS_DIR))
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .sort()
    .reverse()
    .slice(0, n);
  const styles: string[] = [];
  for (const f of files) {
    const raw = await readFile(join(POSTS_DIR, f), 'utf8');
    const cs = raw.match(/^coverStyle:\s*"?([^"\n]+?)"?\s*$/m)?.[1]?.trim();
    if (cs) styles.push(cs);
  }
  return styles;
}

interface SaturatedSource {
  url: string;
  citedBySlug: string;
  citedDate: string;
}

/**
 * URLs cited as `sources:` in posts published within the last
 * TITLE_LOOKBACK_DAYS days, plus URLs from rejected drafts in _drafts/.
 * Re-citing one means the model is circling back to an already-covered
 * topic, so these get blocked at validate().
 */
async function loadSaturatedSources(): Promise<Map<string, SaturatedSource>> {
  const sat = new Map<string, SaturatedSource>();
  const cutoff = Date.now() - TITLE_LOOKBACK_DAYS * 24 * 60 * 60 * 1000;

  const collect = async (dir: string): Promise<void> => {
    if (!existsSync(dir)) return;
    const files = await readdir(dir);
    for (const f of files) {
      if (!f.endsWith('.md') && !f.endsWith('.mdx')) continue;
      const datePart = f.slice(0, 10);
      const ts = Date.parse(datePart);
      if (Number.isNaN(ts) || ts < cutoff) continue;
      const raw = await readFile(join(dir, f), 'utf8');
      const slug = raw.match(/^slug:\s*"?([^"\n]+?)"?\s*$/m)?.[1]?.trim() ?? f;
      const sourcesBlock = raw.match(/^sources:\s*\n((?:\s+.*\n)+)/m)?.[1];
      if (!sourcesBlock) continue;
      const urlMatches = sourcesBlock.matchAll(/^\s+url:\s*"?([^"\n]+?)"?\s*$/gm);
      for (const m of urlMatches) {
        const url = m[1].trim();
        if (!sat.has(url)) sat.set(url, { url, citedBySlug: slug, citedDate: datePart });
      }
    }
  };

  await collect(POSTS_DIR);
  await collect(DRAFTS_DIR);
  return sat;
}

/**
 * Every slug ever used, plus every slug from rejected drafts in _drafts/.
 * Slugs are URL identities and must be unique forever, so this has no time
 * window. Used both as a soft hint in the prompt and as a hard reject in
 * validate().
 */
async function loadAllSlugs(): Promise<Set<string>> {
  const slugs = new Set<string>();
  const collect = async (dir: string): Promise<void> => {
    if (!existsSync(dir)) return;
    const files = await readdir(dir);
    for (const f of files) {
      if (!f.endsWith('.md') && !f.endsWith('.mdx')) continue;
      const raw = await readFile(join(dir, f), 'utf8');
      const m = raw.match(/^slug:\s*"?([^"\n]+?)"?\s*$/m);
      if (m) slugs.add(m[1].trim());
    }
  };
  await collect(POSTS_DIR);
  await collect(DRAFTS_DIR);
  return slugs;
}

function buildPrompt(
  recentPosts: RecentPost[],
  forbiddenSlugs: string[],
  saturatedSources: SaturatedSource[],
  forceTierC: boolean
): string {
  const tierConstraint = forceTierC
    ? `MODE: TIER-C-ONLY FALLBACK
The previous attempt failed (either the topic overlapped with a recent post,
or the article had factual errors). Skip TIER A and TIER B entirely. Pick
ONE under-covered admin task or server subsystem from the doc roots listed
in TIER C below and write a focused, hands-on explainer. Do not retry the
same news topic, go to the docs instead.

`
    : '';
  const recentBlock = recentPosts.length === 0
    ? '(none yet)'
    : recentPosts.map((p) => `- [${p.slug}] ${p.title}\n    covered: ${p.description}`).join('\n');
  const saturatedBlock = saturatedSources.length === 0
    ? '(none yet)'
    : saturatedSources.map((s) => `- ${s.url} (cited by [${s.citedBySlug}] on ${s.citedDate})`).join('\n');
  return `${tierConstraint}You are a senior HCL Domino administrator writing the daily post for a site
read by other Domino administrators: the people who run the servers, not
the people who write code against them. Your standards are:
NEVER fabricate. EVERY factual claim must come from a real source you opened
via the web_search tool in THIS session. Sources must be real URLs that load.

Write like someone who has actually had the incident you're describing, not
like a rewritten press release. Assume the reader is responsible for uptime,
security, and compliance on a production Domino environment and wants
something they can act on, not a feature summary they could get from the
release notes alone.

============================================================
HARD CONSTRAINTS, read these BEFORE picking a topic
============================================================

The script will hard-reject the article if any of these are violated.
Read them first so you don't waste a generation on a doomed topic.

(1) FORBIDDEN SLUGS, your "slug" output MUST NOT equal any of these.
    Every slug ever published, no time window:
${forbiddenSlugs.length === 0 ? '    (none yet)' : forbiddenSlugs.map((s) => `    - ${s}`).join('\n')}

(2) RECENT TOPICS, these stories were already published in the last
    ${TITLE_LOOKBACK_DAYS} days. They are CLOSED. Do NOT write another article on the
    same subject, even with a different angle or different slug.
    The Claude reviewer compares the description below against your draft
    and flags overlap; the workflow then retries or fails.

${recentBlock}

(3) SATURATED SOURCE URLS, these URLs were cited as the primary source
    of a published post in the last ${TITLE_LOOKBACK_DAYS} days. Do NOT include any
    of them in your "sources" array. If the topic you want to write
    requires citing one of these, that's your signal that the topic is
    a duplicate, pick a different topic.

${saturatedBlock}

    PIVOT, DON'T WORK AROUND: if your candidate topic naturally cites
    any URL above, the script has been rejecting these articles every
    day this week. Don't try to substitute the saturated URL with a
    weaker one and keep the same topic, the reviewer also flags topic
    overlap. Pick a completely different subsystem, task, or story.
    The TIER C doc roots below have hundreds of unwritten options.

(4) NOTORIOUSLY OVER-COVERED TOPIC: HCL Domino 2026 / 14.5.1 release.
    Search results will keep surfacing this for months. If a forbidden
    slug or recent topic already covers it, DO NOT write another angle
    on the release notes. Move straight to TIER B / TIER C below.

============================================================
TASK
============================================================

Find material for ONE article about running, securing, or maintaining HCL
Domino (server administration, not application development). In scope:
Domino Server, Domino Directory, ID Vault, Domino REST API deployment and
security, HCL Nomad rollout and management, Domino IQ operations, Sametime
administration, HCL Traveler, and OpenNTF admin tooling.

YOU MUST INVOKE web_search AT LEAST 3 TIMES with different queries before
deciding there is nothing to write about. Suggested queries to rotate
through (skip any that obviously map to a forbidden slug above):
  - HCL Domino security advisory
  - HCL Domino server administration
  - HCL Domino release 2025 OR 2026 admin impact
  - HCL Domino REST API deployment
  - HCL Nomad admin rollout
  - HCL Domino backup OR disaster recovery
  - HCL Domino clustering OR high availability
  - site:hcl-software.com Domino admin
  - site:nashcom.de
  - HCL Ambassador blog Domino administration
  - planetlotus.org
  - collaborationtoday.info

CONTENT TIERS (TIER C is the safe default; TIER A only when you find
genuinely new news that does NOT overlap a recent topic above):
  TIER A, News from the last 14 days that an admin needs to act on:
           security advisory, patch or hotfix, end-of-life or end-of-
           support notice, a release with upgrade or compatibility
           impact, or an official change to admin guidance.
           BEFORE choosing TIER A: confirm the story is NOT in "Recent
           topics" above and the URLs you'd cite are NOT in "Saturated
           source URLs" above. If either check fails, do not use TIER A.
  TIER B, A community admin post from the last 60 days: an incident
           writeup, a monitoring or tuning approach, a migration story,
           an OpenNTF admin tool.
  TIER C, Deep-dive explainer on an under-covered admin task or server
           subsystem. Use this any day when TIER A genuinely has no
           fresh story.

           Doc roots to mine (search inside these for under-covered topics;
           bump the version number in the path once a newer release ships):
             - help.hcl-software.com/domino/14.5.1/admin/     (server admin tasks: install, upgrade, directory, security, replication)
             - help.hcl-software.com/domino/14.5.1/inst_upgrade/ (installation and upgrade planning)
             - opensource.hcltechsw.com/Domino-rest-api/       (Domino REST API endpoints and deployment)
             - help.hcl-software.com/dom_designer/14.5.1/basic/ (only for the notes.ini / server document settings referenced from admin tasks, not for LotusScript syntax itself)

           The task or subsystem name in kebab-case is the slug.
           Examples that look NOT covered yet (verify against forbidden slugs!):
             transaction-logging-styles, daos-enable-tuning, id-vault-recovery,
             directory-assistance-ldap, ddm-probes-setup, cluster-failover-tuning,
             server-controller-restart-policy, compact-options-explained,
             fixup-corruption-recovery, updall-scheduling, smtp-router-tuning,
             tls-cipher-configuration, admin-process-requests, notes-ini-buffer-pool,
             ha-replica-strategy, offline-domino-server-decommission, etc.

           Cite 2+ official doc URLs and (if possible) one community article
           written by a working admin (nashcom.de and similar are good fits).

ACCEPTABLE SOURCE TYPES (rough priority):
  1. Official HCL pages: hcl-software.com, hcltechsw.com, hcl.com, support.hcl-software.com
  2. HCL official documentation / help center pages, admin guides
  3. HCL Ambassador or HCL Master blogs written by practicing admins
  4. OpenNTF project pages and openntf.org articles (admin-facing tools)
  5. Community blog aggregators, planetlotus.org and collaborationtoday.info (cite the original blog when possible)
  6. GitHub release notes / READMEs from hcl-org or recognized community repos
  7. Reputable HCL business partners (panagenda, prominic, csi-international, belsoft, etc.)
  8. Conference recordings or slide decks (Engage, CollabSphere, OpenNTF webinars)

UNACCEPTABLE:
  - Made-up version numbers, dates, quotes, console command syntax, or URLs
  - Speculation with no source ("might", "could be")
  - AI-generated content farms
  - Sources you did not actually open during web_search

Only return {"error":"insufficient_sources"} as a LAST resort. If TIER A and B
yield only forbidden topics, fall back to TIER C, the doc roots above contain
plenty of under-covered admin tasks. There is essentially always a TIER C
topic available; refusing to write one is almost never the right call.

REQUIRED OUTPUT, STRICT JSON, no markdown fences, no commentary:

type Output =
  | { error: "insufficient_sources"; reason: string; queriesTried: string[] }
  | {
      slug: string;                 // kebab-case ascii, max 60 chars, descriptive
      tags: string[];                // 2-4 tags, see TAG SELECTION below
      sources: { title: string; url: string }[]; // MINIMUM 2, MAXIMUM 6 real URLs you actually consulted
      relatedConsoleCommands: string[]; // server console commands this post references, exact syntax, [] if none
      notesIniSettings: string[];       // notes.ini parameters this post references, [] if none
      minDominoVersion: string;         // e.g. "12.0.2", omit the field entirely if the guidance applies to any supported version
      title: string;                    // under 80 chars
      description: string;              // 25-45 words, used as the homepage card summary
      markdown: string;                 // 700-1300 words Markdown, with subheadings, MUST embed >= 3 inline source links [text](url)
    };

TAG SELECTION, pick 2-4 tags drawn from these 4 axes. Prefer one from each
axis that genuinely applies; never tag with all of them just to fill the slot.
Tags are filters: a tag that fits every Domino post (e.g. "Domino", "HCL",
"Notes") is forbidden because it adds zero signal. Pick the most specific
tag that applies.

  Axis 1, Product / module (which thing is this post about):
    ${TAGS_PRODUCT.join(', ')}

  Axis 2, Subsystem / mechanism (what part of the server does the work):
    ${TAGS_SUBSYSTEM.join(', ')}

  Axis 3, Topic (what operational problem the post addresses):
    ${TAGS_TOPIC.join(', ')}

  Axis 4, Content type (what kind of article is this):
    ${TAGS_TYPE.join(', ')}

Examples:
  - A Domino 2026 release announcement with upgrade impact -> ["Release Notes", "Domino Server", "Migration"]
  - A hands-on walkthrough of enabling DAOS -> ["Tutorial", "DAOS", "Performance"]
  - A postmortem on an ID Vault recovery gone wrong -> ["Incident Report", "ID Vault", "Security"]
  - A note on tightening TLS cipher configuration -> ["Admin", "Security", "Domino Server"] (only use "Admin" style umbrella
    topics when a more specific Topic tag genuinely does not fit better)

CRITICAL RULES:
- Write in plain, direct, professional English. No filler transitions, no
  "in today's landscape," no vague-optimism conclusions. State the point,
  back it with the source, move on.
- Tags MUST be exact strings from the axes above.
- Every URL in "sources" MUST be a real URL you opened during web_search.
- The markdown body MUST contain at least 3 inline links of the form [text](https://...).
- INLINE-LINK DIVERSITY (this rule rejects more articles than any other,
  read it carefully):

    BEFORE writing the body, plan the citations:
    1. Your "sources" array MUST contain 2+ different URLs.
    2. The body has >= 3 inline links of the form [text](url).
    3. No single URL accounts for more than half of the inline links in
       the body. If you have 4 inline links, at most 2 may point to the
       same URL; the rest point elsewhere.

    CORRECT EXAMPLE:
      sources: [admin task doc, a related server document setting doc, a community writeup]
      body: 4 inline links, 2 point to the admin task doc, 1 to the setting doc, 1 to the community writeup
      -> top URL is 2/4 = 50%. Passes.

    WRONG EXAMPLE (the rejection pattern we keep seeing):
      sources: [main page, secondary page]
      body anchors: every single anchor links to the main page
      -> 4+ inline links, 1 unique URL. REJECTED.

  The "this is the canonical source" excuse for repeating a URL is
  ALWAYS wrong here, pick a sub-page (a specific admin task page, a
  related server document setting, a community writeup) for the other
  anchors. Look these URLs up during web_search, don't invent them.
- If unsure of any fact (date, version number, exact console command syntax,
  exact notes.ini parameter name), omit it entirely instead of guessing.
  A wrong console command in a post read by people who run production
  servers is worse than a shorter article.`;
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    if (BANNED_HOSTS.has(u.hostname.toLowerCase())) return false;
    return true;
  } catch {
    return false;
  }
}

function countInlineLinks(markdown: string): number {
  const matches = markdown.match(/\[[^\]]+\]\(https?:\/\/[^\s)]+\)/g);
  return matches ? matches.length : 0;
}

function inlineLinkUrls(markdown: string): string[] {
  const matches = [...markdown.matchAll(/\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/g)];
  return matches.map((m) => m[1]);
}

function validate(
  article: Article,
  forbiddenSlugs: Set<string>,
  saturatedSources: Map<string, SaturatedSource>
): void {
  const errors: string[] = [];

  if (forbiddenSlugs.has(article.slug)) {
    errors.push(
      `Slug collision: "${article.slug}" already exists. The model ignored ` +
        `the FORBIDDEN SLUGS list, refusing to overwrite an existing post.`
    );
  }

  for (const s of article.sources ?? []) {
    const sat = s.url ? saturatedSources.get(s.url) : undefined;
    if (sat) {
      errors.push(
        `Saturated source URL: "${s.url}" was already cited by [${sat.citedBySlug}] ` +
          `on ${sat.citedDate}. Re-citing it within ${TITLE_LOOKBACK_DAYS} days means writing ` +
          `about a covered topic. Pick a different topic or a different angle that ` +
          `doesn't lean on this URL.`
      );
    }
  }

  if (!article.sources || article.sources.length < 2) {
    errors.push(`Need >= 2 sources, got ${article.sources?.length ?? 0}.`);
  }

  for (const s of article.sources ?? []) {
    if (!s.url || !isValidUrl(s.url)) {
      errors.push(`Invalid or banned source URL: ${s.url}`);
    }
  }

  const trustedCount = (article.sources ?? []).filter((s) => {
    try {
      const host = new URL(s.url).hostname.toLowerCase();
      return TRUSTED_HOST_HINTS.some((h) => host.endsWith(h));
    } catch {
      return false;
    }
  }).length;
  if (trustedCount === 0) {
    errors.push(
      `At least one source should come from a trusted Domino-related host. Got: ${(article.sources ?? [])
        .map((s) => s.url)
        .join(', ')}`
    );
  }

  const links = countInlineLinks(article.markdown ?? '');
  if (links < 3) errors.push(`Body must have >= 3 inline links, got ${links}.`);

  // Catch the copy-paste-same-URL bug: if one URL dominates inline-link
  // destinations, the model just slapped the same href onto every anchor.
  // Threshold is looser than the original bilingual 40% figure because the
  // sample size here is one body's worth of links, not two languages
  // combined, so a stricter ratio would reject well-formed short articles.
  const allLinkUrls = inlineLinkUrls(article.markdown ?? '');
  if (allLinkUrls.length >= 3) {
    const counts = new Map<string, number>();
    for (const u of allLinkUrls) counts.set(u, (counts.get(u) ?? 0) + 1);
    const [topUrl, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topCount / allLinkUrls.length > 0.5) {
      errors.push(
        `Inline-link diversity check failed: "${topUrl}" appears ${topCount}/${allLinkUrls.length} ` +
          `times in inline links (>50%). Likely a copy-paste error, each anchor should point to its own destination.`
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(`Article validation failed:\n  - ${errors.join('\n  - ')}`);
  }
}

interface GenerateOptions {
  forbiddenSlugs: Set<string>;
  saturatedSources: Map<string, SaturatedSource>;
  recentPosts: RecentPost[];
  forceTierC: boolean;
}

async function generate(opts: GenerateOptions): Promise<Article> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY env var is required.');
  }
  const client = new OpenAI();

  const prompt = buildPrompt(
    opts.recentPosts,
    [...opts.forbiddenSlugs].sort(),
    [...opts.saturatedSources.values()].sort((a, b) => b.citedDate.localeCompare(a.citedDate)),
    opts.forceTierC
  );
  console.log(
    `[generate] Calling ${MODEL} with web_search... ` +
      `(${opts.forbiddenSlugs.size} forbidden slugs, ${opts.recentPosts.length} recent posts, ` +
      `${opts.saturatedSources.size} saturated source URLs${
        opts.forceTierC ? ', forceTierC=true' : ''
      })`
  );

  const response = await client.responses.create({
    model: MODEL,
    tools: [{ type: 'web_search_preview' }],
    input: prompt,
    max_output_tokens: 12000,
  });

  if (response.status === 'incomplete') {
    const reason = response.incomplete_details?.reason ?? 'unknown';
    throw new Error(
      `OpenAI response incomplete (reason="${reason}"). ` +
        (reason === 'max_output_tokens'
          ? 'Bump max_output_tokens or shorten the prompt.'
          : 'Check Responses API docs for this reason code.')
    );
  }

  const text = response.output_text?.trim() ?? '';
  if (!text) throw new Error('Empty response from OpenAI.');

  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error(
      `[generate] Failed to parse JSON. Response status="${response.status}" length=${text.length}. ` +
        `Raw output:\n${text}`
    );
    throw err;
  }

  if (parsed && typeof parsed === 'object' && 'error' in parsed) {
    const errObj = parsed as { reason?: string; queriesTried?: string[] };
    const reason = errObj.reason ?? 'unspecified';
    const tried = errObj.queriesTried?.length
      ? `\n  queries tried: ${errObj.queriesTried.join(' | ')}`
      : '\n  (model did not report which queries it tried, likely searched 0 times)';
    throw new Error(`Model declined to write an article: ${reason}${tried}`);
  }

  const article = parsed as Article;

  if (!article.slug || !article.markdown) {
    throw new Error('Generated article is missing required fields.');
  }

  article.tags = (article.tags ?? [])
    .filter((t): t is string => typeof t === 'string')
    .filter((t) => (ALLOWED_TAGS as readonly string[]).includes(t));
  if (article.tags.length === 0) article.tags = ['News'];

  article.relatedConsoleCommands = (article.relatedConsoleCommands ?? []).filter(
    (c): c is string => typeof c === 'string'
  );
  article.notesIniSettings = (article.notesIniSettings ?? []).filter((c): c is string => typeof c === 'string');

  article.slug = article.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  return article;
}

async function writePost(
  slug: string,
  data: Article,
  dateForFilename: string,
  pubDateIso: string
): Promise<string> {
  await mkdir(POSTS_DIR, { recursive: true });
  const filename = `${dateForFilename}-${slug}.md`;
  const filepath = join(POSTS_DIR, filename);
  const fm = frontmatter({
    title: data.title,
    description: data.description,
    pubDate: pubDateIso,
    slug,
    tags: data.tags,
    sources: data.sources,
    cover: data.cover,
    coverStyle: data.coverStyle,
    relatedConsoleCommands: data.relatedConsoleCommands,
    notesIniSettings: data.notesIniSettings,
    minDominoVersion: data.minDominoVersion,
  });
  await writeFile(filepath, `${fm}${data.markdown.trim()}\n`, 'utf8');
  return filepath;
}

async function generateCover(
  client: OpenAI,
  article: Article
): Promise<{ coverPath: string; styleId: string } | undefined> {
  if (SKIP_IMAGE) {
    console.log('[generate] SKIP_IMAGE=1, skipping cover image generation.');
    return undefined;
  }
  const primaryTag = article.tags[0] ?? 'HCL Domino';
  const recentStyles = await loadRecentCoverStyles(6);
  const result = await generateCoverImage(
    client,
    article.title,
    primaryTag,
    article.slug,
    COVERS_DIR,
    recentStyles
  );
  return result ?? undefined;
}

async function gateUrls(article: Article): Promise<void> {
  const sourceUrls = article.sources.map((s) => s.url);
  const inlineUrls = extractMarkdownLinks(article.markdown);
  const all = [...new Set([...sourceUrls, ...inlineUrls])];
  console.log(`[gate-urls] Verifying ${all.length} URL(s)...`);
  const results = await verifyAll(all);
  const broken = results.filter((r) => !r.ok);
  for (const r of results) {
    const tag = r.ok ? 'ok ' : 'BAD';
    console.log(`  [${tag}] ${r.status} ${r.url}${r.reason ? ' - ' + r.reason : ''}`);
  }
  const brokenSources = broken.filter((b) => sourceUrls.includes(b.url));
  if (brokenSources.length > 0) {
    throw new Error(
      `URL gate FAILED, ${brokenSources.length} source URL(s) are not reachable:\n` +
        brokenSources.map((b) => `  - ${b.status} ${b.url}`).join('\n')
    );
  }
  if (broken.length > 0) {
    console.warn(`[gate-urls] ${broken.length} inline link(s) broken (article still allowed).`);
  }
}

/** Run Claude review and log issues, but DO NOT throw. Caller decides. */
async function runReview(article: Article, recentPosts: RecentPost[]): Promise<ReviewResult | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('[gate-review] ANTHROPIC_API_KEY not set, skipping AI review.');
    return null;
  }
  const result = await reviewArticle(
    article.title,
    article.markdown,
    article.sources.map((s) => s.url),
    recentPosts
  );
  const critical = result.issues.filter((i) => i.severity === 'critical');
  const major = result.issues.filter((i) => i.severity === 'major');
  const minor = result.issues.filter((i) => i.severity === 'minor');
  console.log(
    `[gate-review] ${critical.length} critical / ${major.length} major / ${minor.length} minor` +
      (result.topicOverlap ? `; topicOverlap=true (with: ${result.overlapWith ?? '?'})` : '')
  );
  for (const i of result.issues) console.log(formatIssue(i));
  return result;
}

function formatIssue(i: ReviewIssue): string {
  return `  [${i.severity}] ${i.location}\n      problem: ${i.problem}\n      fix:     ${i.suggestion}`;
}

function reviewBlocks(review: ReviewResult | null): { reasons: string[]; criticals: ReviewIssue[] } {
  if (!review) return { reasons: [], criticals: [] };
  const criticals = review.issues.filter((i) => i.severity === 'critical');
  const reasons: string[] = [];
  if (review.topicOverlap) {
    reasons.push(`topic overlap with **${review.overlapWith ?? 'a recent post'}**`);
  }
  if (criticals.length > 0) {
    reasons.push(`${criticals.length} critical fact issue(s)`);
  }
  return { reasons, criticals };
}

/** Save a rejected article to _drafts/ so the workflow can upload it as an
 * artifact for human salvage. */
async function saveDraft(article: Article, attempt: number, review: ReviewResult | null, reason: string): Promise<void> {
  await mkdir(DRAFTS_DIR, { recursive: true });
  const date = todayIso();
  const pubDateIso = nowTaipeiTimestamp();
  const stem = `${date}-attempt${attempt}-${article.slug}`;
  const note =
    `<!--\nREJECTED DRAFT - ${reason}\nattempt: ${attempt}\nslug: ${article.slug}\n` +
    (review
      ? `topicOverlap: ${review.topicOverlap}${
          review.overlapWith ? ` (overlapWith=${review.overlapWith})` : ''
        }\nissues:\n${review.issues.map(formatIssue).join('\n')}\n`
      : '') +
    `-->\n\n`;
  const fm = frontmatter({
    title: article.title,
    description: article.description,
    pubDate: pubDateIso,
    slug: article.slug,
    tags: article.tags,
    sources: article.sources,
    relatedConsoleCommands: article.relatedConsoleCommands,
    notesIniSettings: article.notesIniSettings,
    draft: true,
  });
  await writeFile(join(DRAFTS_DIR, `${stem}.md`), `${fm}${note}${article.markdown.trim()}\n`, 'utf8');
  console.log(`[draft] Saved rejected article to _drafts/${stem}.md`);
}

/** Append markdown to GITHUB_STEP_SUMMARY if the env var is set. */
async function appendStepSummary(md: string): Promise<void> {
  const path = process.env.GITHUB_STEP_SUMMARY;
  if (!path) return;
  await appendFile(path, md + '\n', 'utf8');
}

/** Write a key=value pair to GITHUB_OUTPUT so the workflow can read it. */
async function setOutput(key: string, value: string): Promise<void> {
  const path = process.env.GITHUB_OUTPUT;
  if (!path) return;
  await appendFile(path, `${key}<<__CCDEOF__\n${value}\n__CCDEOF__\n`, 'utf8');
}

interface AttemptResult {
  ok: boolean;
  article?: Article;
  review?: ReviewResult | null;
  failure?: { stage: string; reason: string };
}

async function attempt(
  forbiddenSlugs: Set<string>,
  saturatedSources: Map<string, SaturatedSource>,
  forceTierC: boolean,
  recentPosts: RecentPost[]
): Promise<AttemptResult> {
  let article: Article;
  try {
    article = await generate({ forbiddenSlugs, saturatedSources, recentPosts, forceTierC });
  } catch (err) {
    return { ok: false, failure: { stage: 'generate', reason: String(err instanceof Error ? err.message : err) } };
  }

  try {
    validate(article, forbiddenSlugs, saturatedSources);
  } catch (err) {
    const msg = String(err instanceof Error ? err.message : err);
    const stage = msg.includes('Slug collision') ? 'generate' : 'validate';
    return { ok: false, article, failure: { stage, reason: msg } };
  }

  try {
    await gateUrls(article);
  } catch (err) {
    return {
      ok: false,
      article,
      failure: { stage: 'urls', reason: String(err instanceof Error ? err.message : err) },
    };
  }

  let review: ReviewResult | null;
  try {
    review = await runReview(article, recentPosts);
  } catch (err) {
    return {
      ok: false,
      article,
      failure: { stage: 'review', reason: String(err instanceof Error ? err.message : err) },
    };
  }

  const { reasons } = reviewBlocks(review);
  if (reasons.length > 0) {
    return {
      ok: false,
      article,
      review,
      failure: { stage: 'review', reason: reasons.join(' + ') },
    };
  }
  return { ok: true, article, review };
}

async function publish(article: Article, fallbackReason: string | null): Promise<void> {
  const client = new OpenAI();
  const cover = await generateCover(client, article);
  if (cover) {
    article.cover = cover.coverPath;
    article.coverStyle = cover.styleId;
  }

  const dateForFilename = todayIso();
  const pubDateIso = nowTaipeiTimestamp();
  const path = await writePost(article.slug, article, dateForFilename, pubDateIso);
  console.log(`[publish] Wrote: ${path}`);
  if (article.cover) console.log(`[publish] Cover: ${article.cover} (style=${article.coverStyle})`);
  console.log(`[publish] Sources used:`);
  for (const s of article.sources) console.log(`  - ${s.title}: ${s.url}`);

  await setOutput('published', 'true');
  await setOutput('slug', article.slug);
  if (fallbackReason) {
    await setOutput('fallback', 'true');
    await setOutput('fallback_reason', fallbackReason);
  } else {
    await setOutput('fallback', 'false');
  }
}

async function main() {
  const recentPosts = await loadRecentPostsMeta();
  const forbiddenSlugs = await loadAllSlugs();
  const saturatedSources = await loadSaturatedSources();
  const summary: string[] = ['# Daily article run\n'];

  console.log('[main] Attempt 1: normal mode (TIER A/B/C all allowed)');
  const r1 = await attempt(forbiddenSlugs, saturatedSources, false, recentPosts);
  if (r1.ok && r1.article) {
    summary.push(
      `**Result:** Published \`${r1.article.slug}\` on first try.`,
      '',
      `- Title: ${r1.article.title}`
    );
    await publish(r1.article, null);
    await appendStepSummary(summary.join('\n'));
    return;
  }

  const reason1 = r1.failure?.reason ?? 'unknown';
  console.warn(`[main] Attempt 1 failed at "${r1.failure?.stage}": ${reason1}`);
  summary.push(
    `## Attempt 1, failed at \`${r1.failure?.stage}\``,
    '',
    '```',
    reason1.length > 1500 ? reason1.slice(0, 1500) + '\n... [truncated]' : reason1,
    '```',
    ''
  );
  if (r1.article) {
    forbiddenSlugs.add(r1.article.slug);
    if (r1.failure?.stage !== 'generate') {
      await saveDraft(r1.article, 1, r1.review ?? null, reason1);
      summary.push(`Rejected draft saved to \`_drafts/\` and uploaded as workflow artifact.`, '');
    }
  }

  console.log('[main] Attempt 2: TIER C-only fallback');
  summary.push('## Attempt 2, TIER C-only fallback', '');
  const r2 = await attempt(forbiddenSlugs, saturatedSources, true, recentPosts);
  if (r2.ok && r2.article) {
    summary.push(
      `**Result:** Published \`${r2.article.slug}\` via TIER C fallback.`,
      '',
      `- Title: ${r2.article.title}`
    );
    const fallbackReason = `attempt 1 rejected (${r1.failure?.stage}: ${reason1.split('\n')[0].slice(0, 200)})`;
    await publish(r2.article, fallbackReason);
    await appendStepSummary(summary.join('\n'));
    return;
  }

  const reason2 = r2.failure?.reason ?? 'unknown';
  console.error(`[main] Attempt 2 also failed at "${r2.failure?.stage}": ${reason2}`);
  summary.push(
    `**Result:** Both attempts failed.`,
    '',
    `- Attempt 1: \`${r1.failure?.stage}\`, ${reason1.split('\n')[0].slice(0, 200)}`,
    `- Attempt 2: \`${r2.failure?.stage}\`, ${reason2.split('\n')[0].slice(0, 200)}`,
    ''
  );
  if (r2.article) {
    await saveDraft(r2.article, 2, r2.review ?? null, reason2);
    summary.push(`Rejected draft saved to \`_drafts/\`. Both attempts available as workflow artifact.`, '');
  }
  await appendStepSummary(summary.join('\n'));
  await setOutput('published', 'false');
  throw new Error(
    `Both attempts failed.\n  attempt 1 (${r1.failure?.stage}): ${reason1}\n  attempt 2 (${r2.failure?.stage}): ${reason2}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

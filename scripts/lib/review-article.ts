/**
 * Cross-vendor article review.
 *
 * Sends the article's markdown to Claude (Anthropic) and asks it to
 * identify factual errors AND whether the topic substantially overlaps
 * with any recent post.
 *
 * Returns issues with severity plus a topicOverlap flag. The caller decides
 * what to do (typically: overlap -> retry generation; critical fact errors
 * -> fail or fall back; otherwise -> publish).
 *
 * Only the persona and the fact-check examples changed from the original
 * (developer-focused) version: this reviews admin guidance, so a "critical"
 * error here is more likely to be a wrong console command or a notes.ini
 * parameter that doesn't exist, not a wrong API name.
 *
 * Required env (only when called): ANTHROPIC_API_KEY
 * Optional env: ANTHROPIC_MODEL (default claude-sonnet-4-6)
 */

import Anthropic from '@anthropic-ai/sdk';

export type Severity = 'critical' | 'major' | 'minor';

export interface ReviewIssue {
  severity: Severity;
  location: string;
  problem: string;
  suggestion: string;
}

export interface RecentPost {
  slug: string;
  title: string;
  description: string;
}

export interface ReviewResult {
  issues: ReviewIssue[];
  topicOverlap: boolean;
  overlapWith?: string;
  rawText: string;
}

const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6';

function buildPrompt(
  title: string,
  markdown: string,
  sources: string[],
  recentPosts: RecentPost[]
): string {
  const recentBlock = recentPosts.length === 0
    ? '(no recent posts to compare against)'
    : recentPosts.map((p) => `  [${p.slug}] ${p.title}, ${p.description}`).join('\n');

  return `You are a senior HCL Domino administrator reviewing a post before it
ships on a site read by other Domino administrators. Review the article
below for technical accuracy AND check that it isn't a rehash of something
just published. Be strict, this article is going to be published, and a
reader may act on it against a production server.

PART 1, Technical accuracy. Look for:
1. **Factual errors**, wrong console command syntax, invented notes.ini
   parameter names, retired product brands (e.g. "Lotus" was retired by
   HCL years ago, current products are "HCL Domino", "HCL Notes", "HCL
   Domino Enterprise Integrator (DEI)" not the old "Lotus Enterprise
   Integrator (LEI/HEI)"), incorrect claims about how a subsystem behaves
   (replication conflict resolution, clustering failover order, DAOS
   garbage collection timing, transaction logging recovery), or
   mis-attributed quotes.
2. **Missing important alternatives or caveats**, when the article says
   "the way to do X" or presents one option as the only one, check whether
   there's a well-known alternative or a version constraint it omits (a
   setting introduced in a specific release, a feature that behaves
   differently in a cluster vs. a standalone server).
3. **Misleading or oversimplified statements**, claims that are technically
   true only in narrow conditions (a specific OS, a specific Domino
   version, a specific deployment topology), presented as universal.
4. **A command or setting that would be actively harmful if followed
   literally**, e.g. a console command with the wrong flag, a notes.ini
   value outside its valid range, a step that skips a required backup.
   Treat these as critical even if everything else about the article is
   fine.
5. **Broken-looking citations**, URLs whose path structure looks fabricated
   (liveness is checked separately, but flag suspicious ones here).

Severity:
- "critical" = clearly wrong fact, fabricated command or setting, or
  guidance that could cause an outage or data loss if followed. Article
  must NOT publish.
- "major"    = important missing context, a version caveat, or misleading
  framing that a reader would be misled by. Should be fixed but not
  blocking.
- "minor"    = clarity or phrasing.

PART 2, Topic uniqueness. Recent posts on this site (last 14 days):
${recentBlock}

Set "topicOverlap" to true only if the new article is SUBSTANTIALLY the same
TOPIC as one of the recent posts, meaning a regular reader would feel
"didn't I just read this?" Different angles on related subjects (e.g.
enabling DAOS vs. tuning DAOS garbage collection) are NOT overlap, they're
complementary deep-dives. A rewrite of the same release notes WITH the same
key facts IS overlap, even with a different slug.

If overlap, set "overlapWith" to the slug of the most-similar recent post.

Return STRICT JSON only, no markdown fences, no commentary. Schema:

{
  "issues": [
    {
      "severity": "critical" | "major" | "minor",
      "location": "short quote or section header pointing to the problem",
      "problem": "specific, concrete description of what's wrong",
      "suggestion": "how to fix it"
    }
  ],
  "topicOverlap": true | false,
  "overlapWith": "slug-of-similar-post"   // omit or null if topicOverlap is false
}

If you find no issues and no overlap, return {"issues": [], "topicOverlap": false}.

---

Article title: ${title}

Cited sources (URLs):
${sources.map((s) => `  - ${s}`).join('\n')}

Article body (markdown):
---
${markdown}
---`;
}

export async function reviewArticle(
  title: string,
  markdown: string,
  sources: string[],
  recentPosts: RecentPost[] = []
): Promise<ReviewResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY env var is required for AI review.');
  }
  const client = new Anthropic();
  const prompt = buildPrompt(title, markdown, sources, recentPosts);

  console.log(`[review] Calling ${MODEL} for fact-check + overlap check...`);
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = response.content[0];
  const text = block && block.type === 'text' ? block.text : '';
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');

  let parsed: { issues?: ReviewIssue[]; topicOverlap?: boolean; overlapWith?: string };
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error('[review] Failed to parse review JSON. Raw:\n', text);
    throw err;
  }

  return {
    issues: parsed.issues ?? [],
    topicOverlap: Boolean(parsed.topicOverlap),
    overlapWith: parsed.overlapWith ?? undefined,
    rawText: text,
  };
}

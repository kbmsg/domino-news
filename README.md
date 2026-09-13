## What's in this drop

Four files, meant to replace their namesakes in your fork of bryanhsiao/domino-news:

- `src/content.config.ts`
- `src/lib/tags.ts`
- `scripts/generate-article.ts`
- `scripts/lib/review-article.ts`

Together they retarget the daily content engine from developers to Domino administrators, and drop the bilingual (zh-TW/en) split in favor of English only, per what you asked for.

## What changed and why

**Schema (`content.config.ts`)**: dropped the `lang` enum and the developer-specific `relatedJava` / `relatedSsjs` fields. Added `relatedConsoleCommands`, `notesIniSettings`, and an optional `minDominoVersion`. Same idea as the original's cross-language coverage fields (record what a post touches so a future report can show what's covered), just pointed at admin-relevant things instead of Java/SSJS class names.

**Tags (`tags.ts`)**: same four-axis structure the original used (Product, a second axis, Topic, Type), but the vocabulary changed. The dev site's second axis was programming languages (LotusScript, Java, XPages). The admin version renamed it "Subsystem" and lists server-side mechanisms instead (Router, Replicator, DAOS, Clustering, and so on). Topic axis grew from 6 to 8 admin concerns (added High Availability, Compliance, Licensing, Monitoring). Type axis gained "Incident Report" as a category, since a postmortem-style piece is a natural admin content type that has no developer-site equivalent.

**Generator prompt (`generate-article.ts`)**: the biggest change. Persona is now "a senior Domino administrator writing for other administrators," not an editor summarizing developer news. The three content tiers point at admin-relevant doc roots (`help.hcl-software.com/domino/.../admin/` instead of the LotusScript/Java/Formula reference under `dom_designer/`). Search queries, example under-covered topics, and the acceptable-source list all shifted to operations concerns (security advisories, backup, clustering) instead of API references. Dropped the entire zh-TW language-discipline section since there's no second language to discipline. The inline-link diversity check is rewritten for a single-language body instead of a combined zh+en count.

**Review persona (`review-article.ts`)**: same structure and JSON contract as the original (so `generate-article.ts` calls it exactly the same way), but the fact-check examples now look for wrong console commands and invented notes.ini values instead of wrong API names, and treats guidance that could cause an outage or data loss as automatically critical.

## What this drop does NOT touch

The Astro site itself (everything under `src/pages/`, `src/layouts/`, `astro.config.mjs`) still assumes the bilingual routing the original site was built around: an `/en/` prefix, a language toggle, and page templates that branch on `lang`. None of that is touched here. If you run the site as-is with these four files, the generator will write English-only posts with a new schema, but the site's own pages and the `zh-TW` folder structure elsewhere will still expect the old shape until that gets a separate pass.

Given what you told me (you want this posting to blog.vanessabrooks.com and b2bwhisperer.com rather than living as its own public site), you may not need that pass at all. The Astro site can stay private as the pipeline's own workspace (or you can drop the public deploy entirely), while these four files are what actually decide what gets written and how it reads. The next piece, whenever you want it, is the publish step that takes a finished post and pushes it to WordPress (b2bwhisperer.com, via the REST API) and to Blogger (blog.vanessabrooks.com, via post-by-email or the Blogger API), plus the split between a full technical version for Lotus Evangelist and a shorter CFO/CIO angle for b2bwhisperer.com.

## Before running it for real

Try one generation locally with `SKIP_IMAGE=1` set (skips the OpenAI cover art call, cheaper and faster to check the writing) and read the output before you let it anywhere near a live site. The prompt is tuned to avoid fabrication, but the review layer catches mistakes, it doesn't guarantee there are none, and this content is aimed at people who might run a console command it mentions.

/**
 * Per-tag color palette. Each tag maps to a category that drives chip color.
 * If a tag isn't listed it falls back to the "meta" palette.
 *
 * Retargeted from the developer-focused taxonomy (which organized tags
 * around programming languages: LotusScript, Java, XPages) to an admin
 * taxonomy organized around server subsystems and operational concerns.
 * The four-axis structure is unchanged; only the vocabulary in each axis
 * changed to match what a Domino administrator actually searches for.
 */

export type TagPalette = {
  bg: string;
  fg: string;
  bgDark: string;
  fgDark: string;
};

const PRODUCT: TagPalette = {
  bg: '#fee2e2',
  fg: '#b91c1c',
  bgDark: '#451a1a',
  fgDark: '#fca5a5',
};
const SUBSYSTEM: TagPalette = {
  bg: '#dbeafe',
  fg: '#1d4ed8',
  bgDark: '#172554',
  fgDark: '#93c5fd',
};
const TOPIC: TagPalette = {
  bg: '#f3e8ff',
  fg: '#7e22ce',
  bgDark: '#3b0764',
  fgDark: '#d8b4fe',
};
const META: TagPalette = {
  bg: '#f1f5f9',
  fg: '#475569',
  bgDark: '#1e293b',
  fgDark: '#cbd5e0',
};

const TAG_CATEGORIES: Record<string, TagPalette> = {
  // Product / module (what the post is about)
  'Domino Server': PRODUCT,
  'Notes Client': PRODUCT,
  'Domino Directory': PRODUCT,
  'ID Vault': PRODUCT,
  'Domino REST API': PRODUCT,
  'HCL Nomad': PRODUCT,
  'Domino IQ': PRODUCT,
  Sametime: PRODUCT,
  'HCL Traveler': PRODUCT,

  // Subsystem / mechanism (what part of the server does the work)
  Router: SUBSYSTEM,
  Replicator: SUBSYSTEM,
  'HTTP Task': SUBSYSTEM,
  'Agent Manager': SUBSYSTEM,
  DAOS: SUBSYSTEM,
  'Transaction Logging': SUBSYSTEM,
  Clustering: SUBSYSTEM,
  'Directory Assistance': SUBSYSTEM,
  'Console Commands': SUBSYSTEM,
  'Notes.ini': SUBSYSTEM,
  OIDC: SUBSYSTEM,

  // Topic (what operational problem the post addresses)
  Security: TOPIC,
  Performance: TOPIC,
  Migration: TOPIC,
  'Backup and Recovery': TOPIC,
  'High Availability': TOPIC,
  Compliance: TOPIC,
  Licensing: TOPIC,
  Monitoring: TOPIC,

  // Content type
  'Release Notes': META,
  Tutorial: META,
  News: META,
  Community: META,
  'Incident Report': META,

  // Additional tags in use (kept in sync with tagAxis below)
  Domino: PRODUCT,
  AI: TOPIC,
  Container: TOPIC,
};

export function tagPalette(tag: string): TagPalette {
  return TAG_CATEGORIES[tag] ?? META;
}

/**
 * Which of the four taxonomy axes a tag belongs to. Drives the grouped
 * filter bar on the "all posts" page. Kept consistent with the palette
 * above: PRODUCT/SUBSYSTEM/TOPIC map to their colours, TYPE uses the META
 * (slate) palette. Unknown tags fall to TYPE so they still group somewhere.
 */
export type TagAxis = 'SUBSYSTEM' | 'PRODUCT' | 'TOPIC' | 'TYPE';

const TAG_AXIS: Record<string, TagAxis> = {
  'Domino Server': 'PRODUCT',
  'Notes Client': 'PRODUCT',
  'Domino Directory': 'PRODUCT',
  'ID Vault': 'PRODUCT',
  'Domino REST API': 'PRODUCT',
  'HCL Nomad': 'PRODUCT',
  'Domino IQ': 'PRODUCT',
  Sametime: 'PRODUCT',
  'HCL Traveler': 'PRODUCT',
  Domino: 'PRODUCT',

  Router: 'SUBSYSTEM',
  Replicator: 'SUBSYSTEM',
  'HTTP Task': 'SUBSYSTEM',
  'Agent Manager': 'SUBSYSTEM',
  DAOS: 'SUBSYSTEM',
  'Transaction Logging': 'SUBSYSTEM',
  Clustering: 'SUBSYSTEM',
  'Directory Assistance': 'SUBSYSTEM',
  'Console Commands': 'SUBSYSTEM',
  'Notes.ini': 'SUBSYSTEM',
  OIDC: 'SUBSYSTEM',

  Security: 'TOPIC',
  Performance: 'TOPIC',
  Migration: 'TOPIC',
  'Backup and Recovery': 'TOPIC',
  'High Availability': 'TOPIC',
  Compliance: 'TOPIC',
  Licensing: 'TOPIC',
  Monitoring: 'TOPIC',
  AI: 'TOPIC',
  Container: 'TOPIC',

  'Release Notes': 'TYPE',
  Tutorial: 'TYPE',
  News: 'TYPE',
  Community: 'TYPE',
  'Incident Report': 'TYPE',
};

export function tagAxis(tag: string): TagAxis {
  return TAG_AXIS[tag] ?? 'TYPE';
}

/** Display order + labels for the axis groups. English-only site, so the
 * label record dropped the zh-TW column that the original kept for its
 * bilingual filter bar. */
export const TAG_AXIS_ORDER: TagAxis[] = ['SUBSYSTEM', 'PRODUCT', 'TOPIC', 'TYPE'];

export const TAG_AXIS_LABEL: Record<TagAxis, { en: string }> = {
  SUBSYSTEM: { en: 'Subsystem' },
  PRODUCT: { en: 'Product' },
  TOPIC: { en: 'Topic' },
  TYPE: { en: 'Type' },
};

/**
 * Deterministic gradient pair from a slug, used as a fallback cover when no
 * generated image exists. Maps the slug hash to two HSL colors. Unchanged
 * from the original, this logic has nothing to do with audience.
 */
export function slugGradient(slug: string): { from: string; to: string } {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  const hue1 = h % 360;
  const hue2 = (hue1 + 35) % 360;
  return {
    from: `hsl(${hue1}, 65%, 55%)`,
    to: `hsl(${hue2}, 70%, 45%)`,
  };
}

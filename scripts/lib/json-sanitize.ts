/**
 * Shared helper for parsing JSON that a model wrote by hand (as opposed to
 * JSON produced by a serializer), used by both the article generator
 * (OpenAI) and the article reviewer (Anthropic).
 *
 * Models occasionally emit a raw, unescaped control character (almost
 * always a literal newline) inside a JSON string value, most likely inside
 * a long multi-paragraph field, exactly the field most likely to contain
 * one. A literal newline sitting inside a JSON string instead of the
 * escaped `\n` is invalid JSON, and `JSON.parse` throws "Bad control
 * character in string literal ..." for it, which used to kill the whole
 * attempt even though the content itself was probably fine.
 *
 * This walks the text tracking whether we're inside a double-quoted string
 * (respecting backslash escapes so an escaped quote doesn't end the string
 * early), and replaces any raw control character found INSIDE a string
 * with its proper JSON escape. Characters outside strings are left
 * untouched, a literal newline between JSON tokens is legal, insignificant
 * whitespace, not the problem.
 */
export function sanitizeControlCharsInJsonStrings(raw: string): string {
  let out = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const code = raw.charCodeAt(i);

    if (inString) {
      if (escaped) {
        out += ch;
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        out += ch;
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = false;
        out += ch;
        continue;
      }
      if (code < 0x20) {
        switch (ch) {
          case '\n':
            out += '\\n';
            break;
          case '\r':
            out += '\\r';
            break;
          case '\t':
            out += '\\t';
            break;
          default:
            out += '\\u' + code.toString(16).padStart(4, '0');
        }
        continue;
      }
      out += ch;
      continue;
    }

    if (ch === '"') {
      inString = true;
    }
    out += ch;
  }
  return out;
}

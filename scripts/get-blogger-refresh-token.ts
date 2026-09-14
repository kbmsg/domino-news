/**
 * ONE-TIME LOCAL SETUP SCRIPT. Run this yourself, on your own machine,
 * once. It is NOT meant to run in GitHub Actions and never will, it opens
 * a real browser-facing Google OAuth consent flow that only makes sense
 * interactively, with you signed into the Google account that administers
 * blog.vanessabrooks.com (Lotus Evangelist).
 *
 * What it does:
 *   1. Starts a temporary local HTTP server on 127.0.0.1.
 *   2. Prints a Google OAuth consent URL. You open it in a browser, sign
 *      in as the account that owns the blog, and approve access.
 *   3. Google redirects back to the local server with an authorization
 *      code; this script exchanges it for a refresh token.
 *   4. Looks up the Blogger blogId for blog.vanessabrooks.com and prints
 *      everything you need to paste into GitHub repo secrets.
 *
 * Prerequisites (see README-blogger-setup.md for the full walkthrough):
 *   - A Google Cloud project with the "Blogger API v3" enabled
 *   - An OAuth 2.0 Client ID of type "Desktop app" in that project
 *
 * Usage:
 *   BLOGGER_CLIENT_ID=xxx BLOGGER_CLIENT_SECRET=yyy npx tsx scripts/get-blogger-refresh-token.ts
 */
import { createServer } from 'node:http';
import { URL } from 'node:url';

const CLIENT_ID = process.env.BLOGGER_CLIENT_ID;
const CLIENT_SECRET = process.env.BLOGGER_CLIENT_SECRET;
const PORT = 8976;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/oauth2callback`;
const SCOPE = 'https://www.googleapis.com/auth/blogger';
const BLOG_URL = 'https://blog.vanessabrooks.com';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Set BLOGGER_CLIENT_ID and BLOGGER_CLIENT_SECRET env vars first (see README-blogger-setup.md).');
  process.exit(1);
}

function authUrl(): string {
  const u = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  u.searchParams.set('client_id', CLIENT_ID!);
  u.searchParams.set('redirect_uri', REDIRECT_URI);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('scope', SCOPE);
  u.searchParams.set('access_type', 'offline');
  u.searchParams.set('prompt', 'consent'); // forces a refresh_token even if you've authorized this client before
  return u.toString();
}

async function exchangeCode(code: string): Promise<{ refresh_token?: string; access_token: string }> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  return res.json() as Promise<{ refresh_token?: string; access_token: string }>;
}

async function lookupBlogId(accessToken: string): Promise<string> {
  const u = new URL('https://www.googleapis.com/blogger/v3/blogs/byurl');
  u.searchParams.set('url', BLOG_URL);
  const res = await fetch(u, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!res.ok) throw new Error(`Blog lookup for ${BLOG_URL} failed: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { id: string; name: string };
  console.log(`Found blog: "${data.name}" (${BLOG_URL})`);
  return data.id;
}

const server = createServer(async (req, res) => {
  if (!req.url?.startsWith('/oauth2callback')) {
    res.writeHead(404).end();
    return;
  }
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.writeHead(200, { 'Content-Type': 'text/html' }).end(
      `<p>Authorization failed: ${error}. Check the terminal and try again.</p>`
    );
    console.error(`Authorization failed: ${error}`);
    server.close();
    process.exit(1);
  }
  if (!code) {
    res.writeHead(400).end('Missing code');
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' }).end(
    '<p>Authorized. You can close this tab and go back to the terminal.</p>'
  );

  try {
    const tokens = await exchangeCode(code);
    if (!tokens.refresh_token) {
      console.error(
        '\nNo refresh_token was returned. This usually means this Google account already\n' +
          'authorized this OAuth client before, and Google only issues a refresh_token on\n' +
          'the FIRST consent. Go to https://myaccount.google.com/permissions, remove access\n' +
          'for this app, then run this script again.\n'
      );
      process.exitCode = 1;
      return;
    }
    const blogId = await lookupBlogId(tokens.access_token);

    console.log('\nSetup complete. Add these four as GitHub repo secrets\n(Settings -> Secrets and variables -> Actions -> New repository secret):\n');
    console.log(`  BLOGGER_CLIENT_ID=${CLIENT_ID}`);
    console.log(`  BLOGGER_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`  BLOGGER_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`  BLOGGER_BLOG_ID=${blogId}\n`);
    console.log('The refresh token does not expire on its own; it only stops working if you');
    console.log('revoke access at https://myaccount.google.com/permissions or leave it unused');
    console.log('for 6 months. You will not need to run this script again after this.\n');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log('\nOpen this URL in a browser, sign in as the account that owns blog.vanessabrooks.com,');
  console.log('and approve access:\n');
  console.log(authUrl());
  console.log('\nWaiting for authorization...\n');
});

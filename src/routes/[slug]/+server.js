import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params, platform }) => {
  const { slug } = params;
  const env = platform?.env;
  if (!env) return new Response('Not found', { status: 404 });

  // Look up the stored metadata in KV by short code.
  const data = await env.LINKS.get(slug);
  if (!data) {
    return new Response('Not found', { status: 404 });
  }

  const metadata = JSON.parse(data);
  const longUrl = metadata.longUrl;

  // Redirect the client to the original URL.
  throw redirect(302, longUrl);
};
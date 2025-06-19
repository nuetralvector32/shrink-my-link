import { redirect } from '@sveltejs/kit';

export const GET = async ({ params, platform }) => {
  const { slug } = params;
  const env = platform?.env;
  if (!env) return new Response('Not found', { status: 404 });

  // Look up stored metadata in KV using 6 digi short 
  const data = await env.LINKS.get(slug);
  if (!data) {
    return new Response('Not found', { status: 404 });
  }

  const metadata = JSON.parse(data);
  const longUrl = metadata.longUrl;

  const timestamp = Date.now();
  await env.LINKS.put(`history:${slug}:${timestamp}`, '');

  metadata.clickCount = (metadata.clickCount || 0) + 1;
  await env.LINKS.put(slug, JSON.stringify(metadata));

  // Redirect client to original URL
  throw redirect(302, longUrl);
};
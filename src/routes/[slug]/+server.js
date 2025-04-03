import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';


/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params, env }) => {
  const { slug } = params;
  
  // Look up the stored metadata in KV by short code.
  const data = await env["ns-shrink-my-link"].get(slug);
  if (!data) {
    return new Response('Not found', { status: 404 });
  }
  
  const metadata = JSON.parse(data);
  const longUrl = metadata.longUrl;
  
  // Update click analytics: increment click count and add a timestamp.
  metadata.clickCount = (metadata.clickCount || 0) + 1;
  metadata.clicks = metadata.clicks || [];
  metadata.clicks.push(Date.now());
  
  // Save the updated metadata back to KV.
  await env["ns-shrink-my-link"].put(slug, JSON.stringify(metadata));
  
  // Redirect the client to the original URL.
  throw redirect(302, longUrl);
};
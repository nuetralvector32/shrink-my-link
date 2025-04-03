import { fail } from '@sveltejs/kit';

function generateShortCode(length = 5) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return code;
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ request, env }) => {
      const formData = await request.formData();
      const longUrl = formData.get('url');
      
      if (!longUrl) {
        return { error: 'URL is required' };
      }
      
      // Generate a random slug
      const slug = Math.random().toString(36).substring(2, 8);
      
      // Store in KV
      await env.ns_shrink_my_link.put(slug, JSON.stringify({
        longUrl,
        clickCount: 0,
        clicks: []
      }));
      
      return { shortUrl: `/${slug}` };
    }
  };
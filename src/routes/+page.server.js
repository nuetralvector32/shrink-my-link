import { generateUniqueSlug, isValidUrl, cleanupOldRateLimits } from '$lib/utils';

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, env }) => {
    try {
      const formData = await request.formData();
      const longUrl = formData.get('url');
      
      if (!longUrl || !isValidUrl(longUrl)) {
        return { error: 'Please enter a valid URL starting with http:// or https://' };
      }
      
      // Rate limiting
      const rateLimitKey = `rate_limit_${request.headers.get('cf-connecting-ip')}`;
      const count = await env.LINKS.get(rateLimitKey);
      if (count && parseInt(count) >= 100) {
        return { error: 'Rate limit exceeded. Please try again later.' };
      }
      
      // Generate unique slug and store
      const slug = await generateUniqueSlug(env);
      await env.LINKS.put(slug, JSON.stringify({
        longUrl,
        clickCount: 0,
        clicks: [],
        createdAt: Date.now()
      }));
      
      // Update rate limit
      await env.LINKS.put(rateLimitKey, (count ? parseInt(count) + 1 : 1).toString(), { expirationTtl: 3600 });
      
      // Clean up old rate limits
      await cleanupOldRateLimits(env);
      
      const shortUrl = `${request.url.split('/').slice(0, 3).join('/')}/${slug}`;
      return { shortUrl };
    } catch (error: any) {
      console.error('Error creating short URL:', error);
      if (error.message?.includes('Failed to generate unique slug')) {
        return { error: 'Unable to generate a unique short URL. Please try again.' };
      }
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  }
};
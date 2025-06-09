import { generateUniqueSlug, isValidUrl, cleanupOldRateLimits } from '$lib/utils';
import type { Actions, RequestEvent } from './$types';

interface Env {
  LINKS: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
    delete(key: string): Promise<void>;
    list(options: { prefix: string }): Promise<{ keys: { name: string }[] }>;
  };
}

export const actions: Actions = {
  default: async (event: RequestEvent) => {
    if (!event.platform?.env) {
      return { error: 'Platform environment not available' };
    }

    try {
      const formData = await event.request.formData();
      const longUrl = formData.get('url')?.toString();
      
      if (!longUrl || !isValidUrl(longUrl)) {
        return { error: 'Please enter a valid URL starting with http:// or https://' };
      }
      
      // Rate limiting
      const rateLimitKey = `rate_limit_${event.request.headers.get('cf-connecting-ip')}`;
      const count = await event.platform.env.LINKS.get(rateLimitKey);
      if (count && parseInt(count) >= 100) {
        return { error: 'Rate limit exceeded. Please try again later.' };
      }
      
      // Generate unique slug and store
      const slug = await generateUniqueSlug(event.platform.env as Env);
      await event.platform.env.LINKS.put(slug, JSON.stringify({
        longUrl,
        clickCount: 0,
        clicks: [],
        createdAt: Date.now()
      }));
      
      // Update rate limit
      await event.platform.env.LINKS.put(rateLimitKey, (count ? parseInt(count) + 1 : 1).toString(), { expirationTtl: 3600 });
      
      // Clean up old rate limits
      await cleanupOldRateLimits(event.platform.env as Env);
      
      const shortUrl = `${event.request.url.split('/').slice(0, 3).join('/')}/${slug}`;
      return { shortUrl };
    } catch (error: unknown) {
      console.error('Error creating short URL:', error);
      if (error instanceof Error && error.message.includes('Failed to generate unique slug')) {
        return { error: 'Unable to generate a unique short URL. Please try again.' };
      }
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  }
}; 
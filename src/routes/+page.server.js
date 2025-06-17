import { generateUniqueSlug, isValidUrl } from '$lib/utils';
import { error as svelteError } from '@sveltejs/kit';

export const actions = {
  default: async (event) => {
    if (!event.platform || !event.platform.env) {
      return { error: 'Platform environment not available' };
    }

    // Rnadom comment 
    try {
      const formData = await event.request.formData();
      const longUrl = formData.get('url') ? formData.get('url').toString() : '';
      
      if (!longUrl || !isValidUrl(longUrl)) {
        return { error: 'Please enter a valid URL starting with http:// or https://' };
      }
      
      // Check if URL already exists using the reverse index
      const reverseKey = `url:${longUrl}`;
      const existingCode = await event.platform.env.LINKS.get(reverseKey);
      
      if (existingCode) {
        // if URL already exists, return existing short URL
        const url = new URL(event.request.url);
        const shortUrl = `${url.origin}/${existingCode}`;
        return { shortUrl, longUrl };
      }

      const slug = await generateUniqueSlug(event.platform.env);
      await event.platform.env.LINKS.put(slug, JSON.stringify({
        longUrl,
        clickCount: 0,
        clicks: [],
        createdAt: Date.now()
      }));

      // Store the reverse index
      await event.platform.env.LINKS.put(`url:${longUrl}`, slug);
      
      const url = new URL(event.request.url);
      const shortUrl = `${url.origin}/${slug}`;
      return { shortUrl, longUrl };
    } catch (err) {
      console.error('Error creating short URL:', err);
      const message = err instanceof Error ? err.message : err.toString();
      throw svelteError(500, message);
    }
  }
};
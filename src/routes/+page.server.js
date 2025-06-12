import { generateUniqueSlug, isValidUrl } from '$lib/utils';
import { error as svelteError } from '@sveltejs/kit';

export const actions = {
  default: async (event) => {
    if (!event.platform || !event.platform.env) {
      return { error: 'Platform environment not available' };
    }

    try {
      const formData = await event.request.formData();
      const longUrl = formData.get('url') ? formData.get('url').toString() : '';
      
      if (!longUrl || !isValidUrl(longUrl)) {
        return { error: 'Please enter a valid URL starting with http:// or https://' };
      }
      
      const list = await event.platform.env.LINKS.list();
      for (const keyObj of list.keys) {
        const data = await event.platform.env.LINKS.get(keyObj.name);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.longUrl === longUrl) {
            //return short URL of existing link
            const url = new URL(event.request.url);
            const shortUrl = `${url.origin}/${keyObj.name}`;
            return { shortUrl, longUrl };
          }
        }
      }

      // Generate unique slug and store
      const slug = await generateUniqueSlug(event.platform.env);
      await event.platform.env.LINKS.put(slug, JSON.stringify({
        longUrl,
        clickCount: 0,
        clicks: [],
        createdAt: Date.now()
      }));
      
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
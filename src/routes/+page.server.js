import { generateUniqueSlug, isValidUrl } from '$lib/utils';

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
      
      // Generate unique slug and store
      const slug = await generateUniqueSlug(event.platform.env);
      await event.platform.env.LINKS.put(slug, JSON.stringify({
        longUrl,
        clickCount: 0,
        clicks: [],
        createdAt: Date.now()
      }));
      
      const url = new URL(event.request.url);
      console.log(url);
      const shortUrl = `${url.origin}/${slug}`;
      console.log(shortUrl);
      
      return { shortUrl };
    } catch (error) {
      console.error('Error creating short URL:', error);
      var message = (typeof error === 'object' && error !== null && 'message' in error) ? error.message : '';
      if (typeof message === 'string' && message.includes('Failed to generate unique slug')) {
        return { error: 'Unable to generate a unique short URL. Please try again.' };
      }
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  }
};
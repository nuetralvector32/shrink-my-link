export function isValidUrl(url) {
  try {
    // Must start with http:// or https://
    if (!/^https?:\/\/.+/i.test(url)) return false;
    const parsedUrl = new URL(url);
    if (!parsedUrl.protocol || !parsedUrl.hostname) return false;
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function generateUniqueSlug(env: any): Promise<string> {
  const maxAttempts = 5;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const slug = generateSlug();
    const existing = await env.LINKS.get(slug);
    
    if (!existing) {
      return slug;
    }
    
    attempts++;
  }
  
  throw new Error('Failed to generate unique slug after multiple attempts');
}

function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let slug = '';
  for (let i = 0; i < 6; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

export async function cleanupOldRateLimits(env: any) {
  // Clean up rate limit entries older than 24 hours
  const now = Date.now();
  const cleanupKey = `cleanup_${Math.floor(now / 86400000)}`;
  const cleanupTime = now - 86400000; // 24 hours ago
  
  // Get all rate limit keys
  const list = await env.LINKS.list({ prefix: 'rate_limit_' });
  
  // Delete old entries
  for (const key of list.keys) {
    const timestamp = parseInt(key.name.split('_')[1]);
    if (timestamp < cleanupTime) {
      await env.LINKS.delete(key.name);
    }
  }
  
  // Store cleanup marker
  await env.LINKS.put(cleanupKey, '1', { expirationTtl: 86400 });
}
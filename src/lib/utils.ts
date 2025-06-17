import type { KVNamespace } from '@cloudflare/workers-types';

export function isValidUrl(url: string): boolean {
  if (!URL.canParse(url)) {
    return false;
  }

  const parsedUrl = new URL(url);
  
  if (!parsedUrl.protocol || !parsedUrl.hostname) {
    return false;
  }

  return ['http:', 'https:'].includes(parsedUrl.protocol);
}

export async function generateUniqueSlug(env: { LINKS: KVNamespace }): Promise<string> {
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


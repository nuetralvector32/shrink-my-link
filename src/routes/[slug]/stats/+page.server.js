export const load = async ({ params, platform, url }) => {
    const { slug } = params;
    const env = platform?.env;
    if (!env) return { error: 'Not found' };
    
    const data = await env.LINKS.get(slug);
    if (!data) {
      return { error: 'Short link not found' };
    }
    
    const metadata = JSON.parse(data);

    // Pagination parameters
    const limit = 100; // or whatever page size you want
    const cursor = url.searchParams.get('cursor') || undefined;

    // List click history keys for this slug, paginated
    const history = await env.LINKS.list({ prefix: `history:${slug}:`, limit, cursor });

    // Extract timestamps from keys
    const clicks = history.keys
      .map(keyObj => {
        const parts = keyObj.name.split(':');
        return Number(parts[2]);
      })
      .sort((a, b) => a - b);

    return {
      slug,
      metadata,
      clicks,
      nextCursor: history.list_complete ? null : history.cursor,
      hasMore: !history.list_complete
    };
  };
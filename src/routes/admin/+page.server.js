export const load = async ({ platform, url }) => {
  if (!platform?.env) {
    return { links: [], nextCursor: null, hasMore: false };
  }

  const limit = 20;
  const cursor = url.searchParams.get('cursor') || undefined;
  
  let list = await platform.env.LINKS.list({ limit, cursor });
  let links = [];

  for (const keyObj of list.keys) {
    if (!/^[a-z0-9]{6}$/.test(keyObj.name)) continue;
    const data = await platform.env.LINKS.get(keyObj.name);
    const parse = data ? JSON.parse(data) : null;
    links.push({
      code: keyObj.name,
      longUrl: parse ? parse.longUrl : '',
      clickCount: parse ? parse.clickCount : 0,
    });
  }

  return {
    links,
    nextCursor: list.list_complete ? null : list.cursor,
    hasMore: !list.list_complete
  };
};
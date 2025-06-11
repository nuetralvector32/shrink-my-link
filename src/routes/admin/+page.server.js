export const load = async ({ platform }) => {
  if (!platform?.env) {
      return { links: [] };
  }

  let list = await platform.env.LINKS.list();
  let links = [];

  for (const keyObj of list.keys) {
      // Only include keys that are 6 characters long and alphanumeric
      if (!/^[a-z0-9]{6}$/.test(keyObj.name)) continue;
      const data = await platform.env.LINKS.get(keyObj.name);
      const metadata = data ? JSON.parse(data) : null;
      links.push({
          code: keyObj.name,
          longUrl: metadata ? metadata.longUrl : '',
          clickCount: metadata ? metadata.clickCount : 0,
      });
  }

  return { links };
};
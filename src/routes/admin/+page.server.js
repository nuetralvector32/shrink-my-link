/** @type {import('./$types').PageServerLoad} */
export const load = async ({ env }) => {
    console.log("environment: ",env);
    // List keys from KV. (Note: For larger datasets you may need pagination.)
    let list = await env.LINKS.list();
    let links = [];
    
    for (const keyObj of list.keys) {
      const data = await env.LINKS.get(keyObj.name);
      const metadata = data ? JSON.parse(data) : null;
      links.push({
        code: keyObj.name,
        longUrl: metadata ? metadata.longUrl : '',
        clickCount: metadata ? metadata.clickCount : 0,
      });
    }
    
    return { links };
  };
/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, platform }) => {
    const { slug } = params;
    const env = platform?.env;
    if (!env) return { error: 'Not found' };
    
    const data = await env.LINKS.get(slug);
    if (!data) {
      return { error: 'Short link not found' };
    }
    
    const metadata = JSON.parse(data);
    return { slug, metadata };
  };
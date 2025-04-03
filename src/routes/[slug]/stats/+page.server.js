/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, env }) => {
    const { slug } = params;
    const data = await env.LINKS.get(slug);
    if (!data) {
      return { error: 'Short link not found' };
    }
    
    const metadata = JSON.parse(data);
    return { slug, metadata };
  };
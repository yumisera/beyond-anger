// Beyond Anger — same-origin Substack RSS relay, deployed as a Cloudflare Worker.
// If Substack blocks Cloudflare's IP addresses, this endpoint returns an error;
// the website then continues to show the last locally available entries.
const FEED_URL = 'https://yumisera.substack.com/feed';
export default {
  async fetch(request, env, ctx) {
    const path = new URL(request.url).pathname;
    if (path !== '/api/substack') return env.ASSETS.fetch(request);
    if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
    try {
      const cacheKey = new Request('https://beyond-anger-cache.invalid/api/substack');
      const cache = caches.default;
      let cached = await cache.match(cacheKey);
      if (cached) return cached;
      const response = await fetch(FEED_URL, {
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.5',
          'User-Agent': 'BeyondAnger/1.0 (+https://beyond-anger.yumirx7.workers.dev/)',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(12000),
      });
      if (!response.ok) return Response.json({ error: 'Substack returned HTTP ' + response.status }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
      const xml = await response.text();
      if (!xml.includes('<rss') && !xml.includes('<feed')) return Response.json({ error: 'Unexpected response from Substack' }, { status: 502 });
      const result = new Response(xml, { headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=3600',
        'X-Content-Type-Options': 'nosniff',
      }});
      ctx.waitUntil(cache.put(cacheKey, result.clone()));
      return result;
    } catch (error) {
      return Response.json({ error: 'RSS fetch failed' }, { status: 502, headers: { 'Cache-Control': 'no-store' } });
    }
  },
};

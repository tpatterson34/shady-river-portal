// Cloudflare Pages Function: /api/chronicles
// Fetches Substack RSS feed, parses top articles into clean JSON, and edge-caches for 5 minutes.

export async function onRequest(context) {
  try {
    const rssUrl = "https://theshadyriverbard.substack.com/feed";
    const res = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TheShadyRiverBard-Sync/1.0; +https://theshadyriverbard.com)"
      },
      cf: {
        cacheTtl: 300,
        cacheEverything: true
      }
    });

    if (!res.ok) {
      throw new Error(`Substack feed returned HTTP ${res.status}`);
    }

    const xml = await res.text();
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
    const articles = [];

    for (const itemXml of itemMatches.slice(0, 6)) {
      const getTag = (tag) => {
        const m = itemXml.match(new RegExp(`<${tag}[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/${tag}>`, 'i'))
               || itemXml.match(new RegExp(`<${tag}[^>]*>([\s\S]*?)<\/${tag}>`, 'i'));
        return m ? m[1].trim() : '';
      };

      const title = getTag('title')
        .replace(/&amp;/g, '&')
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');

      const link = getTag('link');
      const rawDate = getTag('pubDate');
      let dateStr = '';
      if (rawDate) {
        try {
          const d = new Date(rawDate);
          dateStr = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        } catch (e) {
          dateStr = rawDate.slice(0, 16);
        }
      }

      // Enclosure image
      let image = '';
      const encMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
      if (encMatch) {
        image = encMatch[1];
      }

      // Summary
      let summary = getTag('description')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .trim();

      if (summary.length > 180) {
        summary = summary.slice(0, 177) + '...';
      }

      let category = 'Substack Journal';
      const lowTitle = title.toLowerCase();
      if (lowTitle.includes('liner notes')) {
        const parts = title.split(':');
        category = parts.length > 1 ? 'Track Notes: ' + parts[1].trim() : 'Track Liner Notes';
      } else if (lowTitle.includes('spark') || lowTitle.includes('manifesto')) {
        category = 'Manifesto & Process';
      }

      articles.push({
        title,
        url: link,
        date: dateStr,
        category,
        summary,
        image
      });
    }

    return new Response(JSON.stringify(articles), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}

import fs from 'node:fs';
const url = 'https://yumisera.substack.com/feed';
const output = new URL('../data/substack.json', import.meta.url);
const decode = text => String(text || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&#(x[\da-f]+|\d+);/gi, (_, v) => String.fromCodePoint(v.toLowerCase().startsWith('x') ? parseInt(v.slice(1),16) : Number(v))).replace(/&(?:amp|lt|gt|quot|apos|nbsp);/g, ch => ({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&nbsp;':' '}[ch]));
const tag = (xml, name) => decode(xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || '');
const strip = value => decode(String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g,' ')).trim();
const safeHttp = value => { try { const u=new URL(value); return /^https?:$/.test(u.protocol)?u.href:''; } catch {return '';} };
try {
  const response = await fetch(url, {headers:{'user-agent':'BeyondAngerSite/1.0 (+https://yumisera.substack.com/)','accept':'application/rss+xml, application/xml, text/xml'}});
  if (!response.ok) throw new Error(`RSS HTTP ${response.status}`);
  const xml = await response.text();
  if (!xml.includes('<rss') && !xml.includes('<channel')) throw new Error('Invalid RSS feed');
  const items = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map(([, item]) => {
    const title = strip(tag(item, 'title'));
    const link = safeHttp(strip(tag(item, 'link') || tag(item,'guid')));
    const rawDescription=tag(item, 'description') || tag(item,'content:encoded');
    const description=strip(rawDescription).slice(0,320);
    const thumbnail = safeHttp(item.match(/<enclosure\b[^>]*\burl=["']([^"']+)["']/i)?.[1] || item.match(/<media:content\b[^>]*\burl=["']([^"']+)["']/i)?.[1] || rawDescription.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1] || '');
    const rawDate=tag(item, 'pubDate')||tag(item,'dc:date');
    const date=Number.isNaN(Date.parse(rawDate))?'':new Date(rawDate).toISOString().slice(0,10);
    return {title, date, description, image:thumbnail, image_alt:title, substack_url:link, youtube_url:'', category:'Substack', published:true};
  }).filter(x=>x.link!==undefined && x.title && x.substack_url && x.date).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,60);
  if(!items.length) throw new Error('RSS returned no dated posts; keeping existing data');
  const newText=JSON.stringify(items,null,2)+'\n';
  const oldText=fs.existsSync(output)?fs.readFileSync(output,'utf8'):'';
  if(newText!==oldText){fs.writeFileSync(output,newText);console.log(`Updated ${items.length} Substack posts`);} else console.log('No new posts');
} catch(err){console.error('Could not retrieve Substack RSS; existing articles were left unchanged:',err.message);process.exitCode=1;}

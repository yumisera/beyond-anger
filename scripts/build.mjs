import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), out=path.join(root,'dist');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const name of ['index.html','style.css','app.js'])fs.copyFileSync(path.join(root,name),path.join(out,name));
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
function readItems(kind){return fs.readdirSync(path.join(root,'content',kind)).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(root,'content',kind,f),'utf8'))).filter(x=>x.published!==false).sort((a,b)=>(b.date||'').localeCompare(a.date||''));}
const data={site:JSON.parse(fs.readFileSync('data/site.json','utf8')),conversations:readItems('conversations'),portfolio:readItems('portfolio')};
fs.writeFileSync(path.join(out,'content.json'),JSON.stringify(data,null,2));
console.log('Built Beyond Anger: '+data.conversations.length+' conversations, '+data.portfolio.length+' projects');

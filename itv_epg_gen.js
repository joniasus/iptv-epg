const https = require('https');
const zlib = require('zlib');
const fs = require('fs');
// UZ proxy (itv.uz TAS-IX geo-restricted: US serverdan 63 kanal, UZ IP'dan 203). PROXY env bo'lsa o'sha orqali
const _proxy = process.env.PROXY || '';
const _agent = _proxy ? new (require('https-proxy-agent'))(_proxy) : undefined;
const OUT = process.argv[2] || 'itv_epg';
const LIMIT = parseInt(process.argv[3]) || 0; // 0 = barcha kanal

function api(path){
  return new Promise((res)=>{
    https.get('https://gw.itv.uz/api/v1/iptv/channels'+path, {headers:{'Referer':'https://itv.uz/','Origin':'https://itv.uz'}, agent:_agent}, r=>{
      let d=''; r.on('data',c=>d+=c); r.on('end',()=>{ try{res(JSON.parse(d))}catch(e){res(null)} });
    }).on('error',()=>res(null));
  });
}
function esc(s){ return (''+(s||'')).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmt(ts){ const d=new Date((ts+18000)*1000); const p=n=>(''+n).padStart(2,'0'); return d.getUTCFullYear()+p(d.getUTCMonth()+1)+p(d.getUTCDate())+p(d.getUTCHours())+p(d.getUTCMinutes())+p(d.getUTCSeconds())+' +0500'; }

(async()=>{
  const chList = await api('/get-list?categoryId=1&itemsPerPage=0&moduleId=1');
  let channels = (chList && chList.data) || [];
  if(LIMIT) channels = channels.slice(0, LIMIT);
  console.log('kanallar:', channels.length);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<tv generator-info-name="itv.uz-epg">\n';
  channels.forEach(c=>{ xml += '  <channel id="itv-'+c.channelId+'"><display-name>'+esc(c.channelTitle)+'</display-name></channel>\n'; });

  let progCount=0, ci=0;
  for(const c of channels){
    ci++;
    const days = await api('/epg/get-days?channelId='+c.channelId+'&timeDifference=18000');
    if(!days || !days.data){ continue; }
    for(const day of days.data){
      const items = await api('/epg/get-items?channelId='+c.channelId+'&timeDifference=18000&timestamp='+day.timestamp);
      if(!items || !items.data) continue;
      for(const p of items.data){
        if(!p.timestamp) continue;
        xml += '  <programme start="'+fmt(p.timestamp.startAt)+'" stop="'+fmt(p.timestamp.endAt)+'" channel="itv-'+c.channelId+'"><title>'+esc(p.programTitle)+'</title>'+(p.description?'<desc>'+esc(p.description)+'</desc>':'')+(p.imageUrl?'<icon src="'+esc(p.imageUrl)+'"/>':'')+'</programme>\n';
        progCount++;
      }
    }
    if(ci%10===0) console.log('  '+ci+'/'+channels.length+' kanal, '+progCount+' dastur');
  }
  xml += '</tv>\n';
  fs.writeFileSync(OUT+'.xml', xml);
  fs.writeFileSync(OUT+'.xml.gz', zlib.gzipSync(xml));
  console.log('TAYYOR:', channels.length, 'kanal,', progCount, 'dastur,', xml.length, 'bayt (gz:', fs.statSync(OUT+'.xml.gz').size, ')');
})();

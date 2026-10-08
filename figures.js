(() => {
  'use strict';
  const container = document.querySelector('.featured-figures');
  const figures = [...container.querySelectorAll('figure')];
  const base = 'https://dataserver.cptec.inpe.br/dataserver_dimnt/das/carlos.bastarz/sandbox/SMNAMonitoringApp/';
  const urls = cycle => [
    `${base}cron_scripts/anls_imgs/smna-fncep/SMNA-FNCEP/${cycle}/Surface_temperature/1000/0.jpg`,
    `${base}online/static/data/smna-fncep/plots/${cycle}/${cycle}_convergence.webp`
  ];
  function monitorURL(cycle, index) {
    const url = new URL('https://gad-dimnt-cptec.github.io/SMNAMonitorStatic/');
    url.searchParams.set('environment', 'smna-fn');
    url.searchParams.set('cycle', cycle);
    if(index===0) {
      url.searchParams.set('variable', 'Surface_temperature');
      url.searchParams.set('level', '1000');
      url.searchParams.set('forecast', '0');
    } else url.searchParams.set('chart', 'convergence');
    url.hash=index===0?'maps':'gsi';
    return url.href;
  }
  let current = {cycle: container.dataset.cycle, urls: urls(container.dataset.cycle)};
  let objectURLs = [], busy = false;
  function yesterdayCycle() {
    const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
    const get = type => parts.find(part => part.type === type).value;
    const date = new Date(Date.UTC(+get('year'), +get('month')-1, +get('day')-1));
    return date.toISOString().slice(0,10).replaceAll('-','') + '00';
  }
  function captions() {
    const lang = document.documentElement.lang.slice(0,2);
    const copy = {
      pt:['Temperatura à superfície','Minimização da função custo','Análise','Ciclo','Par de figuras do mesmo ciclo. Atualizado quando ambos os produtos estão disponíveis.'],
      en:['Surface temperature','Cost function minimization','Analysis','Cycle','Figures from the same cycle. Updated when both products are available.'],
      es:['Temperatura en superficie','Minimización de la función de coste','Análisis','Ciclo','Figuras del mismo ciclo. Se actualizan cuando ambos productos están disponibles.']
    }[lang] || ['Temperatura à superfície','Minimização da função custo','Análise','Ciclo','Par de figuras do mesmo ciclo. Atualizado quando ambos os produtos estão disponíveis.'];
    const c=current.cycle, date=`${c.slice(6,8)}/${c.slice(4,6)}/${c.slice(0,4)} · ${c.slice(8)} UTC`;
    figures.forEach((figure,i) => {
      figure.querySelector('figcaption strong').textContent=copy[i];
      figure.querySelector('figcaption span').textContent=`${copy[i+2]} · ${date}${i===0?' · +0 h':''}`;
      figure.querySelector('figcaption small').textContent=copy[4];
      figure.querySelector('a').href=monitorURL(c,i);
      figure.querySelector('img').alt=`SMNA · ${copy[i]} · ${date}`;
    });
  }
  function database() {
    return new Promise((resolve,reject) => {
      const request=indexedDB.open('gad-figure-pair',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('pairs');
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>reject(request.error);
    });
  }
  async function cachedPair() {
    const db=await database();
    try { return await new Promise((resolve,reject)=>{
      const request=db.transaction('pairs').objectStore('pairs').get('latest');
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
    }); } finally { db.close(); }
  }
  async function savePair(pair) {
    const db=await database();
    try { await new Promise((resolve,reject)=>{
      const transaction=db.transaction('pairs','readwrite');
      transaction.objectStore('pairs').put(pair,'latest');
      transaction.oncomplete=resolve;transaction.onerror=()=>reject(transaction.error);transaction.onabort=()=>reject(transaction.error);
    }); } finally { db.close(); }
  }
  async function decode(src) {
    const img=new Image();img.src=src;await img.decode();
    if(!img.naturalWidth)throw new Error('Invalid image');
  }
  async function commit(pair) {
    if(!/^\d{10}$/.test(pair.cycle)||!Array.isArray(pair.blobs)||pair.blobs.length!==2||!pair.blobs.every(b=>b instanceof Blob))throw new Error('Invalid pair');
    const next=pair.blobs.map(blob=>URL.createObjectURL(blob));
    try { await Promise.all(next.map(decode)); } catch(error) { next.forEach(URL.revokeObjectURL);throw error; }
    // Both images have decoded successfully; replace both in the same browser frame.
    await new Promise(resolve=>requestAnimationFrame(()=>{
      figures.forEach((figure,i)=>{figure.querySelector('img').src=next[i];});
      current=pair;container.dataset.cycle=pair.cycle;captions();resolve();
    }));
    objectURLs.forEach(URL.revokeObjectURL);objectURLs=next;
  }
  async function check() {
    if(busy)return;
    const cycle=yesterdayCycle();
    if(cycle<=current.cycle)return;
    busy=true;
    try {
      const sources=urls(cycle);
      const blobs=await Promise.all(sources.map(async url=>{
        const response=await fetch(url,{cache:'no-cache',signal:AbortSignal.timeout(20000)});
        if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw new Error('Image not published');
        return response.blob();
      }));
      const pair={cycle,urls:sources,blobs};
      await commit(pair);
      try { await savePair(pair); } catch (_) { /* Storage unavailable: keep the current pair for this visit. */ }
    } catch (_) { /* Preserve both current images when either product is unavailable. */ }
    finally { busy=false; }
  }
  async function start() {
    captions();
    try {const saved=await cachedPair();if(saved&&saved.cycle>=current.cycle&&saved.cycle<=yesterdayCycle())await commit(saved);}catch(_){}
    await check();
    setInterval(check,30*60*1000);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)check();});
  }
  document.addEventListener('gad-language-change',captions);
  start();
})();

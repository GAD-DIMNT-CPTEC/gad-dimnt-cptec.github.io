(() => {
  'use strict';
  // Local previews must never increment the public counter.
  if (location.protocol !== 'https:' || location.hostname !== 'gad-dimnt-cptec.github.io' || location.pathname !== '/') return;
  const badge = document.getElementById('visit-badge');
  const preview = document.getElementById('visit-preview');
  const note = document.getElementById('visit-counter-note');
  const copy = {
    pt: ['Contador de visitas', 'Contagem indisponível'],
    en: ['Visit counter', 'Count unavailable'],
    es: ['Contador de visitas', 'Recuento no disponible']
  };
  let failed = false;
  function labels() {
    const text = copy[document.documentElement.lang.slice(0, 2)] || copy.pt;
    badge.alt = text[0];
    if (failed) note.textContent = text[1];
  }
  note.hidden = true;
  badge.addEventListener('load', () => { preview.hidden = true; badge.hidden = false; });
  badge.addEventListener('error', () => { failed = true; note.hidden = false; labels(); });
  document.addEventListener('gad-language-change', labels);
  labels();
  badge.src = 'https://hits.sh/gad-dimnt-cptec.github.io.svg?style=flat&label=Visitas&color=056b9a&labelColor=263f50';
})();

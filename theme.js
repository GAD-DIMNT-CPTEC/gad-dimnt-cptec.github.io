(() => {
  const root = document.documentElement;
  let preference;
  try { preference = localStorage.getItem('gad-theme'); } catch (_) {}
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  root.dataset.theme = preference || (system.matches ? 'dark' : 'light');
  function updateButton() {
    const button = document.getElementById('theme-toggle');
    const dark = root.dataset.theme === 'dark';
    button.setAttribute('aria-checked', String(dark));
    button.setAttribute('aria-label', ({en:'Dark mode',es:'Modo nocturno'})[root.lang] || 'Modo noturno');
  }
  document.addEventListener('DOMContentLoaded', () => {
    updateButton();
    document.getElementById('theme-toggle').addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = preference;
      try { localStorage.setItem('gad-theme', preference); } catch (_) {}
      updateButton();
    });
    system.addEventListener('change', event => {
      if (!preference) {
        root.dataset.theme = event.matches ? 'dark' : 'light';
        updateButton();
      }
    });
  });
})();

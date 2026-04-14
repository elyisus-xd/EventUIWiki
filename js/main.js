// ── ACTIVE NAV ──
// Marca el link activo en sidebar y header según la URL actual
function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-a, .gh-nav-a').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href');
    if (!href) return;
    // Normaliza comparando el final del path
    const normalized = href.replace(/^\.\.\//, '/').replace(/^\.\//, '/');
    if (path.endsWith(normalized) || (path.endsWith('/') && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ── SEARCH ──
// Índice de páginas para búsqueda client-side
const SEARCH_INDEX = [
  { title: 'Introducción',     url: '/index.html',                  desc: 'Qué es EventUI, arquitectura y primeros pasos' },
  { title: 'Primeros pasos',   url: '/primeros-pasos.html',         desc: 'Guía rápida para empezar con EventUI' },
  { title: 'Instalación',      url: '/guias/instalacion.html',      desc: 'Cómo instalar el plugin y el mod' },
  { title: 'Crear eventos',    url: '/guias/crear-eventos.html',    desc: 'Formato YAML de eventos, objetivos y recompensas' },
  { title: 'Diseñar UIs',      url: '/guias/disenar-uis.html',      desc: 'Elementos, propiedades, animaciones hover, tooltips' },
  { title: 'Objetivos',        url: '/guias/objetivos.html',        desc: 'Los 21 tipos de objetivo con sus parámetros' },
  { title: 'Comandos',         url: '/referencia/comandos.html',    desc: 'Todos los subcomandos de /eventui' },
  { title: 'config.yml',       url: '/referencia/config.html',      desc: 'Referencia completa del archivo de configuración' },
  { title: 'Tipos de UI',      url: '/referencia/tipos-ui.html',    desc: 'IMAGE, BUTTON, IMAGE_BUTTON, TEXT, PROGRESS_BAR...' },
  { title: 'API Bridge',       url: '/desarrollo/api-bridge.html',  desc: 'Protocolo de mensajes entre plugin y mod' },
];

let searchModal = null;

function openSearch() {
  if (searchModal) return;

  searchModal = document.createElement('div');
  searchModal.id = 'search-modal';
  searchModal.innerHTML = `
    <div class="sm-backdrop"></div>
    <div class="sm-box">
      <div class="sm-input-row">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10.5 10.5L13 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input id="sm-input" type="text" placeholder="Buscar en la documentación..." autocomplete="off" />
        <span class="sm-esc">ESC</span>
      </div>
      <div id="sm-results"></div>
    </div>
  `;

  document.body.appendChild(searchModal);

  const input = document.getElementById('sm-input');
  const results = document.getElementById('sm-results');

  input.focus();

  function renderResults(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
      results.innerHTML = '<p class="sm-hint">Escribe para buscar páginas...</p>';
      return;
    }

    const matches = SEARCH_INDEX.filter(p =>
      p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    );

    if (!matches.length) {
      results.innerHTML = '<p class="sm-hint">Sin resultados para "' + query + '"</p>';
      return;
    }

    results.innerHTML = matches.map(p => `
      <a class="sm-result" href="${p.url}">
        <span class="sm-result-title">${p.title}</span>
        <span class="sm-result-desc">${p.desc}</span>
      </a>
    `).join('');
  }

  renderResults('');
  input.addEventListener('input', e => renderResults(e.target.value));

  searchModal.querySelector('.sm-backdrop').addEventListener('click', closeSearch);
  document.addEventListener('keydown', onSearchKey);
}

function closeSearch() {
  if (!searchModal) return;
  searchModal.remove();
  searchModal = null;
  document.removeEventListener('keydown', onSearchKey);
}

function onSearchKey(e) {
  if (e.key === 'Escape') closeSearch();
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    closeSearch();
  }
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();

  // Bind search triggers
  document.querySelectorAll('.gh-search, [data-search]').forEach(el => {
    el.addEventListener('click', openSearch);
  });

  // Keyboard shortcut
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
});

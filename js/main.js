// ── UTILIDAD: calcular prefijo de ruta relativa ──
// Detecta cuántos niveles de profundidad tiene la página actual
// y devuelve el prefijo necesario para llegar a la raíz.
// Ejemplo: /guias/instalacion.html → "../"
//          /index.html             → "./"
function getRootPrefix() {
  const depth = window.location.pathname
    .split('/')
    .filter(Boolean).length - 1;
  if (depth <= 0) return './';
  return '../'.repeat(depth);
}

// ── SIDEBAR DINÁMICO ──
// Carga sidebar.html relativo a la raíz y lo inyecta en #sidebar-placeholder
async function loadSidebar() {
  const placeholder = document.getElementById('sidebar-placeholder');
  if (!placeholder) return;

  const prefix = getRootPrefix();

  try {
    const response = await fetch(prefix + 'sidebar.html');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const html = await response.text();

    // Parsear el HTML como documento para manipularlo de forma segura
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const aside = doc.querySelector('aside');
    if (!aside) throw new Error('No se encontró <aside> en sidebar.html');

    // Reescribir hrefs absolutos (/ruta) a relativos (prefix + ruta)
    aside.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('/')) {
        a.setAttribute('href', prefix + href.slice(1));
      }
    });

    placeholder.replaceWith(aside);
    setActiveNav();
    restoreNavGroupStates();
  } catch (err) {
    console.warn('EventUI sidebar:', err.message);
  }
}

// ── ACTIVE NAV ──
// Marca el link activo en sidebar y header comparando con la URL actual
function setActiveNav() {
  const path = window.location.pathname;

  document.querySelectorAll('.nav-a, .gh-nav-a').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href');
    if (!href) return;

    // Normaliza a ruta absoluta para comparar
    const abs = href.startsWith('/') ? href : '/' + href;

    if (
      path === abs ||
      path === abs.replace(/\.html$/, '') ||
      (path.endsWith('/') && abs === '/index.html')
    ) {
      a.classList.add('active');

      // Expandir grupos padres si el link está activo
      let parent = a.closest('.nav-group-content');
      while (parent) {
        const label = parent.previousElementSibling;
        if (label && label.classList.contains('nav-a-collapsible')) {
          label.classList.add('expanded');
          parent.classList.add('expanded');
        }
        parent = parent.parentElement?.closest('.nav-group-content');
      }
    }
  });

  // Si estamos en tipos-ui.html, expandir el grupo Tipos de UI
  if (path.includes('tipos-ui.html')) {
    const tiposUiLink = document.querySelector('.nav-a-collapsible[href*="tipos-ui"]');
    if (tiposUiLink) {
      tiposUiLink.classList.add('expanded');
      const content = tiposUiLink.nextElementSibling;
      if (content && content.classList.contains('nav-group-content')) {
        content.classList.add('expanded');
      }
    }
  }

  // Si estamos en disenar-uis.html, expandir el grupo Diseñar UIs
  if (path.includes('disenar-uis.html')) {
    const disenarUisLink = document.querySelector('.nav-a-collapsible[href*="disenar-uis"]');
    if (disenarUisLink) {
      disenarUisLink.classList.add('expanded');
      const content = disenarUisLink.nextElementSibling;
      if (content && content.classList.contains('nav-group-content')) {
        content.classList.add('expanded');
      }
    }
  }
}

// ── DISCLOSURE TRIANGLES ──
// Toggle para colapsar/expandir grupos de navegación
function toggleNavGroup(link, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const wasExpanded = link.classList.contains('expanded');
  link.classList.toggle('expanded');
  const content = link.nextElementSibling;
  if (content && content.classList.contains('nav-group-content')) {
    content.classList.toggle('expanded');
  }
  // Guardar estado en localStorage usando data-group-id
  const groupId = link.getAttribute('data-group-id');
  if (groupId) {
    const isExpanded = link.classList.contains('expanded');
    localStorage.setItem('nav-group-' + groupId, isExpanded ? 'expanded' : 'collapsed');
  }
  // Navegar a la página si estaba colapsado (ahora está expandido)
  const href = link.getAttribute('href');
  if (href && !wasExpanded) {
    window.location.href = href;
  }
}

// Restaurar estado de grupos desde localStorage
function restoreNavGroupStates() {
  document.querySelectorAll('.nav-a-collapsible').forEach(link => {
    const groupId = link.getAttribute('data-group-id');
    if (groupId) {
      const state = localStorage.getItem('nav-group-' + groupId);
      if (state === 'expanded') {
        link.classList.add('expanded');
        const content = link.nextElementSibling;
        if (content && content.classList.contains('nav-group-content')) {
          content.classList.add('expanded');
        }
      }
    }
  });
}

// ── SEARCH INDEX ──
const SEARCH_INDEX = [
  { title: 'Introducción',      url: '/index.html',                    desc: 'Qué es EventUI, arquitectura y primeros pasos' },
  { title: 'Primeros pasos',    url: '/primeros-pasos.html',           desc: 'Guía rápida para empezar con EventUI' },
  { title: 'Instalación',       url: '/guias/instalacion.html',        desc: 'Cómo instalar el plugin y el mod' },
  { title: 'Crear eventos',     url: '/guias/crear-eventos.html',      desc: 'Formato YAML de eventos, objetivos y recompensas' },
  { title: 'Diseñar UIs',       url: '/guias/disenar-uis.html',        desc: 'Elementos, propiedades, animaciones hover, tooltips' },
  { title: 'Objetivos',         url: '/guias/objetivos.html',          desc: 'Los 21 tipos de objetivo con sus parámetros' },
  { title: 'Recompensas',       url: '/guias/recompensas.html',        desc: 'XP, ítems y comandos como recompensa' },
  { title: 'Dependencias',      url: '/guias/dependencias.html',       desc: 'Cadenas de misiones y árboles de progresión' },
  { title: 'Data Binding',      url: '/guias/data-binding.html',       desc: 'Variables dinámicas en textos de UI y condiciones visible_if' },
  { title: 'Comandos',          url: '/referencia/comandos.html',      desc: 'Todos los subcomandos de /eventui' },
  { title: 'config.yml',        url: '/referencia/config.html',        desc: 'Referencia completa del archivo de configuración' },
  { title: 'Tipos de UI',       url: '/referencia/tipos-ui.html',      desc: 'IMAGE, BUTTON, IMAGE_BUTTON, TEXT, PROGRESS_BAR...' },
  { title: 'Animaciones hover', url: '/referencia/animaciones.html',   desc: 'Los 17 tipos de animación hover con intensidad' },
  { title: 'API Bridge',        url: '/desarrollo/api-bridge.html',    desc: 'Protocolo de mensajes entre plugin y mod' },
];

// ── SEARCH MODAL ──
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

// ── HIGHLIGHT.JS ──
// Carga highlight.js desde CDN y aplica syntax highlighting a todos los bloques
async function loadHighlightJS() {
  // Cargar el script
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
  document.head.appendChild(script);

  await new Promise(resolve => script.onload = resolve);

  // Configurar y aplicar
  hljs.configure({ ignoreUnescapedHTML: true });

  document.querySelectorAll('pre code').forEach(block => {
    // Detectar lenguaje por el contenido del bloque padre (.code-label)
    const label = block.closest('.code-block')?.querySelector('.code-label');
    const labelText = label?.textContent?.toLowerCase() ?? '';

    if (labelText.includes('.yml') || labelText.includes('yaml') ||
        labelText.includes('config') || labelText.includes('events/') ||
        labelText.includes('uis/') || labelText.includes('estructura') ||
        labelText.includes('ejemplo') || labelText.includes('sintaxis')) {
      block.classList.add('language-yaml');
    } else if (labelText.includes('.java') || labelText.includes('plugin') ||
               labelText.includes('mod fabric') || labelText.includes('listener')) {
      block.classList.add('language-java');
    } else if (labelText.includes('terminal') || labelText.includes('gradle') ||
               labelText.includes('bash') || labelText.includes('./gradlew')) {
      block.classList.add('language-bash');
    } else if (labelText.includes('.xml') || labelText.includes('pom')) {
      block.classList.add('language-xml');
    } else if (labelText.includes('consola') || labelText.includes('salida') ||
               labelText.includes('[eventui]') || labelText.includes('flujo')) {
      block.classList.add('language-accesslog');
    }

    hljs.highlightElement(block);
  });
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', async () => {
  await loadSidebar();
  setActiveNav();
  loadHighlightJS();

  document.querySelectorAll('.gh-search, [data-search]').forEach(el => {
    el.addEventListener('click', openSearch);
  });

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
});

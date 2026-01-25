const elLista = document.getElementById('lista');
const elMsg = document.getElementById('msg');
const elQ = document.getElementById('q');
const elLang = document.getElementById('lang');

const btnBuscar = document.getElementById('btnBuscar');
const btnLimpar = document.getElementById('btnLimpar');
const btnSair = document.getElementById('btnSair');

function setMsg(texto, cor = '#bbb') {
  elMsg.textContent = texto;
  elMsg.style.color = cor;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function stripTags(html) {
  return String(html ?? '').replace(/<[^>]*>/g, '').trim();
}

function render(items) {
  elLista.innerHTML = '';

  if (!items.length) {
    elLista.innerHTML = `<div class="exercise"><b>Nenhum resultado.</b></div>`;
    return;
  }

  for (const ex of items) {
    const nome = escapeHtml(ex.name || 'Exercício');
    const desc = escapeHtml(stripTags(ex.description || ''));
    const cat = escapeHtml(ex.category?.name || '');
    const lang = escapeHtml(ex.language?.short_name || '');

    const card = document.createElement('div');
    card.className = 'exercise';
    card.innerHTML = `
      <h4>${nome}</h4>
      <div class="meta">Categoria: ${cat || '—'} • Idioma: ${lang || '—'}</div>
      <p style="margin:8px 0 0 0; color:#ddd;">
        ${desc ? desc.slice(0, 220) + (desc.length > 220 ? '…' : '') : 'Sem descrição.'}
      </p>
    `;
    elLista.appendChild(card);
  }
}

// Busca exercícios na wger (paginado)
async function buscar() {
  const q = (elQ.value || '').trim();
  const langPref = elLang.value; // 'pt' ou 'en' (wger usa short_name tipo 'en', 'pt')

  setMsg('Carregando exercícios...', '#6c757d');
  elLista.innerHTML = '';

  // Endpoint base (API v2)
  // Lista exercícios: /api/v2/exercise/
  const base = 'https://wger.de/api/v2/exercise/';

  // A wger é paginada; vamos puxar algumas páginas e filtrar por nome/idioma
  // (Depois a gente otimiza com filtros mais avançados.)
  let url = `${base}?limit=50`;
  let pages = 0;
  const maxPages = 4; // 200 itens no máximo por busca (rápido e suficiente pra começar)
  const results = [];

  try {
    while (url && pages < maxPages) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const list = Array.isArray(data.results) ? data.results : [];

      for (const item of list) {
        const nome = (item.name || '').toLowerCase();
        const idioma = (item.language?.short_name || '').toLowerCase();

        const okIdioma = langPref ? idioma === langPref : true;
        const okQuery = q ? nome.includes(q.toLowerCase()) : true;

        if (okIdioma && okQuery) results.push(item);
      }

      url = data.next;
      pages++;
    }

    setMsg(`Encontrados: ${results.length} exercício(s).`, results.length ? 'green' : '#bbb');
    render(results);

  } catch (err) {
    console.error(err);
    setMsg('Erro ao carregar exercícios da API. Verifique a internet/CORS.', 'red');
  }
}

btnBuscar.addEventListener('click', buscar);
btnLimpar.addEventListener('click', () => {
  elQ.value = '';
  elLang.value = 'pt';
  setMsg('');
  elLista.innerHTML = '';
});

elQ.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') buscar();
});

btnSair.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '../login.html';
});

// opcional: carregar algo ao abrir
setMsg('Digite um termo e clique em Buscar.');

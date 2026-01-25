const alunoSelect = document.getElementById('alunoSelect');
const lista = document.getElementById('listaExercicios');
const msg = document.getElementById('msg');

const btnBuscar = document.getElementById('btnBuscar');
const btnLimparBusca = document.getElementById('btnLimparBusca');
const btnSalvar = document.getElementById('btnSalvar');
const btnLimparTreino = document.getElementById('btnLimparTreino');
const btnSair = document.getElementById('btnSair');

const q = document.getElementById('q');
const tbodyTreino = document.getElementById('tbodyTreino');
const contadorItens = document.getElementById('contadorItens');
const tituloTreino = document.getElementById('tituloTreino');
const obsTreino = document.getElementById('obsTreino');

let itensTreino = [];

function setMsg(text, color = '#bbb') {
  msg.textContent = text;
  msg.style.color = color;
}

function stripTags(html) {
  return String(html ?? '').replace(/<[^>]*>/g, '').trim();
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function updateCounter() {
  contadorItens.textContent = `${itensTreino.length} itens`;
}

function renderTreinoTable() {
  tbodyTreino.innerHTML = '';
  updateCounter();

  if (itensTreino.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="8" style="color:#bbb;">Nenhum exercício no treino ainda.</td>`;
    tbodyTreino.appendChild(tr);
    return;
  }

  itensTreino.forEach((it, idx) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>
        <div style="font-weight:700;">${escapeHtml(it.exercise_nome)}</div>
        <div style="color:#bbb; font-size:12px;">API ID: ${it.exercise_api_id ?? '—'}</div>
      </td>
      <td><input class="input" type="number" min="1" value="${it.series ?? 3}" data-field="series" data-idx="${idx}"></td>
      <td><input class="input" type="text" value="${escapeHtml(it.repeticoes ?? '8-12')}" data-field="repeticoes" data-idx="${idx}"></td>
      <td><input class="input" type="text" value="${escapeHtml(it.carga ?? '')}" placeholder="Ex: 20kg" data-field="carga" data-idx="${idx}"></td>
      <td><input class="input" type="number" min="0" value="${it.descanso_seg ?? 60}" data-field="descanso_seg" data-idx="${idx}"></td>
      <td><textarea class="input" rows="2" placeholder="Opcional" data-field="notas" data-idx="${idx}">${escapeHtml(it.notas ?? '')}</textarea></td>
      <td>
        <button class="btn btn-danger" type="button" data-action="remove" data-idx="${idx}">
          Remover
        </button>
      </td>
    `;

    tbodyTreino.appendChild(tr);
  });
}

function readTableChanges(e) {
  const el = e.target;
  const idx = Number(el.dataset.idx);
  const field = el.dataset.field;
  if (Number.isNaN(idx) || !field) return;

  const item = itensTreino[idx];
  if (!item) return;

  if (field === 'series' || field === 'descanso_seg') {
    const n = Number(el.value);
    item[field] = Number.isNaN(n) ? null : n;
  } else {
    item[field] = el.value;
  }
}

tbodyTreino.addEventListener('input', readTableChanges);

tbodyTreino.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.dataset.action === 'remove') {
    const idx = Number(btn.dataset.idx);
    itensTreino.splice(idx, 1);
    // reordena
    itensTreino = itensTreino.map((it, i) => ({ ...it, ordem: i + 1 }));
    renderTreinoTable();
    setMsg('Item removido.', '#bbb');
  }
});

async function carregarAlunos() {
  setMsg('Carregando alunos...', '#6c757d');

  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:3000/alunos', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json().catch(() => []);
    if (!res.ok) throw new Error(data.erro || 'Erro ao buscar alunos');

    alunoSelect.innerHTML = data
      .filter(a => a.tipo === 'aluno') // opcional: só alunos
      .map(a => `<option value="${a.id}">${escapeHtml(a.nome)} (#${a.id})</option>`)
      .join('');

    setMsg('Pronto. Busque exercícios e monte o treino.', 'green');
  } catch (e) {
    console.error(e);
    setMsg('Erro ao carregar alunos (verifique token/rota).', 'red');
  }
}

async function buscarExercicios() {
  const term = (q.value || '').trim().toLowerCase();
  if (!term) {
    setMsg('Digite um termo para buscar.', 'red');
    return;
  }

  setMsg('Buscando exercícios na API...', '#6c757d');
  lista.innerHTML = '';

  let url = 'https://wger.de/api/v2/exercise/?limit=50';
  let pages = 0;
  const maxPages = 3;
  const encontrados = [];

  try {
    while (url && pages < maxPages) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      for (const ex of (data.results || [])) {
        const nome = (ex.name || '').toLowerCase();
        if (nome.includes(term)) encontrados.push(ex);
      }

      url = data.next;
      pages++;
    }

    if (!encontrados.length) {
      setMsg('Nenhum exercício encontrado.', '#bbb');
      return;
    }

    setMsg(`Encontrados: ${encontrados.length}`, 'green');

    for (const ex of encontrados) {
      const li = document.createElement('li');
      li.className = 'item';

      const nomeEx = escapeHtml(ex.name || 'Exercício');
      const desc = escapeHtml(stripTags(ex.description || ''));

      li.innerHTML = `
        <h4>${nomeEx}</h4>
        <div class="meta">${desc ? desc.slice(0, 160) + (desc.length > 160 ? '…' : '') : 'Sem descrição.'}</div>
        <div class="exercise-actions">
          <button class="btn btn-primary" type="button">
            <i class="fas fa-plus"></i> Adicionar
          </button>
        </div>
      `;

      li.querySelector('button').addEventListener('click', () => {
        itensTreino.push({
          ordem: itensTreino.length + 1,
          exercise_api_id: ex.id ?? null,
          exercise_nome: ex.name || 'Exercício',
          exercise_url: ex.url || null,
          series: 3,
          repeticoes: '8-12',
          carga: '',
          descanso_seg: 60,
          notas: ''
        });

        renderTreinoTable();
        setMsg('Exercício adicionado ✅ (ajuste os campos ao lado)', 'green');
      });

      lista.appendChild(li);
    }
  } catch (e) {
    console.error(e);
    setMsg('Erro ao buscar exercícios na API.', 'red');
  }
}

btnBuscar.addEventListener('click', buscarExercicios);

btnLimparBusca.addEventListener('click', () => {
  q.value = '';
  lista.innerHTML = '';
  setMsg('');
});

q.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') buscarExercicios();
});

btnLimparTreino.addEventListener('click', () => {
  itensTreino = [];
  tituloTreino.value = '';
  obsTreino.value = '';
  renderTreinoTable();
  setMsg('Treino limpo.', '#bbb');
});

btnSalvar.addEventListener('click', async () => {
  const aluno_id = Number(alunoSelect.value);
  if (!aluno_id) {
    setMsg('Selecione um aluno.', 'red');
    return;
  }

  const titulo = (tituloTreino.value || '').trim();
  if (!titulo) {
    setMsg('Informe o título do treino.', 'red');
    return;
  }

  if (itensTreino.length === 0) {
    setMsg('Adicione ao menos 1 exercício.', 'red');
    return;
  }

  // garante ordem
  itensTreino = itensTreino.map((it, i) => ({ ...it, ordem: i + 1 }));

  const payload = {
    aluno_id,
    titulo,
    observacoes: (obsTreino.value || '').trim() || null,
    itens: itensTreino.map(it => ({
      ordem: it.ordem,
      exercise_api_id: it.exercise_api_id ?? null,
      exercise_nome: it.exercise_nome,
      exercise_url: it.exercise_url ?? null,
      series: it.series ?? null,
      repeticoes: (it.repeticoes || '').trim() || null,
      carga: (it.carga || '').trim() || null,
      descanso_seg: it.descanso_seg ?? null,
      notas: (it.notas || '').trim() || null
    }))
  };

  const token = localStorage.getItem('token');
  setMsg('Salvando treino...', '#6c757d');

  try {
    const res = await fetch('http://localhost:3000/admin/treinos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(data.erro || 'Erro ao salvar treino', 'red');
      return;
    }

    setMsg(`✅ Treino salvo com sucesso! ID: ${data.treino_id}`, 'green');

    // limpa após salvar
    itensTreino = [];
    tituloTreino.value = '';
    obsTreino.value = '';
    renderTreinoTable();
  } catch (e) {
    console.error(e);
    setMsg('Erro ao conectar com o servidor.', 'red');
  }
});

btnSair.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '../login.html';
});

// inicia
carregarAlunos();
renderTreinoTable();
setMsg('Busque exercícios e monte o treino no painel ao lado.');

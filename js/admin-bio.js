/**
 * js/admin-bio.js
 * Página ADMIN - Cadastro e listagem de Bioimpedância
 * Requer no HTML:
 *  - <form id="bioForm"> ...inputs... </form>
 *  - <div id="msg"></div>
 *  - <tbody id="bioTbody"></tbody>
 *
 * Endpoints esperados no backend:
 *  - POST http://localhost:3000/admin/bioimpedancia
 *  - GET  http://localhost:3000/admin/bioimpedancias  (lista geral)
 *    (opcional) GET http://localhost:3000/admin/bioimpedancias?aluno_id=1
 */

console.log("admin-bio.js carregou ✅");

// ===== Elementos da página =====
const form = document.getElementById("bioForm");
const msg = document.getElementById("msg");
const tbody = document.getElementById("bioTbody");

// Se não encontrar elementos, evita erro e informa no console
if (!form || !msg || !tbody) {
  console.error(
    "Elementos obrigatórios não encontrados. Verifique se o HTML possui: bioForm, msg, bioTbody."
  );
}

// (Opcional) trava simples por tipo salvo no localStorage
try {
  const usuarioStr = localStorage.getItem("usuario");
  if (!usuarioStr) {
    if (msg) {
      msg.style.color = "red";
      msg.textContent = "Você não está logado. Volte e faça login.";
    }
    console.warn("Sem usuario no localStorage");
  } else {
    const usuario = JSON.parse(usuarioStr);
    if (usuario?.tipo !== "admin") {
      if (msg) {
        msg.style.color = "red";
        msg.textContent = "Acesso negado. Apenas admin.";
      }
      console.warn("Usuário não é admin:", usuario);
    }
  }
} catch (e) {
  console.warn("Falha ao ler usuario do localStorage:", e);
}

// ===== Helpers =====
function toNum(id) {
  const el = document.getElementById(id);
  if (!el) return null;

  const v = el.value;
  if (v === "") return null;

  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function setMsg(text, color = "black") {
  if (!msg) return;
  msg.style.color = color;
  msg.textContent = text;
}

// ===== Carregar tabela =====
async function carregarTabela() {
  if (!tbody) return;

  try {
    // Se você quiser filtrar por aluno_id, descomente:
    // const alunoId = getValue("aluno_id");
    // const url = alunoId ? `http://localhost:3000/admin/bioimpedancias?aluno_id=${encodeURIComponent(alunoId)}` : "http://localhost:3000/admin/bioimpedancias";

    const url = "http://localhost:3000/admin/bioimpedancias";
    const res = await fetch(url);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("Falha ao carregar tabela:", res.status, errText);
      setMsg("Erro ao carregar tabela (API).", "red");
      return;
    }

    const dados = await res.json();

    tbody.innerHTML = "";

    if (!Array.isArray(dados) || dados.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="6">Nenhum registro encontrado.</td>`;
      tbody.appendChild(tr);
      return;
    }

    dados.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.id ?? ""}</td>
        <td>${item.aluno_nome ?? ""} (#${item.aluno_id ?? ""})</td>
        <td>${item.data_medicao ?? ""}</td>
        <td>${item.peso ?? ""}</td>
        <td>${item.percentual_gordura ?? ""}</td>
        <td>${item.massa_magra ?? ""}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error("Erro ao carregar tabela:", e);
    setMsg("Erro ao carregar tabela (conexão).", "red");
  }
}

// ===== Enviar cadastro =====
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Campos obrigatórios
    const aluno_id = Number(getValue("aluno_id"));
    const data_medicao = getValue("data_medicao");

    if (!aluno_id || !data_medicao) {
      setMsg("Aluno ID e Data da medição são obrigatórios.", "red");
      return;
    }

    // Monta payload
    const payload = {
      aluno_id,
      data_medicao,
      peso: toNum("peso"),
      altura: toNum("altura"),
      imc: toNum("imc"),
      percentual_gordura: toNum("percentual_gordura"),
      massa_magra: toNum("massa_magra"),
      massa_gorda: toNum("massa_gorda"),
      agua_corporal: toNum("agua_corporal"),
      taxa_metabolica_basal: toNum("taxa_metabolica_basal"),
    };

    // Remove campos vazios
    Object.keys(payload).forEach((k) => {
      if (
        payload[k] === null ||
        payload[k] === "" ||
        Number.isNaN(payload[k])
      ) {
        delete payload[k];
      }
    });

    console.log("Enviando bioimpedância:", payload);

    try {
      const res = await fetch("http://localhost:3000/admin/bioimpedancia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMsg(`Salvo com sucesso! ID: ${data.id ?? ""}`, "green");
        form.reset();
        await carregarTabela();
      } else {
        setMsg(data.erro || "Erro ao salvar bioimpedância.", "red");
        console.error("Erro backend:", data);
      }
    } catch (err) {
      console.error("Erro no fetch:", err);
      setMsg("Erro ao conectar com o servidor.", "red");
    }
  });
}

// Carrega tabela ao abrir a página
carregarTabela();

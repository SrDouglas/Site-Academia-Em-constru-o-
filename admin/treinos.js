console.log("👑 Admin Treinos carregado");

// ===============================
// PROTEÇÃO DE ACESSO
// ===============================
function protegerAdmin() {
  if (localStorage.getItem("perfil") !== "admin") {
    alert("Acesso restrito ao administrador");
    window.location.href = "../index.html";
  }
}

// ===============================
// CARREGA ALUNOS NO SELECT
// ===============================
function carregarAlunos() {
  const select = document.getElementById("alunoSelect");

  alunosDB.forEach(aluno => {
    const option = document.createElement("option");
    option.value = aluno.id;
    option.textContent = aluno.nome;
    select.appendChild(option);
  });
}

// ===============================
// BUSCA EXERCÍCIOS NA API WGER
// ===============================
async function carregarExerciciosAPI() {
  const lista = document.getElementById("listaExercicios");

  try {
    const response = await fetch(
      "https://wger.de/api/v2/exercise/?language=2&limit=20"
    );

    const data = await response.json();

    data.results.forEach(exercicio => {
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${exercicio.name}</strong>
        <button onclick="adicionarExercicio('${exercicio.name}')">
          Adicionar
        </button>
      `;

      lista.appendChild(li);
    });

  } catch (error) {
    console.error("Erro ao buscar exercícios", error);
  }
}

// ===============================
// ADICIONA EXERCÍCIO AO TREINO
// ===============================
function adicionarExercicio(nome) {
  const campo = document.getElementById("treino");
  campo.value += `${nome} - 3x12\n`;
}

// ===============================
// SALVA TREINO DO ALUNO
// ===============================
function salvarTreino() {
  const alunoId = document.getElementById("alunoSelect").value;
  const texto = document.getElementById("treino").value.split("\n");

  const treino = {
    segunda: [],
    terca: [],
    quarta: [],
    quinta: [],
    sexta: []
  };

  texto.forEach(linha => {
    if (!linha.trim()) return;

    const [dia, exercicio] = linha.split(":");
    if (treino[dia.toLowerCase()]) {
      treino[dia.toLowerCase()].push(exercicio.trim());
    }
  });

  salvarTreinoAluno(alunoId, treino);
  alert("✅ Treino salvo em memória!");
}


// ===============================
// INICIALIZA TUDO
// ===============================
function initAdmin() {
  protegerAdmin();
  carregarAlunos();
  carregarExerciciosAPI();
}

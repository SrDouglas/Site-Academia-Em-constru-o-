console.log("📋 Schedule do aluno carregado");

// PROTEGE A ROTA (APENAS ALUNO)
function protegerAluno() {
  if (localStorage.getItem("perfil") !== "aluno") {
    alert("Acesso restrito ao aluno");
    window.location.href = "../index.html";
  }
}

// CARREGA O TREINO DO ALUNO
function carregarTreinoAluno() {
  protegerAluno();

  const alunoId = localStorage.getItem("alunoLogadoId");
  if (!alunoId) {
    alert("Aluno não identificado");
    return;
  }

  const treino = localStorage.getItem(`treino_aluno_${alunoId}`);

  /**
   * IMPORTANTE:
   * Aqui NÃO alteramos o HTML.
   * Só procuramos um container existente.
   * Ajuste o ID se necessário.
   */
  const container =
    document.getElementById("treinoAluno") ||
    document.getElementById("gradeTreino") ||
    document.querySelector(".treino");

  if (!container) {
    console.warn("⚠️ Nenhum container de treino encontrado no HTML");
    return;
  }

  if (treino) {
    container.textContent = treino;
  } else {
    container.textContent = "Nenhum treino cadastrado pelo professor.";
  }
}

// AUTOLOAD
window.addEventListener("load", carregarTreinoAluno);

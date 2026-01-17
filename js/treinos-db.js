console.log("🗄️ Banco de treinos carregado");

// TREINOS POR ALUNO (id)
const treinosDB = {
  1: {
    segunda: ["Supino 3x12", "Crucifixo 3x10"],
    terca: ["Agachamento 4x10"],
    quarta: [],
    quinta: ["Puxada frontal 3x12"],
    sexta: ["Rosca direta 3x10"]
  },
  2: {
    segunda: ["Esteira 20min"],
    terca: [],
    quarta: ["Leg press 3x12"],
    quinta: [],
    sexta: ["Abdominal 3x20"]
  }
};

// FUNÇÕES DE ACESSO
function salvarTreinoAluno(alunoId, treino) {
  treinosDB[alunoId] = treino;
}

function buscarTreinoAluno(alunoId) {
  return treinosDB[alunoId] || null;
}

// EXPORTA
window.treinosDB = treinosDB;
window.salvarTreinoAluno = salvarTreinoAluno;
window.buscarTreinoAluno = buscarTreinoAluno;

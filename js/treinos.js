async function carregarTreinos() {
  try {
    const exercicios = await buscarExercicios();

    // Exemplo de regra: ignorar exercícios sem nome
    const exerciciosValidos = exercicios.filter(e => e.name);

    renderizarTreinos(exerciciosValidos);
  } catch (erro) {
    console.error(erro);
    alert("Erro ao carregar treinos");
  }
}
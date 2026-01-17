function setPerfilAdmin() {
  localStorage.setItem("perfil", "admin");
}

function setPerfilAluno(alunoId) {
  localStorage.setItem("perfil", "aluno");
  localStorage.setItem("alunoLogadoId", alunoId);
}

function getPerfil() {
  return localStorage.getItem("perfil");
}

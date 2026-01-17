console.log("🔐 Sistema de login ADMIN carregado");

// CREDENCIAIS FIXAS DO ADMIN (ACADÊMICO)
const ADMIN_LOGIN = "15418951777";
const ADMIN_SENHA = "13091994";

// Login do administrador
function loginAdmin(login, senha) {
  const loginLimpo = login.replace(/\D/g, "");
  const senhaLimpa = senha.replace(/\D/g, "");

  console.log("🔎 Tentativa ADMIN:", loginLimpo, senhaLimpa);

  if (
    loginLimpo === ADMIN_LOGIN &&
    senhaLimpa === ADMIN_SENHA
  ) {
    localStorage.setItem("perfil", "admin");
    console.log("✅ ADMIN LOGADO COM SUCESSO");
    window.location.href = "admin/treinos.html";
  } else {
    alert("Login ou senha do administrador inválidos");
  }
}

// js/alunos.js - VERSÃO GARANTIDA COM ADMIN
console.log('👥 Sistema de alunos + ADMIN carregado');

// ===============================
// DADOS DO ADMIN (FIXO)
// ===============================
const ADMIN_LOGIN = "15418951777";
const ADMIN_SENHA = "13091994";

// ===============================
// DADOS DE TESTE DOS ALUNOS
// ===============================
const alunosDB = [
    {
        id: 1,
        nome: "João Silva",
        cpf: "12345678900",
        dataNascimento: "15041990",
        plano: "Completo"
    },
    {
        id: 2,
        nome: "Maria Santos",
        cpf: "98765432100",
        dataNascimento: "22081985",
        plano: "Família"
    }
];

// ===============================
// VALIDAÇÕES SIMPLES
// ===============================
function validarCPF(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.length === 11;
}

function validarData(data) {
    const dataLimpa = data.replace(/\D/g, '');
    return dataLimpa.length === 8;
}

// ===============================
// LOGIN DO ADMIN
// ===============================
function buscarAdmin(login, senha) {
    const loginLimpo = login.replace(/\D/g, '');
    const senhaLimpa = senha.replace(/\D/g, '');

    console.log("🔐 Verificando ADMIN...");

    if (loginLimpo === ADMIN_LOGIN && senhaLimpa === ADMIN_SENHA) {
        console.log("✅ ADMIN AUTENTICADO");
        return { perfil: "admin" };
    }

    return null;
}

// ===============================
// LOGIN DO ALUNO
// ===============================
function buscarAluno(cpf, senha) {
    console.log('🔎 BUSCANDO ALUNO ====================');

    const cpfLimpo = cpf.replace(/\D/g, '');
    const senhaLimpa = senha.replace(/\D/g, '');

    for (let aluno of alunosDB) {
        if (aluno.cpf === cpfLimpo && aluno.dataNascimento === senhaLimpa) {
            console.log(`🎯 ALUNO ENCONTRADO: ${aluno.nome}`);
            return aluno;
        }
    }

    return null;
}

// ===============================
// FUNÇÃO ÚNICA DE LOGIN
// ===============================
function realizarLogin(login, senha) {

    // 🔐 TENTA LOGIN COMO ADMIN
    const admin = buscarAdmin(login, senha);
    if (admin) {
        localStorage.setItem("perfil", "admin");
        window.location.href = "admin/treinos.html";
        return;
    }

    // 👤 TENTA LOGIN COMO ALUNO
    const aluno = buscarAluno(login, senha);
    if (aluno) {
        localStorage.setItem("perfil", "aluno");
        localStorage.setItem("alunoLogadoId", aluno.id);
        window.location.href = "area-aluno/schedule.html";
        return;
    }

    alert("Login ou senha inválidos");
}

// ===============================
// EXPORTAÇÕES
// ===============================
window.alunosDB = alunosDB;
window.validarCPF = validarCPF;
window.validarData = validarData;
window.realizarLogin = realizarLogin;

console.log('📝 TESTES:');
console.log('ADMIN → 15418951777 / 13091994');
console.log('João → 12345678900 / 15041990');
console.log('Maria → 98765432100 / 22081985');

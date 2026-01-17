// js/teste-login.js - Arquivo de teste simples
console.log('=== TESTE DE LOGIN ===');

// Dados de teste
const alunosTeste = [
    {
        cpf: "12345678900",
        senha: "15041990",
        nome: "João Teste"
    }
];

// Teste manual
function testarLogin() {
    console.log('Testando login...');
    
    const cpf = "12345678900";
    const senha = "15041990";
    
    const aluno = alunosTeste.find(a => a.cpf === cpf && a.senha === senha);
    
    if (aluno) {
        console.log('✅ Login bem-sucedido!');
        console.log('Aluno:', aluno.nome);
        alert('Teste OK! Redirecionando...');
        window.location.href = 'dashboard.html';
    } else {
        console.log('❌ Login falhou');
        alert('CPF ou senha incorretos!');
    }
}

// Adicione este botão temporário no HTML
document.addEventListener('DOMContentLoaded', function() {
    // Criar botão de teste
    const testBtn = document.createElement('button');
    testBtn.textContent = 'TESTAR LOGIN (Debug)';
    testBtn.style.position = 'fixed';
    testBtn.style.bottom = '10px';
    testBtn.style.left = '10px';
    testBtn.style.zIndex = '9999';
    testBtn.style.background = 'red';
    testBtn.style.color = 'white';
    testBtn.style.padding = '10px';
    testBtn.style.border = 'none';
    testBtn.style.borderRadius = '5px';
    testBtn.style.cursor = 'pointer';
    
    testBtn.onclick = testarLogin;
    
    document.body.appendChild(testBtn);
    
    console.log('Botão de teste adicionado');
});
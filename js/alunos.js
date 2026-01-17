// Banco de dados simulado de alunos
const alunosDB = [
    {
        id: 1,
        nome: "João Silva",
        cpf: "15418951777",
        dataNascimento: "13091994",
        email: "joao@email.com",
        telefone: "(11) 99999-9999",
        plano: "Completo",
        status: "Ativo",
        vencimento: "10/02/2024",
        ultimoAcesso: "05/02/2024 08:30",
        foto: "https://randomuser.me/api/portraits/men/32.jpg",
        medidas: {
            peso: "78kg",
            altura: "1.75m",
            imc: "25.5"
        }
    },
    {
        id: 2,
        nome: "Maria Santos",
        cpf: "98765432100",
        dataNascimento: "22081985",
        email: "maria@email.com",
        telefone: "(11) 98888-8888",
        plano: "Família",
        status: "Ativo",
        vencimento: "15/02/2024",
        ultimoAcesso: "04/02/2024 18:15",
        foto: "https://randomuser.me/api/portraits/women/44.jpg",
        medidas: {
            peso: "65kg",
            altura: "1.68m",
            imc: "23.0"
        }
    },
    // Adicione mais alunos de teste
    {
        id: 3,
        nome: "Teste Simples",
        cpf: "11122233344",
        dataNascimento: "01012000",
        email: "teste@email.com",
        telefone: "(11) 97777-7777",
        plano: "Básico",
        status: "Ativo"
    }
];

// FUNÇÃO VALIDAÇÃO DE CPF SIMPLIFICADA
function validarCPF(cpf) {
    console.log('🔍 Validando CPF:', cpf);
    
    // Remove tudo que não é número
    cpf = cpf.replace(/\D/g, '');
    console.log('CPF limpo:', cpf);
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        console.log('❌ CPF não tem 11 dígitos');
        return false;
    }
    
    // Verifica se não é sequência repetida
    if (/^(\d)\1+$/.test(cpf)) {
        console.log('❌ CPF é sequência repetida');
        return false;
    }
    
    // PARA TESTES - Aceita qualquer CPF com 11 dígitos não repetidos
    console.log('✅ CPF aceito para testes');
    return true;
}

// FUNÇÃO PARA FORMATAR CPF NO INPUT
function formatCPF(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    
    // Formatação: 123.456.789-09
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    input.value = value;
    console.log('CPF formatado:', value);
}

// FUNÇÃO VALIDAÇÃO DE DATA
function validateDate(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 8) {
        value = value.substring(0, 8);
    }
    
    input.value = value;
    
    if (value.length === 8) {
        const dia = parseInt(value.substring(0, 2));
        const mes = parseInt(value.substring(2, 4));
        const ano = parseInt(value.substring(4, 8));
        
        // Validação básica
        const dataValida = !(dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1900 || ano > new Date().getFullYear());
        
        if (dataValida) {
            input.classList.remove('error');
            console.log('✅ Data válida:', value);
            return true;
        } else {
            input.classList.add('error');
            console.log('❌ Data inválida:', value);
            return false;
        }
    }
    
    return false;
}

// BUSCAR ALUNO
function buscarAluno(cpf, senha) {
    cpf = cpf.replace(/\D/g, '');
    console.log('🔎 Buscando aluno:', { cpf, senha });
    
    const aluno = alunosDB.find(a => a.cpf === cpf && a.dataNascimento === senha);
    
    if (aluno) {
        console.log('✅ Aluno encontrado:', aluno.nome);
    } else {
        console.log('❌ Aluno não encontrado');
    }
    
    return aluno || null;
}

// MOSTRAR MENSAGEM DE ERRO
function mostrarErro(input, mensagem) {
    console.log('🚨 Erro:', mensagem);
    
    input.classList.add('error');
    
    // Remover erro anterior
    const erroAnterior = input.parentNode.querySelector('.error-message');
    if (erroAnterior) erroAnterior.remove();
    
    // Criar nova mensagem
    const erroDiv = document.createElement('div');
    erroDiv.className = 'error-message';
    erroDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensagem}`;
    erroDiv.style.color = '#dc3545';
    erroDiv.style.fontSize = '0.85rem';
    erroDiv.style.marginTop = '5px';
    
    input.parentNode.appendChild(erroDiv);
    
    // Remover após 3 segundos
    setTimeout(() => {
        input.classList.remove('error');
        erroDiv.remove();
    }, 3000);
}

// Exportar para uso global
window.alunosDB = alunosDB;
window.validarCPF = validarCPF;
window.formatCPF = formatCPF;
window.validateDate = validateDate;
window.buscarAluno = buscarAluno;
window.mostrarErro = mostrarErro;

console.log('✅ Sistema de alunos carregado com', alunosDB.length, 'alunos');
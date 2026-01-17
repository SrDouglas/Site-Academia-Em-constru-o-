// js/auth.js - SISTEMA DE AUTENTICAÇÃO COMPLETO E FUNCIONAL
console.log('🔐 Sistema de autenticação carregado');

// FUNÇÃO PRINCIPAL
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando sistema de login...');
    
    // VERIFICAR SE JÁ ESTÁ LOGADO
    verificarLoginSalvo();
    
    // CONFIGURAR FORMULÁRIO DE LOGIN
    configurarFormularioLogin();
    
    // CONFIGURAR MODAL DE RECUPERAÇÃO
    configurarModalRecuperacao();
    
    console.log('✅ Sistema de autenticação inicializado');
});

// FUNÇÃO: Verificar se já está logado
function verificarLoginSalvo() {
    console.log('🔍 Verificando autenticação salva...');
    
    // Verificar em ambos os storages
    const savedUser = localStorage.getItem('academia_user') || 
                     sessionStorage.getItem('academia_user');
    
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            console.log(`✅ Usuário já autenticado: ${user.nome}`);
            
            // Se está na página de login, redirecionar para dashboard
            if (window.location.pathname.includes('index.html') || 
                window.location.pathname.endsWith('area-aluno/')) {
                console.log('🔄 Redirecionando para dashboard...');
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 500);
            }
        } catch (error) {
            console.error('❌ Erro ao verificar autenticação:', error);
            limparStorage();
        }
    } else {
        console.log('ℹ️ Nenhum usuário autenticado encontrado');
    }
}

// FUNÇÃO: Configurar formulário de login
function configurarFormularioLogin() {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) {
        console.log('ℹ️ Formulário de login não encontrado nesta página');
        return;
    }
    
    console.log('📝 Configurando formulário de login...');
    
    // Configurar formatação do CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            formatarCPF(this);
            limparErro(this);
        });
        
        // Formatar CPF ao carregar se já tiver valor
        if (cpfInput.value) {
            formatarCPF(cpfInput);
        }
    }
    
    // Configurar formatação da data
    const senhaInput = document.getElementById('password');
    if (senhaInput) {
        senhaInput.addEventListener('input', function(e) {
            formatarData(this);
            limparErro(this);
        });
    }
    
    // Configurar submit do formulário
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processarLogin();
    });
    
    console.log('✅ Formulário de login configurado');
}

// FUNÇÃO: Processar login
function processarLogin() {
    console.log('🔄 Processando login...');
    
    const cpfInput = document.getElementById('cpf');
    const senhaInput = document.getElementById('password');
    const rememberCheck = document.getElementById('remember');
    
    if (!cpfInput || !senhaInput) {
        mostrarErroGlobal('Erro: Campos não encontrados');
        return;
    }
    
    const cpf = cpfInput.value;
    const senha = senhaInput.value.replace(/\D/g, ''); // Remove formatação
    const remember = rememberCheck ? rememberCheck.checked : false;
    
    console.log('📊 Dados recebidos:', { 
        cpf: cpf, 
        senha: '••••••••',
        remember: remember 
    });
    
    // VALIDAÇÕES
    const erros = [];
    
    // Validar CPF
    if (!cpf || cpf.replace(/\D/g, '').length === 0) {
        erros.push({ campo: cpfInput, mensagem: 'CPF é obrigatório' });
    } else if (!validarCPF(cpf)) {
        erros.push({ campo: cpfInput, mensagem: 'CPF inválido (11 dígitos)' });
    }
    
    // Validar senha (data)
    if (!senha || senha.length === 0) {
        erros.push({ campo: senhaInput, mensagem: 'Data de nascimento é obrigatória' });
    } else if (senha.length !== 8) {
        erros.push({ campo: senhaInput, mensagem: 'Data deve ter 8 dígitos (DDMMAAAA)' });
    }
    
    // Mostrar erros se houver
    if (erros.length > 0) {
        erros.forEach(erro => mostrarErro(erro.campo, erro.mensagem));
        return;
    }
    
    // DESABILITAR BOTÃO DURANTE PROCESSAMENTO
    const loginBtn = document.querySelector('.btn-login');
    const btnOriginal = loginBtn ? loginBtn.innerHTML : null;
    
    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
    }
    
    // PROCESSAR LOGIN (com delay simulado)
    setTimeout(() => {
        realizarLogin(cpf, senha, remember, loginBtn, btnOriginal);
    }, 800);
}

// FUNÇÃO: Realizar login (busca e autenticação)
function realizarLogin(cpf, senha, remember, loginBtn, btnOriginal) {
    console.log('🔑 Realizando autenticação...');
    
    // Buscar aluno no banco de dados
    const aluno = buscarAluno(cpf, senha);
    
    if (aluno) {
        // LOGIN BEM-SUCEDIDO
        console.log(`🎉 Login bem-sucedido: ${aluno.nome}`);
        loginSucesso(aluno, remember, loginBtn);
    } else {
        // LOGIN FALHOU
        console.log('❌ Login falhou: CPF ou senha incorretos');
        loginFalhou(loginBtn, btnOriginal);
    }
}

// FUNÇÃO: Login bem-sucedido
function loginSucesso(aluno, remember, loginBtn) {
    // Salvar usuário no storage apropriado
    if (remember) {
        localStorage.setItem('academia_user', JSON.stringify(aluno));
        sessionStorage.removeItem('academia_user');
        console.log('💾 Usuário salvo no localStorage (lembrar ativado)');
    } else {
        sessionStorage.setItem('academia_user', JSON.stringify(aluno));
        localStorage.removeItem('academia_user');
        console.log('💾 Usuário salvo no sessionStorage');
    }
    
    // Atualizar interface
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fas fa-check"></i> Login realizado!';
        loginBtn.style.background = '#28a745';
    }
    
    // Mostrar mensagem de sucesso
    mostrarMensagemSucesso(`Bem-vindo(a), ${aluno.nome.split(' ')[0]}!`);
    
    // Redirecionar para dashboard após 1.5 segundos
    console.log('🔄 Redirecionando para dashboard...');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// FUNÇÃO: Login falhou
function loginFalhou(loginBtn, btnOriginal) {
    // Restaurar botão
    if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.innerHTML = btnOriginal;
    }
    
    // Mostrar erro
    const senhaInput = document.getElementById('password');
    if (senhaInput) {
        mostrarErro(senhaInput, 'CPF ou data de nascimento incorretos');
        
        // Animar o campo de senha
        senhaInput.classList.add('shake');
        setTimeout(() => {
            senhaInput.classList.remove('shake');
        }, 300);
        
        // Dar foco no campo de senha
        senhaInput.focus();
        senhaInput.select();
    }
    
    // Mostrar notificação de erro
    mostrarMensagemErro('Credenciais inválidas. Verifique seus dados.');
}

// FUNÇÃO: Configurar modal de recuperação
function configurarModalRecuperacao() {
    const modal = document.getElementById('recoveryModal');
    const closeBtn = document.querySelector('.close-modal');
    const forgotLink = document.querySelector('.forgot-password');
    
    if (forgotLink && modal) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'flex';
            console.log('📞 Modal de recuperação aberto');
        });
    }
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            console.log('📞 Modal de recuperação fechado');
        });
    }
    
    // Fechar modal ao clicar fora
    if (modal) {
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// FUNÇÃO: Formatar CPF (123.456.789-09)
function formatarCPF(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    
    // Formatação progressiva
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    input.value = value;
    return value;
}

// FUNÇÃO: Formatar data (DD/MM/AAAA)
function formatarData(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 8) {
        value = value.substring(0, 8);
    }
    
    // Formatação progressiva
    if (value.length > 4) {
        value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
    } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
    }
    
    input.value = value;
    return value;
}

// FUNÇÃO: Mostrar erro em campo específico
function mostrarErro(input, mensagem) {
    // Remover classes de erro anteriores
    input.classList.remove('error', 'valid');
    input.classList.add('error');
    
    // Remover mensagem de erro anterior
    const erroAnterior = input.parentNode.querySelector('.error-message');
    if (erroAnterior) erroAnterior.remove();
    
    // Criar nova mensagem de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensagem}`;
    errorDiv.style.color = '#dc3545';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    
    input.parentNode.appendChild(errorDiv);
    
    // Remover após 5 segundos
    setTimeout(() => {
        input.classList.remove('error');
        errorDiv.remove();
    }, 5000);
    
    console.log(`❌ Erro: ${mensagem}`);
}

// FUNÇÃO: Limpar erro de campo
function limparErro(input) {
    input.classList.remove('error');
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) errorDiv.remove();
}

// FUNÇÃO: Mostrar erro global (alerta)
function mostrarErroGlobal(mensagem) {
    alert(`Erro: ${mensagem}`);
    console.error(`🚨 Erro global: ${mensagem}`);
}

// FUNÇÃO: Mostrar mensagem de sucesso
function mostrarMensagemSucesso(mensagem) {
    // Criar elemento de mensagem
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = `
        <div class="success-notification" style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        ">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
                <div>
                    <div style="font-weight: 600;">Sucesso!</div>
                    <div style="font-size: 0.9rem;">${mensagem}</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(msgDiv);
    
    // Remover após 3 segundos
    setTimeout(() => {
        msgDiv.remove();
    }, 3000);
    
    // Adicionar animação CSS se não existir
    adicionarAnimacoesCSS();
    
    console.log(`✅ ${mensagem}`);
}

// FUNÇÃO: Mostrar mensagem de erro
function mostrarMensagemErro(mensagem) {
    // Criar elemento de mensagem
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = `
        <div class="error-notification" style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        ">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-circle" style="font-size: 1.2rem;"></i>
                <div>
                    <div style="font-weight: 600;">Erro!</div>
                    <div style="font-size: 0.9rem;">${mensagem}</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(msgDiv);
    
    // Remover após 3 segundos
    setTimeout(() => {
        msgDiv.remove();
    }, 3000);
    
    // Adicionar animação CSS se não existir
    adicionarAnimacoesCSS();
    
    console.log(`❌ ${mensagem}`);
}

// FUNÇÃO: Adicionar animações CSS
function adicionarAnimacoesCSS() {
    // Verificar se já existe
    if (document.getElementById('auth-animations')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'auth-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .fa-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.3s ease;
        }
    `;
    
    document.head.appendChild(style);
}

// FUNÇÃO: Limpar storage
function limparStorage() {
    localStorage.removeItem('academia_user');
    sessionStorage.removeItem('academia_user');
    console.log('🧹 Storage limpo');
}

// FUNÇÃO: Logout (para uso no dashboard)
window.logout = function() {
    if (confirm('Tem certeza que deseja sair da sua conta?')) {
        limparStorage();
        
        // Mostrar mensagem de despedida
        mostrarMensagemSucesso('Logout realizado com sucesso!');
        
        // Redirecionar após 1 segundo
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
};

// FUNÇÃO: Verificar autenticação (para páginas protegidas)
window.verificarAutenticacao = function() {
    const savedUser = localStorage.getItem('academia_user') || 
                     sessionStorage.getItem('academia_user');
    
    if (!savedUser) {
        console.log('🔒 Acesso não autorizado, redirecionando...');
        window.location.href = 'index.html';
        return null;
    }
    
    try {
        return JSON.parse(savedUser);
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        limparStorage();
        window.location.href = 'index.html';
        return null;
    }
};

// FUNÇÃO: Obter usuário atual
window.obterUsuarioAtual = function() {
    const savedUser = localStorage.getItem('academia_user') || 
                     sessionStorage.getItem('academia_user');
    
    if (savedUser) {
        try {
            return JSON.parse(savedUser);
        } catch (error) {
            console.error('Erro ao obter usuário:', error);
            return null;
        }
    }
    
    return null;
};

// INICIALIZAR ANIMAÇÕES
adicionarAnimacoesCSS();

console.log('🎯 Sistema de autenticação pronto para uso');
// SISTEMA DE AUTENTICAÇÃO - VERSÃO SIMPLIFICADA
console.log('🔐 Sistema de autenticação carregado');

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('Inicializando sistema de autenticação...');
        
        // Verificar login salvo
        const savedUser = localStorage.getItem('academia_user') || sessionStorage.getItem('academia_user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                console.log('Usuário recuperado:', this.currentUser.nome);
                this.redirectIfLoggedIn();
            } catch (e) {
                console.error('Erro ao recuperar usuário:', e);
                this.clearStorage();
            }
        }

        this.setupLoginForm();
        this.setupModal();
    }

    redirectIfLoggedIn() {
        // Se está na página de login e já logado, redireciona
        if (window.location.pathname.includes('index.html') && this.currentUser) {
            console.log('Já logado, redirecionando para dashboard...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        }
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            console.log('Formulário de login encontrado');
            
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Formulário enviado');
                this.handleLogin();
            });
        } else {
            console.warn('Formulário de login NÃO encontrado!');
        }
    }

    handleLogin() {
        console.log('=== PROCESSANDO LOGIN ===');
        
        const cpfInput = document.getElementById('cpf');
        const passwordInput = document.getElementById('password');
        const rememberCheck = document.getElementById('remember');

        if (!cpfInput || !passwordInput) {
            console.error('Inputs não encontrados!');
            return;
        }

        // Obter valores
        const cpf = cpfInput.value;
        const senha = passwordInput.value;
        
        console.log('Dados inseridos:', { cpf, senha });

        // Validações
        if (!validarCPF(cpf)) {
            mostrarErro(cpfInput, 'CPF inválido. Use 11 dígitos.');
            return;
        }

        if (senha.length !== 8) {
            mostrarErro(passwordInput, 'Data deve ter 8 dígitos (DDMMAAAA)');
            return;
        }

        // Buscar aluno
        const aluno = buscarAluno(cpf, senha);

        if (!aluno) {
            mostrarErro(passwordInput, 'CPF ou data de nascimento incorretos');
            return;
        }

        // LOGIN BEM-SUCEDIDO
        this.loginSuccess(aluno, rememberCheck.checked);
    }

    loginSuccess(aluno, rememberMe) {
        console.log('🎉 Login bem-sucedido!', aluno.nome);
        
        this.currentUser = aluno;
        
        // Salvar no storage
        if (rememberMe) {
            localStorage.setItem('academia_user', JSON.stringify(aluno));
            sessionStorage.removeItem('academia_user');
            console.log('Salvo no localStorage');
        } else {
            sessionStorage.setItem('academia_user', JSON.stringify(aluno));
            localStorage.removeItem('academia_user');
            console.log('Salvo no sessionStorage');
        }

        // Feedback visual
        const loginBtn = document.querySelector('.btn-login');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-check"></i> Login bem-sucedido!';
            loginBtn.style.background = '#28a745';
            loginBtn.disabled = true;
            
            // Redirecionar
            setTimeout(() => {
                console.log('Redirecionando para dashboard...');
                window.location.href = 'dashboard.html';
            }, 1000);
        }
    }

    setupModal() {
        const modal = document.getElementById('recoveryModal');
        const closeBtn = document.querySelector('.close-modal');
        const forgotLink = document.querySelector('.forgot-password');

        if (forgotLink && modal) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Abrindo modal de recuperação');
                modal.style.display = 'flex';
            });
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Fechar modal ao clicar fora
        window.addEventListener('click', (e) => {
            if (modal && e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    logout() {
        console.log('👋 Logout realizado');
        this.currentUser = null;
        this.clearStorage();
        window.location.href = 'index.html';
    }

    clearStorage() {
        localStorage.removeItem('academia_user');
        sessionStorage.removeItem('academia_user');
    }

    isAuthenticated() {
        const userData = localStorage.getItem('academia_user') || sessionStorage.getItem('academia_user');
        
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                return true;
            } catch (e) {
                this.clearStorage();
                return false;
            }
        }
        
        return false;
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
}

// Inicializar e exportar
const auth = new AuthSystem();
window.auth = auth;
window.logout = () => auth.logout();

console.log('✅ AuthSystem pronto para uso');
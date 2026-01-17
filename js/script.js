// Menu Mobile
const menuToggle = document.getElementById('menuToggle');
const navList = document.getElementById('navList');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        menuToggle.innerHTML = navList.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-list a').forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Formulário de Agendamento
const trialForm = document.getElementById('trialForm');

if (trialForm) {
    trialForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Aqui você normalmente enviaria para um backend
        // Por enquanto, vamos simular o envio
        
        // Criar mensagem para WhatsApp
        const nome = this.querySelector('input[type="text"]').value;
        const telefone = this.querySelector('input[type="tel"]').value;
        const modalidade = this.querySelector('select').value;
        
        const mensagem = `Olá! Gostaria de agendar uma aula experimental de ${modalidade}. Meu nome é ${nome}. Telefone: ${telefone}`;
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        // Redirecionar para WhatsApp
        window.open(`https://wa.me/5511999999999?text=${mensagemCodificada}`, '_blank');
        
        // Feedback para o usuário
        alert('Você será redirecionado para o WhatsApp para completar o agendamento!');
        
        // Limpar formulário
        this.reset();
    });
}

// Animação de scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Contador de visitantes (simulado)
window.addEventListener('DOMContentLoaded', () => {
    const visitCount = localStorage.getItem('visitCount') || 0;
    localStorage.setItem('visitCount', parseInt(visitCount) + 1);
    
    // Você pode exibir isso em algum lugar se quiser
    console.log(`Esta página foi visitada ${parseInt(visitCount) + 1} vezes`);
});

// Modalidade cards hover effect
document.querySelectorAll('.modality-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 15px 30px rgba(255, 107, 53, 0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
    });
});
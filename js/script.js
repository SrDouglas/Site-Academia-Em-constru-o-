document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 script.js carregado');

    fetch('http://localhost:3000/treinos')
        .then(res => {
            console.log('Resposta recebida:', res);
            return res.json();
        })
        .then(data => {
            console.log('📦 Dados do backend:', data);
        })
        .catch(err => {
            console.error('❌ Erro no fetch:', err);
        });
});

const form = document.getElementById('loginForm');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  // feedback rápido
  mensagem.style.color = '#6c757d';
  mensagem.textContent = 'Entrando...';

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      // ✅ salva token e usuário
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      mensagem.style.color = 'green';
      mensagem.textContent = 'Login realizado com sucesso!';

      // ✅ redireciona conforme tipo
      setTimeout(() => {
        if (data.usuario.tipo === 'admin') {
          window.location.href = 'admin/admin-bio.html';
        } else {
          window.location.href = 'area-aluno/area-aluno.html';
        }
      }, 600);

    } else {
      mensagem.style.color = 'red';
      mensagem.textContent = data.erro || 'Erro ao fazer login';
    }

  } catch (err) {
    console.error(err);
    mensagem.style.color = 'red';
    mensagem.textContent = 'Erro ao conectar com o servidor';
  }
});

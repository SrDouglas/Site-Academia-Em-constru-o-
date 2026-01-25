(() => {
  const token = localStorage.getItem('token');
  const usuarioStr = localStorage.getItem('usuario');

  if (!token || !usuarioStr) {
    window.location.href = '../login.html';
    return;
  }

  try {
    const usuario = JSON.parse(usuarioStr);
    if (usuario.tipo === 'admin') {
      window.location.href = '../admin/admin-bio.html';
      return;
    }
  } catch {
    window.location.href = '../login.html';
  }
})();

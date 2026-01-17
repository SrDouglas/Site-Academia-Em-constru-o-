const API_BASE = "https://wger.de/api/v2";

async function buscarExercicios(limit = 20) {
  const response = await fetch(`${API_BASE}/exerciseinfo/?limit=${limit}`);

  if (!response.ok) {
    throw new Error("Erro ao acessar a API de exercícios");
  }

  const data = await response.json();
  return data.results;
}

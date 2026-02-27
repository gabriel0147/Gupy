const BASE_URL = "http://localhost:8080/api/production/suggestion";

export async function listProductionSuggestions() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Erro ao buscar sugestão de produção");
  return response.json();
}
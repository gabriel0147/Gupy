const BASE_URL = "http://localhost:8080/api/raw-materials";

export async function listRawMaterials() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Erro ao buscar matérias-primas");
  return response.json();
}

export async function createRawMaterial({ name, quantityInStock }) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, quantityInStock }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      body?.name || body?.quantityInStock || "Erro ao criar matéria-prima";
    throw new Error(message);
  }

  return response.json();
}

export async function deleteRawMaterial(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) {
    throw new Error("Erro ao deletar matéria-prima");
  }
}
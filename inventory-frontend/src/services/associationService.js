const BASE_URL = "http://localhost:8080/api/product-materials";

export async function listAssociations() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Erro ao buscar associações");
  return response.json();
}

export async function createAssociation({ productId, rawMaterialId, quantityRequired }) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, rawMaterialId, quantityRequired }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      body?.message || "Erro ao associar produto e matéria-prima";
    throw new Error(message);
  }

  return response.json();
}

export async function deleteAssociation(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) {
    throw new Error("Erro ao deletar associação");
  }
}
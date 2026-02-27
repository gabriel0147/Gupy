const BASE_URL = "http://localhost:8080/api/products";

export async function listProducts() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Erro ao buscar produtos");
  return response.json();
}

export async function createProduct({ name, price }) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message =
      body?.name || body?.price || "Erro ao criar produto";
    throw new Error(message);
  }

  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok && response.status !== 204) {
    throw new Error("Erro ao deletar produto");
  }
}
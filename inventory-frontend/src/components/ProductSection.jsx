import { useEffect, useState } from "react";
import {
  listProducts,
  createProduct,
  deleteProduct,
} from "../services/productService";
import "../styles/product-section.css";

export function ProductSection() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const numericPrice = parseFloat(price);
    if (!name.trim()) {
      setError("Informe o nome do produto.");
      return;
    }
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError("O preço deve ser maior que zero.");
      return;
    }

    try {
      setSaving(true);
      await createProduct({ name: name.trim(), price: numericPrice });
      setName("");
      setPrice("");
      await loadProducts();
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao salvar produto.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      setError("");
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir produto.");
    }
  };

  return (
    <section className="card">
      <h2>Produtos</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="product-name">Nome</label>
          <input
            id="product-name"
            type="text"
            placeholder="Ex.: Premium Table"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-price">Preço (R$)</label>
          <input
            id="product-price"
            type="number"
            placeholder="Ex.: 1000.00"
            value={price}
            min="0.01"
            step="0.01"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar produto"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <h3 className="card-subtitle">Lista de produtos</h3>

      {loading ? (
        <p className="muted">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <p className="muted">Nenhum produto cadastrado.</p>
      ) : (
        <ul className="item-list">
          {products.map((product) => (
            <li key={product.id} className="item-row">
              <span>
                <strong>{product.name}</strong> – R$ {Number(product.price).toFixed(2)}
              </span>
              <button
                type="button"
                className="btn danger"
                onClick={() => handleDelete(product.id)}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
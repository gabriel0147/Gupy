import { useEffect, useState } from "react";
import { listProducts } from "../services/productService";
import { listRawMaterials } from "../services/rawMaterialService";
import {
  listAssociations,
  createAssociation,
  deleteAssociation,
} from "../services/associationService";
import "../styles/product-section.css";

export function AssociationSection() {
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [associations, setAssociations] = useState([]);

  const [productId, setProductId] = useState("");
  const [rawMaterialId, setRawMaterialId] = useState("");
  const [quantityRequired, setQuantityRequired] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadAll = async () => {
    try {
      setLoading(true);
      setError("");
      const [prodData, rawData, assocData] = await Promise.all([
        listProducts(),
        listRawMaterials(),
        listAssociations(),
      ]);
      setProducts(prodData);
      setRawMaterials(rawData);
      setAssociations(assocData);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar dados de associação.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const qty = parseFloat(quantityRequired);
    if (!productId || !rawMaterialId) {
      setError("Selecione produto e matéria-prima.");
      return;
    }
    if (Number.isNaN(qty) || qty <= 0) {
      setError("Quantidade necessária deve ser maior que zero.");
      return;
    }

    try {
      setSaving(true);
      await createAssociation({
        productId: Number(productId),
        rawMaterialId: Number(rawMaterialId),
        quantityRequired: qty,
      });
      setQuantityRequired("");
      await loadAll();
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao salvar associação.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remover essa associação?")) return;
    try {
      setError("");
      await deleteAssociation(id);
      await loadAll();
    } catch (err) {
      console.error(err);
      setError("Erro ao remover associação.");
    }
  };

  const getProductName = (id) =>
    products.find((p) => p.id === id)?.name || `Produto #${id}`;

  const getRawName = (id) =>
    rawMaterials.find((r) => r.id === id)?.name || `Matéria-prima #${id}`;

  return (
    <section className="card">
      <h2>Associação produto × matéria-prima</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="assoc-product">Produto</label>
          <select
            id="assoc-product"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Selecione...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="assoc-raw">Matéria-prima</label>
          <select
            id="assoc-raw"
            value={rawMaterialId}
            onChange={(e) => setRawMaterialId(e.target.value)}
          >
            <option value="">Selecione...</option>
            {rawMaterials.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="assoc-qty">Qtd. necessária por 1 produto</label>
          <input
            id="assoc-qty"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Ex.: 10"
            value={quantityRequired}
            onChange={(e) => setQuantityRequired(e.target.value)}
          />
        </div>

        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? "Associando..." : "Associar"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <h3 className="card-subtitle">Associações cadastradas</h3>

      {loading ? (
        <p className="muted">Carregando associações...</p>
      ) : associations.length === 0 ? (
        <p className="muted">Nenhuma associação cadastrada.</p>
      ) : (
        <ul className="item-list">
          {associations.map((a) => (
            <li key={a.id} className="item-row">
              <span>
                <strong>{getProductName(a.product.id)}</strong> usa{" "}
                <strong>{getRawName(a.rawMaterial.id)}</strong> –{" "}
                {a.quantityRequired} unidade(s)
              </span>
              <button
                type="button"
                className="btn danger"
                onClick={() => handleDelete(a.id)}
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
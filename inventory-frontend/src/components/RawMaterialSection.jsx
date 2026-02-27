import { useEffect, useState } from "react";
import {
  listRawMaterials,
  createRawMaterial,
  deleteRawMaterial,
} from "../services/rawMaterialService";
import "../styles/product-section.css"; 

export function RawMaterialSection() {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadRawMaterials = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listRawMaterials();
      setRawMaterials(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as matérias-primas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRawMaterials();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const numericQty = parseInt(quantity, 10);
    if (!name.trim()) {
      setError("Informe o nome da matéria-prima.");
      return;
    }
    if (Number.isNaN(numericQty) || numericQty < 0) {
      setError("A quantidade deve ser zero ou positiva.");
      return;
    }

    try {
      setSaving(true);
      await createRawMaterial({
        name: name.trim(),
        quantityInStock: numericQty,
      });
      setName("");
      setQuantity("");
      await loadRawMaterials();
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro ao salvar matéria-prima.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta matéria-prima?"))
      return;

    try {
      setError("");
      await deleteRawMaterial(id);
      await loadRawMaterials();
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir matéria-prima.");
    }
  };

  return (
    <section className="card">
      <h2>Matérias-primas</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="raw-name">Nome</label>
          <input
            id="raw-name"
            type="text"
            placeholder="Ex.: Wood"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="raw-qty">Quantidade em estoque</label>
          <input
            id="raw-qty"
            type="number"
            placeholder="Ex.: 100"
            min="0"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar matéria-prima"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <h3 className="card-subtitle">Lista de matérias-primas</h3>

      {loading ? (
        <p className="muted">Carregando matérias-primas...</p>
      ) : rawMaterials.length === 0 ? (
        <p className="muted">Nenhuma matéria-prima cadastrada.</p>
      ) : (
        <ul className="item-list">
          {rawMaterials.map((rm) => (
            <li key={rm.id} className="item-row">
              <span>
                <strong>{rm.name}</strong> – estoque: {rm.quantityInStock}
              </span>
              <button
                type="button"
                className="btn danger"
                onClick={() => handleDelete(rm.id)}
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
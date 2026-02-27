import { useEffect, useState } from "react";
import { listProductionSuggestions } from "../services/productionService";
import "../styles/product-section.css";

export function SuggestionSection() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await listProductionSuggestions();
      setSuggestions(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar sugestão de produção.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  return (
    <section className="card">
      <div className="card-header-row">
        <h2>Sugestão de produção</h2>
        <button className="btn secondary" onClick={loadSuggestions}>
          Atualizar
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="muted">Calculando sugestão de produção...</p>
      ) : suggestions.length === 0 ? (
        <p className="muted">Nenhuma sugestão disponível.</p>
      ) : (
        <ul className="item-list">
          {suggestions.map((s) => (
            <li key={s.productId} className="item-row">
              <div className="suggestion-main">
                <strong>{s.productName}</strong>
                <span>Preço unitário: R$ {Number(s.unitPrice).toFixed(2)}</span>
              </div>
              <div className="suggestion-detail">
                <span>
                  Máx. quantidade:{" "}
                  <strong>{s.maxQuantityToProduce}</strong>
                </span>
                <span>
                  Valor total:{" "}
                  <strong>R$ {Number(s.totalValue).toFixed(2)}</strong>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
import "./App.css";

import { ProductSection } from "./components/ProductSection";
import { RawMaterialSection } from "./components/RawMaterialSection";
import { AssociationSection } from "./components/AssociationSection";
import { SuggestionSection } from "./components/SuggestionSection";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Inventory System</h1>
        <p>Controle de produtos, matérias-primas e produção sugerida.</p>
      </header>

      <main className="app-main">
        <ProductSection />
        <RawMaterialSection />
        <AssociationSection />
        <SuggestionSection />
      </main>

      <footer className="app-footer">
        <span>Desenvolvido para o teste prático de controle de estoque.</span>
      </footer>
    </div>
  );
}

export default App;
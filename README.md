# Inventory System – Teste prático

Sistema web para controle de estoque de uma indústria que produz diferentes produtos a partir de matérias-primas.

O objetivo é:

- Cadastrar **produtos** (nome, valor).
- Cadastrar **matérias-primas** (nome, quantidade em estoque).
- Associar **produtos × matérias-primas**, definindo quanto de cada insumo é necessário para produzir 1 unidade do produto.
- Calcular **quais produtos**, e **em que quantidade**, podem ser produzidos com o estoque atual, priorizando os produtos de maior valor total possível.

---

## Tecnologias utilizadas

### Backend (API)

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Bean Validation (Jakarta Validation)
- PostgreSQL
- Maven

### Frontend

- React (Vite)
- JavaScript (ESNext)
- Fetch API
- CSS puro (layout responsivo)

---

## Arquitetura da solução

### Backend

Projeto organizado em camadas:

- `entity` – mapeamento JPA das entidades:
  - `Product` – produto (id, name, price)
  - `RawMaterial` – matéria-prima (id, name, quantityInStock)
  - `ProductRawMaterial` – relação N:N entre produto e matéria-prima, com o campo `quantityRequired`

- `repository` – interfaces `JpaRepository` para cada entidade.

- `service` – regras de negócio, por exemplo:
  - validações adicionais
  - cálculo da produção máxima possível com base no estoque
  - prioridade de produção pelos produtos de maior valor

- `controller` – endpoints REST:
  - `ProductController`
  - `RawMaterialController`
  - `ProductRawMaterialController`
  - `ProductionController` (sugestão de produção)

- `dto` – objetos de transferência para evitar expor diretamente o modelo:
  - `ProductProductionDTO` (produto + quantidade máxima + valor total)

Validação de dados feita com **Bean Validation**, exemplo:

- `@NotBlank` para nome
- `@DecimalMin("0.01")` para preço
- `@Min(0)` para estoque

Quando há erro de validação, a API retorna `400 Bad Request` com mensagens amigáveis em JSON.

### Frontend

Aplicação React simples, com uma única página que organiza a interface em blocos:

1. **Produtos**
   - Formulário para criação de produtos
   - Lista com todos os produtos e botão de excluir

2. **Matérias-primas**
   - Formulário para criação de matérias-primas
   - Lista com estoque atual e botão de excluir

3. **Associação produto × matéria-prima**
   - Combos para escolher um produto e uma matéria-prima
   - Campo para informar a quantidade necessária daquele insumo
   - Lista com todas as associações existentes

4. **Sugestão de produção**
   - Botão “Recalcular”
   - Tabela com:
     - Produto
     - Preço unitário
     - Quantidade máxima possível
     - Valor total a ser obtido  

Layout responsivo, com cards e tabela centralizada.

---

## Como executar o projeto

### 1. Pré-requisitos

- Java 17+
- Maven
- Node.js + npm
- PostgreSQL

### 2. Configurar o banco de dados

No PostgreSQL, criar o banco:

```sql
CREATE DATABASE inventorydb;

spring.datasource.url=jdbc:postgresql://localhost:5432/inventorydb
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true 
```

### 3. Executar Backend

**Executar Backend**

```bash
./mvnw spring-boot:run
```

Backend será iniciado em:

http://localhost:8080

Por padrão, a API estará disponível em:

http://localhost:8080/api


### 4. Executar Frontend

Acesse a pasta do frontend:

```bash
cd inventory-frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend será iniciado normalmente em:

http://localhost:5173

Certifique-se de que o backend esteja rodando antes de utilizar a aplicação.

### Estratégia de Cálculo da Produção

Para cada produto:

1. O sistema identifica todas as matérias-primas associadas.

2. Para cada insumo, calcula:

- estoque disponível / quantidade necessária por unidade


3. O menor valor encontrado determina o número máximo de unidades que podem ser produzidas.

4. Em seguida, calcula o valor total:
- quantidade máxima × preço unitário

5. Os produtos são ordenados pelo maior valor total possível.
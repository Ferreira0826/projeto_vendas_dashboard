# 📊 Dashboard de Vendas — Pipeline de Dados

Projeto completo de Engenharia de Dados com ETL, API REST e Dashboard interativo.

---

## 🚀 Tecnologias

- Python (ETL)
- Django + Django REST Framework (API)
- SQLite (banco de dados)
- React + Vite (frontend)
- Recharts (visualização)

---

## 🔄 Arquitetura

ETL → Banco → API → Frontend

---

## 📊 Funcionalidades

- KPIs de vendas (receita, ticket médio, crescimento)
- Forecast de receita
- Ranking de vendedores
- Análise por categoria e canal
- Filtros dinâmicos

---

## ⚙️ Como rodar o projeto

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver

cd frontend
npm install
npm run dev

---

## ⚙️ 2. Gerar requirements.txt

Dentro de `backend`:

```bash
pip freeze > requirements.txt
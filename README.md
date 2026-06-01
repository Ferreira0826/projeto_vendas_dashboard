# TechNova — Dashboard Executivo de Vendas

> Projeto full stack de portfólio desenvolvido para demonstrar integração entre backend Django, API REST e frontend React com visualização de dados em tempo real.

🔗 **Demo ao vivo:** [projeto-vendas-dashboard.vercel.app](https://projeto-vendas-dashboard.vercel.app)  
🔗 **API:** [projeto-vendas-dashboard.onrender.com/api/vendas](https://projeto-vendas-dashboard.onrender.com/api/vendas/)

---

## Sobre o projeto

O TechNova é um dashboard executivo de vendas que consome dados de uma API REST Django e os apresenta de forma visual e interativa. O painel permite filtrar por período, categoria, vendedor e canal de vendas, com atualização dinâmica de todos os indicadores e gráficos.

O projeto foi desenvolvido do zero como exercício prático de stack full stack moderna, cobrindo desde a modelagem de banco de dados até o deploy em produção.

---

## Stack

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS v4
- TanStack Router
- Recharts
- Radix UI / shadcn/ui
- Deploy: Vercel

### Backend
- Python / Django 6
- Django REST Framework
- SQLite (produção via Render)
- Deploy: Render

---

## Funcionalidades

- KPIs em tempo real: receita total, pedidos, ticket médio, crescimento mensal
- Filtros combinados por período, categoria, vendedor e canal
- Gráfico de área com evolução de receita + forecast do próximo mês
- Gráfico de barras com receita por categoria
- Gráfico de pizza com distribuição por canal (Online vs Loja Física)
- Comparativo mensal de Meta vs Realizado com destaque visual
- Ranking de vendedores com barra de progresso
- Top 5 produtos por receita e produtos de menor desempenho
- Estoque por produto (top 10)
- Insights automáticos: melhor vendedor, produto campeão, categoria líder
- Alertas de metas não atingidas

---

## Estrutura do projeto

```
projeto_vendas-dashboard/
├── backend/
│   ├── config/          # Settings, URLs, WSGI
│   ├── sales/           # Model, Serializer, Views, URLs
│   ├── manage.py
│   ├── vendas.json      # Fixture com dados de exemplo
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── hooks/       # useSalesData (fetch com fallback local)
│   │   ├── lib/         # sales-data.ts, utils.ts
│   │   ├── routes/      # index.tsx (dashboard principal)
│   │   ├── components/  # UI components (shadcn/ui)
│   │   └── styles.css   # Design system com variáveis CSS
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## Como rodar localmente

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

pip install -r requirements.txt

python manage.py migrate
python manage.py loaddata vendas.json
python manage.py runserver
```

API disponível em: `http://localhost:8000/api/vendas/`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard disponível em: `http://localhost:5173`

Crie um arquivo `.env` na pasta `frontend/` com:

```
VITE_API_URL=http://localhost:8000
```

---

## Variáveis de ambiente

### Frontend (Vercel)
| Variável | Valor |
|---|---|
| `VITE_API_URL` | URL do backend no Render |

### Backend (Render)
| Variável | Valor |
|---|---|
| `SECRET_KEY` | Chave secreta do Django |
| `DEBUG` | `False` |

---

## Deploy

O frontend é deployado automaticamente na Vercel a cada push na branch `main` (Root Directory configurado como `frontend`).

O backend roda no Render com o seguinte Start Command:

```bash
python manage.py migrate && python manage.py loaddata vendas.json && gunicorn config.wsgi:application
```

---

## Dados de exemplo

O projeto inclui um dataset fictício com registros de vendas cobrindo múltiplos meses, categorias (Smartphone, Notebook, Tablet, Monitor, Acessórios, Componentes, Smartwatch), vendedores e canais (Online e Loja Física).

Os dados locais em `frontend/src/lib/sales-data.ts` são carregados imediatamente como fallback, enquanto a API é consultada em background.

---

## Autor

**Gabriel Ferreira**  
Analista de Dados | Power BI | SQL | Python | Engenharia de Dados  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Perfil-blue?logo=linkedin)](https://www.linkedin.com/in/gabriel-ferreira-davila-78565323a/)
[![GitHub](https://img.shields.io/badge/GitHub-Ferreira0826-black?logo=github)](https://github.com/Ferreira0826)

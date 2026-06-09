# TechNova — Dashboard Executivo de Vendas

> Plataforma full stack de análise de vendas com **pipeline de dados automatizado**, API REST documentada e dashboard executivo interativo. Projeto de portfólio com foco em **engenharia e análise de dados**.

🔗 **Dashboard:** [projeto-vendas-dashboard.vercel.app](https://projeto-vendas-dashboard.vercel.app)
🔗 **API:** [projeto-vendas-dashboard.onrender.com/api/vendas/](https://projeto-vendas-dashboard.onrender.com/api/vendas/)
🔗 **Documentação da API (Swagger):** [/api/docs/](https://projeto-vendas-dashboard.onrender.com/api/docs/)

---

## Visão geral

O TechNova simula o ambiente de dados de uma empresa de varejo de tecnologia. O projeto cobre o ciclo completo de dados: **ingestão de fonte externa, armazenamento em banco gerenciado, exposição via API documentada e visualização em dashboard executivo**.

O diferencial não é apenas exibir dados, mas demonstrar como eles se movem de ponta a ponta, de forma automatizada e auditável.

---

## Arquitetura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Fonte externa  │     │  GitHub Actions  │     │   PostgreSQL    │
│  (AwesomeAPI)   │────▶│  Pipeline diário │────▶│   (Supabase)    │
│  Cotação USD    │     │  (cron agendado) │     │                 │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                        ┌──────────────────┐              │
                        │   Django + DRF   │◀─────────────┘
                        │   API REST       │
                        │   (Render)       │
                        └────────┬─────────┘
                                 │
                        ┌────────▼─────────┐
                        │  React Dashboard │
                        │  (Vercel)        │
                        └──────────────────┘
```

---

## Destaques de engenharia de dados

### Pipeline de ingestão automatizado
Um script de ingestão (Django management command) busca dados de uma API externa, trata e grava no banco. É executado automaticamente todo dia útil via **GitHub Actions** (cron agendado), com histórico de execuções auditável no repositório.

Características implementadas:
- **Idempotência** — o uso de `update_or_create` garante que reexecuções não duplicam registros
- **Tratamento de falhas** — timeouts e erros de rede são tratados sem corromper o banco
- **Rastreabilidade** — cada registro guarda o timestamp de quando foi importado
- **Parametrização** — janela de ingestão configurável via argumento de linha de comando

### Banco de dados gerenciado
Migração de SQLite para **PostgreSQL gerenciado (Supabase)**, refletindo um ambiente de produção real. Ambientes local e de produção compartilham a mesma fonte de dados via connection pooling.

### API documentada
API REST construída com Django REST Framework, com **documentação OpenAPI/Swagger** gerada automaticamente (drf-spectacular). Endpoints com schema completo e interface interativa.

---

## Stack

**Backend / Dados**
- Python, Django, Django REST Framework
- PostgreSQL (Supabase)
- drf-spectacular (OpenAPI / Swagger)
- GitHub Actions (orquestração do pipeline)
- Deploy: Render

**Frontend**
- React, Vite, TypeScript
- Tailwind CSS, Recharts
- Deploy: Vercel

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/vendas/` | Lista de vendas (CRUD completo) |
| GET | `/api/kpis/` | KPIs agregados (receita, pedidos, ticket médio) |
| GET | `/api/cotacao/` | Histórico de cotação do dólar (alimentado pelo pipeline) |
| GET | `/api/docs/` | Documentação interativa (Swagger) |
| GET | `/api/schema/` | Schema OpenAPI |

---

## Funcionalidades do dashboard

- KPIs de receita, pedidos, ticket médio e crescimento mensal
- Evolução de vendas com forecast do próximo mês
- Receita por categoria e por canal (Online vs Loja Física)
- Comparativo de Meta vs Realizado
- Ranking de vendedores e análise de produtos
- Filtros combinados por período, categoria, vendedor e canal

---

## Decisões técnicas

**Por que Supabase em vez de SQLite?**
SQLite não reflete um ambiente de produção. O PostgreSQL gerenciado do Supabase oferece um banco real, persistente, com painel de administração e connection pooling — mais próximo do que se encontra no mercado.

**Por que GitHub Actions em vez de um cron pago?**
O GitHub Actions, além de ser gratuito, mantém o histórico de execuções versionado junto ao código. A automação fica transparente e auditável.

**Por que separar o pipeline da API?**
O pipeline de ingestão é desacoplado da camada de exposição (API). Isso segue o princípio de responsabilidade única: a ingestão pode evoluir, falhar ou ser reexecutada sem afetar a disponibilidade da API.

---

## Como rodar localmente

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# .env com DATABASE_URL (Supabase) e SECRET_KEY
python manage.py migrate
python manage.py runserver
```

### Pipeline de ingestão (manual)
```bash
python manage.py importar_cotacao --dias 30
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Autor

**Gabriel Ferreira**
Análise e Engenharia de Dados | Power BI · SQL · Python · Django

[LinkedIn](https://www.linkedin.com/in/gabriel-ferreira-davila-78565323a/) · [GitHub](https://github.com/Ferreira0826)
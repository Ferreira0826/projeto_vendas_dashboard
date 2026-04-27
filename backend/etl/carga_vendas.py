import os
import sys
import django
import random
import pandas as pd
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from sales.models import Venda


produtos = [
    ("SKU001", "Smartphone Galaxy S23", "Smartphone", 4500),
    ("SKU002", "iPhone 14", "Smartphone", 6000),
    ("SKU003", "Notebook Dell Inspiron", "Notebook", 5200),
    ("SKU004", "MacBook Air M2", "Notebook", 9500),
    ("SKU005", "Tablet Samsung S8", "Tablet", 3200),
    ("SKU006", "iPad 10ª Geração", "Tablet", 4000),
    ("SKU007", "Fone Bluetooth JBL", "Acessorios", 500),
    ("SKU008", "Mouse Logitech MX", "Acessorios", 350),
    ("SKU009", "Teclado Mecânico Redragon", "Acessorios", 450),
    ("SKU010", 'Monitor LG 27"', "Monitor", 1800),
    ("SKU011", 'Monitor Samsung 24"', "Monitor", 1200),
    ("SKU012", "Smartwatch Apple Watch", "Smartwatch", 3500),
    ("SKU013", "Smartwatch Samsung", "Smartwatch", 2200),
    ("SKU014", "SSD 1TB Kingston", "Componentes", 600),
    ("SKU015", "Memória RAM 16GB", "Componentes", 400),
    ("SKU016", "Placa de Vídeo RTX 4060", "Componentes", 3200),
    ("SKU017", "Placa de Vídeo RTX 4070", "Componentes", 4500),
    ("SKU018", "Notebook Acer Aspire", "Notebook", 3800),
    ("SKU019", "Notebook Lenovo IdeaPad", "Notebook", 4200),
    ("SKU020", "Smartphone Xiaomi 13", "Smartphone", 3500),
]

vendedores = ["Carlos", "Ana", "Bruno", "Mariana", "João", "Fernanda"]
canais = ["Online", "Fisico"]

data_inicio = datetime(2025, 1, 1)
data_fim = datetime(2026, 12, 31)

registros = []

for i in range(800):
    sku, produto, categoria, preco = random.choice(produtos)
    data_venda = data_inicio + timedelta(days=random.randint(0, (data_fim - data_inicio).days))
    vendas = random.randint(5, 150)
    estoque = random.randint(10, 400)
    receita = preco * vendas

    registros.append({
        "sku": sku,
        "produto": produto,
        "categoria": categoria,
        "preco": preco,
        "estoque": estoque,
        "vendas": vendas,
        "receita": receita,
        "vendedor": random.choice(vendedores),
        "canal": random.choice(canais),
        "data": data_venda.date()
    })

df = pd.DataFrame(registros)

Venda.objects.all().delete()

for _, row in df.iterrows():
    Venda.objects.create(
        sku=row["sku"],
        produto=row["produto"],
        categoria=row["categoria"],
        preco=row["preco"],
        estoque=row["estoque"],
        vendas=row["vendas"],
        receita=row["receita"],
        vendedor=row["vendedor"],
        canal=row["canal"],
        data=row["data"]
    )

print(f"{len(df)} registros inseridos com sucesso!")
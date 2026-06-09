"""
Pipeline de ingestão de cotação do dólar (USD/BRL).

Fonte: AwesomeAPI (https://docs.awesomeapi.com.br/api-de-moedas)
Uso:
    python manage.py importar_cotacao            # últimos 30 dias
    python manage.py importar_cotacao --dias 90  # últimos 90 dias
"""
from datetime import datetime
from decimal import Decimal

import requests
from django.core.management.base import BaseCommand

from sales.models import CotacaoDolar

API_URL = "https://economia.awesomeapi.com.br/json/daily/USD-BRL/{dias}"


class Command(BaseCommand):
    help = "Importa a cotação diária do dólar (USD/BRL) da AwesomeAPI para o banco."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dias",
            type=int,
            default=30,
            help="Quantidade de dias de histórico a importar (padrão: 30).",
        )

    def handle(self, *args, **options):
        dias = options["dias"]
        url = API_URL.format(dias=dias)

        self.stdout.write(f"Buscando cotação dos últimos {dias} dias...")

        try:
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
            dados = resp.json()
        except requests.RequestException as e:
            self.stderr.write(self.style.ERROR(f"Falha ao acessar a API: {e}"))
            return

        if not isinstance(dados, list) or not dados:
            self.stderr.write(self.style.ERROR("API não retornou dados válidos."))
            return

        criados = 0
        atualizados = 0

        for item in dados:
            # timestamp em segundos (UTC) → data
            ts = int(item["timestamp"])
            data = datetime.fromtimestamp(ts).date()

            fechamento = Decimal(item["bid"])
            abertura = Decimal(item.get("open") or item["bid"])
            maxima = Decimal(item["high"])
            minima = Decimal(item["low"])
            variacao = Decimal(item.get("pctChange") or 0)

            obj, created = CotacaoDolar.objects.update_or_create(
                data=data,
                defaults={
                    "abertura": abertura,
                    "fechamento": fechamento,
                    "maxima": maxima,
                    "minima": minima,
                    "variacao_pct": variacao,
                },
            )
            if created:
                criados += 1
            else:
                atualizados += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Pipeline concluído: {criados} cotações novas, {atualizados} atualizadas."
            )
        )
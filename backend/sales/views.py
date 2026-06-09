from rest_framework import viewsets
from .models import Venda
from .serializers import VendaSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg
from drf_spectacular.utils import extend_schema, OpenApiResponse, inline_serializer
from rest_framework import serializers
from .serializers import VendaSerializer, CotacaoDolarSerializer
from .models import Venda, CotacaoDolar

@extend_schema(
    responses=inline_serializer(
        name="KpisResponse",
        fields={
            "receita_total": serializers.FloatField(),
            "total_pedidos": serializers.IntegerField(),
            "produtos_vendidos": serializers.IntegerField(),
            "ticket_medio": serializers.FloatField(),
        },
    ),
    description="Retorna os KPIs agregados de vendas: receita total, total de pedidos, produtos vendidos e ticket médio.",
)
@api_view(["GET"])
def kpis(request):
    vendas = Venda.objects.all()

    receita_total = vendas.aggregate(total=Sum("receita"))["total"] or 0
    total_pedidos = vendas.count()
    produtos_vendidos = vendas.aggregate(total=Sum("vendas"))["total"] or 0
    ticket_medio = receita_total / total_pedidos if total_pedidos else 0

    return Response({
    "receita_total": float(receita_total),
    "total_pedidos": total_pedidos,
    "produtos_vendidos": produtos_vendidos,
    "ticket_medio": float(ticket_medio),
})

class VendaViewSet(viewsets.ModelViewSet):
    queryset = Venda.objects.all()
    serializer_class = VendaSerializer

class CotacaoDolarViewSet(viewsets.ReadOnlyModelViewSet):
    """Cotações diárias do dólar (USD/BRL) importadas via pipeline."""
    queryset = CotacaoDolar.objects.all()
    serializer_class = CotacaoDolarSerializer
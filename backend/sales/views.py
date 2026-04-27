from rest_framework import viewsets
from .models import Venda
from .serializers import VendaSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg

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

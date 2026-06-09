from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendaViewSet, CotacaoDolarViewSet, kpis

router = DefaultRouter()
router.register(r'vendas', VendaViewSet)
router.register(r'cotacao', CotacaoDolarViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('kpis/', kpis),
]
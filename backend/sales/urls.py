from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendaViewSet, kpis

router = DefaultRouter()
router.register(r'vendas', VendaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('kpis/', kpis),
]
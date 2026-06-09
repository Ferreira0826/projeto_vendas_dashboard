from rest_framework import serializers
from .models import Venda
from .models import Venda, CotacaoDolar

class VendaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venda
        fields = '__all__'

class CotacaoDolarSerializer(serializers.ModelSerializer):
    class Meta:
        model = CotacaoDolar
        fields = '__all__'
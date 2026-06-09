from django.db import models

class Venda(models.Model):
    sku = models.CharField(max_length=20)
    produto = models.CharField(max_length=150)
    categoria = models.CharField(max_length=100)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    estoque = models.IntegerField()
    vendas = models.IntegerField()
    receita = models.DecimalField(max_digits=12, decimal_places=2)
    vendedor = models.CharField(max_length=100)
    canal = models.CharField(max_length=20)
    data = models.DateField()

class CotacaoDolar(models.Model):
    """Cotação diária do dólar (USD/BRL) importada da AwesomeAPI."""
    data = models.DateField(unique=True)
    abertura = models.DecimalField(max_digits=10, decimal_places=4)
    fechamento = models.DecimalField(max_digits=10, decimal_places=4)
    maxima = models.DecimalField(max_digits=10, decimal_places=4)
    minima = models.DecimalField(max_digits=10, decimal_places=4)
    variacao_pct = models.DecimalField(max_digits=8, decimal_places=4, default=0)
    importado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-data"]
        verbose_name = "Cotação do Dólar"
        verbose_name_plural = "Cotações do Dólar"

    def __str__(self):
        return f"USD/BRL {self.data} - R$ {self.fechamento}"
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

    def __str__(self):
        return f"{self.sku} - {self.produto}"
from django.db import models

# Client model
class Client(models.Model):
    name = models.CharField(max_length=120)

    def _str_(self):
        return self.name

# Product model
class Product(models.Model):
    name = models.CharField(max_length=120)
    price = models.FloatField()
    stock_amount = models.IntegerField()

    def _str_(self):
        return self.name

# Order model
class Order(models.Model):
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, blank=True, null=True)
    products = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True)
    amount = models.IntegerField()

    def _str_(self):
        return self.id
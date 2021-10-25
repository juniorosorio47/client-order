from django.contrib.auth import get_user_model
from django.db import models
from .client_model import Client
from .product_model import Product

User = get_user_model()

# Order model
class Order(models.Model):

    client = models.ForeignKey(Client, on_delete=models.SET_NULL, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    products = models.ManyToManyField(Product, through='OrderProduct')
    total = models.DecimalField(default=0.00, decimal_places=2, max_digits=20)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Order {self.id}'

    def getClientName(self):
        return self.client.name
        
    # def get_total_cost(self):
    #     return sum(item.get_cost() for item in self.items.all())


# OrderProduct model
class OrderProduct(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price = models.DecimalField(default=0.00, decimal_places=2, max_digits=20)
    quantity = models.IntegerField(default=1)

    class Meta:
        unique_together = ('order', 'product')

    def get_cost(self):
        return self.price * self.quantity
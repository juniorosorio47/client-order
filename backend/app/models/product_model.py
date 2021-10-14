from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

# Product model
class Product(models.Model):
    name = models.CharField(max_length=120)
    price = models.DecimalField(default=0.00, decimal_places=2, max_digits=20)
    stock_amount = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)


    def _str_(self):
        return self.name
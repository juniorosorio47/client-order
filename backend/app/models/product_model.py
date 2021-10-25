from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()

# Product model
class Product(models.Model):
    name = models.CharField(max_length=120, unique=True)
    price = models.DecimalField(default=0.00, decimal_places=2, max_digits=20)
    inventory = models.IntegerField(default=0)
    multiple = models.IntegerField(default=1, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)

    def _str_(self):
        return self.name

    # Check if the product has inventory
    def has_inventory(self, quantity):
        if quantity > self.inventory:
            return False
        else:
            return True

    def decrease_inventory(self, quantity):
        self.inventory -= quantity
    
    def increase_inventory(self, quantity):
        self.inventory += quantity

    def check_multiple(self, quantity):
        if self.multiple:
            return quantity%self.multiple==0
        else:
            return None

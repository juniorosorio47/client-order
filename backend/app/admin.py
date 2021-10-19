from django.contrib import admin
from .models import Client, Product, Order


class ClientAdmin(admin.ModelAdmin):
    list_display = ('name','id' )


class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'inventory')


class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'client', 'user']


admin.site.register(Client, ClientAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
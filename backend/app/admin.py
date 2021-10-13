from django.contrib import admin
from .models import Client, Product, Order


class ClientAdmin(admin.ModelAdmin):
    list_display = ('name','id' )


class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'stock_amount')


class OrderAdmin(admin.ModelAdmin):
    filter_horizontal = ('products',)
    list_display = ('id', 'client', 'get_products', 'amount')

    def get_products(self, obj):
        return ", ".join([str(p) for p in obj.products.all()])


admin.site.register(Client, ClientAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
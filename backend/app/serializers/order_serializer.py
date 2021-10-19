from rest_framework import serializers
from ..models import Order
from .product_serializer import ProductSerializer



class OrderSerializer(serializers.ModelSerializer):
    products = ProductSerializer(read_only=True, many=True)

    class Meta:
        model = Order
        fields = ('id', 'client', 'user', 'products', 'total', 'timestamp' )
        

# class OrderProductSerializer(serializers.ModelSerializer):
#     order = OrderSerializer(read_only=True, many=True)
#     product = ProductSerializer(read_only=True, many=True)

    # class Meta:
    #     model = OrderProduct
    #     fields = ('id', 'order', 'product', '', 'timestamp' )
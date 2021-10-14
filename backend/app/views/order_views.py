from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from requests.exceptions import HTTPError
from ..serializers import OrderSerializer
from ..models import Order, OrderProduct, Product



# Get all orders and create new orders
@api_view(['GET', 'POST'])
def orders_list(request):

    if request.method == 'GET':
        data = Order.objects.all()

        serializer = OrderSerializer(data, context={'request': request}, many=True)


        return Response(serializer.data)

    elif request.method == 'POST':

        products = request.data.get('products')
        print(products)
        serializer = OrderSerializer(data=request.data)


        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def order_detail(request, pk):
    
    order = get_object_or_404(Order, pk=pk)

    if request.method == 'GET':
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = OrderSerializer(order, data=request.data,context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        order.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)

def close_order(request, pk):
    order = get_object_or_404(Order, pk=pk)



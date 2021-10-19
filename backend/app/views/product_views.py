from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from requests.exceptions import HTTPError
from ..serializers import ProductSerializer
from ..models import Product


# Get all products and create new products
# @login_required
@api_view(['GET', 'POST'])
def products_list(request):
    user = request.user

    if request.method == 'GET':
        data = Product.objects.all()

        serializer = ProductSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        product_request = request.data

        product_request['user'] = user.id

        serializer = ProductSerializer(data=product_request)
        if serializer.is_valid():
            product = serializer.save()
            
            response = {
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'inventory': product.inventory,
                'user': product.user.username,
            }
            return Response(response, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @login_required
@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, pk):
    
    product = get_object_or_404(Product, pk=pk)
    
    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = ProductSerializer(product, data=request.data,context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
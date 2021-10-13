from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from requests.exceptions import HTTPError
from ..serializers import OrderSerializer
from ..models import Order


# Get all orders and create new orders
@api_view(['GET', 'POST'])
def orders_list(request):

    if request.method == 'GET':
        data = Order.objects.all()

        serializer = OrderSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def order_delete(request, pk):
    try:
        order = Order.objects.get(pk=pk)
    except Order.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # if request.method == 'GET':
    #     serializer = EncoderSerializer(encoder)
    #     return Response(serializer.data)

    # if request.method == 'PUT':
    #     serializer = EncoderSerializer(encoder, data=request.data,context={'request': request})
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(status=status.HTTP_204_NO_CONTENT)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # elif request.method == 'DELETE':
    order.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
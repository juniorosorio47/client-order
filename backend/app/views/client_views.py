from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from requests.exceptions import HTTPError
from ..serializers import ClientSerializer
from ..models import Client


# Get all clients and create new clients
@api_view(['GET', 'POST'])
def clients_list(request):

    if request.method == 'GET':
        data = Client.objects.all()

        serializer = ClientSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        
        serializer = ClientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def client_detail(request, pk):
    
    client = get_object_or_404(Client, pk=pk)

    if request.method == 'GET':
        serializer = ClientSerializer(client)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = ClientSerializer(client, data=request.data,context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        client.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
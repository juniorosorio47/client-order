from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

# User login
@api_view(['POST'])
def login_view(request):

    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)

    if user is None:
        return Response(status=status.HTTP_404_NOT_FOUND)

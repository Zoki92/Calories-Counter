from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login, get_user_model

from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

import json

from .serializers import TokenSerializer, UserSerializer


User = get_user_model()

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserLoginView(CreateAPIView):
    """
    POST auth/login
    """
    permission_classes = (permissions.AllowAny,)

    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            serializer = TokenSerializer(data={
                "token": jwt_encode_handler(jwt_payload_handler(user))
            })
            serializer.is_valid()
            return Response(serializer.data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class RegisterUserView(APIView):
    """
    POST auth/register
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        """
        post method for saving new user
        """
        new_user_serializer = UserSerializer(data=request.data)
        if new_user_serializer.is_valid():
            new_user_serializer.save()
            user = User.objects.get(email=new_user_serializer.data["email"])
            serializer = TokenSerializer(data={
                "token": jwt_encode_handler(jwt_payload_handler(user))
            })
            serializer.is_valid()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=new_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """
        get method to check whether email exists
        """
        email = request.GET.get('email')
        try:
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            user = None
        if email and user:
            return Response(data={'available': False}, status=status.HTTP_200_OK)
        return Response(data={'available': True}, status=status.HTTP_200_OK)

from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from rest_framework import permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, get_user_model
from .serializers import TokenSerializer, UserSerializer
from rest_framework_jwt.settings import api_settings

# Create your views here.


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


class RegisterUserView(CreateAPIView):
    """
    POST auth/register
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        new_user_serializer = UserSerializer(data=request.data)
        if new_user_serializer.is_valid():
            new_user_serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(data=new_user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

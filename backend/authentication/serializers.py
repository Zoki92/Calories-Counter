from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CustomUser

User = get_user_model()


class TokenSerializer(serializers.Serializer):
    """
    This serializer serializes the token data
    """
    access = serializers.CharField(max_length=255)
    refresh = serializers.CharField(max_length=255)


class UserSerializer(serializers.ModelSerializer):
    """
    Serializes User class
    """
    class Meta:
        model = User
        fields = "__all__"

    def create(self, validated_data):
        user = User(email=validated_data["email"])
        user.set_password(validated_data['password'])
        user.save()
        return user

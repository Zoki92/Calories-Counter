from django.shortcuts import render, get_object_or_404
from django.http import Http404

from rest_framework import viewsets, status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import permission_classes

from .serializers import MealSerializer
from .models import Meal
from .permissions import UserTypesPermission

# Create your views here.


class MealViewSet(viewsets.ViewSet):
    """
    Provides a get method handler
    """
    permission_classes = (IsAuthenticated, UserTypesPermission)
    serializer_class = MealSerializer

    # need to implement this method to be able to use permissions on object level
    # it's in the documentation
    def get_object(self):
        obj = get_object_or_404(Meal, pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        return obj

    def list(self, request):
        qs = Meal.objects.filter(owner=request.user)
        serialized = self.serializer_class(qs, many=True)
        return Response(serialized.data)

    def create(self, request):
        owner = request.user
        serializer = MealSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=owner)
            return Response(
                data=serializer.data,
                status=status.HTTP_201_CREATED)

        else:
            return Response(
                data=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, pk=None):
        obj = self.get_object()
        serializer = MealSerializer(obj, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(
                data=serializer.data,
                status=status.HTTP_204_NO_CONTENT
            )
        else:
            return Response(
                data=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, pk=None):
        obj = self.get_object()
        obj.delete()
        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

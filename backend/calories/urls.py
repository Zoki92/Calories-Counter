from django.urls import path
from .views import MealViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'meals', MealViewSet, basename="meal")


urlpatterns = router.urls

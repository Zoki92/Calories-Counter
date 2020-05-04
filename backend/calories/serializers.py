from rest_framework.serializers import ModelSerializer
from .models import Meal


class MealSerializer(ModelSerializer):

    class Meta:
        model = Meal
        fields = ("pk", "text", "num_calories", "time_created",)

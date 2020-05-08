from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()


class Meal(models.Model):

    class Meta:
        ordering = ('time_created',)

    text = models.TextField()
    num_calories = models.DecimalField(
        decimal_places=2,
        max_digits=8
    )
    time_created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='meals'
    )

    def date_range(self, date_from, date_to):
        """
        todo
        e.g. how much calories have I had for lunch each day in the last month if lunch is between 12 and 15h
        """
        pass

    def time_range(self, time_from, time_to):
        """
        todo
        e.g. how much calories have I had for lunch each day in the last month if lunch is between 12 and 15h
        """
        pass

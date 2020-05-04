from django.test import TestCase
from ..models import Meal
from authentication.models import CustomUser


class TestMeal(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="zoran@zoran.com", password="123456")
        Meal.objects.create(
            text="breakfast", num_calories=1000, owner=self.user)

        self.meal = Meal.objects.get(text="breakfast")

    def test_meal_exists(self):
        self.assertEqual(self.meal.text, 'breakfast')
        self.assertEqual(Meal.objects.all().count(), 1)

    def test_get_calories(self):
        self.assertEqual(self.meal.num_calories, 1000)

    def test_user(self):
        self.assertEqual(self.meal.owner, self.user)

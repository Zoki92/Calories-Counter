from django.core.exceptions import ObjectDoesNotExist
from rest_framework.test import APIClient, APITestCase
from ..models import Meal
from django.contrib.auth import get_user_model
from django.shortcuts import reverse
from rest_framework.views import status
from ..serializers import MealSerializer
import json

User = get_user_model()


class BaseViewTest(APITestCase):
    """
    Base View Test class for setting up data
    """
    client = APIClient()

    @staticmethod
    def create_meal(text="", num_calories=0, user=None):
        """
        create meal static method
        """
        if text != "" and num_calories != 0:
            Meal.objects.create(
                text=text,
                num_calories=num_calories,
                owner=user
            )

    @staticmethod
    def create_user(email="", password="", is_user_manager=False, is_superuser=False):
        """
        create different type of users method
        """
        if email != "" and password != "":
            if is_superuser:
                user = User.objects.create_superuser(
                    email=email, password=password)
            elif is_user_manager:
                user = User.objects.create_manager(
                    email=email, password=password)
            else:
                user = User.objects.create_user(email=email, password=password)
            return user

    def login_client(self, email="", password=""):
        """
        login the user in the APIClient and set request
        credentials
        """
        # get a token from DRF
        response = self.client.post(
            reverse('create_token'),
            data=json.dumps({
                'email': email,
                'password': password,
            }),
            content_type="application/json"
        )
        self.token = response.data['token']
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.token}"
        )
        self.client.login(email=email, password=password)
        return self.token

    def setUp(self):
        """
        Set up helper data
        """
        self.user = self.create_user("zoran@123.com", "123456")
        self.user_2 = self.create_user("zoranstoilov@123.com", "123456")
        self.user_manager = self.create_user(
            "zoran-manager@123.com", "123456", is_user_manager=True)
        self.superuser = self.create_user(
            "zoran-superuser@123.com", "123456", is_superuser=True)
        self.create_meal("breakfast", 500, self.user)
        self.create_meal("lunch", 1000, self.user)
        self.create_meal("dinner", 1000, self.user)


class GetMealsForUser(BaseViewTest):
    """
    Get the meals for the logged in user
    """

    def test_get_all_meals_for_user(self):
        """
        This ensures that we get all the meals when
        we make a GET request to the end point
        """
        self.login_client('zoran@123.com', '123456')
        response = self.client.get(reverse("meal-list"))
        expected = Meal.objects.filter(
            owner__id=self.client.session['_auth_user_id'])
        serialized = MealSerializer(expected, many=True)
        self.assertEqual(response.data, serialized.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_user_with_no_meals(self):
        """
        This ensures that we get no meals for the
        user that hasn't got any meal entries
        """
        self.login_client('zoranstoilov@123.com', '123456')
        response = self.client.get(
            reverse("meal-list"))
        expected = 0
        self.assertEqual(len(response.data), expected)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AddNewMeal(BaseViewTest):
    """
    Add new meal test class
    """

    def test_add_new_meal_with_valid_data(self):
        """
        Ensure we send valid data in the request
        and check if we get it in the response
        """
        self.login_client("zoran@123.com", "123456")
        new_meal_data = {
            "text": "lunch",
            "num_calories": 600,
        }
        response = self.client.post(
            reverse('meal-list'),
            json.dumps(new_meal_data),
            content_type="application/json"
        )

        saved_meal = Meal.objects.get(pk=response.data['pk'])
        serializer = MealSerializer(new_meal_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # just checking text and num_calories because the response returns created too
        self.assertEqual(response.data['text'], serializer.data['text'])
        self.assertEqual(
            response.data['num_calories'], serializer.data['num_calories'])
        # check if the correct user is asociated to the created meal
        self.assertEqual(saved_meal.owner.email, "zoran@123.com")

    def test_add_new_meal_with_invalid_data(self):
        """
        Ensure we send invalid data in the request
        and check if we get bad request return
        """
        self.login_client("zoran@123.com", "123456")
        new_meal_data = {
            "text": "",
            "num_calories": "",
        }
        response = self.client.post(
            reverse('meal-list'),
            json.dumps(new_meal_data),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UpdateMeal(BaseViewTest):
    """
    Class for testing update of a meal
    """

    def test_update_meal_with_owner_logged_in(self):
        """
        Ensure the logged in user has created the meal
        and test the update endpoint
        """
        self.login_client("zoran@123.com", "123456")
        updated_meal_data = {
            "num_calories": 1200
        }
        # updating meal manually
        meal = Meal.objects.get(pk=1)
        serializer = MealSerializer(meal)

        response = self.client.put(
            reverse('meal-detail', kwargs={"pk": 1}),
            json.dumps(updated_meal_data),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # starting num_calories was 500 and was updated to 1200, so checking this
        self.assertNotEqual(
            response.data['num_calories'], serializer.data['num_calories'])

    def test_update_meal_with_another_user_logged_in(self):
        """
        Ensure the logged in user has NOT created the meal
        and test the update endpoint
        """
        self.login_client("zoranstoilov@123.com", "123456")

        updated_meal_data = {
            "num_calories": 1200
        }
        response = self.client.put(
            reverse('meal-detail', kwargs={"pk": 1}),
            json.dumps(updated_meal_data),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_meal_with_logged_in_user_manager(self):
        """
        Ensure the logged in user has NOT created the meal,
         is user_manager type test the update endpoint
        """
        self.login_client(
            "zoran-manager@123.com",
            "123456"
        )

        updated_meal_data = {
            "num_calories": 1200
        }

        meal = Meal.objects.get(pk=1)
        serializer = MealSerializer(meal)

        response = self.client.put(
            reverse('meal-detail', kwargs={"pk": 1}),
            json.dumps(updated_meal_data),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertNotEqual(
            response.data['num_calories'], serializer.data['num_calories'])

    def test_update_meal_with_logged_in_superuser(self):
        """
        Ensure the logged in user has NOT created the meal,
         is superuser type test the update endpoint
        """
        self.login_client(self.superuser.email, "123456")
        updated_meal_data = {
            "num_calories": 1200
        }

        meal = Meal.objects.get(pk=1)
        serializer = MealSerializer(meal)

        response = self.client.put(
            reverse('meal-detail', kwargs={"pk": 1}),
            json.dumps(updated_meal_data),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertNotEqual(
            response.data['num_calories'], serializer.data['num_calories'])


class DeleteMeal(BaseViewTest):
    """
    Class for testing delete requests
    """

    def test_delete_object_with_logged_in_owner(self):
        """
        Ensure the logged in user is the owner of the meal
        and test the outcome of the delete request for the
        endpoint
        """
        self.login_client(self.user.email, "123456")

        response = self.client.delete(
            reverse('meal-detail', kwargs={"pk": 1}),
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )
        try:
            meal = Meal.objects.get(pk=1)
        except ObjectDoesNotExist:
            meal = None

        self.assertIsNone(meal)

    def test_delete_object_with_logged_in_different_user(self):
        """
        Ensure the logged in user is NOT the owner of the meal
        and test the outcome of the delete request for the
        endpoint
        """
        self.login_client(self.user_2.email, "123456")
        response = self.client.delete(
            reverse('meal-detail', kwargs={"pk": 1}),
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN
        )
        try:
            meal = Meal.objects.get(pk=1)
        except ObjectDoesNotExist:
            meal = None

        self.assertIsNotNone(meal)

    def test_delete_object_with_logged_in_user_manager(self):
        """
        Ensure the logged in user is NOT the owner of the meal,
        is of type user_manager and test the outcome of the
        delete request for the endpoint
        """
        self.login_client(self.user_manager.email, "123456")
        response = self.client.delete(
            reverse('meal-detail', kwargs={"pk": 1}),
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )
        try:
            meal = Meal.objects.get(pk=1)
        except ObjectDoesNotExist:
            meal = None

        self.assertIsNone(meal)

    def test_delete_object_with_logged_in_superuser(self):
        """
        Ensure the logged in user is NOT the owner of the meal,
        is of type superuser and test the outcome of the
        delete request for the endpoint
        """
        self.login_client(self.superuser.email, "123456")
        response = self.client.delete(
            reverse('meal-detail', kwargs={"pk": 1}),
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT
        )
        try:
            meal = Meal.objects.get(pk=1)
        except ObjectDoesNotExist:
            meal = None

        self.assertIsNone(meal)

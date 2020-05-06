from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.shortcuts import reverse
from django.contrib.auth import get_user_model
import json

User = get_user_model()


class AuthBaseViewTest(APITestCase):
    client = APIClient()

    def setUp(self):
        self.user = User.objects.create_user(
            email="zoran@123.com",
            password="123456"
        )

    def login_user(self, email="", password=""):
        url = reverse("auth_login")
        return self.client.post(url, data=json.dumps({
            "email": email,
            "password": password
        }), content_type="application/json")



class AuthRegisterUserTest(AuthBaseViewTest):
    """
    Tests for auth/register endpoint
    """
    url = reverse("auth_register")

    new_email = "zoran@zoran.com"
    new_password = "123456"

    def test_register_user_with_valid_data(self):
        response = self.client.post(
            self.url,
            data=json.dumps({
                "email": self.new_email,
                "password": self.new_password,
            }),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # query db to check if new user is created
        users = User.objects.all()
        self.assertEqual(users.count(), 2)

    def test_register_user_with_invalid_data(self):
        response = self.client.post(
            self.url,
            data=json.dumps({
                "email": "zoran",
                "password": "hey there",
            }),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response = self.client.post(
            self.url,
            data=json.dumps({
                "email": "",
                "password": "",
            }),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # query db to check if users are created despite bad data
        users = User.objects.all()
        self.assertEqual(users.count(), 1)

    def test_unique_users(self):
        response = self.client.post(
            self.url,
            data=json.dumps({
                "email": "zoran@123.com",
                "password": "123456"
            }),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        users = User.objects.all()
        self.assertEqual(users.count(), 1)

    def test_validate_email_view(self):
        """
        Testing the get method for auth_register
        which tests whether email is unique
        or not
        """
        # user exists
        response = self.client.get(
            self.url,
            {'email': 'zoran@123.com'}
        )

        self.assertFalse(response.data["available"])

        # email not used yet
        response = self.client.get(
            self.url,
            {'email': 'zoran123@123.com'}
        )
        self.assertTrue(response.data["available"])

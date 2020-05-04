from ..models import CustomUser
from django.test import TestCase


class UserTest(TestCase):
    def setUp(self):
        CustomUser.objects.create_user(
            email="zoran@zoran.com", password="123456")
        self.user = CustomUser.objects.get(email="zoran@zoran.com")

    def test_user_exists(self):
        self.assertEqual(self.user.email, 'zoran@zoran.com')

    def test_user_is_not_manager(self):
        self.assertEqual(self.user.is_user_manager, False)

    def test_user_is_not_admin(self):
        self.assertEqual(self.user.is_superuser, False)


class ManagerUserTest(TestCase):
    def setUp(self):
        CustomUser.objects.create_manager(
            email="zoran@zoran.com", password="123456", is_user_manager=True)
        self.user = CustomUser.objects.get(email="zoran@zoran.com")

    def test_user_exists(self):
        self.assertEqual(self.user.email, 'zoran@zoran.com')
        self.assertEqual(CustomUser.objects.all().count(), 1)

    def test_user_is_manager(self):
        self.assertEqual(self.user.is_user_manager, True)

    def test_user_is_not_admin(self):
        self.assertEqual(self.user.is_superuser, False)


class AdminUserTest(TestCase):
    def setUp(self):
        CustomUser.objects.create_superuser(
            email="zoran@zoran.com", password="123456", is_superuser=True)
        self.user = CustomUser.objects.get(email="zoran@zoran.com")

    def test_user_exists(self):
        self.assertEqual(self.user.email, 'zoran@zoran.com')
        self.assertEqual(CustomUser.objects.all().count(), 1)

    def test_user_is_manager(self):
        self.assertFalse(self.user.is_user_manager)

    def test_user_is_admin(self):
        self.assertEqual(self.user.is_superuser, True)

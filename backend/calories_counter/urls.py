from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token, refresh_jwt_token
from authentication.views import UserLoginView, RegisterUserView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-token-auth/', obtain_jwt_token, name="create_token"),
    path('api-token-verify/', verify_jwt_token, name="verify_token"),
    path('auth/login/', UserLoginView.as_view(), name="auth_login"),
    path('auth/register/', RegisterUserView.as_view(), name="auth_register"),
    path('api-token-refresh/', refresh_jwt_token, name="refresh_token"),
    path('api/v1/', include('calories.urls')),
]

from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from authentication.views import RegisterUserView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/register/', RegisterUserView.as_view(), name="auth_register"),
    path('api/token/', TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('api/v1/', include('calories.urls')),
]

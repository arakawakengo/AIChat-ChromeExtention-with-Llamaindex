from django.contrib import admin
from django.urls import path, include

API_PATH = "api/"

urlpatterns = [
    path(API_PATH+'admin/', admin.site.urls),
    path(API_PATH+"test/", include('test_api.urls')),
]

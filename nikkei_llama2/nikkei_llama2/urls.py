from django.contrib import admin
from django.urls import path, include

API_PATH = "api/"

urlpatterns = [
    path(API_PATH+'admin/', admin.site.urls),
    path(API_PATH+"info/", include('info.urls')),
    path(API_PATH+"llm/", include('llm.urls')),
]

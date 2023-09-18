from django.urls import path

from . import views

urlpatterns = [
    path('', views.TEST.as_view()),
]
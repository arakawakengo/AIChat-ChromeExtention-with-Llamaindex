from django.urls import path

from . import views

urlpatterns = [
    path('', views.ANSWER_QUESTION.as_view()),
]
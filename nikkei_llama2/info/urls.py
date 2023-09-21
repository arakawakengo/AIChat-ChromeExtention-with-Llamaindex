from django.urls import path

from . import views

urlpatterns = [
    path('test/', views.Test.as_view()),
    path('article/<str:article_id>/', views.Article.as_view()),
    path('article/recommend', views.RecommendArticle.as_view()),
]
from django.urls import path

from . import views

urlpatterns = [
    path("", views.today, name="today"),
    path("calendar", views.calendar, name="calendar"),
    path("day/<int:date>", views.day, name="day"),
    path("new_meal", views.new_meal, name="new_meal"),
    path("nutrition_api/<int:date>/<str:meal_time>", views.nutrition_api, name="nutrition_api"),
    path("test", views.test, name="test")
]
from django.urls import path

from . import views

urlpatterns = [
    path("", views.today, name="today"),
    path("calendar", views.calendar, name="calendar"),
    path("calendar_details", views.calendar_details, name="calendar_details"),
    path("day/<int:date>", views.day, name="day"),
    path("new_meal", views.new_meal, name="new_meal"),
    path("test", views.test, name="test"),
    path("foods_search/<str:food_name>/<int:page_num>", views.fatSecretSearch, name="foods_search"),
    path("food_get/<int:id>", views.fatSecretGet, name="food_get"),
    path("save_meal", views.saveNewMeal, name="saveNewMeal"),
    path("get_calendar/<int:date>", views.getCalendar, name="get_calendar") 
]
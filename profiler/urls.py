from django.urls import path

from . import views

urlpatterns = [
    path("", views.today, name="today"),
    path("calendar", views.calendar, name="calendar"),
    path("calendar_details", views.calendar_details, name="calendar_details"),
    path("day/<int:date>", views.day, name="day"),
    path("foods_search/<str:food_name>/<int:page_num>", views.fatSecretSearch, name="foods_search"),
    path("food_get/<int:id>", views.fatSecretGet, name="food_get"),
    path("save_meal", views.saveNewMeal, name="saveNewMeal"),
    path("get_calendar/<int:date>", views.getCalendar, name="get_calendar"),
    path("account", views.account, name="account"),

    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("set_goal", views.set_goal, name="set_goal"),
    path("password_change", views.change_pass, name="change_pass")
]
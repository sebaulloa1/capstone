from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
import datetime
from django import forms
import json
from django.views.decorators.csrf import csrf_exempt
from .models import Breakfast, Lunch, Dinner, Snack, Calendar, Goal, User
import requests
from django.core.exceptions import ObjectDoesNotExist
from decimal import Decimal
from django.urls import reverse
from django.core import serializers
from django.forms.models import model_to_dict
from calendar import monthrange
import inspect
from django.core.paginator import Paginator, EmptyPage
from itertools import chain
from django.contrib import messages

from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError


def lineno():
    """Returns the current line number in our program."""
    return inspect.currentframe().f_back.f_lineno

def get_token():
    data = {"grant_type": "client_credentials", "scope": "basic"}
    clientID = '8afd07b7355c41e3813a80e3008c127e'
    clientSecret = 'b17853e36e824b26aa0c18867e114d45'
    r = requests.post('https://oauth.fatsecret.com/connect/token', data=data, auth=(clientID, clientSecret))
    print(r)
    print(r.json())
    r = r.json()
    return r['access_token']

token = get_token()

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("today"))
        else:
            messages.add_message(request, messages.ERROR, 'Wrong username or password')
            return render(request, "profiler/login.html")
    else:
        return render(request, "profiler/login.html")

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            messages.add_message(request, messages.ERROR, "Password and confirmation don't match")
            return render(request, "profiler/register.html")

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            messages.add_message(request, messages.ERROR, "Error creating new user")
            return render(request, "profiler/register.html")
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        return HttpResponseRedirect(reverse("set_goal"))
    else:
        return render(request, "profiler/register.html")

@csrf_exempt
def change_pass(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        pass_info = data['change_pass']
        user = authenticate(request, username=request.user.username, password=pass_info['current'])
        if user is not None:
            u = User.objects.get(username=request.user.username)
            u.set_password(pass_info['new'])
            u.save()
            update_session_auth_hash(request, u)
            return HttpResponse('Password changed')
        else:
            return HttpResponse('Invalid current password')

@login_required(login_url='/login', redirect_field_name=None)
def calendar(request):
    return render(request, "profiler/calendar.html")

@login_required(login_url='/login', redirect_field_name=None)
@csrf_exempt
def calendar_details(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        detailsDict = {}
        for dayNumber in range(1, monthrange(data['year'], data['month'] + 1)[1] + 1):
            try:
                calendar = Calendar.objects.get(day=f'{data["year"]}-{str(data["month"] + 1).zfill(2)}-{str(dayNumber).zfill(2)}', user=request.user)
                goals, created = Goal.objects.get_or_create(user=request.user)
                percent_calories = (float(calendar.calories) / (float(goals.calories) + 0.01)) * 100
                if percent_calories > 100:
                    percent_calories = 100
                percent_protein = (float(calendar.protein) / (0.01 + float(goals.protein))) * 100
                if percent_protein > 100:
                    percent_protein = 100
                percent_fat = (float(calendar.fat) / (0.01 + float(goals.fat))) * 100
                if percent_fat > 100:
                    percent_fat = 100
                percent_carbs = (float(calendar.carbs) / (0.01 + float(goals.carbs))) * 100
                if percent_carbs > 100:
                    percent_carbs = 100
                percent = (percent_calories + percent_protein + percent_fat + percent_carbs) / 4
                detailsDict[dayNumber] = percent
            except ObjectDoesNotExist:
                detailsDict[dayNumber] = 0
        print(detailsDict)
        return JsonResponse(detailsDict)

@login_required(login_url='/login', redirect_field_name=None)
def day(request, date):
    iso_date = datetime.datetime.fromtimestamp(date)
    user = request.user
    print(iso_date)
    calendar = Calendar.objects.get_or_create(day=iso_date, user=request.user)
    breakfast = Breakfast.objects.filter(user=user, date=iso_date)
    lunch = Lunch.objects.filter(user=user, date=iso_date)
    dinner = Dinner.objects.filter(user=user, date=iso_date)
    snack = Snack.objects.filter(user=user, date=iso_date)
    print(breakfast[0], lineno())
    return render(request, "profiler/day.html", {
        "date": iso_date,
        "calendar": calendar[0],
        "today": False,
        "breakfast": breakfast,
        "lunch": lunch,
        "dinner": dinner,
        "snack": snack
    })

@login_required(login_url='/login', redirect_field_name=None)
def today(request):
    date = datetime.datetime.today()
    user = request.user
    print(date, lineno())
    calendar = Calendar.objects.get_or_create(day=date, user=user)
    breakfast = Breakfast.objects.filter(user=user, date=date)
    lunch = Lunch.objects.filter(user=user, date=date)
    dinner = Dinner.objects.filter(user=user, date=date)
    snack = Snack.objects.filter(user=user, date=date)
    print(calendar)
    return render(request, "profiler/day.html", {
        "date": date,
        "calendar": calendar[0],
        "today": True,
        "breakfast": breakfast,
        "lunch": lunch,
        "dinner": dinner,
        "snack": snack
    })

@csrf_exempt
def fatSecretSearch(request, food_name, page_num):
    if request.method == 'POST':   
        #try:    
        params = {'method': 'foods.search', 'format': 'json', 'search_expression': f'{food_name}', 'page_number': f'{page_num}', 'max_results': '10'}
        headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
        r = requests.post('https://platform.fatsecret.com/rest/server.api', params=params, headers=headers)
        print(r.url)
        print(r.headers)
        print(r.json())
        r = r.json()
        return JsonResponse({
            'results': r
            })
        #except:
        #    token = get_token()
        #    return HttpResponseRedirect(reverse('foods_search', args=(food_name, page_num)))

@csrf_exempt
def fatSecretGet(request, id):
    if request.method == 'POST':
        params = {'method': 'food.get.v2', 'food_id': f'{id}', 'format': 'json'}
        headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'}
        r = requests.post('https://platform.fatsecret.com/rest/server.api', params=params, headers=headers)
        print(r)
        r = r.json()
        print(r)
        return JsonResponse({
            'food': r
        })

@csrf_exempt
def saveNewMeal(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        for meal in data['meal'].values():
            for nutrient, value in meal.items():
                if value == None:
                    meal[nutrient] = 0
            print(meal['name'])
            new_meal = globals()[meal['type'].lower().capitalize()](date=datetime.datetime.fromisoformat(meal['date']), ingredient=meal['name'], measure=meal['measurement_description'], metric_measure=f"{meal['metric_serving_amount']} {meal['metric_serving_unit']}", quantity=meal['number_of_units'], calories=meal['calories'], carbs=meal['carbs'], fat=meal['fat'], protein=meal['protein'], cholesterol=meal['cholesterol'], sat_fat=meal['sat_fat'], poly_fat=meal['poly_fat'], mono_fat=meal['mono_fat'], fiber=meal['fiber'], sugars=meal['sugars'], sodium=meal['sodium'], potassium=meal['potassium'], user= request.user)
            new_meal.save()
        updateCalendar(data['meal'], request.user)
        print(next(iter(data['meal'].values())))
        calendar = list(Calendar.objects.filter(day=datetime.datetime.fromisoformat(next(iter(data['meal'].values()))['date']), user=request.user).values())
        print(calendar)
    return JsonResponse(calendar, safe=False)

def updateCalendar(meal, user):
    print(next(iter(meal.values())))
    date = datetime.datetime.fromisoformat(next(iter(meal.values()))['date'])
    day = Calendar.objects.get(day=date, user=user)
    for i in meal:
        print(i)
        day.calories += Decimal(meal[i]['calories'])
        day.protein += Decimal(meal[i]['protein'])
        day.cholesterol += Decimal(meal[i]['cholesterol'])
        day.fat += Decimal(meal[i]['fat'])
        day.poly_fat += Decimal(meal[i]['poly_fat'])
        day.sat_fat += Decimal(meal[i]['sat_fat'])
        day.mono_fat += Decimal(meal[i]['mono_fat'])
        day.sugar += Decimal(meal[i]['sugars'])
        day.carbs += Decimal(meal[i]['carbs'])
        day.fiber += Decimal(meal[i]['fiber'])
        day.sodium += Decimal(meal[i]['sodium'])
        day.potassium += Decimal(meal[i]['potassium'])
        day.save()


def getCalendar(request, date):
    date = datetime.date.fromtimestamp(date)
    print(date)
    calendar = list(Calendar.objects.filter(day=date, user=request.user).values())
    goals = list(Goal.objects.filter(user=request.user).values())
    print(calendar)
    return JsonResponse({
        "calendar": calendar,
        "goals": goals
    }, safe=False)

def set_goal(request):
    if request.method == "GET":
        try:
            Goal.objects.get(user=request.user)
            return HttpResponseRedirect(reverse("today"))
        except ObjectDoesNotExist:
            return render(request, "profiler/set_goal.html")
    else:
        goal = Goal(user = request.user, calories=request.POST["calories"], protein=request.POST["protein"], fat=request.POST["fat"], carbs=request.POST["carbs"])
        goal.save()
        return HttpResponseRedirect(reverse("today"))

@login_required(login_url='/login', redirect_field_name=None)
@csrf_exempt
def account(request):
    if request.method == "GET":
        goals = Goal.objects.get(user=request.user)
        return render(request, "profiler/account.html", {
            'goals': goals
        })
    else:
        data = json.loads(request.body)
        print(data)
        user = request.user
        new_goals = data['goals']
        goals = Goal.objects.get(user=user)
        print(goals.calories)
        #goals.calories = new_goals['calories']
        for macro in new_goals:
            setattr(goals, macro, new_goals[macro])
        goals.save()
        return JsonResponse({
            "goals": model_to_dict(goals)
        })

@csrf_exempt
def food_list(request):
    if request.method == "POST":
        data = json.loads(request.body)
        date = datetime.date.fromtimestamp(data['date'])
        user = request.user
        page_num = data['page_num']
        meal = data['meal']
        if meal == 'all':
            breakfast = list(Breakfast.objects.filter(user=user, date=date).values())
            lunch = list(Lunch.objects.filter(user=user, date=date).values())
            dinner = list(Dinner.objects.filter(user=user, date=date).values())
            snack = list(Snack.objects.filter(user=user, date=date).values())
            meal_set = list(chain(breakfast, lunch, dinner, snack))
            
        else:
            meal_set = list(globals()[meal.lower().capitalize()].objects.filter(date=date, user= user).order_by('pk').values())
        meal_paginator = Paginator(meal_set, 5)
        try:
            food_list = meal_paginator.page(page_num)
        except EmptyPage:
            food_list = meal_paginator.page(meal_paginator.num_pages)
        print(meal_set, lineno())

        return JsonResponse({
            "meal_paginator": list(food_list),
            "num_pages": meal_paginator.num_pages
        }, safe=False)
        
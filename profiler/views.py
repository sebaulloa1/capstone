from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
import datetime
from django import forms
import json
from django.views.decorators.csrf import csrf_exempt
from .models import Breakfast, Lunch, Dinner, Snack, Calendar
import requests
from django.core.exceptions import ObjectDoesNotExist
from decimal import Decimal
from django.urls import reverse
from django.core import serializers

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

def calendar(request):
    return render(request, "profiler/calendar.html")

def day(request, date):
    iso_date = datetime.datetime.fromtimestamp(date)
    print(iso_date)
    calendar = Calendar.objects.get_or_create(day=iso_date)
    print(calendar[0].protein)
    return render(request, "profiler/day.html", {
        "date": iso_date,
        "calendar": calendar[0]
    })

def today(request):
    date = datetime.datetime.today()
    print(date)
    calendar = Calendar.objects.get_or_create(day=date)
    print(calendar)
    return render(request, "profiler/day.html", {
        "date": date,
        "calendar": calendar[0]
    })

@csrf_exempt
def new_meal(request):
    if request.method == "POST":
        data = json.loads(request.body)
        meal_time = data['meal_time'].capitalize()
        date = datetime.datetime.fromisoformat(data['date'])
        print(data)
        #for ingredient in data['meal']:
        #    meal = globals()[meal_time](date=date.strftime('%Y-%m-%d'), ingredient=ingredient['name'], measure=ingredient['measure'], quantity=ingredient['qty'])
         #   meal.save()
            #print(ingredient)
        
        params = {'app_id': 'e572f575', 'app_key': '5e459acdcb817d770ab8212e966bdfb6'}
        for ingredient in data['meal']:
            food = {'ingredients': [{'quantity': int(ingredient['qty']), 'measure': ingredient['measure'], 'foodId': ingredient['id']}]}
            print(food)
            r = requests.post('https://api.edamam.com/api/food-database/v2/nutrients', params=params, json=food)
            print(r.json())
       
        return HttpResponse()


# For checking if that day (date) meals have been added in the total nutrients 
# (have been passed to the api)
def parse_checker(date):
    print('parse checker working')
    breakfast_meals = Breakfast.objects.filter(date=date)
    for meal in breakfast_meals:
        print('checking breakfast')
        if not meal.nutrition_parsed:
            return False
    
    lunch_meals = Lunch.objects.filter(date=date)
    for meal in lunch_meals:
        print('checking lunch')
        if not meal.nutrition_parsed:
            return False

    dinner_meals = Dinner.objects.filter(date=date)
    for meal in dinner_meals:
        print('checking dinner')
        if not meal.nutrition_parsed:
            return False

    snack_meals = Snack.objects.filter(date=date)
    for meal in snack_meals:
        print('checking snacks')
        if not meal.nutrition_parsed:
            return False
    
    return True


def test(request):
    return render(request, 'profiler/test.html')



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
            print(meal['name'])
            new_meal = globals()[meal['type'].lower().capitalize()](date=datetime.datetime.fromisoformat(meal['date']), ingredient=meal['name'], measure=meal['measurement_description'], metric_measure=f"{meal['metric_serving_amount']} {meal['metric_serving_unit']}", quantity=meal['number_of_units'], calories=meal['calories'], carbs=meal['carbs'], fat=meal['fat'], protein=meal['protein'], cholesterol=meal['cholesterol'], sat_fat=meal['sat_fat'], poly_fat=meal['poly_fat'], mono_fat=meal['mono_fat'], fiber=meal['fiber'], sugars=meal['sugars'], sodium=meal['sodium'], potassium=meal['potassium'])
            new_meal.save()
        updateCalendar(data['meal'])
        print(next(iter(data['meal'].values())))
        calendar = Calendar.objects.filter(day=datetime.datetime.fromisoformat(next(iter(data['meal'].values()))['date']))
        print(calendar)
        calendar = serializers.serialize('json', calendar)
    return JsonResponse(calendar, safe=False)

def updateCalendar(meal):
    print(next(iter(meal.values())))
    date = datetime.datetime.fromisoformat(next(iter(meal.values()))['date'])
    day = Calendar.objects.get(day=date)
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
    calendar = Calendar.objects.filter(day=date)
    calendar = list(calendar.values())
    print(calendar)
    return JsonResponse(calendar, safe=False)
from django.shortcuts import render
from django.http import HttpResponse
import datetime
from django import forms
import json
from django.views.decorators.csrf import csrf_exempt
from .models import Breakfast, Lunch, Dinner, Snack, Calendar
import requests
from django.core.exceptions import ObjectDoesNotExist
from decimal import Decimal

def calendar(request):
    return render(request, "profiler/calendar.html")

def day(request, date):
    date = datetime.datetime.fromtimestamp(date)
    print(date)
    parse_checker(date)
    nutrition_api(request, date)
    return render(request, "profiler/day.html", {
        "date": date
    })

def today(request):
    date = datetime.datetime.today()
    print(date)
    food_parser()
    return render(request, "profiler/day.html", {
        "date": date
    })

@csrf_exempt
def new_meal(request):
    if request.method == "POST":
        data = json.loads(request.body)
        meal_time = data['meal_time'].capitalize()
        date = datetime.datetime.fromisoformat(data['date'])
        print(data)
        for ingredient in data['meal']:
            meal = globals()[meal_time](date=date.strftime('%Y-%m-%d'), ingredient=ingredient['name'], measure=ingredient['measure'], quantity=ingredient['qty'])
            meal.save()
            print(ingredient)
        
        return HttpResponse()

def nutrition_api(request, date):
    # API parameters
    params = {'app_id': '99a7b787', 'app_key': '9a3fc6f5cccc22d9f5855692f022cb3c'}

    # Get all meal models from that day
    breakfast = Breakfast.objects.filter(date=date)
    lunch = Lunch.objects.filter(date=date)
    dinner = Dinner.objects.filter(date=date)
    snack = Snack.objects.filter(date=date)
    print(breakfast)

    # Build a json for the meals
    recipe = {'title': 'Day meal',
        'yield': '1 serving',
        'ingr': []}
    for meal in breakfast:
        recipe['ingr'] += {f'{meal.quantity} {meal.measure} {meal.ingredient}'}
    for meal in lunch:
        recipe['ingr'] += {f'{meal.quantity} {meal.measure} {meal.ingredient}'}
    for meal in dinner:
        recipe['ingr'] += {f'{meal.quantity} {meal.measure} {meal.ingredient}'}
    for meal in snack:
        recipe['ingr'] += {f'{meal.quantity} {meal.measure} {meal.ingredient}'}

    print(recipe)
    # Send the request to the API with the meals
    r = requests.post('https://api.edamam.com/api/nutrition-details', params=params,json=recipe)
    print(r.url)
    print(r.json(), "json")

    # If got a response with the nutrients
    if r.ok:
        for meal in breakfast:
            meal.nutrition_parsed = True
            meal.save()
        for meal in lunch:
            meal.nutrition_parsed = True
            meal.save()
        for meal in dinner:
            meal.nutrition_parsed = True
            meal.save()
        for meal in snack:
            meal.nutrition_parsed = True
            meal.save()

    nutrients = r.json()
    
    # Update the calendar model to save the total nutrients, to avoid re-calling the api every reload
    # (checked before calling this function with the parse_checker function)
    try:
        day_nutrition = Calendar.objects.get(day=date)
        day_nutrition.calories += Decimal(nutrients['totalNutrients']['ENERC_KCAL']['quantity'])
        day_nutrition.protein += Decimal(nutrients['totalNutrients']['PROCNT']['quantity'])
        day_nutrition.fat += Decimal(nutrients['totalNutrients']['FAT']['quantity'])
        day_nutrition.fat_sat += Decimal(nutrients['totalNutrients']['FASAT']['quantity'])
        day_nutrition.fat_trans += Decimal(nutrients['totalNutrients']['FATRN']['quantity'])
        day_nutrition.sugar += Decimal(nutrients['totalNutrients']['SUGAR']['quantity'])
        day_nutrition.carb += Decimal(nutrients['totalNutrients']['CHOCDF']['quantity'])
        day_nutrition.fiber += Decimal(nutrients['totalNutrients']['FIBTG']['quantity'])
        day_nutrition.save()
    except Calendar.DoesNotExist:
        day_nutrition = Calendar(day=date, calories=nutrients['totalNutrients']['ENERC_KCAL']['quantity'], protein=nutrients['totalNutrients']['PROCNT']['quantity'], fat=nutrients['totalNutrients']['FAT']['quantity'],
                        fat_sat=nutrients['totalNutrients']['FASAT']['quantity'], fat_trans=nutrients['totalNutrients']['FATRN']['quantity'], sugar=nutrients['totalNutrients']['SUGAR']['quantity'],
                        carb=nutrients['totalNutrients']['CHOCDF']['quantity'], fiber=nutrients['totalNutrients']['FIBTG']['quantity'])
        day_nutrition.save()

    return r.json()

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


def food_parser():
    params = {'ingr': 'bacon', 'app_id': 'e572f575', 'app_key': '5e459acdcb817d770ab8212e966bdfb6'}
    r = requests.get('https://api.edamam.com/api/food-database/v2/parser', params=params)
    print(r.json())
    return r.json()

def test(request):
    return render(request, 'profiler/test.html')

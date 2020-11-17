from django.db import models

class Breakfast(models.Model):
    date = models.DateField()
    ingredient = models.CharField(max_length=64)
    measure = models.CharField(max_length=64)
    metric_measure = models.CharField(max_length=64)
    quantity = models.DecimalField(max_digits=10, decimal_places=3)
    calories = models.DecimalField(max_digits=10, decimal_places=3)
    carbs = models.DecimalField(max_digits=10, decimal_places=3)
    fat = models.DecimalField(max_digits=10, decimal_places=3)
    protein = models.DecimalField(max_digits=10, decimal_places=3)
    cholesterol = models.DecimalField(max_digits=10, decimal_places=3)
    sat_fat = models.DecimalField(max_digits=10, decimal_places=3) 
    poly_fat = models.DecimalField(max_digits=10, decimal_places=3) 
    mono_fat = models.DecimalField(max_digits=10, decimal_places=3)
    fiber = models.DecimalField(max_digits=10, decimal_places=3) 
    sugars = models.DecimalField(max_digits=10, decimal_places=3)
    sodium = models.DecimalField(max_digits=10, decimal_places=3) 
    potassium = models.DecimalField(max_digits=10, decimal_places=3)  

class Lunch(models.Model):
    date = models.DateField()
    ingredient = models.CharField(max_length=64)
    measure = models.CharField(max_length=64)
    metric_measure = models.CharField(max_length=64)
    quantity = models.DecimalField(max_digits=10, decimal_places=3)
    calories = models.DecimalField(max_digits=10, decimal_places=3)
    carbs = models.DecimalField(max_digits=10, decimal_places=3)
    fat = models.DecimalField(max_digits=10, decimal_places=3)
    protein = models.DecimalField(max_digits=10, decimal_places=3)
    cholesterol = models.DecimalField(max_digits=10, decimal_places=3)
    sat_fat = models.DecimalField(max_digits=10, decimal_places=3) 
    poly_fat = models.DecimalField(max_digits=10, decimal_places=3)
    mono_fat = models.DecimalField(max_digits=10, decimal_places=3)
    fiber = models.DecimalField(max_digits=10, decimal_places=3) 
    sugars = models.DecimalField(max_digits=10, decimal_places=3)
    sodium = models.DecimalField(max_digits=10, decimal_places=3) 
    potassium = models.DecimalField(max_digits=10, decimal_places=3)

class Dinner(models.Model):
    date = models.DateField()
    ingredient = models.CharField(max_length=64)
    measure = models.CharField(max_length=64)
    metric_measure = models.CharField(max_length=64)
    quantity = models.DecimalField(max_digits=10, decimal_places=3)
    calories = models.DecimalField(max_digits=10, decimal_places=3)
    carbs = models.DecimalField(max_digits=10, decimal_places=3)
    fat = models.DecimalField(max_digits=10, decimal_places=3)
    protein = models.DecimalField(max_digits=10, decimal_places=3)
    cholesterol = models.DecimalField(max_digits=10, decimal_places=3)
    sat_fat = models.DecimalField(max_digits=10, decimal_places=3) 
    poly_fat = models.DecimalField(max_digits=10, decimal_places=3)
    mono_fat = models.DecimalField(max_digits=10, decimal_places=3)
    fiber = models.DecimalField(max_digits=10, decimal_places=3) 
    sugars = models.DecimalField(max_digits=10, decimal_places=3)
    sodium = models.DecimalField(max_digits=10, decimal_places=3) 
    potassium = models.DecimalField(max_digits=10, decimal_places=3)

class Snack(models.Model):
    date = models.DateField()
    ingredient = models.CharField(max_length=64)
    measure = models.CharField(max_length=64)
    metric_measure = models.CharField(max_length=64)
    quantity = models.DecimalField(max_digits=10, decimal_places=3)
    calories = models.DecimalField(max_digits=10, decimal_places=3)
    carbs = models.DecimalField(max_digits=10, decimal_places=3)
    fat = models.DecimalField(max_digits=10, decimal_places=3)
    protein = models.DecimalField(max_digits=10, decimal_places=3)
    cholesterol = models.DecimalField(max_digits=10, decimal_places=3)
    sat_fat = models.DecimalField(max_digits=10, decimal_places=3) 
    poly_fat = models.DecimalField(max_digits=10, decimal_places=3)
    mono_fat = models.DecimalField(max_digits=10, decimal_places=3)
    fiber = models.DecimalField(max_digits=10, decimal_places=3) 
    sugars = models.DecimalField(max_digits=10, decimal_places=3)
    sodium = models.DecimalField(max_digits=10, decimal_places=3) 
    potassium = models.DecimalField(max_digits=10, decimal_places=3)

class Calendar(models.Model):
    day = models.DateField()
    calories = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    protein = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    cholesterol = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    fat = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    poly_fat = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    sat_fat = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    mono_fat = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    sugar = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    carbs = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    fiber = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    sodium = models.DecimalField(max_digits=10, decimal_places=3, default=0)
    potassium = models.DecimalField(max_digits=10, decimal_places=3, default=0)


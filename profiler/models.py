from django.db import models

class Breakfast(models.Model):
    date = models.DateField()
    ingredient = models.CharField(max_length=64)
    measure = models.CharField(max_length=64)
    quantity = models.CharField(max_length=64)
    nutrition_parsed = models.BooleanField(default=False)

class Lunch(models.Model):
    date = models.DateField()
    ingredient = models.CharField(max_length=64)
    measure = models.CharField(max_length=64)
    quantity = models.CharField(max_length=64)
    nutrition_parsed = models.BooleanField(default=False)

class Dinner(models.Model):
    date = models.DateField()
    ingredient = models.CharField(max_length=64)
    measure = models.CharField(max_length=64)
    quantity = models.CharField(max_length=64) 
    nutrition_parsed = models.BooleanField(default=False)

class Snack(models.Model):
    date = models.DateField()
    ingredient = models.CharField(max_length=64)
    measure = models.CharField(max_length=64)
    quantity = models.CharField(max_length=64)
    nutrition_parsed = models.BooleanField(default=False)

class Calendar(models.Model):
    day = models.DateField()
    calories = models.DecimalField(max_digits=10, decimal_places=3)
    protein = models.DecimalField(max_digits=10, decimal_places=3)
    fat = models.DecimalField(max_digits=10, decimal_places=3)
    fat_sat = models.DecimalField(max_digits=10, decimal_places=3)
    fat_trans = models.DecimalField(max_digits=10, decimal_places=3)
    sugar = models.DecimalField(max_digits=10, decimal_places=3)
    carb = models.DecimalField(max_digits=10, decimal_places=3)
    fiber = models.DecimalField(max_digits=10, decimal_places=3)

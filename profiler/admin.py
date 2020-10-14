from django.contrib import admin
from .models import Breakfast, Lunch, Dinner, Snack, Calendar


admin.site.register(Breakfast)
admin.site.register(Lunch)
admin.site.register(Dinner)
admin.site.register(Snack)
admin.site.register(Calendar)

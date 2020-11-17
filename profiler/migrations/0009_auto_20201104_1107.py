# Generated by Django 3.0.8 on 2020-11-04 14:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiler', '0008_auto_20201012_0056'),
    ]

    operations = [
        migrations.RenameField(
            model_name='calendar',
            old_name='carb',
            new_name='carbs',
        ),
        migrations.RenameField(
            model_name='calendar',
            old_name='fat_sat',
            new_name='sat_fat',
        ),
        migrations.RemoveField(
            model_name='breakfast',
            name='nutrition_parsed',
        ),
        migrations.RemoveField(
            model_name='calendar',
            name='fat_trans',
        ),
        migrations.RemoveField(
            model_name='dinner',
            name='nutrition_parsed',
        ),
        migrations.RemoveField(
            model_name='lunch',
            name='nutrition_parsed',
        ),
        migrations.RemoveField(
            model_name='snack',
            name='nutrition_parsed',
        ),
        migrations.AddField(
            model_name='breakfast',
            name='calories',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='breakfast',
            name='carbs',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='breakfast',
            name='cholesterol',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='breakfast',
            name='fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='breakfast',
            name='fiber',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='breakfast',
            name='metric_measure',
            field=models.CharField(default=1, max_length=64),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='breakfast',
            name='mono_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='breakfast',
            name='poly_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='breakfast',
            name='potassium',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='breakfast',
            name='protein',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='breakfast',
            name='sat_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='breakfast',
            name='sodium',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='breakfast',
            name='sugars',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='calendar',
            name='mono_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='calendar',
            name='potassium',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='calendar',
            name='sodium',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='calories',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='carbs',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='cholesterol',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='fiber',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='metric_measure',
            field=models.CharField(default=1, max_length=64),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='mono_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='poly_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='potassium',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='protein',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='sat_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='sodium',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='dinner',
            name='sugars',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='calories',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='carbs',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='cholesterol',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='fiber',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='metric_measure',
            field=models.CharField(default=1, max_length=64),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='mono_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='poly_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='potassium',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='protein',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='sat_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='sodium',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lunch',
            name='sugars',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='calories',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='carbs',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='cholesterol',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='fiber',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='metric_measure',
            field=models.CharField(default=1, max_length=64),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='mono_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='poly_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='potassium',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='protein',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='sat_fat',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='sodium',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='snack',
            name='sugars',
            field=models.DecimalField(decimal_places=3, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='breakfast',
            name='quantity',
            field=models.DecimalField(decimal_places=3, max_digits=10),
        ),
        migrations.AlterField(
            model_name='dinner',
            name='quantity',
            field=models.DecimalField(decimal_places=3, max_digits=10),
        ),
        migrations.AlterField(
            model_name='lunch',
            name='quantity',
            field=models.DecimalField(decimal_places=3, max_digits=10),
        ),
        migrations.AlterField(
            model_name='snack',
            name='quantity',
            field=models.DecimalField(decimal_places=3, max_digits=10),
        ),
    ]

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('hub', '0011_labphoto_and_refactor_laboratoryimage'),
    ]

    operations = [
        migrations.RenameField(
            model_name='labphoto',
            old_name='image',
            new_name='card_image',
        ),
        migrations.AddField(
            model_name='labphoto',
            name='lab_image',
            field=models.ImageField(blank=True, null=True, upload_to='labs/', verbose_name='Фото внутри лаборатории (колба)'),
        ),
    ]

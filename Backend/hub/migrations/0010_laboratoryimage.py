from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('hub', '0009_delete_laboratoryimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='LaboratoryImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='labs/', verbose_name='Изображение')),
                ('order', models.PositiveIntegerField(default=0, verbose_name='Порядок')),
                ('laboratory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='uploaded_images', to='hub.laboratory', verbose_name='Лаборатория')),
            ],
            options={
                'verbose_name': 'Изображение лаборатории',
                'verbose_name_plural': 'Изображения лабораторий',
                'db_table': 'hub_laboratory_images',
                'managed': True,
                'ordering': ['order'],
            },
        ),
    ]

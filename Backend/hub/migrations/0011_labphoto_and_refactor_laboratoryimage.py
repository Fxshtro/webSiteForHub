from django.db import migrations, models
import django.db.models.deletion


def migrate_existing_images(apps, schema_editor):
    LaboratoryImage = apps.get_model('hub', 'LaboratoryImage')
    LabPhoto = apps.get_model('hub', 'LabPhoto')
    import os
    from django.core.files import File

    for img in LaboratoryImage.objects.all():
        old_path = img.image.path if img.image else None
        if old_path and os.path.exists(old_path):
            with open(old_path, 'rb') as f:
                photo = LabPhoto()
                fname = os.path.basename(old_path)
                photo.image.save(fname, File(f))
                photo.save()
                img.lab_photo = photo
                img.save()


class Migration(migrations.Migration):
    dependencies = [
        ('hub', '0010_laboratoryimage'),
    ]

    operations = [
        migrations.CreateModel(
            name='LabPhoto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='labs/', verbose_name='Изображение')),
            ],
            options={
                'verbose_name': 'Фото лаборатории',
                'verbose_name_plural': 'Фото лабораторий',
                'db_table': 'hub_lab_photos',
                'managed': True,
            },
        ),
        migrations.AddField(
            model_name='laboratoryimage',
            name='lab_photo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='hub.labphoto', verbose_name='Фото'),
            preserve_default=False,
        ),
        migrations.RunPython(migrate_existing_images, reverse_code=migrations.RunPython.noop),
        migrations.RemoveField(
            model_name='laboratoryimage',
            name='image',
        ),
        migrations.RemoveField(
            model_name='laboratoryimage',
            name='order',
        ),
        migrations.AlterField(
            model_name='laboratoryimage',
            name='lab_photo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hub.labphoto', verbose_name='Фото'),
            preserve_default=False,
        ),
    ]

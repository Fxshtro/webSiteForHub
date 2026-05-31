from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('hub', '0012_card_and_lab_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='LaboratoryGuide',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('guide', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hub.guide', verbose_name='Руководитель')),
                ('laboratory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='guide_links', to='hub.laboratory', verbose_name='Лаборатория')),
            ],
            options={
                'verbose_name': 'Руководитель лаборатории',
                'verbose_name_plural': 'Руководители лаборатории',
                'db_table': 'hub_laboratory_guides',
                'managed': True,
            },
        ),
    ]

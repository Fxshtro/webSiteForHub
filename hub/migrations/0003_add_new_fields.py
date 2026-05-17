from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hub', '0002_create_event_log'),
    ]

    operations = [
        # Создаём таблицу руководителей хаба
        migrations.CreateModel(
            name='HubLeader',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', models.CharField(blank=True, max_length=200, verbose_name='Должность')),
                ('phone', models.CharField(blank=True, max_length=50, verbose_name='Телефон')),
                ('is_active', models.BooleanField(default=True, verbose_name='Активен')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Добавлен')),
                ('student', models.OneToOneField(db_column='student_id', on_delete=django.db.models.deletion.CASCADE, related_name='hub_leader_profile', to='hub.student')),
            ],
            options={
                'verbose_name': 'Руководитель хаба',
                'verbose_name_plural': 'Руководители хаба',
                'db_table': 'hub_leaders',
            },
        ),
        # Добавляем колонку goal в projects (350 символов)
        migrations.AddField(
            model_name='project',
            name='goal',
            field=models.CharField(
                blank=True, max_length=350, null=True,
                verbose_name='Цель проекта',
                db_column='goal'
            ),
            preserve_default=False,
        ),
        # Добавляем колонку text_limited в achievements (350 символов)
        migrations.AddField(
            model_name='achievement',
            name='text_limited',
            field=models.CharField(
                blank=True, max_length=350, null=True,
                verbose_name='Описание (350 симв.)',
                db_column='text_limited'
            ),
            preserve_default=False,
        ),
        # Добавляем колонку images в laboratories (JSON)
        migrations.AddField(
            model_name='laboratory',
            name='images',
            field=models.JSONField(
                blank=True, default=list,
                verbose_name='Фотографии (JSON)',
                db_column='images'
            ),
            preserve_default=False,
        ),
        # Добавляем колонку short_description в laboratories (350 символов)
        migrations.AddField(
            model_name='laboratory',
            name='short_description',
            field=models.CharField(
                blank=True, max_length=350, null=True,
                verbose_name='Краткое описание',
                db_column='short_description'
            ),
            preserve_default=False,
        ),
        # Добавляем колонку active в laboratories
        migrations.AddField(
            model_name='laboratory',
            name='active',
            field=models.BooleanField(
                default=True,
                verbose_name='Активна',
                db_column='active'
            ),
            preserve_default=False,
        ),
    ]
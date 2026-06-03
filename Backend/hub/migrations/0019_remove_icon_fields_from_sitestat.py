from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hub', '0018_create_all_missing_tables'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sitestat',
            name='icon',
        ),
        migrations.RemoveField(
            model_name='sitestat',
            name='icon_class',
        ),
        migrations.AlterField(
            model_name='sitestat',
            name='label',
            field=models.CharField(help_text='Например: "48 участников"', max_length=200, verbose_name='Текст статистики'),
        ),
    ]

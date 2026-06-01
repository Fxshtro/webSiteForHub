from django.db import migrations, models
import django.db.models.deletion


GUIDE_SQL = """
CREATE TABLE IF NOT EXISTS `guide` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `surname` varchar(100) NOT NULL,
    `name` varchar(100) NOT NULL,
    `patronymic` varchar(100) DEFAULT NULL,
    `position` varchar(200) DEFAULT NULL,
    `description` longtext DEFAULT NULL,
    `image` varchar(100) DEFAULT NULL,
    `laboratory_id` bigint DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `guide_laboratory_id_b39dbf5b_fk_laboratories_id` (`laboratory_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"""


class Migration(migrations.Migration):

    dependencies = [
        ('hub', '0012_card_and_lab_image'),
    ]

    operations = [
        migrations.RunSQL(
            sql=GUIDE_SQL,
            reverse_sql=migrations.RunSQL.noop,
        ),
        migrations.SeparateDatabaseAndState(
            state_operations=[
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
            ],
            database_operations=[
                migrations.RunSQL(
                    sql="""
                        CREATE TABLE IF NOT EXISTS `hub_laboratory_guides` (
                            `id` bigint NOT NULL AUTO_INCREMENT,
                            `guide_id` bigint NOT NULL,
                            `laboratory_id` bigint NOT NULL,
                            PRIMARY KEY (`id`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                    """,
                    reverse_sql=migrations.RunSQL.noop,
                ),
            ],
        ),
    ]

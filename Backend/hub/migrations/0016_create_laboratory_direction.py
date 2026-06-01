from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('hub', '0015_create_missing_legacy_tables'),
    ]

    operations = [
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `laboratory_direction` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `direction_id` BIGINT NOT NULL,
                    `laboratory_id` BIGINT NOT NULL,
                    `link` VARCHAR(500) NULL,
                    UNIQUE KEY `unique_direction_laboratory` (`direction_id`, `laboratory_id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `laboratory_direction`',
        ),
    ]

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('hub', '0016_create_laboratory_direction'),
    ]

    operations = [
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `achievements` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `title` VARCHAR(200) NOT NULL,
                    `laboratory_id` BIGINT NULL,
                    `project_id` BIGINT NULL,
                    `text_limited` VARCHAR(350) NULL,
                    `image` VARCHAR(100) NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `achievements`',
        ),
    ]

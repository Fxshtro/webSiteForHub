from django.db import migrations


SITE_ROLE_SQL = """
CREATE TABLE IF NOT EXISTS `site_role` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `title` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"""

DIRECTIONS_SQL = """
CREATE TABLE IF NOT EXISTS `directions` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `title` varchar(50) NOT NULL UNIQUE,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"""


class Migration(migrations.Migration):

    dependencies = [
        ('hub', '0014_alter_guide_laboratory_nullable'),
    ]

    operations = [
        migrations.RunSQL(
            sql=SITE_ROLE_SQL,
            reverse_sql=migrations.RunSQL.noop,
        ),
        migrations.RunSQL(
            sql=DIRECTIONS_SQL,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]

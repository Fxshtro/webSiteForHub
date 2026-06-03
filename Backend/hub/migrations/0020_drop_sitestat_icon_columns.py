from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hub', '0019_remove_icon_fields_from_sitestat'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[],
            database_operations=[
                migrations.RunSQL(
                    "ALTER TABLE hub_site_stats DROP COLUMN IF EXISTS icon",
                    "SELECT 1",
                ),
                migrations.RunSQL(
                    "ALTER TABLE hub_site_stats DROP COLUMN IF EXISTS icon_class",
                    "SELECT 1",
                ),
            ],
        ),
    ]

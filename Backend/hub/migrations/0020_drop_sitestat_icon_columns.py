from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hub', '0019_remove_icon_fields_from_sitestat'),
    ]

    operations = [
        migrations.RunSQL(
            "ALTER TABLE hub_site_stats DROP COLUMN icon",
            "ALTER TABLE hub_site_stats ADD COLUMN icon varchar(500) NOT NULL DEFAULT ''",
        ),
        migrations.RunSQL(
            "ALTER TABLE hub_site_stats DROP COLUMN icon_class",
            "ALTER TABLE hub_site_stats ADD COLUMN icon_class varchar(500) NOT NULL DEFAULT ''",
        ),
    ]

from django.db import migrations

FK_NAME = 'guide_laboratory_id_b39dbf5b_fk_laboratories_id'


class Migration(migrations.Migration):
    dependencies = [
        ('hub', '0013_laboratoryguide'),
    ]

    operations = [
        migrations.RunSQL(
            sql=f"ALTER TABLE guide DROP FOREIGN KEY {FK_NAME};",
            reverse_sql=f"ALTER TABLE guide ADD CONSTRAINT {FK_NAME} FOREIGN KEY (laboratory_id) REFERENCES laboratories(id);",
        ),
        migrations.RunSQL(
            sql="ALTER TABLE guide MODIFY laboratory_id INT(11) NULL;",
            reverse_sql="ALTER TABLE guide MODIFY laboratory_id INT(11) NOT NULL;",
        ),
    ]

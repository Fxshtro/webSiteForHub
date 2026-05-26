from django.db import migrations


def add_missing_columns(apps, schema_editor) -> None:
    alters = {
        "projects": "ADD COLUMN IF NOT EXISTS `goal` VARCHAR(350) NULL",
        "achievements": "ADD COLUMN IF NOT EXISTS `text_limited` VARCHAR(350) NULL",
        "laboratories": "\n".join(
            [
                "ADD COLUMN IF NOT EXISTS `images` LONGTEXT NULL",
                "ADD COLUMN IF NOT EXISTS `short_description` VARCHAR(350) NULL",
                "ADD COLUMN IF NOT EXISTS `active` TINYINT(1) NOT NULL DEFAULT 1",
            ]
        ),
    }

    with schema_editor.connection.cursor() as cursor:
        for table, clause in alters.items():
            cursor.execute(
                """
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE table_schema = DATABASE() AND table_name = %s
                """,
                [table],
            )
            if cursor.fetchone()[0] == 0:
                continue

            for part in clause.split("\n"):
                cursor.execute(f"ALTER TABLE `{table}` {part.strip()}")


def remove_missing_columns(apps, schema_editor) -> None:
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("hub", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(add_missing_columns, remove_missing_columns),
    ]

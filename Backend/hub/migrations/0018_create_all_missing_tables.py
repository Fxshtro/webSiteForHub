from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('hub', '0017_create_achievements'),
    ]

    operations = [
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `type` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `title` VARCHAR(100) NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `type`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `user` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `site_role_id` BIGINT NULL,
                    `login` VARCHAR(50) NOT NULL,
                    `password` VARCHAR(255) NOT NULL,
                    `laboratory_id` BIGINT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `user`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `students` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `surname` VARCHAR(100) NOT NULL,
                    `name` VARCHAR(100) NOT NULL,
                    `patronymic` VARCHAR(100) NULL,
                    `study_group` VARCHAR(50) NOT NULL,
                    `phone_number` VARCHAR(15) NOT NULL,
                    `email` VARCHAR(50) NOT NULL,
                    `university_city` VARCHAR(50) NOT NULL DEFAULT 'Ростов-на-Дону',
                    `task_board` VARCHAR(15) NULL,
                    `telegram_nickname` VARCHAR(50) NULL,
                    `telegram_id` BIGINT NULL,
                    `experience` VARCHAR(7) NULL,
                    `wishes` LONGTEXT NULL,
                    `metaverse_account_link` VARCHAR(2048) NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `students`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `hub_managers` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `name` VARCHAR(200) NOT NULL,
                    `position` VARCHAR(200) NULL,
                    `description` LONGTEXT NULL,
                    `image` VARCHAR(100) NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `hub_managers`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `laboratory_leaders` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `laboratory_id` BIGINT NOT NULL,
                    `student_id` BIGINT NOT NULL,
                    UNIQUE KEY `unique_laboratory_student` (`laboratory_id`, `student_id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `laboratory_leaders`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `students_laboratory` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `student_id` BIGINT NOT NULL,
                    `laboratory_id` BIGINT NULL,
                    UNIQUE KEY `unique_student_laboratory` (`student_id`, `laboratory_id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `students_laboratory`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `student_direction` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `student_id` BIGINT NOT NULL,
                    `direction_id` BIGINT NOT NULL,
                    UNIQUE KEY `unique_student_direction` (`student_id`, `direction_id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `student_direction`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `roles` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `title` VARCHAR(50) NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `roles`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `projects` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `title` VARCHAR(100) NOT NULL,
                    `description` VARCHAR(2048) NULL,
                    `goal` LONGTEXT NULL,
                    `need_report` BOOL NOT NULL DEFAULT 0
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `projects`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `project_links` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `project_id` BIGINT NOT NULL,
                    `title` VARCHAR(200) NOT NULL,
                    `url` VARCHAR(2048) NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `project_links`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `project_laboratory` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `laboratory_id` BIGINT NOT NULL,
                    `project_id` BIGINT NOT NULL,
                    UNIQUE KEY `unique_laboratory_project` (`laboratory_id`, `project_id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `project_laboratory`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `project_roles` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `project_id` BIGINT NOT NULL,
                    `role_id` BIGINT NOT NULL,
                    UNIQUE KEY `unique_project_role` (`project_id`, `role_id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `project_roles`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `student_project_roles` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `student_id` BIGINT NOT NULL,
                    `project_role_id` BIGINT NOT NULL,
                    `present` BOOL NOT NULL DEFAULT 1
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `student_project_roles`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `file` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `link` VARCHAR(2048) NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `file`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `file_achievements` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `file_id` BIGINT NOT NULL,
                    `achievements_id` BIGINT NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `file_achievements`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `file_guide` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `file_id` BIGINT NOT NULL,
                    `guide_id` BIGINT NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `file_guide`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `file_project` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `file_id` BIGINT NOT NULL,
                    `project_id` BIGINT NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `file_project`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `report` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `laboratory_id` BIGINT NULL,
                    `project_id` BIGINT NULL,
                    `date_time` DATETIME(6) NOT NULL,
                    `report_text` LONGTEXT NULL,
                    `file_report_id` BIGINT NULL,
                    `confirmation` BOOL NOT NULL DEFAULT 0
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `report`',
        ),
        migrations.RunSQL(
            sql='''
                CREATE TABLE IF NOT EXISTS `file_report` (
                    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
                    `file_id` BIGINT NOT NULL,
                    `report_id` BIGINT NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ''',
            reverse_sql='DROP TABLE IF EXISTS `file_report`',
        ),
    ]

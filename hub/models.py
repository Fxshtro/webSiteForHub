from django.db import models


# =============================================================================
# ЖУРНАЛ СОБЫТИЙ (своя таблица)
# =============================================================================

class EventLog(models.Model):
    """Журнал событий системы"""
    ACTION_CHOICES = [
        ('project_created', 'Создан проект'),
        ('project_updated', 'Обновлен проект'),
        ('lab_created', 'Создана лаборатория'),
        ('lab_updated', 'Обновлена лаборатория'),
        ('participant_left', 'Участник покинул проект'),
        ('participant_joined', 'Участник присоединился'),
        ('report_created', 'Создан отчёт'),
        ('report_confirmed', 'Отчёт подтверждён'),
    ]
    user_login = models.CharField(max_length=50, blank=True, null=True, verbose_name='Пользователь')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES, verbose_name='Действие')
    entity_type = models.CharField(max_length=50, verbose_name='Тип сущности')
    entity_id = models.IntegerField(verbose_name='ID сущности')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Время')
    details = models.TextField(blank=True, null=True, verbose_name='Детали (JSON)')

    class Meta:
        managed = True
        db_table = 'event_log'
        verbose_name = 'Событие'
        verbose_name_plural = 'Журнал событий'
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.get_action_display()} — {self.entity_type} #{self.entity_id}"


# =============================================================================
# СПРАВОЧНИКИ (managed=False — читаем из существующей БД)
# =============================================================================

class SiteRole(models.Model):
    title = models.CharField(max_length=50, verbose_name='Название роли')

    class Meta:
        db_table = 'site_role'
        managed = False
        verbose_name = 'Роль сайта'
        verbose_name_plural = 'Роли сайта'

    def __str__(self):
        return self.title


class Status(models.Model):
    title = models.CharField(max_length=50, verbose_name='Название статуса')

    class Meta:
        db_table = 'status'
        managed = False
        verbose_name = 'Статус'
        verbose_name_plural = 'Статусы'

    def __str__(self):
        return self.title


class Type(models.Model):
    title = models.CharField(max_length=100, verbose_name='Название типа')

    class Meta:
        db_table = 'type'
        managed = False
        verbose_name = 'Тип'
        verbose_name_plural = 'Типы'

    def __str__(self):
        return self.title


# =============================================================================
# ПОЛЬЗОВАТЕЛИ
# =============================================================================

class User(models.Model):
    site_role = models.ForeignKey(
        SiteRole, on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='site_role_id',
        related_name='users'
    )
    login = models.CharField(max_length=50, unique=True, verbose_name='Логин')
    password = models.CharField(max_length=255, verbose_name='Пароль')
    laboratory = models.ForeignKey(
        'Laboratory', on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='laboratory_id',
        related_name='admin_users'
    )

    class Meta:
        db_table = 'user'
        managed = False
        verbose_name = 'Пользователь админки'
        verbose_name_plural = 'Пользователи админки'

    def __str__(self):
        return self.login


class Student(models.Model):
    surname = models.CharField(max_length=100, verbose_name='Фамилия')
    name = models.CharField(max_length=100, verbose_name='Имя')
    patronymic = models.CharField(max_length=100, blank=True, null=True, verbose_name='Отчество')
    study_group = models.CharField(max_length=50, verbose_name='Учебная группа')
    phone_number = models.CharField(max_length=15, verbose_name='Телефон')
    email = models.EmailField(max_length=50, verbose_name='Email')
    university_city = models.CharField(
        max_length=50, default='Ростов-на-Дону',
        verbose_name='Город университета'
    )
    task_board = models.CharField(max_length=15, blank=True, null=True, verbose_name='Task-борд')
    telegram_nickname = models.CharField(max_length=50, blank=True, null=True, verbose_name='Telegram')
    telegram_id = models.BigIntegerField(blank=True, null=True, verbose_name='Telegram ID')
    experience = models.CharField(
        max_length=7, blank=True, null=True,
        choices=[
            ('Да', 'Да'), ('Нет', 'Нет'),
            ('Немного', 'Немного'),
        ],
        verbose_name='Опыт'
    )
    wishes = models.TextField(blank=True, null=True, verbose_name='Пожелания')
    metaverse_account_link = models.URLField(
        max_length=2048, blank=True, null=True,
        verbose_name='Ссылка на аккаунт в метавселенной'
    )

    class Meta:
        db_table = 'students'
        managed = False
        verbose_name = 'Студент'
        verbose_name_plural = 'Студенты'
        ordering = ['surname', 'name']

    def __str__(self):
        return f"{self.surname} {self.name}"

    @property
    def full_name(self):
        parts = [self.surname, self.name]
        if self.patronymic:
            parts.append(self.patronymic)
        return ' '.join(parts)


class Guide(models.Model):
    surname = models.CharField(max_length=100, verbose_name='Фамилия')
    name = models.CharField(max_length=100, verbose_name='Имя')
    patronymic = models.CharField(max_length=100, verbose_name='Отчество')
    laboratory = models.ForeignKey(
        'Laboratory', on_delete=models.CASCADE,
        db_column='laboratory_id',
        related_name='guides'
    )

    class Meta:
        db_table = 'guide'
        managed = False
        verbose_name = 'Руководитель'
        verbose_name_plural = 'Руководители'
        ordering = ['surname', 'name']

    def __str__(self):
        return f"{self.surname} {self.name} {self.patronymic}"


# =============================================================================
# ЛАБОРАТОРИИ И НАПРАВЛЕНИЯ
# =============================================================================

class Direction(models.Model):
    title = models.CharField(max_length=50, unique=True, verbose_name='Название')

    class Meta:
        db_table = 'directions'
        managed = False
        verbose_name = 'Направление'
        verbose_name_plural = 'Направления'
        ordering = ['title']

    def __str__(self):
        return self.title


class Laboratory(models.Model):
    title = models.CharField(max_length=50, unique=True, verbose_name='Название')
    link = models.URLField(max_length=50, blank=True, null=True, verbose_name='Ссылка на чат')

    class Meta:
        db_table = 'laboratories'
        managed = False
        verbose_name = 'Лаборатория'
        verbose_name_plural = 'Лаборатории'
        ordering = ['title']

    def __str__(self):
        return self.title


class LaboratoryDirection(models.Model):
    direction = models.ForeignKey(
        Direction, on_delete=models.CASCADE,
        db_column='direction_id',
        related_name='laboratory_links'
    )
    laboratory = models.ForeignKey(
        Laboratory, on_delete=models.CASCADE,
        db_column='laboratory_id',
        related_name='direction_links'
    )
    link = models.URLField(max_length=500, blank=True, null=True, verbose_name='Ссылка на чат')

    class Meta:
        db_table = 'laboratory_direction'
        managed = False
        verbose_name = 'Направление лаборатории'
        verbose_name_plural = 'Направления лабораторий'
        unique_together = ['direction', 'laboratory']

    def __str__(self):
        return f"{self.laboratory.title} — {self.direction.title}"


class LaboratoryLeader(models.Model):
    laboratory = models.ForeignKey(
        Laboratory, on_delete=models.CASCADE,
        db_column='laboratory_id',
        related_name='leaders'
    )
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE,
        db_column='student_id',
        related_name='led_laboratories'
    )

    class Meta:
        db_table = 'laboratory_leaders'
        managed = False
        verbose_name = 'Лидер лаборатории'
        verbose_name_plural = 'Лидеры лабораторий'
        unique_together = ['laboratory', 'student']

    def __str__(self):
        return f"{self.student.full_name} — {self.laboratory.title}"


class StudentLaboratory(models.Model):
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE,
        db_column='student_id',
        related_name='laboratory_links'
    )
    laboratory = models.ForeignKey(
        Laboratory, on_delete=models.CASCADE,
        db_column='laboratory_id',
        null=True, blank=True,
        related_name='student_links'
    )

    class Meta:
        db_table = 'students_laboratory'
        managed = False
        verbose_name = 'Студент-лаборатория'
        verbose_name_plural = 'Студенты-лаборатории'
        unique_together = ['student', 'laboratory']

    def __str__(self):
        lab = self.laboratory.title if self.laboratory else 'Без лаборатории'
        return f"{self.student.full_name} — {lab}"


class StudentDirection(models.Model):
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE,
        db_column='student_id',
        related_name='direction_links'
    )
    direction = models.ForeignKey(
        Direction, on_delete=models.CASCADE,
        db_column='direction_id',
        related_name='student_links'
    )

    class Meta:
        db_table = 'student_direction'
        managed = False
        verbose_name = 'Студент-направление'
        verbose_name_plural = 'Студенты-направления'
        unique_together = ['student', 'direction']

    def __str__(self):
        return f"{self.student.full_name} — {self.direction.title}"


# =============================================================================
# ПРОЕКТЫ И РОЛИ
# =============================================================================

class Role(models.Model):
    title = models.CharField(max_length=50, verbose_name='Название роли')

    class Meta:
        db_table = 'roles'
        managed = False
        verbose_name = 'Роль проекта'
        verbose_name_plural = 'Роли проектов'
        ordering = ['title']

    def __str__(self):
        return self.title


class Project(models.Model):
    title = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.TextField(max_length=2048, blank=True, null=True, verbose_name='Описание')
    need_report = models.BooleanField(default=False, verbose_name='Требуется отчёт')

    class Meta:
        db_table = 'projects'
        managed = False
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        ordering = ['title']

    def __str__(self):
        return self.title


class ProjectLaboratory(models.Model):
    laboratory = models.ForeignKey(
        Laboratory, on_delete=models.CASCADE,
        db_column='laboratory_id',
        related_name='project_links'
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE,
        db_column='project_id',
        related_name='laboratory_links'
    )

    class Meta:
        db_table = 'project_laboratory'
        managed = False
        verbose_name = 'Проект-лаборатория'
        verbose_name_plural = 'Проекты-лаборатории'
        unique_together = ['laboratory', 'project']

    def __str__(self):
        return f"{self.project.title} — {self.laboratory.title}"


class ProjectRole(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE,
        db_column='project_id',
        related_name='role_slots'
    )
    role = models.ForeignKey(
        Role, on_delete=models.CASCADE,
        db_column='role_id',
        related_name='project_slots'
    )

    class Meta:
        db_table = 'project_roles'
        managed = False
        verbose_name = 'Позиция в проекте'
        verbose_name_plural = 'Позиции в проектах'
        unique_together = ['project', 'role']

    def __str__(self):
        return f"{self.project.title} — {self.role.title}"


class StudentProjectRole(models.Model):
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE,
        db_column='student_id',
        related_name='project_roles'
    )
    project_role = models.ForeignKey(
        ProjectRole, on_delete=models.CASCADE,
        db_column='project_role_id',
        related_name='assigned_students'
    )
    present = models.BooleanField(
        default=True,
        verbose_name='Действующий участник'
    )

    class Meta:
        db_table = 'student_project_roles'
        managed = False
        verbose_name = 'Участник проекта'
        verbose_name_plural = 'Участники проектов'
        ordering = ['-id']

    def __str__(self):
        status = "активен" if self.present else "покинул"
        return f"{self.student.full_name} — {self.project_role} ({status})"


# =============================================================================
# ДОСТИЖЕНИЯ И ФАЙЛЫ
# =============================================================================

class File(models.Model):
    link = models.URLField(max_length=2048, verbose_name='Ссылка на файл')

    class Meta:
        db_table = 'file'
        managed = False
        verbose_name = 'Файл'
        verbose_name_plural = 'Файлы'

    def __str__(self):
        return self.link.split('/')[-1] if self.link else str(self.id)


class Achievement(models.Model):
    title = models.CharField(max_length=200, verbose_name='Название')
    laboratory = models.ForeignKey(
        Laboratory, on_delete=models.CASCADE,
        null=True, blank=True,
        db_column='laboratory_id',
        related_name='achievements'
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE,
        null=True, blank=True,
        db_column='project_id',
        related_name='achievements'
    )
    text = models.TextField(blank=True, null=True, verbose_name='Текст')
    link = models.URLField(max_length=2048, blank=True, null=True, verbose_name='Ссылка')
    file_achievements = models.ForeignKey(
        File, on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='file_achievements_id',
        related_name='achievement_direct'
    )

    class Meta:
        db_table = 'achievements'
        managed = False
        verbose_name = 'Достижение'
        verbose_name_plural = 'Достижения'
        ordering = ['-id']

    def __str__(self):
        return self.title


class FileAchievement(models.Model):
    file = models.ForeignKey(
        File, on_delete=models.CASCADE,
        db_column='file_id',
        related_name='fileachievement_links'
    )
    achievements = models.ForeignKey(
        Achievement, on_delete=models.CASCADE,
        db_column='achievements_id',
        related_name='file_links'
    )

    class Meta:
        db_table = 'file_achievements'
        managed = False
        verbose_name = 'Файл достижения'
        verbose_name_plural = 'Файлы достижений'


class FileGuide(models.Model):
    file = models.ForeignKey(
        File, on_delete=models.CASCADE,
        db_column='file_id',
        related_name='guide_links'
    )
    guide = models.ForeignKey(
        Guide, on_delete=models.CASCADE,
        db_column='guide_id',
        related_name='file_links'
    )

    class Meta:
        db_table = 'file_guide'
        managed = False
        verbose_name = 'Файл руководителя'
        verbose_name_plural = 'Файлы руководителей'


class FileProject(models.Model):
    file = models.ForeignKey(
        File, on_delete=models.CASCADE,
        db_column='file_id',
        related_name='project_links'
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE,
        db_column='project_id',
        related_name='file_links'
    )

    class Meta:
        db_table = 'file_project'
        managed = False
        verbose_name = 'Файл проекта'
        verbose_name_plural = 'Файлы проектов'


# =============================================================================
# ОТЧЁТЫ
# =============================================================================

class Report(models.Model):
    laboratory = models.ForeignKey(
        Laboratory, on_delete=models.CASCADE,
        null=True, blank=True,
        db_column='laboratory_id',
        related_name='reports'
    )
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE,
        null=True, blank=True,
        db_column='project_id',
        related_name='reports'
    )
    date_time = models.DateTimeField(auto_now_add=True, verbose_name='Дата/время')
    report_text = models.TextField(blank=True, null=True, verbose_name='Текст отчёта')
    file_report = models.ForeignKey(
        File, on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='file_report_id',
        related_name='report_direct'
    )
    confirmation = models.BooleanField(default=False, verbose_name='Подтверждён')

    class Meta:
        db_table = 'report'
        managed = False
        verbose_name = 'Отчёт'
        verbose_name_plural = 'Отчёты'
        ordering = ['-date_time']

    def __str__(self):
        proj = self.project.title if self.project else 'Без проекта'
        return f"{proj} — {self.date_time.strftime('%d.%m.%Y')}"


class FileReport(models.Model):
    file = models.ForeignKey(
        File, on_delete=models.CASCADE,
        db_column='file_id',
        related_name='filereport_links'
    )
    report = models.ForeignKey(
        Report, on_delete=models.CASCADE,
        db_column='report_id',
        related_name='file_links'
    )

    class Meta:
        db_table = 'file_report'
        managed = False
        verbose_name = 'Файл отчёта'
        verbose_name_plural = 'Файлы отчётов'
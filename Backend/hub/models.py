from django.db import models
from django.core.validators import MaxLengthValidator
from django.core.exceptions import ValidationError


# =============================================================================
# ВАЛИДАТОРЫ
# =============================================================================

def validate_image_4x3(file):
    """Изображение 4:3, максимум 2МБ, одна штука"""
    from PIL import Image
    from django.core.exceptions import ValidationError

    if file.size > 2 * 1024 * 1024:
        raise ValidationError('Размер изображения не может превышать 2МБ')

    try:
        img = Image.open(file)
        width, height = img.size
        aspect_ratio = width / height
        expected_ratio = 4 / 3
        tolerance = 0.15
        if abs(aspect_ratio - expected_ratio) > tolerance:
            raise ValidationError(
                f'Изображение должно быть соотношения 4:3 (текущее: {width}x{height})'
            )
        file.seek(0)
    except Exception:
        pass


# =============================================================================
# НАСТРОЙКИ ГЛАВНОЙ СТРАНИЦЫ
# =============================================================================

class SiteContent(models.Model):
    about_title = models.CharField(max_length=200, default='О ХАБЕ', verbose_name='Заголовок раздела "О хабе"')
    about_intro = models.TextField(default='Хаб — это экосистема студенческих лабораторий', verbose_name='Текст "О хабе" (первая карточка)')
    about_mission = models.TextField(default='Мы объединяем студентов...', verbose_name='Текст миссии (вторая карточка)')
    labs_subtitle = models.TextField(default='Каждая лаборатория — это команда и своя экспертиза. Выбери направление по душе.', verbose_name='Подзаголовок раздела лабораторий')
    hero_subtitle = models.TextField(default='Открытая площадка для студенческих лабораторий.', verbose_name='Подзаголовок героя')
    hero_description = models.TextField(default='Исследуй, создавай, достигай вместе с нами!', verbose_name='Описание героя (жирная часть)')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')

    class Meta:
        db_table = 'hub_site_content'
        managed = True
        verbose_name = 'Настройка главной страницы'
        verbose_name_plural = 'Настройки главной страницы'

    def __str__(self):
        return 'Настройки главной страницы'


class SiteStat(models.Model):
    site_content = models.ForeignKey(
        SiteContent, on_delete=models.CASCADE,
        related_name='stats'
    )
    label = models.CharField(max_length=200, verbose_name='Текст статистики', help_text='Например: "48 участников"')
    icon = models.CharField(max_length=500, verbose_name='Путь к иконке', help_text='Например: /images/ui/icoHumans.svg')
    icon_class = models.CharField(max_length=500, blank=True, default='', verbose_name='CSS-классы для иконки', help_text='Позиционирование иконки')
    order = models.PositiveIntegerField(default=0, verbose_name='Порядок')

    class Meta:
        db_table = 'hub_site_stats'
        managed = True
        verbose_name = 'Элемент статистики'
        verbose_name_plural = 'Элементы статистики'
        ordering = ['order']

    def __str__(self):
        return self.label


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
    title = models.CharField(
        max_length=50, verbose_name='Название',
        help_text='Уровень доступа пользователя: Администратор (полный доступ), '
                  'Лидер лаборатории (управление своей лаб.), '
                  'Менеджер проекта (управление проектом), '
                  'Студент (только чтение)'
    )

    class Meta:
        db_table = 'site_role'
        managed = False
        verbose_name = 'Уровень доступа'
        verbose_name_plural = 'Уровни доступа (кто может заходить в админку)'

    def __str__(self):
        return self.title


class Type(models.Model):
    title = models.CharField(max_length=100, verbose_name='Название категории')

    class Meta:
        db_table = 'type'
        managed = False
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории (типы проектов/достижений)'

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
    position = models.CharField(max_length=200, blank=True, null=True, verbose_name='Должность')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    image = models.ImageField(upload_to='guides/', blank=True, null=True, verbose_name='Фото',
        help_text='Соотношение 4:3. Идеальное разрешение: 1200×900 px. Максимум 2 МБ.')
    laboratory = models.ForeignKey(
        'Laboratory', on_delete=models.SET_NULL,
        db_column='laboratory_id',
        blank=True, null=True,
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


class HubManager(models.Model):
    name = models.CharField(max_length=200, verbose_name='ФИО')
    position = models.CharField(max_length=200, blank=True, null=True, verbose_name='Должность')
    description = models.TextField(blank=True, null=True, verbose_name='Описание')
    image = models.ImageField(upload_to='managers/', blank=True, null=True, verbose_name='Фото')

    class Meta:
        db_table = 'hub_managers'
        managed = False
        verbose_name = 'Руководитель хаба'
        verbose_name_plural = 'Руководители хаба'
        ordering = ['name']

    def __str__(self):
        return self.name


class HubLeader(models.Model):
    user = models.OneToOneField(
        'User', on_delete=models.CASCADE,
        db_column='user_id', related_name='hub_leader_profile'
    )
    full_name = models.CharField(max_length=200, blank=True, verbose_name='ФИО')
    position = models.CharField(max_length=200, blank=True, verbose_name='Должность')
    degree = models.CharField(max_length=200, blank=True, verbose_name='Учёная степень / звание')
    phone = models.CharField(max_length=20, blank=True, verbose_name='Телефон')
    email = models.EmailField(max_length=100, blank=True, verbose_name='Email')
    image = models.ImageField(upload_to='hub_leaders/', blank=True, null=True, verbose_name='Фото')
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Добавлен')

    class Meta:
        db_table = 'hub_leaders'
        managed = True
        verbose_name = 'Руководитель хаба'
        verbose_name_plural = 'Руководители хаба'
        ordering = ['full_name']

    def __str__(self):
        return self.full_name or (f"{self.user.login} ({self.position})" if self.position else self.user.login)


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
    slug = models.CharField(max_length=50, unique=True, blank=True, null=True, verbose_name='ЧПУ (slug)')
    link = models.URLField(max_length=50, blank=True, null=True, verbose_name='Ссылка на чат')
    active = models.BooleanField(default=True, verbose_name='Активна', db_column='active')
    images = models.TextField(default='', blank=True, verbose_name='Изображения (JSON)')
    short_description = models.CharField(max_length=350, blank=True, null=True, verbose_name='Краткое описание')
    description = models.TextField(blank=True, null=True, verbose_name='Полное описание')
    class Meta:
        db_table = 'laboratories'
        managed = False
        verbose_name = 'Лаборатория'
        verbose_name_plural = 'Лаборатории'
        ordering = ['title']

    def __str__(self):
        return self.title


class LabPhoto(models.Model):
    card_image = models.ImageField(upload_to='labs/', verbose_name='Фото карточки')
    lab_image = models.ImageField(upload_to='labs/', verbose_name='Фото внутри лаборатории (колба)', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'hub_lab_photos'
        verbose_name = 'Фото лаборатории'
        verbose_name_plural = 'Фото лабораторий'

    def __str__(self):
        return self.card_image.name


class LaboratoryImage(models.Model):
    laboratory = models.ForeignKey(
        Laboratory, on_delete=models.CASCADE,
        related_name='uploaded_images',
        verbose_name='Лаборатория'
    )
    lab_photo = models.ForeignKey(
        LabPhoto, on_delete=models.CASCADE,
        verbose_name='Фото'
    )

    class Meta:
        managed = True
        db_table = 'hub_laboratory_images'
        verbose_name = 'Изображение лаборатории'
        verbose_name_plural = 'Изображения лабораторий'

    def __str__(self):
        return f'{self.laboratory.title} — {self.lab_photo.card_image.name}'


class LaboratoryGuide(models.Model):
    laboratory = models.ForeignKey(
        Laboratory, on_delete=models.CASCADE,
        related_name='guide_links',
        verbose_name='Лаборатория'
    )
    guide = models.ForeignKey(
        'Guide', on_delete=models.CASCADE,
        verbose_name='Руководитель'
    )

    class Meta:
        managed = True
        db_table = 'hub_laboratory_guides'
        verbose_name = 'Руководитель лаборатории'
        verbose_name_plural = 'Руководители лаборатории'

    def __str__(self):
        return f'{self.laboratory.title} — {self.guide}'


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
    title = models.CharField(max_length=50, verbose_name='Название роли в проекте',
                             help_text='Например: Дизайнер, Разработчик, Проектный менеджер, Тестировщик')

    class Meta:
        db_table = 'roles'
        managed = False
        verbose_name = 'Роль в проекте'
        verbose_name_plural = 'Роли в проектах (добавляются внутри Проекта)'

    def __str__(self):
        return self.title


class LabRole(models.Model):
    laboratory = models.ForeignKey(
        Laboratory, on_delete=models.CASCADE,
        related_name='lab_roles',
        verbose_name='Лаборатория'
    )
    title = models.CharField(max_length=50, verbose_name='Название роли',
                             help_text='Например: Дизайнер, Разработчик, Проектный менеджер, Тестировщик')

    class Meta:
        managed = True
        db_table = 'hub_lab_roles'
        verbose_name = 'Роль лаборатории'
        verbose_name_plural = 'Роли лаборатории'
        unique_together = ['laboratory', 'title']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        result = super().save(*args, **kwargs)
        Role.objects.get_or_create(title=self.title)
        return result


class Project(models.Model):
    title = models.CharField(max_length=100, unique=True, verbose_name='Название')
    description = models.CharField(
        max_length=2048, blank=True, null=True,
        verbose_name='Короткое описание на карточке'
    )
    goal = models.TextField(
        blank=True, null=True,
        verbose_name='Описание',
        db_column='goal',
        validators=[MaxLengthValidator(350)]
    )
    need_report = models.BooleanField(default=False, verbose_name='Требуется отчёт')

    class Meta:
        db_table = 'projects'
        managed = False
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        ordering = ['title']

    def __str__(self):
        return self.title


class ProjectLink(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE,
        db_column='project_id',
        related_name='links'
    )
    title = models.CharField(max_length=200, verbose_name='Текст ссылки')
    url = models.URLField(max_length=2048, verbose_name='Ссылка')

    class Meta:
        db_table = 'project_links'
        managed = False
        verbose_name = 'Ссылка проекта'
        verbose_name_plural = 'Ссылки проекта'

    def __str__(self):
        return f"{self.title} — {self.project.title}"


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
        ordering = ['id', 'student__surname', 'student__name']

    def __str__(self):
        status = "активен" if self.present else "покинул"
        return f"{self.student.full_name} — {self.project_role} ({status})"


# =============================================================================
# ДОСТИЖЕНИЯ И ФАЙЛЫ
# =============================================================================

class File(models.Model):
    link = models.URLField(max_length=2048, verbose_name='Ссылка на внешний документ',
                           help_text='URL на файл в Google Drive, Dropbox, Яндекс.Диск и т.д.')

    class Meta:
        db_table = 'file'
        managed = False
        verbose_name = 'Ссылка на документ'
        verbose_name_plural = 'Ссылки на документы (Google Drive, Dropbox и т.д.)'

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
    description = models.CharField(
        max_length=350, blank=True, null=True,
        verbose_name='Текст',
        db_column='text_limited',
        validators=[MaxLengthValidator(350)]
    )
    image = models.ImageField(upload_to='achievements/', blank=True, null=True, verbose_name='Фото',
        help_text='Соотношение 4:3. Идеальное разрешение: 1200×900 px. Максимум 2 МБ.')

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
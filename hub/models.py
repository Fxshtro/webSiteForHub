from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
import json


class User(AbstractUser):
    
    ROLE_CHOICES = [
        ('admin', 'Администратор'),
        ('lab_lead', 'Лидер лаборатории'),
        ('project_manager', 'Менеджер проекта'),
        ('student', 'Студент'),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='student',
        verbose_name='Роль'
    )
    metaverse_link = models.URLField(
        blank=True,
        null=True,
        verbose_name='Ссылка на метавселенную'
    )
    managed_lab = models.ForeignKey(
        'Lab',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='leaders',
        verbose_name='Управляемая лаборатория',
        limit_choices_to={'active': True}
    )
    
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def is_admin(self):
        return self.role == 'admin'
    
    def is_lab_lead(self):
        return self.role == 'lab_lead'
    
    def is_project_manager(self):
        return self.role == 'project_manager'
    
    def is_student(self):
        return self.role == 'student'


class Direction(models.Model):
    
    name = models.CharField(max_length=200, verbose_name='Название')
    
    class Meta:
        verbose_name = 'Направление'
        verbose_name_plural = 'Направления'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Lab(models.Model):
    
    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    direction = models.ForeignKey(
        Direction,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='labs',
        verbose_name='Направление'
    )
    active = models.BooleanField(default=True, verbose_name='Активна')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создана')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлена')
    
    class Meta:
        verbose_name = 'Лаборатория'
        verbose_name_plural = 'Лаборатории'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Project(models.Model):
    
    title = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    concept_file = models.FileField(
        upload_to='concepts/',
        blank=True,
        null=True,
        verbose_name='Файл концепции'
    )
    lab = models.ForeignKey(
        Lab,
        on_delete=models.CASCADE,
        related_name='projects',
        verbose_name='Лаборатория'
    )
    active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлен')
    
    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class ProjectParticipant(models.Model):
    
    ROLE_CHOICES = [
        ('manager', 'Менеджер'),
        ('developer', 'Разработчик'),
        ('designer', 'Дизайнер'),
        ('analyst', 'Аналитик'),
        ('tester', 'Тестировщик'),
        ('other', 'Другое'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='project_participations',
        verbose_name='Пользователь'
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='participants',
        verbose_name='Проект'
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        verbose_name='Роль в проекте'
    )
    joined_at = models.DateTimeField(auto_now_add=True, verbose_name='Присоединился')
    left_at = models.DateTimeField(null=True, blank=True, verbose_name='Покинул проект')
    
    class Meta:
        verbose_name = 'Участник проекта'
        verbose_name_plural = 'Участники проектов'
        unique_together = ['user', 'project']
        ordering = ['-joined_at']
    
    def __str__(self):
        status = "бывший" if self.left_at else "активный"
        return f"{self.user.username} - {self.project.title} ({status})"
    
    def is_active(self):
        return self.left_at is None


class Achievement(models.Model):
    
    title = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    image = models.ImageField(
        upload_to='achievements/',
        blank=True,
        null=True,
        verbose_name='Изображение'
    )
    lab = models.ForeignKey(
        Lab,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='achievements',
        verbose_name='Лаборатория'
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='achievements',
        verbose_name='Проект'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    
    class Meta:
        verbose_name = 'Достижение'
        verbose_name_plural = 'Достижения'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def clean(self):
        if not self.lab and not self.project:
            raise ValidationError('Достижение должно быть связано либо с лабораторией, либо с проектом')
        if self.lab and self.project:
            raise ValidationError('Достижение может быть связано только с лабораторией ИЛИ проектом')
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        from django.urls import reverse
        try:
            return reverse('achievement-detail', args=[str(self.id)])
        except:
            return None


class EventLog(models.Model):
    
    ACTION_CHOICES = [
        ('file_download', 'Скачивание файла'),
        ('report_export', 'Экспорт отчета'),
        ('participant_left', 'Участник покинул проект'),
        ('project_created', 'Создан проект'),
        ('project_updated', 'Обновлен проект'),
        ('lab_created', 'Создана лаборатория'),
        ('lab_updated', 'Обновлена лаборатория'),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='event_logs',
        verbose_name='Пользователь'
    )
    action = models.CharField(
        max_length=50,
        choices=ACTION_CHOICES,
        verbose_name='Действие'
    )
    entity_type = models.CharField(
        max_length=50,
        verbose_name='Тип сущности'
    )
    entity_id = models.IntegerField(verbose_name='ID сущности')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Время')
    details = models.JSONField(
        default=dict,
        blank=True,
        verbose_name='Дополнительные данные'
    )
    
    class Meta:
        verbose_name = 'Событие'
        verbose_name_plural = 'Журнал событий'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.get_action_display()} - {self.entity_type} #{self.entity_id}"


class HubSettings(models.Model):
    
    name = models.CharField(
        max_length=200,
        default='Студенческий Цифровой Хаб',
        verbose_name='Название Хаба'
    )
    description = models.TextField(blank=True, verbose_name='Описание Хаба')
    contact_email = models.EmailField(blank=True, verbose_name='Контактный email')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')
    
    class Meta:
        verbose_name = 'Настройки Хаба'
        verbose_name_plural = 'Настройки Хаба'
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


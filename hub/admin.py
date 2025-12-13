from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.db import models
from django.http import HttpResponse
from django.utils.html import format_html
from django.urls import reverse
from django.utils import timezone
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from openpyxl.utils import get_column_letter
from .models import (
    User, Direction, Lab, Project, ProjectParticipant,
    Achievement, EventLog, HubSettings
)
from .utils import log_event


# ==================== Вспомогательные функции ====================

def export_to_excel(modeladmin, request, queryset):
    """Экспорт данных в Excel"""
    wb = Workbook()
    ws = wb.active
    ws.title = modeladmin.model._meta.verbose_name_plural
    
    # Заголовки
    headers = []
    if modeladmin.model == Project:
        headers = ['ID', 'Название', 'Лаборатория', 'Активен', 'Создан', 'Участников']
    elif modeladmin.model == Lab:
        headers = ['ID', 'Название', 'Направление', 'Активна', 'Проектов', 'Создана']
    elif modeladmin.model == ProjectParticipant:
        headers = ['ID', 'Пользователь', 'Проект', 'Роль', 'Присоединился', 'Покинул']
    elif modeladmin.model == Achievement:
        headers = ['ID', 'Название', 'Лаборатория', 'Проект', 'Создано']
    elif modeladmin.model == EventLog:
        headers = ['ID', 'Пользователь', 'Действие', 'Сущность', 'Время', 'Детали']
    
    # Стили для заголовков
    header_fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF")
    
    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num)
        cell.value = header
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")
    
    # Данные
    for row_num, obj in enumerate(queryset, 2):
        if modeladmin.model == Project:
            ws.cell(row=row_num, column=1, value=obj.id)
            ws.cell(row=row_num, column=2, value=obj.title)
            ws.cell(row=row_num, column=3, value=str(obj.lab))
            ws.cell(row=row_num, column=4, value='Да' if obj.active else 'Нет')
            ws.cell(row=row_num, column=5, value=obj.created_at.strftime('%d.%m.%Y %H:%M'))
            ws.cell(row=row_num, column=6, value=obj.participants.filter(left_at__isnull=True).count())
        elif modeladmin.model == Lab:
            ws.cell(row=row_num, column=1, value=obj.id)
            ws.cell(row=row_num, column=2, value=obj.name)
            ws.cell(row=row_num, column=3, value=str(obj.direction) if obj.direction else '')
            ws.cell(row=row_num, column=4, value='Да' if obj.active else 'Нет')
            ws.cell(row=row_num, column=5, value=obj.projects.count())
            ws.cell(row=row_num, column=6, value=obj.created_at.strftime('%d.%m.%Y %H:%M'))
        elif modeladmin.model == ProjectParticipant:
            ws.cell(row=row_num, column=1, value=obj.id)
            ws.cell(row=row_num, column=2, value=str(obj.user))
            ws.cell(row=row_num, column=3, value=str(obj.project))
            ws.cell(row=row_num, column=4, value=obj.get_role_display())
            ws.cell(row=row_num, column=5, value=obj.joined_at.strftime('%d.%m.%Y %H:%M'))
            ws.cell(row=row_num, column=6, value=obj.left_at.strftime('%d.%m.%Y %H:%M') if obj.left_at else 'Активен')
        elif modeladmin.model == Achievement:
            ws.cell(row=row_num, column=1, value=obj.id)
            ws.cell(row=row_num, column=2, value=obj.title)
            ws.cell(row=row_num, column=3, value=str(obj.lab) if obj.lab else '')
            ws.cell(row=row_num, column=4, value=str(obj.project) if obj.project else '')
            ws.cell(row=row_num, column=5, value=obj.created_at.strftime('%d.%m.%Y %H:%M'))
        elif modeladmin.model == EventLog:
            ws.cell(row=row_num, column=1, value=obj.id)
            ws.cell(row=row_num, column=2, value=str(obj.user) if obj.user else '')
            ws.cell(row=row_num, column=3, value=obj.get_action_display())
            ws.cell(row=row_num, column=4, value=f"{obj.entity_type} #{obj.entity_id}")
            ws.cell(row=row_num, column=5, value=obj.timestamp.strftime('%d.%m.%Y %H:%M:%S'))
            ws.cell(row=row_num, column=6, value=str(obj.details))
    
    # Автоматическая ширина колонок
    for col_num in range(1, len(headers) + 1):
        column_letter = get_column_letter(col_num)
        ws.column_dimensions[column_letter].width = 20
    
    # Логирование
    log_event(
        user=request.user,
        action='report_export',
        entity_type=modeladmin.model.__name__,
        entity_id=0,
        details={'count': queryset.count(), 'model': modeladmin.model.__name__}
    )
    
    # Ответ
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    filename = f"{modeladmin.model._meta.verbose_name_plural}_{timezone.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    wb.save(response)
    return response

export_to_excel.short_description = "Экспортировать выбранные в Excel"


# ==================== Админ-классы ====================

@admin.register(User)
class UserAdmin(ModelAdmin):
    list_display = ['username', 'email', 'role', 'managed_lab', 'is_active']
    list_filter = ['role', 'is_active']
    search_fields = ['username', 'email']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Персональная информация', {'fields': ('first_name', 'last_name', 'email')}),
        ('Роль и доступ', {'fields': ('role', 'managed_lab', 'metaverse_link')}),
        ('Права доступа', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Важные даты', {'fields': ('last_login', 'date_joined')}),
    )
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_admin():
            return qs
        elif request.user.is_lab_lead():
            # Лидер видит только пользователей своей лабы
            if request.user.managed_lab:
                return qs.filter(
                    models.Q(managed_lab=request.user.managed_lab) |
                    models.Q(project_participations__project__lab=request.user.managed_lab)
                ).distinct()
        return qs.none()


@admin.register(Direction)
class DirectionAdmin(ModelAdmin):
    list_display = ['name', 'labs_count']
    search_fields = ['name']
    
    def labs_count(self, obj):
        return obj.labs.count()
    labs_count.short_description = 'Лабораторий'


@admin.register(Lab)
class LabAdmin(ModelAdmin):
    list_display = ['name', 'direction', 'active', 'projects_count', 'created_at']
    list_filter = ['active', 'direction', 'created_at']
    search_fields = ['name', 'description']
    actions = [export_to_excel]
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_admin():
            return qs
        elif request.user.is_lab_lead():
            # Лидер видит только свою лабу
            if request.user.managed_lab:
                return qs.filter(id=request.user.managed_lab.id)
        return qs.none()
    
    def projects_count(self, obj):
        return obj.projects.count()
    projects_count.short_description = 'Проектов'


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = ['title', 'lab', 'active', 'participants_count', 'created_at', 'concept_file_link']
    list_filter = ['active', 'lab', 'created_at']
    search_fields = ['title', 'description']
    actions = [export_to_excel]
    
    def concept_file_link(self, obj):
        if obj.concept_file:
            url = reverse('download_concept_file', args=[obj.id])
            return format_html('<a href="{}" target="_blank">Скачать</a>', url)
        return '-'
    concept_file_link.short_description = 'Файл концепции'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_admin():
            return qs
        elif request.user.is_lab_lead():
            # Лидер видит проекты своей лабы
            if request.user.managed_lab:
                return qs.filter(lab=request.user.managed_lab)
        elif request.user.is_project_manager():
            # Менеджер видит только свой проект
            managed_projects = ProjectParticipant.objects.filter(
                user=request.user,
                role='manager',
                left_at__isnull=True
            ).values_list('project_id', flat=True)
            return qs.filter(id__in=managed_projects)
        return qs.none()
    
    def participants_count(self, obj):
        return obj.participants.filter(left_at__isnull=True).count()
    participants_count.short_description = 'Участников'


@admin.register(ProjectParticipant)
class ProjectParticipantAdmin(ModelAdmin):
    list_display = ['user', 'project', 'role', 'joined_at', 'left_at', 'is_active_display']
    list_filter = ['role', 'left_at', 'project__lab']
    search_fields = ['user__username', 'project__title']
    actions = [export_to_excel, 'mark_as_left']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_admin():
            return qs
        elif request.user.is_lab_lead():
            # Лидер видит участников проектов своей лабы
            if request.user.managed_lab:
                return qs.filter(project__lab=request.user.managed_lab)
        elif request.user.is_project_manager():
            # Менеджер видит участников своего проекта
            managed_projects = ProjectParticipant.objects.filter(
                user=request.user,
                role='manager',
                left_at__isnull=True
            ).values_list('project_id', flat=True)
            return qs.filter(project_id__in=managed_projects)
        return qs.none()
    
    def is_active_display(self, obj):
        if obj.left_at:
            return format_html('<span style="color: red;">Бывший</span>')
        return format_html('<span style="color: green;">Активный</span>')
    is_active_display.short_description = 'Статус'
    
    def mark_as_left(self, request, queryset):
        """Пометить участников как покинувших проект"""
        count = 0
        for participant in queryset.filter(left_at__isnull=True):
            participant.left_at = timezone.now()
            participant.save()
            count += 1
            # Логирование
            log_event(
                user=request.user,
                action='participant_left',
                entity_type='ProjectParticipant',
                entity_id=participant.id,
                details={
                    'user': str(participant.user),
                    'project': str(participant.project)
                }
            )
        self.message_user(request, f'{count} участников помечено как покинувших проект.')
    mark_as_left.short_description = "Пометить как покинувших проект"
    
    def delete_model(self, request, obj):
        """Переопределяем удаление - вместо удаления помечаем как покинувшего"""
        if obj.left_at is None:
            obj.left_at = timezone.now()
            obj.save()
            log_event(
                user=request.user,
                action='participant_left',
                entity_type='ProjectParticipant',
                entity_id=obj.id,
                details={
                    'user': str(obj.user),
                    'project': str(obj.project)
                }
            )
    
    def delete_queryset(self, request, queryset):
        """Переопределяем массовое удаление"""
        self.mark_as_left(request, queryset)


@admin.register(Achievement)
class AchievementAdmin(ModelAdmin):
    list_display = ['title', 'lab', 'project', 'created_at']
    list_filter = ['created_at', 'lab']
    search_fields = ['title', 'description']
    actions = [export_to_excel]
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_admin():
            return qs
        elif request.user.is_lab_lead():
            # Лидер видит достижения своей лабы
            if request.user.managed_lab:
                return qs.filter(
                    models.Q(lab=request.user.managed_lab) |
                    models.Q(project__lab=request.user.managed_lab)
                )
        elif request.user.is_project_manager():
            # Менеджер видит достижения своего проекта
            managed_projects = ProjectParticipant.objects.filter(
                user=request.user,
                role='manager',
                left_at__isnull=True
            ).values_list('project_id', flat=True)
            return qs.filter(project_id__in=managed_projects)
        return qs.none()


@admin.register(EventLog)
class EventLogAdmin(ModelAdmin):
    list_display = ['timestamp', 'user', 'action', 'entity_type', 'entity_id']
    list_filter = ['action', 'entity_type', 'timestamp']
    search_fields = ['user__username', 'entity_type']
    readonly_fields = ['user', 'action', 'entity_type', 'entity_id', 'timestamp', 'details']
    actions = [export_to_excel]
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_admin()


@admin.register(HubSettings)
class HubSettingsAdmin(ModelAdmin):
    list_display = ['name', 'contact_email', 'updated_at']
    fields = ['name', 'description', 'contact_email']
    
    def has_add_permission(self, request):
        # Разрешаем только одну запись
        return not HubSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_admin()


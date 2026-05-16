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
    Achievement, EventLog, HubSettings, HubLeader
)
from .utils import log_event


def export_to_excel(modeladmin, request, queryset):
    wb = Workbook()
    ws = wb.active
    ws.title = modeladmin.model._meta.verbose_name_plural

    headers = []
    if modeladmin.model == Project:
        headers = ['ID', 'Название', 'Лаборатория', 'Активен', 'Создан', 'Участников']
    elif modeladmin.model == Lab:
        headers = ['ID', 'Название', 'Направления', 'Активна', 'Проектов', 'Создана']
    elif modeladmin.model == ProjectParticipant:
        headers = ['ID', 'Пользователь', 'Проект', 'Роль', 'Присоединился', 'Покинул']
    elif modeladmin.model == Achievement:
        headers = ['ID', 'Название', 'Лаборатория', 'Проект', 'Создано']
    elif modeladmin.model == EventLog:
        headers = ['ID', 'Пользователь', 'Действие', 'Сущность', 'Время', 'Детали']
    elif modeladmin.model == HubLeader:
        headers = ['ID', 'Пользователь', 'Должность', 'Телефон', 'Активен', 'Добавлен']

    header_fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF")

    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num)
        cell.value = header
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")

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
            ws.cell(row=row_num, column=3, value=', '.join([d.name for d in obj.directions.all()]))
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
        elif modeladmin.model == HubLeader:
            ws.cell(row=row_num, column=1, value=obj.id)
            ws.cell(row=row_num, column=2, value=str(obj.user))
            ws.cell(row=row_num, column=3, value=obj.position)
            ws.cell(row=row_num, column=4, value=obj.phone)
            ws.cell(row=row_num, column=5, value='Да' if obj.is_active else 'Нет')
            ws.cell(row=row_num, column=6, value=obj.created_at.strftime('%d.%m.%Y'))

    for col_num in range(1, len(headers) + 1):
        column_letter = get_column_letter(col_num)
        ws.column_dimensions[column_letter].width = 20

    log_event(
        user=request.user,
        action='report_export',
        entity_type=modeladmin.model.__name__,
        entity_id=0,
        details={'count': queryset.count(), 'model': modeladmin.model.__name__}
    )

    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    filename = f"{modeladmin.model._meta.verbose_name_plural}_{timezone.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    wb.save(response)
    return response

export_to_excel.short_description = "Экспортировать выбранные в Excel"


# === USER ADMIN ===
@admin.register(User)
class UserAdmin(ModelAdmin):
    list_display = ['username', 'email', 'role', 'status_badge', 'date_joined']
    list_filter = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    readonly_fields = ['date_joined', 'last_login']
    actions = ['activate_users', 'deactivate_users']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Персональная информация', {'fields': ('first_name', 'last_name', 'email')}),
        ('Роль и доступ', {'fields': ('role', 'managed_lab')}),
        ('Права доступа', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Важные даты', {'fields': ('last_login', 'date_joined')}),
    )

    def status_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color: green;">Активен</span>')
        return format_html('<span style="color: red;">Неактивен</span>')
    status_badge.short_description = 'Статус'

    def activate_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f'{queryset.count()} пользователей активировано.')
    activate_users.short_description = 'Активировать выбранных'

    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f'{queryset.count()} пользователей деактивировано.')
    deactivate_users.short_description = 'Деактивировать выбранных'

    def save_model(self, request, obj, form, change):
        if 'password' in form.changed_data:
            obj.set_password(form.cleaned_data['password'])
        super().save_model(request, obj, form, change)


# === DIRECTION ADMIN ===
@admin.register(Direction)
class DirectionAdmin(ModelAdmin):
    list_display = ['name', 'labs_count', 'projects_count']
    search_fields = ['name']

    def labs_count(self, obj):
        count = obj.labs_multi.count() + obj.labs.count()
        return count
    labs_count.short_description = 'Лабораторий'

    def projects_count(self, obj):
        count = Project.objects.filter(lab__directions=obj).count() + Project.objects.filter(lab__directions_multi=obj).count()
        return count
    projects_count.short_description = 'Проектов'


# === LAB ADMIN ===
@admin.register(Lab)
class LabAdmin(ModelAdmin):
    list_display = ['name', 'active', 'directions_list', 'projects_count', 'created_at']
    list_filter = ['active', 'directions']
    search_fields = ['name', 'short_description', 'full_description']
    filter_horizontal = ['directions']
    actions = [export_to_excel]

    fieldsets = (
        (None, {
            'fields': ('name', 'active')
        }),
        ('Описание', {
            'fields': ('short_description', 'full_description')
        }),
        ('Направления', {
            'fields': ('directions',)
        }),
        ('Фотографии', {
            'fields': ('images',)
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['created_at', 'updated_at']

    def directions_list(self, obj):
        directions = list(obj.directions.all()) + list(obj.directions_multi.all())
        return ', '.join([d.name for d in directions]) or '-'
    directions_list.short_description = 'Направления'

    def projects_count(self, obj):
        return obj.projects.count()
    projects_count.short_description = 'Проектов'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser or request.user.is_admin():
            return qs
        elif request.user.is_lab_lead():
            if request.user.managed_lab:
                return qs.filter(id=request.user.managed_lab.id)
        return qs.none()

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if change:
            log_event(
                user=request.user,
                action='lab_updated',
                entity_type='Lab',
                entity_id=obj.id,
                details={'name': obj.name}
            )


# === PROJECT ADMIN ===
@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = ['title', 'lab', 'goal_preview', 'active', 'participants_count', 'created_at']
    list_filter = ['active', 'lab', 'created_at']
    search_fields = ['title', 'description', 'goal']
    actions = [export_to_excel]

    fieldsets = (
        (None, {
            'fields': ('title', 'lab', 'active')
        }),
        ('Описание', {
            'fields': ('description', 'goal')
        }),
        ('Файл концепции', {
            'fields': ('concept_file',)
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['created_at', 'updated_at']

    def goal_preview(self, obj):
        if obj.goal:
            return obj.goal[:50] + '...' if len(obj.goal) > 50 else obj.goal
        return '-'
    goal_preview.short_description = 'Цель'

    def concept_file_link(self, obj):
        if obj.concept_file:
            url = reverse('download_concept_file', args=[obj.id])
            return format_html('<a href="{}" target="_blank">Скачать</a>', url)
        return '-'
    concept_file_link.short_description = 'Файл концепции'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser or request.user.is_admin():
            return qs
        elif request.user.is_lab_lead():
            if request.user.managed_lab:
                return qs.filter(lab=request.user.managed_lab)
        elif request.user.is_project_manager():
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

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if change:
            log_event(
                user=request.user,
                action='project_updated',
                entity_type='Project',
                entity_id=obj.id,
                details={'title': obj.title, 'lab': str(obj.lab)}
            )


# === PROJECT PARTICIPANT ADMIN ===
@admin.register(ProjectParticipant)
class ProjectParticipantAdmin(ModelAdmin):
    list_display = ['user', 'project', 'role', 'status_display', 'joined_at']
    list_filter = ['role', 'left_at', 'project__lab']
    search_fields = ['user__username', 'user__email', 'project__title']
    actions = [export_to_excel, 'mark_as_left', 'assign_manager_role']

    fieldsets = (
        (None, {
            'fields': ('user', 'project', 'role')
        }),
        ('Статус', {
            'fields': ('joined_at', 'left_at')
        }),
    )

    readonly_fields = ['joined_at']

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ['user', 'project']
        return self.readonly_fields

    def status_display(self, obj):
        if obj.left_at:
            return format_html('<span style="color: red;">Покинул</span>')
        return format_html('<span style="color: green;">Активен</span>')
    status_display.short_description = 'Статус'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser or request.user.is_admin():
            return qs
        elif request.user.is_lab_lead():
            if request.user.managed_lab:
                return qs.filter(project__lab=request.user.managed_lab)
        elif request.user.is_project_manager():
            managed_projects = ProjectParticipant.objects.filter(
                user=request.user,
                role='manager',
                left_at__isnull=True
            ).values_list('project_id', flat=True)
            return qs.filter(project_id__in=managed_projects)
        return qs.none()

    def mark_as_left(self, request, queryset):
        from django.conf import settings
        from django.core.mail import send_mail

        count = 0
        for participant in queryset.filter(left_at__isnull=True):
            participant.left_at = timezone.now()
            participant.save()
            count += 1
            log_event(
                user=request.user,
                action='participant_left',
                entity_type='ProjectParticipant',
                entity_id=participant.id,
                details={
                    'user': str(participant.user),
                    'project': str(participant.project),
                    'role': participant.role
                }
            )
            # Деактивация если был manager или lab_lead
            if participant.role == 'manager':
                participant.user.role = 'student'
                participant.user.save()
            elif participant.role == 'designer' or participant.role == 'developer':
                participant.user.is_active = False
                participant.user.save()
        self.message_user(request, f'{count} участников помечено как покинувших проект.')
    mark_as_left.short_description = "Пометить как покинувших проект"

    def assign_manager_role(self, request, queryset):
        from django.conf import settings
        import random
        import string

        count = 0
        for participant in queryset.filter(left_at__isnull=True):
            if participant.role != 'manager':
                participant.role = 'manager'
                participant.save()
                count += 1
                log_event(
                    user=request.user,
                    action='role_changed',
                    entity_type='ProjectParticipant',
                    entity_id=participant.id,
                    details={
                        'user': str(participant.user),
                        'project': str(participant.project),
                        'new_role': 'manager'
                    }
                )
                # Сменить роль пользователю на project_manager и активировать
                participant.user.role = 'project_manager'
                participant.user.is_active = True
                participant.user.save()

                # Генерация пароля и отправка на email
                if participant.user.email:
                    password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
                    participant.user.set_password(password)
                    participant.user.save()

                    subject = 'Вам назначена роль менеджера проекта'
                    message = f'''Здравствуйте, {participant.user.username}!

Вам назначена роль менеджера проекта "{participant.project.title}".

Ваш логин: {participant.user.username}
Ваш новый пароль: {password}

Пожалуйста, войдите в систему и измените пароль.'''

                    try:
                        send_mail(
                            subject,
                            message,
                            settings.DEFAULT_FROM_EMAIL,
                            [participant.user.email],
                            fail_silently=False
                        )
                    except Exception as e:
                        self.message_user(request, f'Ошибка отправки email для {participant.user.username}: {str(e)}', level='WARNING')
        self.message_user(request, f'{count} участников назначено менеджерами.')
    assign_manager_role.short_description = "Назначить менеджером проекта"

    def delete_model(self, request, obj):
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
        self.mark_as_left(request, queryset)


# === ACHIEVEMENT ADMIN ===
@admin.register(Achievement)
class AchievementAdmin(ModelAdmin):
    list_display = ['title', 'lab', 'project', 'description_preview', 'image_thumbnail', 'created_at']
    list_filter = ['created_at', 'lab']
    search_fields = ['title', 'description']
    actions = [export_to_excel]

    fieldsets = (
        (None, {
            'fields': ('title', 'lab', 'project')
        }),
        ('Описание и изображение', {
            'fields': ('description', 'image')
        }),
        ('Дата', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['created_at']

    def description_preview(self, obj):
        if obj.description:
            return obj.description[:50] + '...' if len(obj.description) > 50 else obj.description
        return '-'
    description_preview.short_description = 'Описание'

    def image_thumbnail(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 45px; object-fit: cover;" />',
                obj.image.url
            )
        return '-'
    image_thumbnail.short_description = 'Изображение'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser or request.user.is_admin():
            return qs
        elif request.user.is_lab_lead():
            if request.user.managed_lab:
                return qs.filter(
                    models.Q(lab=request.user.managed_lab) |
                    models.Q(project__lab=request.user.managed_lab)
                )
        elif request.user.is_project_manager():
            managed_projects = ProjectParticipant.objects.filter(
                user=request.user,
                role='manager',
                left_at__isnull=True
            ).values_list('project_id', flat=True)
            return qs.filter(project_id__in=managed_projects)
        return qs.none()


# === HUB LEADER ADMIN ===
@admin.register(HubLeader)
class HubLeaderAdmin(ModelAdmin):
    list_display = ['user', 'position', 'phone', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['user__username', 'user__email', 'position']
    actions = [export_to_excel, 'activate_leaders', 'deactivate_leaders']

    fieldsets = (
        (None, {
            'fields': ('user', 'position', 'phone', 'is_active')
        }),
        ('Дата добавления', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['created_at']

    def activate_leaders(self, request, queryset):
        queryset.update(is_active=True)
        for leader in queryset:
            leader.user.is_active = True
            leader.user.save()
        self.message_user(request, f'{queryset.count()} руководителей активировано.')
    activate_leaders.short_description = 'Активировать руководителей'

    def deactivate_leaders(self, request, queryset):
        queryset.update(is_active=False)
        for leader in queryset:
            leader.user.is_active = False
            leader.user.save()
        self.message_user(request, f'{queryset.count()} руководителей деактивировано.')
    deactivate_leaders.short_description = 'Деактивировать руководителей'


# === EVENT LOG ADMIN ===
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
        return request.user.is_superuser or request.user.is_admin()


# === HUB SETTINGS ADMIN ===
@admin.register(HubSettings)
class HubSettingsAdmin(ModelAdmin):
    list_display = ['name', 'updated_at']
    fields = ['name', 'description']

    def has_add_permission(self, request):
        return not HubSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_admin()
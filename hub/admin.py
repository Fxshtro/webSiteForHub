from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.admin import ModelAdmin, TabularInline
from django.utils.html import format_html
from django.http import HttpResponse
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from openpyxl.utils import get_column_letter
import secrets
import string

from .models import (
    SiteRole, Type,
    User, Student, Guide,
    Direction, Laboratory, LaboratoryDirection, LaboratoryLeader,
    StudentLaboratory, StudentDirection,
    Role, Project, ProjectLaboratory, ProjectRole, StudentProjectRole,
    File, Achievement, FileAchievement, FileGuide, FileProject,
    Report, FileReport, EventLog, HubLeader
)

admin.site.unregister(Group)

# =============================================================================
# УБРАТЬ ПРОМЕЖУТОЧНЫЕ ТАБЛИЦЫ — они доступны через инлайны
# =============================================================================

HIDDEN_MODELS = [LaboratoryDirection, StudentLaboratory, StudentDirection,
                 ProjectLaboratory, ProjectRole, Role, FileAchievement, FileGuide,
                 FileProject, FileReport]

for model in HIDDEN_MODELS:
    try:
        admin.site.unregister(model)
    except admin.sites.NotRegistered:
        pass


# =============================================================================
# УТИЛИТЫ
# =============================================================================

def export_to_excel(modeladmin, request, queryset):
    wb = Workbook()
    ws = wb.active
    ws.title = modeladmin.model._meta.verbose_name_plural
    headers = ['ID'] + [f.verbose_name for f in modeladmin.model._meta.fields if f.name != 'id']
    header_fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF")
    for col_num, header in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num)
        cell.value = header
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center")
    for row_num, obj in enumerate(queryset, 2):
        for col_num, field in enumerate(modeladmin.model._meta.fields, 1):
            val = getattr(obj, field.name, '')
            if hasattr(val, 'strftime'):
                val = val.strftime('%d.%m.%Y %H:%M')
            ws.cell(row=row_num, column=col_num, value=str(val) if val is not None else '')
    for col_num in range(1, len(headers) + 1):
        ws.column_dimensions[get_column_letter(col_num)].width = 25
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    filename = f"{modeladmin.model._meta.verbose_name_plural}.xlsx"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    wb.save(response)
    return response
export_to_excel.short_description = "Экспорт в Excel"


def generate_password(length=8):
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))


MANAGER_ROLE_TITLE = 'Менеджер проекта'
LAB_LEAD_ROLE_TITLE = 'Лидер лаборатории'
ADMIN_ROLE_TITLE = 'Администратор'


def send_credentials_email(student, user, password, role_title, context_title):
    try:
        send_mail(
            f'Вы назначены {role_title} — {context_title}',
            f'Здравствуйте, {student.full_name}!\n\n'
            f'Вы назначены {role_title}: "{context_title}".\n\n'
            f'Ваш логин: {user.login}\nВаш пароль: {password}\n\n'
            f'Войдите в админ-панель и измените пароль.',
            settings.DEFAULT_FROM_EMAIL,
            [student.email],
            fail_silently=True
        )
    except Exception:
        pass


def create_user_with_password(student, lab=None):
    login = student.email.split('@')[0]
    password = generate_password()
    user, created = User.objects.get_or_create(login=login)
    user.password = make_password(password)
    if lab:
        user.laboratory = lab
    user.save()
    return user, password, created


# =============================================================================
# СПРАВОЧНИКИ — скрытые, редко нужны
# =============================================================================

@admin.register(SiteRole)
class SiteRoleAdmin(ModelAdmin):
    list_display = ['id', 'title']
    search_fields = ['title']


@admin.register(Type)
class TypeAdmin(ModelAdmin):
    list_display = ['id', 'title']
    search_fields = ['title']


@admin.register(Direction)
class DirectionAdmin(ModelAdmin):
    list_display = ['id', 'title', 'labs_count']
    search_fields = ['title']

    def labs_count(self, obj):
        return obj.laboratory_links.count()
    labs_count.short_description = 'Лабораторий'


# =============================================================================
# ПОЛЬЗОВАТЕЛИ
# =============================================================================

@admin.register(User)
class UserAdmin(ModelAdmin):
    list_display = ['id', 'login', 'site_role', 'laboratory']
    list_filter = ['site_role', 'laboratory']
    list_editable = ['site_role', 'laboratory']
    search_fields = ['login']
    fieldsets = (
        (None, {'fields': ('login', 'password', 'site_role', 'laboratory')}),
    )

    def save_model(self, request, obj, form, change):
        new_role = obj.site_role
        if new_role and new_role.title in [MANAGER_ROLE_TITLE, LAB_LEAD_ROLE_TITLE]:
            student = Student.objects.filter(email__startswith=obj.login).first()
            if student and student.email:
                password = generate_password()
                obj.password = make_password(password)
                context = obj.laboratory.title if obj.laboratory else 'Хаб'
                send_credentials_email(student, obj, password, new_role.title.lower(), context)
        elif 'password' in form.changed_data:
            obj.password = make_password(form.cleaned_data['password'])
        super().save_model(request, obj, form, change)


class StudentDirectionInline(TabularInline):
    model = StudentDirection
    extra = 0
    fields = ['direction']
    verbose_name = 'Направление'
    verbose_name_plural = 'Направления студента'


class StudentLaboratoryInline(TabularInline):
    model = StudentLaboratory
    extra = 0
    fields = ['laboratory']
    verbose_name = 'Лаборатория'
    verbose_name_plural = 'Лаборатории студента'


@admin.register(Student)
class StudentAdmin(ModelAdmin):
    list_display = [
        'id', 'surname', 'name', 'patronymic', 'study_group',
        'email', 'phone_number', 'telegram_nickname', 'experience_badge'
    ]
    list_filter = ['study_group', 'experience', 'university_city']
    search_fields = ['surname', 'name', 'email', 'telegram_nickname', 'study_group']
    inlines = [StudentDirectionInline, StudentLaboratoryInline]
    fieldsets = (
        ('ФИО', {'fields': ('surname', 'name', 'patronymic')}),
        ('Учёба', {'fields': ('study_group', 'university_city')}),
        ('Контакты', {'fields': ('phone_number', 'email', 'telegram_nickname', 'telegram_id')}),
        ('Опыт и пожелания', {'fields': ('experience', 'wishes')}),
        ('Метавселенная', {'fields': ('metaverse_account_link', 'task_board')}),
    )

    def experience_badge(self, obj):
        colors = {'Да': 'green', 'Немного': 'orange', 'Нет': 'gray'}
        color = colors.get(obj.experience, 'gray')
        return format_html('<span style="color: {}; font-weight: bold;">{}</span>', color, obj.experience or '-')
    experience_badge.short_description = 'Опыт'

    def has_add_permission(self, request):
        return False


@admin.register(Guide)
class GuideAdmin(ModelAdmin):
    list_display = ['id', 'surname', 'name', 'patronymic', 'laboratory']
    list_filter = ['laboratory']
    search_fields = ['surname', 'name', 'patronymic']


# =============================================================================
# ЛАБОРАТОРИИ
# =============================================================================

class LabDirectionInline(TabularInline):
    model = LaboratoryDirection
    extra = 1
    fields = ['direction', 'link']
    verbose_name = 'Направление'
    verbose_name_plural = 'Направления лаборатории'


class LabLeaderInline(TabularInline):
    model = LaboratoryLeader
    extra = 1
    fields = ['student']
    verbose_name = 'Лидер'
    verbose_name_plural = 'Лидеры лаборатории'


@admin.register(Laboratory)
class LaboratoryAdmin(ModelAdmin):
    list_display = ['id', 'title', 'active', 'directions_list', 'leaders_count', 'students_count']
    list_filter = ['active']
    search_fields = ['title', 'short_description']
    actions = [export_to_excel]
    inlines = [LabDirectionInline, LabLeaderInline]

    fieldsets = (
        ('Основное', {'fields': ('title', 'link', 'active')}),
        ('Описание', {'fields': ('short_description', 'description')}),
        ('Фотографии (JSON-массив ссылок)', {'fields': ('images',)}),
    )

    def directions_list(self, obj):
        return ', '.join([ld.direction.title for ld in obj.direction_links.all()]) or '-'
    directions_list.short_description = 'Направления'

    def leaders_count(self, obj):
        return obj.leaders.count()
    leaders_count.short_description = 'Лидеров'

    def students_count(self, obj):
        return obj.student_links.filter(laboratory__isnull=False).count()
    students_count.short_description = 'Студентов'


@admin.register(LaboratoryLeader)
class LaboratoryLeaderAdmin(ModelAdmin):
    list_display = ['student_info', 'laboratory', 'student_email']
    list_filter = ['laboratory']
    search_fields = ['student__surname', 'student__name', 'laboratory__title']
    actions = [export_to_excel, 'assign_as_manager', 'assign_as_lab_lead']

    def student_info(self, obj):
        return obj.student.full_name
    student_info.short_description = 'Студент'

    def student_email(self, obj):
        return obj.student.email
    student_email.short_description = 'Email'

    def assign_as_manager(self, request, queryset):
        count = 0
        for leader in queryset:
            student = leader.student
            if student.email:
                user, password, _ = create_user_with_password(student, lab=leader.laboratory)
                manager_role = SiteRole.objects.filter(title=MANAGER_ROLE_TITLE).first()
                if manager_role:
                    user.site_role = manager_role
                    user.save()
                send_credentials_email(student, user, password, 'менеджером проекта', leader.laboratory.title)
                count += 1
        self.message_user(request, f'{count} менеджеров назначено, email отправлены.')
    assign_as_manager.short_description = 'Назначить менеджером + отправить пароль'

    def assign_as_lab_lead(self, request, queryset):
        count = 0
        for leader in queryset:
            student = leader.student
            if student.email:
                user, password, _ = create_user_with_password(student, lab=leader.laboratory)
                lab_lead_role = SiteRole.objects.filter(title=LAB_LEAD_ROLE_TITLE).first()
                if lab_lead_role:
                    user.site_role = lab_lead_role
                    user.save()
                send_credentials_email(student, user, password, 'лидером лаборатории', leader.laboratory.title)
                count += 1
        self.message_user(request, f'{count} лидеров назначено, email отправлены.')
    assign_as_lab_lead.short_description = 'Назначить лидером лаб. + отправить пароль'


# =============================================================================
# ПРОЕКТЫ
# =============================================================================

class ProjectLabInline(TabularInline):
    model = ProjectLaboratory
    extra = 1
    fields = ['laboratory']
    verbose_name = 'Лаборатория'
    verbose_name_plural = 'Лаборатории проекта'


class ProjectRoleInline(TabularInline):
    model = ProjectRole
    extra = 1
    fields = ['role']
    verbose_name = 'Роль (позиция)'
    verbose_name_plural = 'Роли в проекте'


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = ['id', 'title', 'goal_preview', 'need_report', 'labs_list', 'participants_count']
    list_filter = ['need_report']
    search_fields = ['title', 'description', 'goal']
    actions = [export_to_excel]
    inlines = [ProjectLabInline, ProjectRoleInline]

    fieldsets = (
        ('Основное', {'fields': ('title', 'need_report')}),
        ('Описание и цель', {'fields': ('description', 'goal')}),
    )

    def goal_preview(self, obj):
        if obj.goal:
            return obj.goal[:60] + '...' if len(obj.goal) > 60 else obj.goal
        return '-'
    goal_preview.short_description = 'Цель'

    def labs_list(self, obj):
        labs = [pl.laboratory.title for pl in obj.laboratory_links.all()]
        return ', '.join(labs) if labs else '-'
    labs_list.short_description = 'Лаборатории'

    def participants_count(self, obj):
        return obj.role_slots.filter(assigned_students__present=True).count()
    participants_count.short_description = 'Участников'


@admin.register(StudentProjectRole)
class StudentProjectRoleAdmin(ModelAdmin):
    list_display = ['id', 'student_full', 'project', 'role', 'present', 'status_display']
    list_filter = ['present', 'project_role__role', 'project_role__project']
    list_editable = ['present']
    search_fields = ['student__surname', 'student__name', 'project_role__project__title']
    actions = [export_to_excel, 'mark_as_left', 'send_manager_email']

    fieldsets = (
        (None, {'fields': ('student', 'project_role', 'present')}),
    )

    def has_add_permission(self, request):
        return False

    def student_full(self, obj):
        return obj.student.full_name
    student_full.short_description = 'Студент'

    def project(self, obj):
        return obj.project_role.project.title
    project.short_description = 'Проект'

    def role(self, obj):
        return obj.project_role.role.title
    role.short_description = 'Роль'

    def status_display(self, obj):
        if obj.present:
            return format_html('<span style="color: green;">{}</span>', 'Активен')
        return format_html('<span style="color: red;">{}</span>', 'Покинул')
    status_display.short_description = 'Статус'

    def mark_as_left(self, request, queryset):
        count = queryset.filter(present=True).update(present=False)
        self.message_user(request, f'{count} участников помечено как покинувших проект.')
    mark_as_left.short_description = "Пометить как покинувших"

    def send_manager_email(self, request, queryset):
        count = 0
        for participant in queryset.filter(present=True):
            student = participant.student
            if student.email:
                user, password, _ = create_user_with_password(student)
                manager_role = SiteRole.objects.filter(title=MANAGER_ROLE_TITLE).first()
                if manager_role:
                    user.site_role = manager_role
                    user.save()
                send_credentials_email(
                    student, user, password, 'менеджером',
                    participant.project_role.project.title
                )
                count += 1
        self.message_user(request, f'{count} email отправлено.')
    send_manager_email.short_description = 'Отправить пароль менеджерам'


# =============================================================================
# ДОСТИЖЕНИЯ И ФАЙЛЫ
# =============================================================================

class FileAchievementInline(TabularInline):
    model = FileAchievement
    extra = 0
    fields = ['file']
    verbose_name = 'Дополнительный файл'
    verbose_name_plural = 'Дополнительные файлы'


@admin.register(Achievement)
class AchievementAdmin(ModelAdmin):
    list_display = ['id', 'title', 'laboratory', 'project', 'text_limited_preview', 'image_preview']
    list_filter = ['laboratory']
    search_fields = ['title', 'text', 'text_limited']
    actions = [export_to_excel]
    inlines = [FileAchievementInline]

    fieldsets = (
        ('Основное', {'fields': ('title', 'laboratory', 'project')}),
        ('Описание (до 350 символов)', {'fields': ('text_limited', 'text', 'link')}),
        ('Изображение (4:3, max 2МБ, 1 шт)', {'fields': ('image',)}),
    )

    def text_limited_preview(self, obj):
        text = obj.text_limited or obj.text or ''
        if text:
            return text[:60] + '...' if len(text) > 60 else text
        return '-'
    text_limited_preview.short_description = 'Описание'

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 80px; max-width: 120px;" />', obj.image.url)
        return '-'
    image_preview.short_description = 'Фото'


@admin.register(File)
class FileAdmin(ModelAdmin):
    list_display = ['id', 'link_preview']
    search_fields = ['link']

    def link_preview(self, obj):
        name = obj.link.split('/')[-1] if obj.link else str(obj.id)
        return name[:60]
    link_preview.short_description = 'Документ'


# =============================================================================
# ОТЧЁТЫ
# =============================================================================

class FileReportInline(TabularInline):
    model = FileReport
    extra = 0
    fields = ['file']
    verbose_name = 'Файл отчёта'
    verbose_name_plural = 'Файлы отчёта'


@admin.register(Report)
class ReportAdmin(ModelAdmin):
    list_display = ['id', 'project', 'laboratory', 'date_time', 'confirmation_display']
    list_filter = ['confirmation', 'laboratory']
    search_fields = ['project__title', 'report_text']
    actions = [export_to_excel, 'confirm_reports']
    inlines = [FileReportInline]

    def confirmation_display(self, obj):
        if obj.confirmation:
            return format_html('<span style="color: green;">✓ {}</span>', 'Подтверждён')
        return format_html('<span style="color: orange;">{}</span>', 'Ожидает')
    confirmation_display.short_description = 'Статус'

    def confirm_reports(self, request, queryset):
        count = queryset.filter(confirmation=False).update(confirmation=True)
        self.message_user(request, f'{count} отчётов подтверждено.')
    confirm_reports.short_description = 'Подтвердить выбранные'


# =============================================================================
# РУКОВОДИТЕЛИ ХАБА
# =============================================================================

@admin.register(HubLeader)
class HubLeaderAdmin(ModelAdmin):
    list_display = ['id', 'user_login', 'user_role', 'position', 'is_active', 'lab']
    list_filter = ['is_active', 'user__site_role']
    search_fields = ['user__login', 'position']
    actions = [export_to_excel, 'activate_leaders', 'deactivate_leaders']

    fieldsets = (
        (None, {'fields': ('user', 'position', 'is_active')}),
    )

    readonly_fields = ['created_at']

    def user_login(self, obj):
        return obj.user.login
    user_login.short_description = 'Логин'

    def user_role(self, obj):
        return obj.user.site_role.title if obj.user.site_role else '-'
    user_role.short_description = 'Роль'

    def lab(self, obj):
        return obj.user.laboratory.title if obj.user.laboratory else '-'
    lab.short_description = 'Лаборатория'

    def activate_leaders(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f'{queryset.count()} руководителей активировано.')
    activate_leaders.short_description = 'Активировать'

    def deactivate_leaders(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f'{queryset.count()} руководителей деактивировано.')
    deactivate_leaders.short_description = 'Деактивировать'


# =============================================================================
# ЖУРНАЛ СОБЫТИЙ
# =============================================================================

@admin.register(EventLog)
class EventLogAdmin(ModelAdmin):
    list_display = ['id', 'timestamp', 'user_login', 'action', 'entity_type', 'entity_id']
    list_filter = ['action', 'entity_type', 'timestamp']
    search_fields = ['user_login', 'entity_type']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
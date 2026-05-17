from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.db import models
from django.utils.html import format_html
from django.http import HttpResponse
from django.utils import timezone
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill
from openpyxl.utils import get_column_letter

from .models import (
    SiteRole, Status, Type,
    User, Student, Guide,
    Direction, Laboratory, LaboratoryDirection, LaboratoryLeader,
    StudentLaboratory, StudentDirection,
    Role, Project, ProjectLaboratory, ProjectRole, StudentProjectRole,
    File, Achievement, FileAchievement, FileGuide, FileProject,
    Report, FileReport
)


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
export_to_excel.short_description = "Экспортировать выбранные в Excel"


# =============================================================================
# СПРАВОЧНИКИ
# =============================================================================

@admin.register(SiteRole)
class SiteRoleAdmin(ModelAdmin):
    list_display = ['id', 'title']
    search_fields = ['title']


@admin.register(Status)
class StatusAdmin(ModelAdmin):
    list_display = ['id', 'title']
    search_fields = ['title']


@admin.register(Type)
class TypeAdmin(ModelAdmin):
    list_display = ['id', 'title']
    search_fields = ['title']


# =============================================================================
# ПОЛЬЗОВАТЕЛИ
# =============================================================================

@admin.register(User)
class UserAdmin(ModelAdmin):
    list_display = ['id', 'login', 'site_role', 'laboratory']
    list_filter = ['site_role', 'laboratory']
    search_fields = ['login']
    fieldsets = (
        (None, {'fields': ('login', 'password')}),
        ('Роль и лаборатория', {'fields': ('site_role', 'laboratory')}),
    )
    def save_model(self, request, obj, form, change):
        if 'password' in form.changed_data:
            from django.contrib.auth.hashers import make_password
            obj.password = make_password(form.cleaned_data['password'])
        super().save_model(request, obj, form, change)


@admin.register(Student)
class StudentAdmin(ModelAdmin):
    list_display = [
        'id', 'surname', 'name', 'patronymic', 'study_group',
        'email', 'phone_number', 'telegram_nickname', 'experience_display'
    ]
    list_filter = ['study_group', 'experience', 'university_city']
    search_fields = ['surname', 'name', 'email', 'telegram_nickname', 'study_group']
    fieldsets = (
        ('ФИО', {'fields': ('surname', 'name', 'patronymic')}),
        ('Учёба', {'fields': ('study_group', 'university_city')}),
        ('Контакты', {'fields': ('phone_number', 'email', 'telegram_nickname', 'telegram_id')}),
        ('Опыт и пожелания', {'fields': ('experience', 'wishes')}),
        ('Метавселенная', {'fields': ('metaverse_account_link', 'task_board')}),
    )

    def experience_display(self, obj):
        return obj.experience or '-'
    experience_display.short_description = 'Опыт'

    def has_add_permission(self, request):
        return False


@admin.register(Guide)
class GuideAdmin(ModelAdmin):
    list_display = ['id', 'surname', 'name', 'patronymic', 'laboratory']
    list_filter = ['laboratory']
    search_fields = ['surname', 'name', 'patronymic']


# =============================================================================
# ЛАБОРАТОРИИ И НАПРАВЛЕНИЯ
# =============================================================================

@admin.register(Direction)
class DirectionAdmin(ModelAdmin):
    list_display = ['id', 'title', 'laboratories_count']
    search_fields = ['title']

    def laboratories_count(self, obj):
        return obj.laboratory_links.count()
    laboratories_count.short_description = 'Лабораторий'


@admin.register(Laboratory)
class LaboratoryAdmin(ModelAdmin):
    list_display = ['id', 'title', 'link', 'leaders_count', 'students_count']
    search_fields = ['title']
    actions = [export_to_excel]

    def leaders_count(self, obj):
        return obj.leaders.count()
    leaders_count.short_description = 'Лидеров'

    def students_count(self, obj):
        return obj.student_links.filter(laboratory__isnull=False).count()
    students_count.short_description = 'Студентов'


@admin.register(LaboratoryDirection)
class LaboratoryDirectionAdmin(ModelAdmin):
    list_display = ['id', 'laboratory', 'direction', 'link']
    list_filter = ['laboratory', 'direction']
    search_fields = ['laboratory__title', 'direction__title']


@admin.register(LaboratoryLeader)
class LaboratoryLeaderAdmin(ModelAdmin):
    list_display = ['id', 'student', 'laboratory', 'student_info']
    list_filter = ['laboratory']
    search_fields = ['student__surname', 'student__name', 'laboratory__title']

    def student_info(self, obj):
        return f"{obj.student.surname} {obj.student.name} ({obj.student.study_group})"
    student_info.short_description = 'Студент'


@admin.register(StudentLaboratory)
class StudentLaboratoryAdmin(ModelAdmin):
    list_display = ['id', 'student', 'laboratory', 'student_group']
    list_filter = ['laboratory']
    search_fields = ['student__surname', 'student__name']

    def student_group(self, obj):
        return obj.student.study_group
    student_group.short_description = 'Группа'


@admin.register(StudentDirection)
class StudentDirectionAdmin(ModelAdmin):
    list_display = ['id', 'student', 'direction', 'student_group']
    list_filter = ['direction']
    search_fields = ['student__surname', 'student__name', 'direction__title']

    def student_group(self, obj):
        return obj.student.study_group
    student_group.short_description = 'Группа'


# =============================================================================
# ПРОЕКТЫ И РОЛИ
# =============================================================================

@admin.register(Role)
class RoleAdmin(ModelAdmin):
    list_display = ['id', 'title']
    search_fields = ['title']
    actions = [export_to_excel]


@admin.register(Project)
class ProjectAdmin(ModelAdmin):
    list_display = ['id', 'title', 'description_preview', 'need_report', 'labs_list', 'participants_count']
    list_filter = ['need_report']
    search_fields = ['title', 'description']
    actions = [export_to_excel]

    def description_preview(self, obj):
        if obj.description:
            return obj.description[:80] + '...' if len(obj.description) > 80 else obj.description
        return '-'
    description_preview.short_description = 'Описание'

    def labs_list(self, obj):
        labs = [pl.laboratory.title for pl in obj.laboratory_links.all()]
        return ', '.join(labs) if labs else '-'
    labs_list.short_description = 'Лаборатории'

    def participants_count(self, obj):
        active = obj.studentprojectrole_set.filter(present=True).count()
        return active
    participants_count.short_description = 'Участников'


@admin.register(ProjectLaboratory)
class ProjectLaboratoryAdmin(ModelAdmin):
    list_display = ['id', 'project', 'laboratory']
    list_filter = ['laboratory']
    search_fields = ['project__title', 'laboratory__title']


@admin.register(ProjectRole)
class ProjectRoleAdmin(ModelAdmin):
    list_display = ['id', 'project', 'role', 'project_title', 'assigned_students_count']
    list_filter = ['role', 'project__laboratory_links']
    search_fields = ['project__title', 'role__title']

    def project_title(self, obj):
        return obj.project.title
    project_title.short_description = 'Проект'

    def assigned_students_count(self, obj):
        return obj.assigned_students.filter(present=True).count()
    assigned_students_count.short_description = 'Занято'


@admin.register(StudentProjectRole)
class StudentProjectRoleAdmin(ModelAdmin):
    list_display = ['id', 'student', 'project', 'role', 'present_display']
    list_filter = ['present', 'project_role__role']
    search_fields = ['student__surname', 'student__name', 'project_role__project__title']
    actions = [export_to_excel, 'mark_as_left']

    def project(self, obj):
        return obj.project_role.project.title
    project.short_description = 'Проект'

    def role(self, obj):
        return obj.project_role.role.title
    role.short_description = 'Роль'

    def present_display(self, obj):
        if obj.present:
            return format_html('<span style="color: green;">Активен</span>')
        return format_html('<span style="color: red;">Покинул</span>')
    present_display.short_description = 'Статус'

    def mark_as_left(self, request, queryset):
        count = queryset.filter(present=True).update(present=False)
        self.message_user(request, f'{count} участников помечено как покинувших.')
    mark_as_left.short_description = "Пометить как покинувших"


# =============================================================================
# ДОСТИЖЕНИЯ И ФАЙЛЫ
# =============================================================================

@admin.register(File)
class FileAdmin(ModelAdmin):
    list_display = ['id', 'link_preview']
    search_fields = ['link']

    def link_preview(self, obj):
        name = obj.link.split('/')[-1] if obj.link else str(obj.id)
        return name[:60]
    link_preview.short_description = 'Файл'


@admin.register(Achievement)
class AchievementAdmin(ModelAdmin):
    list_display = ['id', 'title', 'laboratory', 'project', 'link']
    list_filter = ['laboratory']
    search_fields = ['title', 'text']
    actions = [export_to_excel]


@admin.register(FileAchievement)
class FileAchievementAdmin(ModelAdmin):
    list_display = ['id', 'file', 'achievements']
    list_filter = ['achievements']


@admin.register(FileGuide)
class FileGuideAdmin(ModelAdmin):
    list_display = ['id', 'file', 'guide']
    list_filter = ['guide']


@admin.register(FileProject)
class FileProjectAdmin(ModelAdmin):
    list_display = ['id', 'file', 'project']
    list_filter = ['project']


# =============================================================================
# ОТЧЁТЫ
# =============================================================================

@admin.register(Report)
class ReportAdmin(ModelAdmin):
    list_display = ['id', 'project', 'laboratory', 'date_time', 'confirmation_display']
    list_filter = ['confirmation', 'laboratory']
    search_fields = ['project__title', 'report_text']
    actions = [export_to_excel]

    def confirmation_display(self, obj):
        if obj.confirmation:
            return format_html('<span style="color: green;">✓ Подтверждён</span>')
        return format_html('<span style="color: orange;">Ожидает</span>')
    confirmation_display.short_description = 'Статус'


@admin.register(FileReport)
class FileReportAdmin(ModelAdmin):
    list_display = ['id', 'file', 'report']
    list_filter = ['report__laboratory']
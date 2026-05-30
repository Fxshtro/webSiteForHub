from rest_framework import serializers
from .models import (
    SiteRole, User, Student, Guide, HubManager,
    Direction, Laboratory, LaboratoryDirection, LaboratoryLeader,
    StudentLaboratory, StudentDirection,
    Role, Project, ProjectLink, ProjectLaboratory, ProjectRole, StudentProjectRole,
    Achievement, Report, EventLog, HubLeader, SiteContent, SiteStat,
)


class SiteRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteRole
        fields = ['id', 'title']


class DirectionSerializer(serializers.ModelSerializer):
    labs_count = serializers.SerializerMethodField()

    class Meta:
        model = Direction
        fields = ['id', 'title', 'labs_count']

    def get_labs_count(self, obj):
        return obj.laboratory_links.count()


class LaboratorySerializer(serializers.ModelSerializer):
    directions_list = serializers.SerializerMethodField()
    leaders_list = serializers.SerializerMethodField()
    students_count = serializers.SerializerMethodField()
    projects_count = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = Laboratory
        fields = [
            'id', 'title', 'slug', 'link', 'active',
            'images', 'directions_list', 'leaders_list', 'students_count', 'projects_count'
        ]

    def get_directions_list(self, obj):
        return [
            {'id': ld.direction.id, 'title': ld.direction.title, 'link': ld.link}
            for ld in obj.direction_links.all()
        ]

    def get_leaders_list(self, obj):
        return [
            {
                'id': g.id,
                'full_name': f'{g.surname} {g.name} {g.patronymic or ""}'.strip(),
                'position': g.position or '',
            }
            for g in obj.guides.all()
        ]

    def get_students_count(self, obj):
        return obj.student_links.filter(laboratory__isnull=False).count()

    def get_projects_count(self, obj):
        return obj.project_links.count()

    def get_images(self, obj):
        if isinstance(obj.images, list):
            return obj.images
        return []


class LaboratoryDirectionSerializer(serializers.ModelSerializer):
    direction_title = serializers.CharField(source='direction.title', read_only=True)
    laboratory_title = serializers.CharField(source='laboratory.title', read_only=True)

    class Meta:
        model = LaboratoryDirection
        fields = ['id', 'laboratory', 'laboratory_title', 'direction', 'direction_title', 'link']


class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    laboratories = serializers.SerializerMethodField()
    directions = serializers.SerializerMethodField()
    projects = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'id', 'surname', 'name', 'patronymic', 'full_name',
            'study_group', 'phone_number', 'email', 'university_city',
            'task_board', 'telegram_nickname', 'telegram_id',
            'experience', 'wishes', 'metaverse_account_link',
            'laboratories', 'directions', 'projects'
        ]

    def get_laboratories(self, obj):
        return [
            {'id': sl.laboratory.id, 'title': sl.laboratory.title}
            for sl in obj.laboratory_links.filter(laboratory__isnull=False)
        ]

    def get_directions(self, obj):
        return [
            {'id': sd.direction.id, 'title': sd.direction.title}
            for sd in obj.direction_links.all()
        ]

    def get_projects(self, obj):
        return [
            {
                'id': spr.project_role.project.id,
                'title': spr.project_role.project.title,
                'role': spr.project_role.role.title
            }
            for spr in obj.project_roles.filter(present=True).select_related(
                'project_role__project', 'project_role__role'
            )
        ]


class GuideSerializer(serializers.ModelSerializer):
    laboratory_title = serializers.CharField(source='laboratory.title', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Guide
        fields = ['id', 'surname', 'name', 'patronymic', 'position', 'description', 'image', 'image_url', 'laboratory', 'laboratory_title']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class HubManagerSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = HubManager
        fields = ['id', 'name', 'position', 'description', 'image', 'image_url']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class SiteStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteStat
        fields = ['id', 'label', 'icon', 'icon_class', 'order']


class SiteContentSerializer(serializers.ModelSerializer):
    stats = SiteStatSerializer(many=True, read_only=True)

    class Meta:
        model = SiteContent
        fields = [
            'id', 'about_title', 'about_intro', 'about_mission',
            'labs_subtitle', 'hero_subtitle', 'hero_description',
            'stats', 'created_at', 'updated_at',
        ]


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'title']


class ProjectLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectLink
        fields = ['id', 'title', 'url']


class ProjectSerializer(serializers.ModelSerializer):
    laboratories = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()
    participants = serializers.SerializerMethodField()
    active_participants_count = serializers.SerializerMethodField()
    links = ProjectLinkSerializer(many=True, read_only=True, source='links.all')

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'goal', 'need_report',
            'laboratories', 'roles', 'participants', 'active_participants_count',
            'links'
        ]

    def get_laboratories(self, obj):
        return [
            {'id': pl.laboratory.id, 'title': pl.laboratory.title}
            for pl in obj.laboratory_links.all()
        ]

    def get_roles(self, obj):
        return [
            {'id': pr.role.id, 'title': pr.role.title, 'slot_id': pr.id,
             'assigned_count': pr.assigned_students.filter(present=True).count()}
            for pr in obj.role_slots.all()
        ]

    def get_participants(self, obj):
        active = obj.role_slots.filter(assigned_students__present=True)
        result = []
        for pr in obj.role_slots.all():
            for spr in pr.assigned_students.filter(present=True):
                result.append({
                    'id': spr.id,
                    'student_id': spr.student.id,
                    'student_name': spr.student.full_name,
                    'role': pr.role.title,
                    'present': spr.present
                })
        return result

    def get_active_participants_count(self, obj):
        return StudentProjectRole.objects.filter(
            project_role__project=obj, present=True
        ).count()


class StudentProjectRoleSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    project_title = serializers.CharField(source='project_role.project.title', read_only=True)
    role_title = serializers.CharField(source='project_role.role.title', read_only=True)

    class Meta:
        model = StudentProjectRole
        fields = [
            'id', 'student', 'student_name',
            'project_role', 'project_title', 'role_title',
            'present'
        ]
        read_only_fields = ['id']


class AchievementSerializer(serializers.ModelSerializer):
    laboratory_title = serializers.CharField(source='laboratory.title', read_only=True, default=None)
    project_title = serializers.CharField(source='project.title', read_only=True, default=None)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = [
            'id', 'title', 'laboratory', 'laboratory_title',
            'project', 'project_title',
            'description', 'image', 'image_url',
        ]
        read_only_fields = ['id']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

    def validate_description(self, value):
        if value and len(value) > 350:
            raise serializers.ValidationError('Текст не может превышать 350 символов')
        return value

    def validate_image(self, value):
        if value:
            if value.size > 2 * 1024 * 1024:
                raise serializers.ValidationError('Размер изображения не может превышать 2МБ')
            from PIL import Image
            try:
                img = Image.open(value)
                width, height = img.size
                aspect_ratio = width / height
                expected_ratio = 4 / 3
                tolerance = 0.15
                if abs(aspect_ratio - expected_ratio) > tolerance:
                    raise serializers.ValidationError(
                        f'Изображение должно быть соотношения 4:3 ({width}x{height})'
                    )
                value.seek(0)
            except Exception as e:
                if isinstance(e, serializers.ValidationError):
                    raise e
        return value


class ReportSerializer(serializers.ModelSerializer):
    laboratory_title = serializers.CharField(source='laboratory.title', read_only=True, default=None)
    project_title = serializers.CharField(source='project.title', read_only=True, default=None)

    class Meta:
        model = Report
        fields = [
            'id', 'laboratory', 'laboratory_title',
            'project', 'project_title',
            'date_time', 'report_text', 'confirmation'
        ]
        read_only_fields = ['id', 'date_time']


class UserSerializer(serializers.ModelSerializer):
    site_role_title = serializers.CharField(source='site_role.title', read_only=True, default=None)
    laboratory_title = serializers.CharField(source='laboratory.title', read_only=True, default=None)

    class Meta:
        model = User
        fields = [
            'id', 'login', 'site_role', 'site_role_title',
            'laboratory', 'laboratory_title'
        ]
        read_only_fields = ['id', 'password']


class UserListSerializer(serializers.ModelSerializer):
    site_role_title = serializers.CharField(source='site_role.title', read_only=True, default=None)
    laboratory_title = serializers.CharField(source='laboratory.title', read_only=True, default=None)
    is_hub_leader = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'login', 'site_role_title', 'laboratory_title', 'is_hub_leader'
        ]

    def get_is_hub_leader(self, obj):
        try:
            return obj.hub_leader_profile.is_active
        except HubLeader.DoesNotExist:
            return False


class HubLeaderSerializer(serializers.ModelSerializer):
    user_login = serializers.CharField(source='user.login', read_only=True)
    user_role = serializers.CharField(source='user.site_role.title', read_only=True, default=None)
    laboratory_title = serializers.CharField(source='user.laboratory.title', read_only=True, default=None)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = HubLeader
        fields = [
            'id', 'user', 'user_login', 'user_role',
            'full_name', 'position', 'degree', 'phone', 'email',
            'image', 'image_url', 'is_active', 'created_at',
            'laboratory_title'
        ]
        read_only_fields = ['id', 'created_at']

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class EventLogSerializer(serializers.ModelSerializer):
    action_display = serializers.CharField(source='get_action_display', read_only=True)

    class Meta:
        model = EventLog
        fields = [
            'id', 'user_login', 'action', 'action_display',
            'entity_type', 'entity_id', 'timestamp', 'details'
        ]
        read_only_fields = ['id', 'timestamp']


class LaboratoryLeaderSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    laboratory_title = serializers.CharField(source='laboratory.title', read_only=True)

    class Meta:
        model = LaboratoryLeader
        fields = ['id', 'student', 'student_name', 'laboratory', 'laboratory_title']


class StudentLaboratorySerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    laboratory_title = serializers.CharField(source='laboratory.title', read_only=True, default=None)

    class Meta:
        model = StudentLaboratory
        fields = ['id', 'student', 'student_name', 'laboratory', 'laboratory_title']


class StudentDirectionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    direction_title = serializers.CharField(source='direction.title', read_only=True)

    class Meta:
        model = StudentDirection
        fields = ['id', 'student', 'student_name', 'direction', 'direction_title']


class ProjectLaboratorySerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    laboratory_title = serializers.CharField(source='laboratory.title', read_only=True)

    class Meta:
        model = ProjectLaboratory
        fields = ['id', 'project', 'project_title', 'laboratory', 'laboratory_title']


class ProjectRoleSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    role_title = serializers.CharField(source='role.title', read_only=True)
    assigned_count = serializers.SerializerMethodField()

    class Meta:
        model = ProjectRole
        fields = ['id', 'project', 'project_title', 'role', 'role_title', 'assigned_count']

    def get_assigned_count(self, obj):
        return obj.assigned_students.filter(present=True).count()
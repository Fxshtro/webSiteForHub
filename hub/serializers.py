from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import (
    Lab, Project, ProjectParticipant, Achievement, User,
    Direction, EventLog, HubSettings, HubLeader
)


class DirectionSerializer(serializers.ModelSerializer):
    labs_count = serializers.IntegerField(source='labs.count', read_only=True)
    labs_multi_count = serializers.IntegerField(source='labs_multi.count', read_only=True)

    class Meta:
        model = Direction
        fields = ['id', 'name', 'labs_count', 'labs_multi_count']
        read_only_fields = ['id']


class LabSerializer(serializers.ModelSerializer):
    directions_names = serializers.SerializerMethodField()
    projects_count = serializers.IntegerField(source='projects.count', read_only=True)
    active_projects_count = serializers.SerializerMethodField()

    class Meta:
        model = Lab
        fields = [
            'id', 'name', 'short_description', 'full_description',
            'directions', 'directions_names', 'images',
            'active', 'created_at', 'updated_at',
            'projects_count', 'active_projects_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_directions_names(self, obj):
        directions = list(obj.directions.all()) + list(obj.directions_multi.all())
        return [d.name for d in directions]

    def get_active_projects_count(self, obj):
        return obj.projects.filter(active=True).count()


class ProjectSerializer(serializers.ModelSerializer):
    lab_name = serializers.CharField(source='lab.name', read_only=True)
    participants_count = serializers.SerializerMethodField()
    active_participants_count = serializers.SerializerMethodField()
    concept_file_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'goal', 'concept_file', 'concept_file_url',
            'lab', 'lab_name', 'active', 'created_at', 'updated_at',
            'participants_count', 'active_participants_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_participants_count(self, obj):
        return obj.participants.count()

    def get_active_participants_count(self, obj):
        return obj.participants.filter(left_at__isnull=True).count()

    def get_concept_file_url(self, obj):
        if obj.concept_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.concept_file.url)
        return None


class UserSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    managed_lab_name = serializers.CharField(source='managed_lab.name', read_only=True)
    is_hub_leader = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'role_display', 'metaverse_link', 'managed_lab',
            'managed_lab_name', 'is_active', 'date_joined', 'last_login',
            'is_hub_leader'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login', 'is_hub_leader']

    def get_is_hub_leader(self, obj):
        return hasattr(obj, 'hub_leader_profile') and obj.hub_leader_profile.is_active

    def validate(self, data):
        role = data.get('role')
        managed_lab = data.get('managed_lab')

        if role == 'lab_lead' and not managed_lab:
            raise serializers.ValidationError({
                'managed_lab': 'Лидер лаборатории должен быть привязан к лаборатории'
            })

        return data

    def update(self, instance, validated_data):
        # Хешируем пароль если передан
        password = validated_data.pop('password', None)
        if password:
            instance.password = make_password(password)

        # Обработка снятия с роли lab_lead или project_manager
        old_role = instance.role
        new_role = validated_data.get('role', old_role)

        if old_role in ['lab_lead', 'project_manager'] and new_role != old_role:
            instance.is_active = False

        return super().update(instance, validated_data)


class UserRoleListSerializer(serializers.ModelSerializer):
    """Упрощенный сериализатор для списка пользователей по ролям"""
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    lab_name = serializers.CharField(source='managed_lab.name', read_only=True, allow_null=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'role_display', 'lab_name', 'is_active']


class ProjectParticipantSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = ProjectParticipant
        fields = [
            'id', 'user', 'user_username', 'user_email', 'project',
            'project_title', 'role', 'role_display', 'joined_at',
            'left_at', 'is_active'
        ]
        read_only_fields = ['id', 'joined_at']

    def get_is_active(self, obj):
        return obj.left_at is None


class AchievementSerializer(serializers.ModelSerializer):
    lab_name = serializers.CharField(source='lab.name', read_only=True)
    project_title = serializers.CharField(source='project.title', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = [
            'id', 'title', 'description', 'image', 'image_url',
            'lab', 'lab_name', 'project', 'project_title', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None

    def validate(self, data):
        lab = data.get('lab')
        project = data.get('project')

        if not lab and not project:
            raise serializers.ValidationError(
                'Достижение должно быть связано либо с лабораторией, либо с проектом'
            )
        if lab and project:
            raise serializers.ValidationError(
                'Достижение может быть связано только с лабораторией ИЛИ проектом'
            )

        # Проверка длины описания
        description = data.get('description', '')
        if len(description) > 350:
            raise serializers.ValidationError({
                'description': 'Описание не может превышать 350 символов'
            })

        return data

    def validate_image(self, value):
        if value:
            # Проверка размера файла (2МБ)
            if value.size > 2 * 1024 * 1024:
                raise serializers.ValidationError('Размер изображения не может превышать 2МБ')

            # Проверка соотношения сторон (4:3)
            from PIL import Image
            try:
                img = Image.open(value)
                width, height = img.size
                aspect_ratio = width / height
                expected_ratio = 4 / 3
                tolerance = 0.1
                if abs(aspect_ratio - expected_ratio) > tolerance:
                    raise serializers.ValidationError(
                        f'Изображение должно быть соотношения 4:3 (было {width}x{height})'
                    )
            except Exception as e:
                raise serializers.ValidationError(f'Ошибка обработки изображения: {str(e)}')

        return value


class EventLogSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)

    class Meta:
        model = EventLog
        fields = [
            'id', 'user', 'user_username', 'action', 'action_display',
            'entity_type', 'entity_id', 'timestamp', 'details'
        ]
        read_only_fields = ['id', 'timestamp']


class HubLeaderSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_role = serializers.CharField(source='user.role', read_only=True)

    class Meta:
        model = HubLeader
        fields = [
            'id', 'user', 'user_username', 'user_email', 'user_role',
            'position', 'phone', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class HubSettingsSerializer(serializers.ModelSerializer):
    leaders = serializers.SerializerMethodField()

    class Meta:
        model = HubSettings
        fields = ['id', 'name', 'description', 'leaders', 'updated_at']
        read_only_fields = ['id', 'updated_at', 'leaders']

    def get_leaders(self, obj):
        leaders = HubLeader.objects.filter(is_active=True)
        return HubLeaderSerializer(leaders, many=True).data
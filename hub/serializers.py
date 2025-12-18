from rest_framework import serializers
from .models import (
    Lab, Project, ProjectParticipant, Achievement, User,
    Direction, EventLog, HubSettings
)


class DirectionSerializer(serializers.ModelSerializer):
    labs_count = serializers.IntegerField(source='labs.count', read_only=True)
    
    class Meta:
        model = Direction
        fields = ['id', 'name', 'labs_count']
        read_only_fields = ['id']


class LabSerializer(serializers.ModelSerializer):
    direction_name = serializers.CharField(source='direction.name', read_only=True)
    projects_count = serializers.IntegerField(source='projects.count', read_only=True)
    active_projects_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Lab
        fields = [
            'id', 'name', 'description', 'direction', 'direction_name',
            'active', 'created_at', 'updated_at', 'projects_count', 'active_projects_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
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
            'id', 'title', 'description', 'concept_file', 'concept_file_url',
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
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'role_display', 'metaverse_link', 'managed_lab',
            'managed_lab_name', 'is_active', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']


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
        return data


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


class HubSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HubSettings
        fields = ['id', 'name', 'description', 'contact_email', 'updated_at']
        read_only_fields = ['id', 'updated_at']


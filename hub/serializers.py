"""Serializers для API"""
from rest_framework import serializers
from .models import Lab, Project, ProjectParticipant, Achievement, User


class LabSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lab
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class ProjectParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectParticipant
        fields = '__all__'


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'


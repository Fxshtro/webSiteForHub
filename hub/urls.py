from django.urls import path, include
from rest_framework import routers
from . import views
from .viewsets import (
    DirectionViewSet, LabViewSet, ProjectViewSet,
    UserViewSet, ProjectParticipantViewSet,
    AchievementViewSet, EventLogViewSet, HubSettingsViewSet
)

router = routers.DefaultRouter()
router.register(r'directions', DirectionViewSet, basename='direction')
router.register(r'labs', LabViewSet, basename='lab')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'users', UserViewSet, basename='user')
router.register(r'participants', ProjectParticipantViewSet, basename='participant')
router.register(r'achievements', AchievementViewSet, basename='achievement')
router.register(r'events', EventLogViewSet, basename='event')
router.register(r'settings', HubSettingsViewSet, basename='settings')

urlpatterns = [
    path('', include(router.urls)),
    path('download/concept/<int:project_id>/', views.download_concept_file, name='download_concept_file'),
]


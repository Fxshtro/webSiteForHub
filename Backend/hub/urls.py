from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import viewsets

router = DefaultRouter()
router.register(r'directions', viewsets.DirectionViewSet)
router.register(r'roles', viewsets.RoleViewSet)
router.register(r'site-roles', viewsets.SiteRoleViewSet)
router.register(r'labs', viewsets.LaboratoryViewSet)
router.register(r'lab-directions', viewsets.LaboratoryDirectionViewSet)
router.register(r'student-labs', viewsets.StudentLaboratoryViewSet)
router.register(r'student-directions', viewsets.StudentDirectionViewSet)
router.register(r'projects', viewsets.ProjectViewSet)
router.register(r'project-labs', viewsets.ProjectLaboratoryViewSet)
router.register(r'project-roles', viewsets.ProjectRoleViewSet)
router.register(r'participants', viewsets.StudentProjectRoleViewSet, basename='participant')
router.register(r'achievements', viewsets.AchievementViewSet)
router.register(r'reports', viewsets.ReportViewSet)
router.register(r'students', viewsets.StudentViewSet)
router.register(r'guides', viewsets.GuideViewSet)
router.register(r'hub-managers', viewsets.HubManagerViewSet)
router.register(r'users', viewsets.UserViewSet)
router.register(r'hub-leaders', viewsets.HubLeaderViewSet)
router.register(r'site-content', viewsets.SiteContentViewSet)
router.register(r'events', viewsets.EventLogViewSet)

urlpatterns = [
    path('', viewsets.api_root, name='api_root'),
    path('', include(router.urls)),
]
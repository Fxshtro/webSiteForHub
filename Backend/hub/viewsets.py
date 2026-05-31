from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings
import secrets
import string

from .models import (
    SiteRole, User, Student, Guide, HubManager,
    Direction, Laboratory, LaboratoryDirection,
    StudentLaboratory, StudentDirection,
    Role, Project, ProjectLaboratory, ProjectRole, StudentProjectRole,
    Achievement, Report, EventLog, HubLeader, SiteContent,
)
from .serializers import (
    SiteRoleSerializer, UserSerializer, UserListSerializer, StudentSerializer, GuideSerializer,
    DirectionSerializer, LaboratorySerializer, LaboratoryDirectionSerializer,
    StudentLaboratorySerializer, StudentDirectionSerializer,
    RoleSerializer, ProjectSerializer, ProjectLaboratorySerializer, ProjectRoleSerializer,
    StudentProjectRoleSerializer, AchievementSerializer, ReportSerializer,
    EventLogSerializer, HubLeaderSerializer, HubManagerSerializer,
    SiteContentSerializer,
)
from .permissions import IsAdmin, IsLabLead, IsProjectManager


def generate_password(length=8):
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(length))


MANAGER_ROLE_TITLE = 'Менеджер проекта'
LAB_LEAD_ROLE_TITLE = 'Лидер лаборатории'


# =============================================================================
# СПРАВОЧНИКИ
# =============================================================================

class DirectionViewSet(viewsets.ModelViewSet):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['title']


class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['title']


class SiteContentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiteContent.objects.all()
    serializer_class = SiteContentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        obj = self.get_queryset().first()
        if obj:
            serializer = self.get_serializer(obj)
            return Response(serializer.data)
        return Response({'detail': 'Настройки не найдены'}, status=404)


class SiteRoleViewSet(viewsets.ModelViewSet):
    queryset = SiteRole.objects.all()
    serializer_class = SiteRoleSerializer
    permission_classes = [IsAdminUser]


# =============================================================================
# ПОЛЬЗОВАТЕЛИ
# =============================================================================

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['site_role', 'laboratory']
    search_fields = ['login']
    ordering_fields = ['id', 'login']

    def get_serializer_class(self):
        if self.action == 'list':
            return UserListSerializer
        return UserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        login = request.user.username if hasattr(request.user, 'username') else str(request.user)
        try:
            user = User.objects.get(login=login)
            serializer = UserSerializer(user, context={'request': request})
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'Пользователь не найден'}, status=404)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['study_group', 'experience', 'university_city']
    search_fields = ['surname', 'name', 'email', 'telegram_nickname', 'study_group']
    ordering_fields = ['surname', 'name']

    def get_queryset(self):
        qs = super().get_queryset()
        lab_id = self.request.query_params.get('laboratory')
        if lab_id:
            qs = qs.filter(laboratory_links__laboratory_id=lab_id)
        return qs


class GuideViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Guide.objects.all()
    serializer_class = GuideSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['surname', 'name']

    def get_queryset(self):
        qs = super().get_queryset()
        lab_id = self.request.query_params.get('laboratory')
        if lab_id:
            qs = qs.filter(laboratoryguide__laboratory_id=lab_id)
        return qs


class HubManagerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HubManager.objects.all()
    serializer_class = HubManagerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


# =============================================================================
# ЛАБОРАТОРИИ
# =============================================================================

class LaboratoryViewSet(viewsets.ModelViewSet):
    queryset = Laboratory.objects.all()
    serializer_class = LaboratorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['active', 'slug']
    search_fields = ['title', 'slug', 'short_description']
    ordering_fields = ['title']

    @action(detail=True, methods=['get'])
    def projects(self, request, pk=None):
        lab = self.get_object()
        projects = Project.objects.filter(laboratory_links__laboratory=lab)
        serializer = ProjectSerializer(projects, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        lab = self.get_object()
        students = Student.objects.filter(laboratory_links__laboratory=lab)
        serializer = StudentSerializer(students, many=True, context={'request': request})
        return Response(serializer.data)


class LaboratoryDirectionViewSet(viewsets.ModelViewSet):
    queryset = LaboratoryDirection.objects.all()
    serializer_class = LaboratoryDirectionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['laboratory', 'direction']


class StudentLaboratoryViewSet(viewsets.ModelViewSet):
    queryset = StudentLaboratory.objects.all()
    serializer_class = StudentLaboratorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['laboratory']


class StudentDirectionViewSet(viewsets.ModelViewSet):
    queryset = StudentDirection.objects.all()
    serializer_class = StudentDirectionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['direction']


# =============================================================================
# ПРОЕКТЫ
# =============================================================================

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['need_report']
    search_fields = ['title', 'description', 'goal']
    ordering_fields = ['title']

    def get_queryset(self):
        qs = super().get_queryset()
        lab_slug = self.request.query_params.get('lab_slug')
        if lab_slug:
            qs = qs.filter(laboratory_links__laboratory__slug=lab_slug)
        return qs

    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        project = self.get_object()
        participants = StudentProjectRole.objects.filter(
            project_role__project=project, present=True
        )
        serializer = StudentProjectRoleSerializer(participants, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def active_participants(self, request, pk=None):
        project = self.get_object()
        participants = StudentProjectRole.objects.filter(
            project_role__project=project, present=True
        )
        serializer = StudentProjectRoleSerializer(participants, many=True, context={'request': request})
        return Response(serializer.data)


class ProjectLaboratoryViewSet(viewsets.ModelViewSet):
    queryset = ProjectLaboratory.objects.all()
    serializer_class = ProjectLaboratorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['laboratory', 'project']


class ProjectRoleViewSet(viewsets.ModelViewSet):
    queryset = ProjectRole.objects.all()
    serializer_class = ProjectRoleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['project', 'role']


class StudentProjectRoleViewSet(viewsets.ModelViewSet):
    queryset = StudentProjectRole.objects.all()
    serializer_class = StudentProjectRoleSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['present', 'project_role__project', 'project_role__role']
    search_fields = ['student__surname', 'student__name']

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        participant = self.get_object()
        participant.present = False
        participant.save()
        return Response({'status': 'participant_left'})


# =============================================================================
# ДОСТИЖЕНИЯ
# =============================================================================

class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['laboratory', 'project']
    search_fields = ['title', 'description']


# =============================================================================
# ОТЧЁТЫ
# =============================================================================

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['laboratory', 'project', 'confirmation']
    search_fields = ['report_text']
    ordering_fields = ['-date_time']


# =============================================================================
# РУКОВОДИТЕЛИ ХАБА
# =============================================================================

class HubLeaderViewSet(viewsets.ModelViewSet):
    queryset = HubLeader.objects.all()
    serializer_class = HubLeaderSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['user__login', 'position', 'full_name', 'phone', 'email']


# =============================================================================
# ЖУРНАЛ СОБЫТИЙ
# =============================================================================

class EventLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventLog.objects.all()
    serializer_class = EventLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['action', 'entity_type']
    search_fields = ['user_login', 'entity_type']
    ordering_fields = ['-timestamp']


# =============================================================================
# API ROOT
# =============================================================================

@api_view(['GET'])
def api_root(request):
    return Response({
        'directions': '/api/directions/',
        'roles': '/api/roles/',
        'labs': '/api/labs/',
        'lab-directions': '/api/lab-directions/',
        'lab-leaders': '/api/lab-leaders/',
        'projects': '/api/projects/',
        'project-labs': '/api/project-labs/',
        'project-roles': '/api/project-roles/',
        'participants': '/api/participants/',
        'achievements': '/api/achievements/',
        'reports': '/api/reports/',
        'students': '/api/students/',
        'guides': '/api/guides/',
        'student-labs': '/api/student-labs/',
        'student-directions': '/api/student-directions/',
        'users': '/api/users/',
        'hub-leaders': '/api/hub-leaders/',
        'site-content': '/api/site-content/',
        'events': '/api/events/',
    })
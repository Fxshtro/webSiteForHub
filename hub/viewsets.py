from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import (
    User, Direction, Lab, Project, ProjectParticipant,
    Achievement, EventLog, HubSettings, HubLeader
)
from .serializers import (
    DirectionSerializer, LabSerializer, ProjectSerializer,
    UserSerializer, UserRoleListSerializer, ProjectParticipantSerializer,
    AchievementSerializer, EventLogSerializer, HubSettingsSerializer,
    HubLeaderSerializer
)
from .permissions import (
    IsAdminOrReadOnly, IsLabLeadOrReadOnly,
    IsProjectManagerOrReadOnly, IsOwnerOrReadOnly
)


class DirectionViewSet(viewsets.ModelViewSet):
    queryset = Direction.objects.all()
    serializer_class = DirectionSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    ordering = ['name']


class LabViewSet(viewsets.ModelViewSet):
    queryset = Lab.objects.prefetch_related('directions', 'directions_multi').all()
    serializer_class = LabSerializer
    permission_classes = [IsAuthenticated, IsLabLeadOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['active', 'directions']
    search_fields = ['name', 'short_description', 'full_description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_superuser or user.is_admin():
            return qs
        if user.is_lab_lead() and user.managed_lab:
            return qs.filter(id=user.managed_lab.id)
        return qs.filter(active=True)

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_lab_lead() and user.managed_lab:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Лидер лаборатории не может создавать новые лаборатории")
        serializer.save()

    @action(detail=True, methods=['get'])
    def projects(self, request, pk=None):
        lab = self.get_object()
        projects = lab.projects.all()
        serializer = ProjectSerializer(projects, many=True, context={'request': request})
        return Response(serializer.data)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.select_related('lab').all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsLabLeadOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['active', 'lab']
    search_fields = ['title', 'description', 'goal']
    ordering_fields = ['title', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_superuser or user.is_admin():
            return qs
        if user.is_lab_lead() and user.managed_lab:
            return qs.filter(lab=user.managed_lab)
        if user.is_project_manager():
            managed_projects = ProjectParticipant.objects.filter(
                user=user,
                role='manager',
                left_at__isnull=True
            ).values_list('project_id', flat=True)
            return qs.filter(id__in=managed_projects)
        return qs.filter(active=True)

    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        project = self.get_object()
        participants = project.participants.all()
        serializer = ProjectParticipantSerializer(
            participants, many=True, context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def active_participants(self, request, pk=None):
        project = self.get_object()
        participants = project.participants.filter(left_at__isnull=True)
        serializer = ProjectParticipantSerializer(
            participants, many=True, context={'request': request}
        )
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related('managed_lab').all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'date_joined']
    ordering = ['username']

    def get_serializer_class(self):
        if self.action == 'by_role':
            return UserRoleListSerializer
        return UserSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_superuser or user.is_admin():
            return qs
        if user.is_lab_lead() and user.managed_lab:
            return qs.filter(
                Q(managed_lab=user.managed_lab) |
                Q(project_participations__project__lab=user.managed_lab)
            ).distinct()
        return qs.filter(id=user.id)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_role(self, request):
        """Список пользователей по ролям"""
        role = request.query_params.get('role')
        queryset = self.get_queryset()
        if role:
            queryset = queryset.filter(role=role)
        serializer = UserRoleListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def roles_summary(self, request):
        """Сводка по ролям"""
        summary = {}
        for role_code, role_name in User.ROLE_CHOICES:
            summary[role_code] = {
                'name': role_name,
                'count': User.objects.filter(role=role_code, is_active=True).count()
            }
        return Response(summary)


class ProjectParticipantViewSet(viewsets.ModelViewSet):
    queryset = ProjectParticipant.objects.select_related('user', 'project', 'project__lab').all()
    serializer_class = ProjectParticipantSerializer
    permission_classes = [IsAuthenticated, IsLabLeadOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'project', 'left_at']
    search_fields = ['user__username', 'project__title']
    ordering_fields = ['joined_at', 'left_at']
    ordering = ['-joined_at']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_superuser or user.is_admin():
            return qs
        if user.is_lab_lead() and user.managed_lab:
            return qs.filter(project__lab=user.managed_lab)
        if user.is_project_manager():
            managed_projects = ProjectParticipant.objects.filter(
                user=user,
                role='manager',
                left_at__isnull=True
            ).values_list('project_id', flat=True)
            return qs.filter(project_id__in=managed_projects)
        return qs.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_project_manager() or user.is_lab_lead():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Добавление участников доступно только администраторам")
        serializer.save()

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        participant = self.get_object()

        if participant.user != request.user and not (
            request.user.is_superuser or request.user.is_admin() or
            (request.user.is_lab_lead() and participant.project.lab == request.user.managed_lab)
        ):
            return Response(
                {'error': 'У вас нет прав для этого действия'},
                status=status.HTTP_403_FORBIDDEN
            )

        if participant.left_at:
            return Response(
                {'error': 'Участник уже покинул проект'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.utils import timezone
        from .utils import log_event

        participant.left_at = timezone.now()
        participant.save()

        # Деактивация при снятии роли manager
        if participant.role == 'manager':
            participant.user.role = 'student'
            participant.user.save()

        log_event(
            user=request.user,
            action='participant_left',
            entity_type='ProjectParticipant',
            entity_id=participant.id,
            details={
                'user': str(participant.user),
                'project': str(participant.project)
            }
        )

        return Response({'status': 'Участник покинул проект'})

    @action(detail=True, methods=['post'])
    def assign_manager(self, request, pk=None):
        """Назначить участника менеджером проекта"""
        if not (request.user.is_superuser or request.user.is_admin() or request.user.is_lab_lead()):
            return Response(
                {'error': 'У вас нет прав для этого действия'},
                status=status.HTTP_403_FORBIDDEN
            )

        participant = self.get_object()
        if participant.left_at:
            return Response(
                {'error': 'Нельзя назначить менеджером бывшего участника'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.conf import settings
        from django.core.mail import send_mail
        from django.contrib.auth.hashers import make_password
        import random
        import string
        from .utils import log_event

        participant.role = 'manager'
        participant.save()

        # Активация пользователя и смена роли
        participant.user.role = 'project_manager'
        participant.user.is_active = True
        participant.user.save()

        # Генерация пароля и отправка email
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        participant.user.set_password(password)
        participant.user.save()

        if participant.user.email:
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
            except Exception:
                pass

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

        return Response({'status': 'Участник назначен менеджером'})


class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.select_related('lab', 'project').all()
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated, IsLabLeadOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['lab', 'project']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_superuser or user.is_admin():
            return qs
        if user.is_lab_lead() and user.managed_lab:
            return qs.filter(
                Q(lab=user.managed_lab) |
                Q(project__lab=user.managed_lab)
            )
        if user.is_project_manager():
            managed_projects = ProjectParticipant.objects.filter(
                user=user,
                role='manager',
                left_at__isnull=True
            ).values_list('project_id', flat=True)
            return qs.filter(project_id__in=managed_projects)
        return qs


class EventLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EventLog.objects.select_related('user').all()
    serializer_class = EventLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['action', 'entity_type', 'user']
    search_fields = ['user__username', 'entity_type']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.user
        if user.is_superuser or user.is_admin():
            return qs
        return qs.filter(user=user)


class HubSettingsViewSet(viewsets.ModelViewSet):
    queryset = HubSettings.objects.all()
    serializer_class = HubSettingsSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    def get_queryset(self):
        return HubSettings.objects.all()

    def get_object(self):
        return HubSettings.get_settings()

    def list(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class HubLeaderViewSet(viewsets.ModelViewSet):
    queryset = HubLeader.objects.select_related('user').all()
    serializer_class = HubLeaderSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['user__username', 'user__email', 'position']
    ordering = ['user__username']

    def perform_create(self, serializer):
        from .utils import log_event
        leader = serializer.save()
        leader.user.is_active = True
        leader.user.save()
        log_event(
            user=self.request.user,
            action='hub_leader_added',
            entity_type='HubLeader',
            entity_id=leader.id,
            details={'user': str(leader.user), 'position': leader.position}
        )

    def perform_destroy(self, instance):
        from .utils import log_event
        log_event(
            user=self.request.user,
            action='hub_leader_removed',
            entity_type='HubLeader',
            entity_id=instance.id,
            details={'user': str(instance.user)}
        )
        instance.delete()
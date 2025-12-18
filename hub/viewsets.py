from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import (
    User, Direction, Lab, Project, ProjectParticipant,
    Achievement, EventLog, HubSettings
)
from .serializers import (
    DirectionSerializer, LabSerializer, ProjectSerializer,
    UserSerializer, ProjectParticipantSerializer,
    AchievementSerializer, EventLogSerializer, HubSettingsSerializer
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
    
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_superuser or user.is_admin():
            return qs
        return qs


class LabViewSet(viewsets.ModelViewSet):
    queryset = Lab.objects.all()
    serializer_class = LabSerializer
    permission_classes = [IsAuthenticated, IsLabLeadOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['active', 'direction']
    search_fields = ['name', 'description']
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
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsLabLeadOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['active', 'lab']
    search_fields = ['title', 'description']
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
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'date_joined']
    ordering = ['username']
    
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


class ProjectParticipantViewSet(viewsets.ModelViewSet):
    queryset = ProjectParticipant.objects.all()
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


class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
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
    queryset = EventLog.objects.all()
    serializer_class = EventLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['action', 'entity_type', 'user']
    search_fields = ['user__username', 'entity_type']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
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


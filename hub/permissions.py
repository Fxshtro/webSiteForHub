from rest_framework import permissions
from .models import ProjectParticipant


class IsAdminOrReadOnly(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        return request.user.is_authenticated and (
            request.user.is_superuser or request.user.is_admin()
        )


class IsLabLeadOrReadOnly(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_superuser or request.user.is_admin() or request.user.is_lab_lead()
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if request.user.is_superuser or request.user.is_admin():
            return True
        
        if hasattr(obj, 'lab'):
            if request.user.is_lab_lead() and obj.lab == request.user.managed_lab:
                return True
        
        if hasattr(obj, 'lab'):
            if request.user.is_lab_lead() and obj.lab == request.user.managed_lab:
                return True
        
        if hasattr(obj, 'project'):
            if request.user.is_lab_lead() and obj.project.lab == request.user.managed_lab:
                return True
            if request.user.is_project_manager():
                return ProjectParticipant.objects.filter(
                    user=request.user,
                    project=obj.project,
                    role='manager',
                    left_at__isnull=True
                ).exists()
        
        return False


class IsProjectManagerOrReadOnly(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_superuser or request.user.is_admin() or request.user.is_project_manager()
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if request.user.is_superuser or request.user.is_admin():
            return True
        
        if hasattr(obj, 'project'):
            obj = obj.project
        if hasattr(obj, 'lab'):
            managed_projects = ProjectParticipant.objects.filter(
                user=request.user,
                role='manager',
                left_at__isnull=True
            ).values_list('project_id', flat=True)
            return obj.id in managed_projects
        
        return False


class IsOwnerOrReadOnly(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        if request.user.is_superuser or request.user.is_admin():
            return True
        
        if hasattr(obj, 'username'):
            return obj == request.user
        
        return False


# API эндпоинты —暂时禁用 (требует отдельной настройки под реальную БД)
# Для работы админки viewsets не требуются
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def api_root(request):
    return Response({
        'message': 'API хаба',
        'admin': '/admin/',
        'docs': 'Настройте API отдельно при необходимости'
    })
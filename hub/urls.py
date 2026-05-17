from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.api_root, name='api_root'),
]
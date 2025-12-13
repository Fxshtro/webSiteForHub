"""URLs для API приложения hub"""
from django.urls import path
from rest_framework import routers
from . import views

urlpatterns = [
    path('download/concept/<int:project_id>/', views.download_concept_file, name='download_concept_file'),
    # API endpoints можно добавить позже
]


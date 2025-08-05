from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('packages/', views.packages, name='packages'),
    path('destinations/', views.destinations, name='destination'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('packages/<int:pk>/', views.package_detail, name='package_detail'),
    path('destination/<int:pk>/', views.destination_detail, name='destination_detail'),
]
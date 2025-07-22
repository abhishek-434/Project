from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('destinations/', views.destinations, name='destinations'),
    path('destination/<int:pk>/', views.destination_detail, name='destination_detail'),
    path('packages/', views.packages, name='packages'),
    path('package/<int:pk>/', views.package_detail, name='package_detail'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('gallery/', views.gallery, name='gallery'),
]
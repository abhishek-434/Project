from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('courses/', views.courses, name='courses'),
    path('courses/<str:code>/', views.course_detail, name='course_detail'),
    path('admissions/', views.admissions, name='admissions'),
    path('faculty/', views.faculty, name='faculty'),
    path('gallery/', views.gallery, name='gallery'),
    path('notices/', views.notices, name='notices'),
    path('contact/', views.contact, name='contact'),
]
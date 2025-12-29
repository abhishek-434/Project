from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # Admin URLs
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/students/', views.admin_students, name='admin_students'),
    path('admin/teachers/', views.admin_teachers, name='admin_teachers'),
    path('admin/attendance/', views.admin_attendance, name='admin_attendance'),
    path('admin/exams/', views.admin_exams, name='admin_exams'),
    path('admin/fees/', views.admin_fees, name='admin_fees'),
    path('admin/notices/', views.admin_notices, name='admin_notices'),
    
    # Teacher URLs
    path('teacher/dashboard/', views.teacher_dashboard, name='teacher_dashboard'),
    path('teacher/attendance/', views.teacher_attendance, name='teacher_attendance'),
    path('teacher/exams/', views.teacher_exams, name='teacher_exams'),
    
    # Student URLs
    path('student/dashboard/', views.student_dashboard, name='student_dashboard'),
    path('student/attendance/', views.student_attendance, name='student_attendance'),
    path('student/exams/', views.student_exams, name='student_exams'),
    path('student/fees/', views.student_fees, name='student_fees'),
]
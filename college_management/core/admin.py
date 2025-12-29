from django.contrib import admin
from .models import *

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'is_active']
    list_filter = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code']
    search_fields = ['name', 'code']

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'department', 'credits']
    list_filter = ['department']
    search_fields = ['code', 'name']

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['roll_number', 'user', 'department', 'semester']
    list_filter = ['department', 'semester']
    search_fields = ['roll_number', 'user__username']

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'user', 'department', 'designation']
    list_filter = ['department']
    search_fields = ['employee_id', 'user__username']

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'date', 'status']
    list_filter = ['status', 'date', 'course']
    search_fields = ['student__roll_number']

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ['name', 'course', 'exam_type', 'date', 'total_marks']
    list_filter = ['exam_type', 'date']
    search_fields = ['name', 'course__name']

@admin.register(ExamResult)
class ExamResultAdmin(admin.ModelAdmin):
    list_display = ['student', 'exam', 'marks_obtained', 'grade']
    list_filter = ['grade', 'exam']
    search_fields = ['student__roll_number']

@admin.register(Fee)
class FeeAdmin(admin.ModelAdmin):
    list_display = ['student', 'fee_type', 'amount', 'payment_status', 'due_date']
    list_filter = ['payment_status', 'fee_type']
    search_fields = ['student__roll_number']

@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ['title', 'posted_by', 'posted_date', 'target_role', 'is_active']
    list_filter = ['target_role', 'is_active', 'posted_date']
    search_fields = ['title', 'content']
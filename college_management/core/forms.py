from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import *

class UserRegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'phone', 'address', 'role']

class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ['roll_number', 'department', 'semester', 'admission_date', 'courses']
        widgets = {
            'admission_date': forms.DateInput(attrs={'type': 'date'}),
        }

class TeacherForm(forms.ModelForm):
    class Meta:
        model = Teacher
        fields = ['employee_id', 'department', 'designation', 'qualification', 'joining_date', 'courses']
        widgets = {
            'joining_date': forms.DateInput(attrs={'type': 'date'}),
        }

class AttendanceForm(forms.ModelForm):
    class Meta:
        model = Attendance
        fields = ['student', 'course', 'date', 'status', 'remarks']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
        }

class ExamForm(forms.ModelForm):
    class Meta:
        model = Exam
        fields = ['course', 'name', 'exam_type', 'date', 'total_marks']
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),
        }

class ExamResultForm(forms.ModelForm):
    class Meta:
        model = ExamResult
        fields = ['exam', 'student', 'marks_obtained', 'grade', 'remarks']

class FeeForm(forms.ModelForm):
    class Meta:
        model = Fee
        fields = ['student', 'fee_type', 'amount', 'due_date', 'payment_status']
        widgets = {
            'due_date': forms.DateInput(attrs={'type': 'date'}),
        }

class NoticeForm(forms.ModelForm):
    class Meta:
        model = Notice
        fields = ['title', 'content', 'target_role', 'is_active']
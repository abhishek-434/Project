from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Count, Q, Avg
from datetime import datetime, timedelta
from .models import *
from .forms import *

# Authentication Views
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            if user.role == 'admin':
                return redirect('admin_dashboard')
            elif user.role == 'teacher':
                return redirect('teacher_dashboard')
            else:
                return redirect('student_dashboard')
        else:
            messages.error(request, 'Invalid credentials')
    
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')

# Admin Views
@login_required
def admin_dashboard(request):
    if request.user.role != 'admin':
        return redirect('login')
    
    context = {
        'total_students': Student.objects.count(),
        'total_teachers': Teacher.objects.count(),
        'total_courses': Course.objects.count(),
        'total_departments': Department.objects.count(),
        'recent_notices': Notice.objects.filter(is_active=True)[:5],
        'pending_fees': Fee.objects.filter(payment_status='pending').count(),
    }
    return render(request, 'admin/dashboard.html', context)

@login_required
def admin_students(request):
    if request.user.role != 'admin':
        return redirect('login')
    
    students = Student.objects.select_related('user', 'department').all()
    
    if request.method == 'POST':
        user_form = UserRegistrationForm(request.POST)
        student_form = StudentForm(request.POST)
        
        if user_form.is_valid() and student_form.is_valid():
            user = user_form.save(commit=False)
            user.role = 'student'
            user.save()
            
            student = student_form.save(commit=False)
            student.user = user
            student.save()
            student_form.save_m2m()
            
            messages.success(request, 'Student added successfully')
            return redirect('admin_students')
    else:
        user_form = UserRegistrationForm()
        student_form = StudentForm()
    
    context = {
        'students': students,
        'user_form': user_form,
        'student_form': student_form,
    }
    return render(request, 'admin/students.html', context)

@login_required
def admin_teachers(request):
    if request.user.role != 'admin':
        return redirect('login')
    
    teachers = Teacher.objects.select_related('user', 'department').all()
    
    if request.method == 'POST':
        user_form = UserRegistrationForm(request.POST)
        teacher_form = TeacherForm(request.POST)
        
        if user_form.is_valid() and teacher_form.is_valid():
            user = user_form.save(commit=False)
            user.role = 'teacher'
            user.save()
            
            teacher = teacher_form.save(commit=False)
            teacher.user = user
            teacher.save()
            teacher_form.save_m2m()
            
            messages.success(request, 'Teacher added successfully')
            return redirect('admin_teachers')
    else:
        user_form = UserRegistrationForm()
        teacher_form = TeacherForm()
    
    context = {
        'teachers': teachers,
        'user_form': user_form,
        'teacher_form': teacher_form,
    }
    return render(request, 'admin/teachers.html', context)

@login_required
def admin_attendance(request):
    if request.user.role != 'admin':
        return redirect('login')
    
    attendance_records = Attendance.objects.select_related('student', 'course').all()[:100]
    
    context = {
        'attendance_records': attendance_records,
    }
    return render(request, 'admin/attendance.html', context)

@login_required
def admin_exams(request):
    if request.user.role != 'admin':
        return redirect('login')
    
    exams = Exam.objects.select_related('course').all()
    
    if request.method == 'POST':
        exam_form = ExamForm(request.POST)
        if exam_form.is_valid():
            exam_form.save()
            messages.success(request, 'Exam created successfully')
            return redirect('admin_exams')
    else:
        exam_form = ExamForm()
    
    context = {
        'exams': exams,
        'exam_form': exam_form,
    }
    return render(request, 'admin/exams.html', context)

@login_required
def admin_fees(request):
    if request.user.role != 'admin':
        return redirect('login')
    
    fees = Fee.objects.select_related('student').all()
    
    if request.method == 'POST':
        fee_form = FeeForm(request.POST)
        if fee_form.is_valid():
            fee_form.save()
            messages.success(request, 'Fee record created successfully')
            return redirect('admin_fees')
    else:
        fee_form = FeeForm()
    
    context = {
        'fees': fees,
        'fee_form': fee_form,
    }
    return render(request, 'admin/fees.html', context)

@login_required
def admin_notices(request):
    if request.user.role != 'admin':
        return redirect('login')
    
    notices = Notice.objects.all()
    
    if request.method == 'POST':
        notice_form = NoticeForm(request.POST)
        if notice_form.is_valid():
            notice = notice_form.save(commit=False)
            notice.posted_by = request.user
            notice.save()
            messages.success(request, 'Notice posted successfully')
            return redirect('admin_notices')
    else:
        notice_form = NoticeForm()
    
    context = {
        'notices': notices,
        'notice_form': notice_form,
    }
    return render(request, 'admin/notices.html', context)

# Teacher Views
@login_required
def teacher_dashboard(request):
    if request.user.role != 'teacher':
        return redirect('login')
    
    teacher = Teacher.objects.get(user=request.user)
    courses = teacher.courses.all()
    
    context = {
        'teacher': teacher,
        'courses': courses,
        'total_students': Student.objects.filter(courses__in=courses).distinct().count(),
        'recent_notices': Notice.objects.filter(Q(target_role='teacher') | Q(target_role=''))[:5],
    }
    return render(request, 'teacher/dashboard.html', context)

@login_required
def teacher_attendance(request):
    if request.user.role != 'teacher':
        return redirect('login')
    
    teacher = Teacher.objects.get(user=request.user)
    courses = teacher.courses.all()
    
    if request.method == 'POST':
        course_id = request.POST.get('course')
        date = request.POST.get('date')
        student_ids = request.POST.getlist('students')
        
        course = Course.objects.get(id=course_id)
        for student_id in student_ids:
            student = Student.objects.get(id=student_id)
            Attendance.objects.update_or_create(
                student=student,
                course=course,
                date=date,
                defaults={'status': True}
            )
        
        messages.success(request, 'Attendance marked successfully')
        return redirect('teacher_attendance')
    
    context = {
        'courses': courses,
    }
    return render(request, 'teacher/attendance.html', context)

@login_required
def teacher_exams(request):
    if request.user.role != 'teacher':
        return redirect('login')
    
    teacher = Teacher.objects.get(user=request.user)
    courses = teacher.courses.all()
    exams = Exam.objects.filter(course__in=courses)
    
    context = {
        'exams': exams,
        'courses': courses,
    }
    return render(request, 'teacher/exams.html', context)

# Student Views
@login_required
def student_dashboard(request):
    if request.user.role != 'student':
        return redirect('login')
    
    student = Student.objects.get(user=request.user)
    courses = student.courses.all()
    
    # Calculate attendance percentage
    total_classes = Attendance.objects.filter(student=student).count()
    attended_classes = Attendance.objects.filter(student=student, status=True).count()
    attendance_percentage = (attended_classes / total_classes * 100) if total_classes > 0 else 0
    
    context = {
        'student': student,
        'courses': courses,
        'attendance_percentage': round(attendance_percentage, 2),
        'recent_notices': Notice.objects.filter(Q(target_role='student') | Q(target_role=''))[:5],
    }
    return render(request, 'student/dashboard.html', context)

@login_required
def student_attendance(request):
    if request.user.role != 'student':
        return redirect('login')
    
    student = Student.objects.get(user=request.user)
    attendance_records = Attendance.objects.filter(student=student).select_related('course')
    
    # Calculate course-wise attendance
    course_attendance = {}
    for course in student.courses.all():
        total = Attendance.objects.filter(student=student, course=course).count()
        present = Attendance.objects.filter(student=student, course=course, status=True).count()
        percentage = (present / total * 100) if total > 0 else 0
        course_attendance[course] = {
            'total': total,
            'present': present,
            'percentage': round(percentage, 2)
        }
    
    context = {
        'attendance_records': attendance_records,
        'course_attendance': course_attendance,
    }
    return render(request, 'student/attendance.html', context)

@login_required
def student_exams(request):
    if request.user.role != 'student':
        return redirect('login')
    
    student = Student.objects.get(user=request.user)
    courses = student.courses.all()
    exams = Exam.objects.filter(course__in=courses)
    results = ExamResult.objects.filter(student=student).select_related('exam')
    
    context = {
        'exams': exams,
        'results': results,
    }
    return render(request, 'student/exams.html', context)

@login_required
def student_fees(request):
    if request.user.role != 'student':
        return redirect('login')
    
    student = Student.objects.get(user=request.user)
    fees = Fee.objects.filter(student=student)
    
    total_fees = sum(fee.amount for fee in fees)
    paid_fees = sum(fee.amount for fee in fees if fee.payment_status == 'paid')
    pending_fees = total_fees - paid_fees
    
    context = {
        'fees': fees,
        'total_fees': total_fees,
        'paid_fees': paid_fees,
        'pending_fees': pending_fees,
    }
    return render(request, 'student/fees.html', context)
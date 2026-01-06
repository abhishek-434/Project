from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.core.paginator import Paginator
from .models import (
    Department, 
    Faculty, 
    Notice, 
    GalleryImage, 
    BannerSlide, 
    CollegeInfo
)
from .forms import AdmissionInquiryForm, ContactMessageForm


def home(request):
    """Homepage with banner, departments, notices, and gallery preview"""
    context = {
        'banners': BannerSlide.objects.filter(is_active=True),
        'departments': Department.objects.filter(is_active=True)[:6],
        'notices': Notice.objects.all()[:5],
        'gallery_images': GalleryImage.objects.all()[:6],
        'college_info': CollegeInfo.objects.first(),
    }
    return render(request, 'main/home.html', context)


def about(request):
    """About page with college information"""
    context = {
        'college_info': CollegeInfo.objects.first(),
    }
    return render(request, 'main/about.html', context)


def courses(request):
    """List all active courses/departments"""
    context = {
        'departments': Department.objects.filter(is_active=True),
    }
    return render(request, 'main/courses.html', context)


def course_detail(request, code):
    """Individual course detail page"""
    department = get_object_or_404(Department, code=code, is_active=True)
    context = {
        'department': department,
        'faculty_members': department.faculty_members.all(),
    }
    return render(request, 'main/course_detail.html', context)


def admissions(request):
    """Admissions page with inquiry form"""
    if request.method == 'POST':
        form = AdmissionInquiryForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Your admission inquiry has been submitted successfully! We will contact you soon.')
            return redirect('admissions')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = AdmissionInquiryForm()
    
    context = {
        'form': form,
        'departments': Department.objects.filter(is_active=True),
    }
    return render(request, 'main/admissions.html', context)


def faculty(request):
    """Faculty list with department filtering"""
    dept_code = request.GET.get('department', None)
    
    if dept_code:
        faculty_members = Faculty.objects.filter(department__code=dept_code)
        selected_dept = get_object_or_404(Department, code=dept_code)
    else:
        faculty_members = Faculty.objects.all()
        selected_dept = None
    
    context = {
        'faculty_members': faculty_members,
        'departments': Department.objects.filter(is_active=True),
        'selected_dept': selected_dept,
    }
    return render(request, 'main/faculty.html', context)


def gallery(request):
    """Gallery with category filtering"""
    category = request.GET.get('category', None)
    
    if category:
        images = GalleryImage.objects.filter(category=category)
    else:
        images = GalleryImage.objects.all()
    
    context = {
        'images': images,
        'categories': GalleryImage.objects.values_list('category', flat=True).distinct(),
        'selected_category': category,
    }
    return render(request, 'main/gallery.html', context)


def notices(request):
    """Notices listing with pagination"""
    notice_list = Notice.objects.all()
    paginator = Paginator(notice_list, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
    }
    return render(request, 'main/notices.html', context)


def contact(request):
    """Contact page with form"""
    if request.method == 'POST':
        form = ContactMessageForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Thank you for contacting us! We will get back to you soon.')
            return redirect('contact')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = ContactMessageForm()
    
    context = {
        'form': form,
        'college_info': CollegeInfo.objects.first(),
    }
    return render(request, 'main/contact.html', context)
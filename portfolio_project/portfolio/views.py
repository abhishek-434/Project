from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Profile, Education, Experience, Skill, Project, ContactMessage

def home(request):
    try:
        profile = Profile.objects.first()
    except Profile.DoesNotExist:
        profile = None
    
    context = {
        'profile': profile,
        'featured_projects': Project.objects.filter(is_featured=True)[:3]
    }
    return render(request, 'portfolio/home.html', context)

def about(request):
    profile = Profile.objects.first()
    context = {'profile': profile}
    return render(request, 'portfolio/about.html', context)

def education(request):
    educations = Education.objects.all()
    context = {'educations': educations}
    return render(request, 'portfolio/education.html', context)

def experience(request):
    experiences = Experience.objects.all()
    context = {'experiences': experiences}
    return render(request, 'portfolio/experience.html', context)

def skills(request):
    skills_by_category = {}
    for skill in Skill.objects.all():
        category = skill.get_category_display()
        if category not in skills_by_category:
            skills_by_category[category] = []
        skills_by_category[category].append(skill)
    
    context = {'skills_by_category': skills_by_category}
    return render(request, 'portfolio/skills.html', context)

def projects(request):
    all_projects = Project.objects.all()
    context = {'projects': all_projects}
    return render(request, 'portfolio/projects.html', context)

def contact(request):
    profile = Profile.objects.first()
    
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        ContactMessage.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        
        messages.success(request, 'Thank you! Your message has been sent.')
        return redirect('contact')
    
    context = {'profile': profile}
    return render(request, 'portfolio/contact.html', context)
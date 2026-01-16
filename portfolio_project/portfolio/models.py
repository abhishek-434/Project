from django.db import models
from django.core.validators import RegexValidator

class Profile(models.Model):
    name = models.CharField(max_length=100)
    profession = models.CharField(max_length=200)
    bio = models.TextField()
    date_of_birth = models.DateField()
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$')
    phone_number = models.CharField(validators=[phone_regex], max_length=17)
    email = models.EmailField()
    address = models.CharField(max_length=300, blank=True)
    profile_image = models.ImageField(upload_to='profile/', blank=True)
    resume = models.FileField(upload_to='resume/', blank=True)
    
    # Social Media
    github = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Profile'
        verbose_name_plural = 'Profile'
    
    def __str__(self):
        return self.name

class Education(models.Model):
    EDUCATION_LEVEL = (
        ('school', 'Schooling'),
        ('college', 'College'),
        ('university', 'University'),
        ('current', 'Current Study'),
    )
    
    level = models.CharField(max_length=20, choices=EDUCATION_LEVEL)
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    grade = models.CharField(max_length=50, blank=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-order', '-start_date']
        verbose_name = 'Education'
        verbose_name_plural = 'Education'
    
    def __str__(self):
        return f"{self.degree} - {self.institution}"

class Experience(models.Model):
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    location = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField()
    technologies = models.CharField(max_length=500, blank=True, 
                                   help_text="Comma-separated technologies")
    company_logo = models.ImageField(upload_to='companies/', blank=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-order', '-start_date']
        verbose_name = 'Experience'
        verbose_name_plural = 'Experiences'
    
    def __str__(self):
        return f"{self.position} at {self.company}"
    
    def get_technologies_list(self):
        return [tech.strip() for tech in self.technologies.split(',')]

class Skill(models.Model):
    SKILL_CATEGORY = (
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('database', 'Database'),
        ('tools', 'Tools & Technologies'),
        ('soft', 'Soft Skills'),
    )
    
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=SKILL_CATEGORY)
    proficiency = models.IntegerField(default=50, 
                                     help_text="Proficiency percentage (0-100)")
    icon = models.CharField(max_length=100, blank=True, 
                           help_text="Font Awesome icon class")
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['category', '-proficiency']
        verbose_name = 'Skill'
        verbose_name_plural = 'Skills'
    
    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    long_description = models.TextField(blank=True)
    image = models.ImageField(upload_to='projects/')
    technologies = models.CharField(max_length=500, 
                                   help_text="Comma-separated technologies")
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    completed_date = models.DateField()
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-is_featured', '-order', '-completed_date']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
    
    def __str__(self):
        return self.title
    
    def get_technologies_list(self):
        return [tech.strip() for tech in self.technologies.split(',')]

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
    
    def __str__(self):
        return f"{self.name} - {self.subject}"
from django.db import models
from django.utils import timezone

# Create your models here.

class Department(models.Model):
    """
    Represents different departments/courses in the college
    Example: Computer Science, Business Administration, etc.
    """
    name = models.CharField(max_length=100, help_text="Department name (e.g., Computer Science)")
    code = models.CharField(max_length=10, unique=True, help_text="Department code (e.g., CS, MBA)")
    description = models.TextField(help_text="Detailed description of the department")
    image = models.ImageField(upload_to='courses/', blank=True, null=True, help_text="Department image")
    hod_name = models.CharField(max_length=100, verbose_name="Head of Department", help_text="Name of HOD")
    duration = models.CharField(max_length=50, help_text="Course duration (e.g., 3 Years, 4 Years)")
    eligibility = models.TextField(help_text="Eligibility criteria for admission")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True, help_text="Is this department active?")
    
    class Meta:
        ordering = ['name']
        verbose_name = "Department"
        verbose_name_plural = "Departments"
    
    def __str__(self):
        return f"{self.name} ({self.code})"


# ==================== Faculty Model ====================
class Faculty(models.Model):
    """
    Represents faculty members/teachers in the college
    """
    DESIGNATION_CHOICES = [
        ('professor', 'Professor'),
        ('associate', 'Associate Professor'),
        ('assistant', 'Assistant Professor'),
        ('lecturer', 'Lecturer'),
    ]
    
    name = models.CharField(max_length=100, help_text="Full name of faculty member")
    designation = models.CharField(max_length=20, choices=DESIGNATION_CHOICES, help_text="Job designation")
    department = models.ForeignKey(
        Department, 
        on_delete=models.CASCADE, 
        related_name='faculty_members',
        help_text="Department this faculty belongs to"
    )
    qualification = models.CharField(max_length=200, help_text="Highest qualification (e.g., Ph.D., M.Tech)")
    experience = models.CharField(max_length=50, help_text="Years of experience (e.g., 10 Years)")
    email = models.EmailField(help_text="Official email address")
    phone = models.CharField(max_length=15, blank=True, help_text="Contact number")
    photo = models.ImageField(upload_to='faculty/', blank=True, null=True, help_text="Faculty photo")
    bio = models.TextField(blank=True, help_text="Short biography")
    specialization = models.CharField(max_length=200, blank=True, help_text="Area of specialization")
    order = models.IntegerField(default=0, help_text="Display order (lower number = higher priority)")
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = "Faculty Member"
        verbose_name_plural = "Faculty"
    
    def __str__(self):
        return f"{self.name} - {self.get_designation_display()}"


# ==================== Notice Model ====================
class Notice(models.Model):
    """
    Represents announcements and notices on the website
    """
    CATEGORY_CHOICES = [
        ('academic', 'Academic'),
        ('examination', 'Examination'),
        ('admission', 'Admission'),
        ('event', 'Event'),
        ('general', 'General'),
    ]
    
    title = models.CharField(max_length=200, help_text="Notice title/heading")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    content = models.TextField(help_text="Full notice content")
    published_date = models.DateTimeField(default=timezone.now, help_text="When to publish this notice")
    is_important = models.BooleanField(default=False, help_text="Mark as important (shows with red badge)")
    attachment = models.FileField(upload_to='notices/', blank=True, null=True, help_text="Optional file attachment")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-published_date']
        verbose_name = "Notice"
        verbose_name_plural = "Notices"
    
    def __str__(self):
        return self.title


# ==================== Gallery Model ====================
class GalleryImage(models.Model):
    """
    Represents images in the gallery section
    """
    CATEGORY_CHOICES = [
        ('campus', 'Campus'),
        ('labs', 'Laboratories'),
        ('classrooms', 'Classrooms'),
        ('events', 'Events'),
        ('sports', 'Sports'),
        ('library', 'Library'),
    ]
    
    title = models.CharField(max_length=100, help_text="Image title")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, help_text="Image category")
    image = models.ImageField(upload_to='gallery/', help_text="Upload image file")
    description = models.TextField(blank=True, help_text="Optional image description")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0, help_text="Display order")
    
    class Meta:
        ordering = ['order', '-uploaded_at']
        verbose_name = "Gallery Image"
        verbose_name_plural = "Gallery Images"
    
    def __str__(self):
        return f"{self.title} - {self.get_category_display()}"


# ==================== Admission Inquiry Model ====================
class AdmissionInquiry(models.Model):
    """
    Stores admission inquiry form submissions from prospective students
    """
    full_name = models.CharField(max_length=100, help_text="Student's full name")
    email = models.EmailField(help_text="Contact email")
    phone = models.CharField(max_length=15, help_text="Contact phone number")
    course_interested = models.ForeignKey(
        Department, 
        on_delete=models.SET_NULL, 
        null=True,
        help_text="Course/Department interested in"
    )
    qualification = models.CharField(max_length=100, help_text="Current educational qualification")
    message = models.TextField(blank=True, help_text="Additional message/questions")
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_contacted = models.BooleanField(default=False, help_text="Has been contacted by admin?")
    
    class Meta:
        ordering = ['-submitted_at']
        verbose_name = "Admission Inquiry"
        verbose_name_plural = "Admission Inquiries"
    
    def __str__(self):
        return f"{self.full_name} - {self.course_interested}"


# ==================== Contact Message Model ====================
class ContactMessage(models.Model):
    """
    Stores contact form submissions from website visitors
    """
    name = models.CharField(max_length=100, help_text="Sender's name")
    email = models.EmailField(help_text="Sender's email")
    phone = models.CharField(max_length=15, blank=True, help_text="Sender's phone (optional)")
    subject = models.CharField(max_length=200, help_text="Message subject")
    message = models.TextField(help_text="Message content")
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False, help_text="Has admin read this message?")
    
    class Meta:
        ordering = ['-submitted_at']
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
    
    def __str__(self):
        return f"{self.name} - {self.subject}"


# ==================== Banner Slide Model ====================
class BannerSlide(models.Model):
    """
    Represents slides in the homepage banner carousel
    """
    title = models.CharField(max_length=100, help_text="Main banner heading")
    subtitle = models.CharField(max_length=200, blank=True, help_text="Subtitle/description (optional)")
    image = models.ImageField(upload_to='banners/', help_text="Banner image (1920x600px recommended)")
    button_text = models.CharField(max_length=50, blank=True, help_text="Call-to-action button text")
    button_link = models.CharField(max_length=200, blank=True, help_text="Button link URL")
    order = models.IntegerField(default=0, help_text="Display order (1, 2, 3...)")
    is_active = models.BooleanField(default=True, help_text="Show this slide?")
    
    class Meta:
        ordering = ['order']
        verbose_name = "Banner Slide"
        verbose_name_plural = "Banner Slides"
    
    def __str__(self):
        return self.title


# ==================== College Info Model ====================
class CollegeInfo(models.Model):
    """
    Stores basic college information (Should have only ONE instance)
    This is a singleton model - only one record should exist
    """
    # Basic Information
    name = models.CharField(max_length=200, help_text="College name")
    tagline = models.CharField(max_length=200, help_text="College tagline/motto")
    about = models.TextField(help_text="About the college")
    vision = models.TextField(help_text="College vision statement")
    mission = models.TextField(help_text="College mission statement")
    
    # Principal Information
    principal_name = models.CharField(max_length=100, help_text="Principal's name")
    principal_message = models.TextField(help_text="Message from the principal")
    principal_photo = models.ImageField(upload_to='college/', blank=True, help_text="Principal's photo")
    
    # Contact Information
    address = models.TextField(help_text="Complete college address")
    phone = models.CharField(max_length=50, help_text="Contact phone number(s)")
    email = models.EmailField(help_text="Official email address")
    website = models.URLField(blank=True, help_text="College website URL")
    
    # Social Media Links
    facebook = models.URLField(blank=True, help_text="Facebook page URL")
    twitter = models.URLField(blank=True, help_text="Twitter profile URL")
    instagram = models.URLField(blank=True, help_text="Instagram profile URL")
    linkedin = models.URLField(blank=True, help_text="LinkedIn page URL")
    
    # Google Maps
    google_maps_embed = models.TextField(
        blank=True, 
        help_text="Paste Google Maps iframe embed code here"
    )
    
    class Meta:
        verbose_name = "College Information"
        verbose_name_plural = "College Information"
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        """
        Override save to ensure only one instance exists (Singleton pattern)
        """
        if not self.pk and CollegeInfo.objects.exists():
            raise ValueError('There can only be one CollegeInfo instance. Please edit the existing one.')
        return super(CollegeInfo, self).save(*args, **kwargs)
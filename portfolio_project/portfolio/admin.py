from django.contrib import admin
from .models import Profile, Education, Experience, Skill, Project, ContactMessage

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'profession', 'email', 'phone_number']
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'profession', 'bio', 'date_of_birth', 
                      'profile_image', 'resume')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone_number', 'address')
        }),
        ('Social Media', {
            'fields': ('github', 'linkedin', 'twitter', 'instagram')
        }),
    )
    
    def has_add_permission(self, request):
        return not Profile.objects.exists()

@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['institution', 'degree', 'level', 'start_date', 
                   'end_date', 'is_current', 'order']
    list_filter = ['level', 'is_current']
    search_fields = ['institution', 'degree', 'field_of_study']
    ordering = ['-order', '-start_date']

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['company', 'position', 'start_date', 'end_date', 
                   'is_current', 'order']
    list_filter = ['is_current']
    search_fields = ['company', 'position', 'description']
    ordering = ['-order', '-start_date']

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency', 'order']
    list_filter = ['category']
    search_fields = ['name']
    ordering = ['category', '-proficiency']

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_featured', 'completed_date', 'order']
    list_filter = ['is_featured', 'completed_date']
    search_fields = ['title', 'description', 'technologies']
    ordering = ['-is_featured', '-order', '-completed_date']

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Mark selected messages as read"
    
    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
    mark_as_unread.short_description = "Mark selected messages as unread"
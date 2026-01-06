from django.contrib import admin
from .models import (
    Department, 
    Faculty, 
    Notice, 
    GalleryImage, 
    AdmissionInquiry, 
    ContactMessage, 
    BannerSlide, 
    CollegeInfo
)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'hod_name', 'duration', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at', 'duration']
    search_fields = ['name', 'code', 'hod_name', 'description']
    list_editable = ['is_active']
    prepopulated_fields = {'code': ('name',)}
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description', 'image')
        }),
        ('Academic Details', {
            'fields': ('hod_name', 'duration', 'eligibility')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )
    
    list_per_page = 20


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ['name', 'designation', 'department', 'qualification', 'email', 'order']
    list_filter = ['designation', 'department']
    search_fields = ['name', 'email', 'qualification', 'specialization']
    list_editable = ['order']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'photo', 'email', 'phone')
        }),
        ('Professional Details', {
            'fields': ('designation', 'department', 'qualification', 'experience', 'specialization')
        }),
        ('Biography', {
            'fields': ('bio',),
            'classes': ('collapse',)
        }),
        ('Display Settings', {
            'fields': ('order',)
        }),
    )
    
    list_per_page = 25


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'published_date', 'is_important', 'created_at']
    list_filter = ['category', 'is_important', 'published_date']
    search_fields = ['title', 'content']
    list_editable = ['is_important']
    date_hierarchy = 'published_date'
    
    fieldsets = (
        ('Notice Details', {
            'fields': ('title', 'category', 'content', 'attachment')
        }),
        ('Publishing', {
            'fields': ('published_date', 'is_important')
        }),
    )
    
    list_per_page = 20


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'uploaded_at', 'order']
    list_filter = ['category', 'uploaded_at']
    search_fields = ['title', 'description']
    list_editable = ['order']
    date_hierarchy = 'uploaded_at'
    
    fieldsets = (
        ('Image Information', {
            'fields': ('title', 'category', 'image', 'description')
        }),
        ('Display Settings', {
            'fields': ('order',)
        }),
    )
    
    list_per_page = 30


@admin.register(AdmissionInquiry)
class AdmissionInquiryAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone', 'course_interested', 'submitted_at', 'is_contacted']
    list_filter = ['is_contacted', 'course_interested', 'submitted_at']
    search_fields = ['full_name', 'email', 'phone', 'qualification']
    list_editable = ['is_contacted']
    readonly_fields = ['submitted_at']
    date_hierarchy = 'submitted_at'
    
    fieldsets = (
        ('Applicant Information', {
            'fields': ('full_name', 'email', 'phone', 'qualification')
        }),
        ('Course Details', {
            'fields': ('course_interested', 'message')
        }),
        ('Status', {
            'fields': ('submitted_at', 'is_contacted')
        }),
    )
    
    list_per_page = 25
    
    actions = ['mark_as_contacted', 'mark_as_not_contacted']
    
    def mark_as_contacted(self, request, queryset):
        updated = queryset.update(is_contacted=True)
        self.message_user(request, f'{updated} inquiries marked as contacted.')
    mark_as_contacted.short_description = "Mark selected as contacted"
    
    def mark_as_not_contacted(self, request, queryset):
        updated = queryset.update(is_contacted=False)
        self.message_user(request, f'{updated} inquiries marked as not contacted.')
    mark_as_not_contacted.short_description = "Mark selected as not contacted"


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'submitted_at', 'is_read']
    list_filter = ['is_read', 'submitted_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']
    readonly_fields = ['submitted_at']
    date_hierarchy = 'submitted_at'
    
    fieldsets = (
        ('Sender Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Status', {
            'fields': ('submitted_at', 'is_read')
        }),
    )
    
    list_per_page = 25
    
    actions = ['mark_as_read', 'mark_as_unread']
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} messages marked as read.')
    mark_as_read.short_description = "Mark selected as read"
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} messages marked as unread.')
    mark_as_unread.short_description = "Mark selected as unread"


@admin.register(BannerSlide)
class BannerSlideAdmin(admin.ModelAdmin):
    list_display = ['title', 'order', 'is_active']
    list_filter = ['is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['title', 'subtitle']
    
    fieldsets = (
        ('Slide Content', {
            'fields': ('title', 'subtitle', 'image')
        }),
        ('Call to Action', {
            'fields': ('button_text', 'button_link')
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )
    
    list_per_page = 20


@admin.register(CollegeInfo)
class CollegeInfoAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'tagline', 'about')
        }),
        ('Vision & Mission', {
            'fields': ('vision', 'mission')
        }),
        ('Principal Details', {
            'fields': ('principal_name', 'principal_message', 'principal_photo')
        }),
        ('Contact Information', {
            'fields': ('address', 'phone', 'email', 'website')
        }),
        ('Social Media', {
            'fields': ('facebook', 'twitter', 'instagram', 'linkedin'),
            'classes': ('collapse',)
        }),
        ('Map Integration', {
            'fields': ('google_maps_embed',),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return not CollegeInfo.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False


admin.site.site_header = "College Administration Panel"
admin.site.site_title = "College Admin"
admin.site.index_title = "Welcome to College Management System"
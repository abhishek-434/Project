# reviews/admin.py

from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_reviewed_item', 'rating', 'created_at', 'is_approved')
    list_filter = ('rating', 'is_approved', 'created_at')
    search_fields = ('user__username', 'title', 'comment')
    actions = ['approve_reviews']
    
    def get_reviewed_item(self, obj):
        if obj.destination:
            return f"Destination: {obj.destination.name}"
        else:
            return f"Package: {obj.package.name}"
    get_reviewed_item.short_description = 'Reviewed Item'
    
    def approve_reviews(self, request, queryset):
        queryset.update(is_approved=True)
    approve_reviews.short_description = "Approve selected reviews"
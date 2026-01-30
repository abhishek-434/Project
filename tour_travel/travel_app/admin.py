from django.contrib import admin
from .models import Destination, TourPackage, Booking, Review, Contact, Newsletter, GalleryImage

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['caption', 'tourist_name', 'created_at']
    list_filter = ['created_at']
    search_fields = ['caption', 'tourist_name']


@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'featured', 'created_at']
    list_filter = ['featured', 'country', 'created_at']
    search_fields = ['name', 'country', 'description']
    list_editable = ['featured']

@admin.register(TourPackage)
class TourPackageAdmin(admin.ModelAdmin):
    list_display = ['title', 'destination', 'price', 'duration_days', 'difficulty', 'featured', 'created_at']
    list_filter = ['featured', 'difficulty', 'destination', 'created_at']
    search_fields = ['title', 'description', 'destination__name']
    list_editable = ['featured', 'price']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'package', 'travel_date', 'number_of_people', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'travel_date', 'created_at']
    search_fields = ['full_name', 'email', 'package__title']
    list_editable = ['status']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['name', 'package', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['name', 'comment', 'package__title']

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']

@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ['email', 'subscribed_at']
    list_filter = ['subscribed_at']
    search_fields = ['email']
    readonly_fields = ['subscribed_at']
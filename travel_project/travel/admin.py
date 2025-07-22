from django.contrib import admin
from .models import Destination, TourPackage, Contact, Booking

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'price', 'featured', 'created_at']
    list_filter = ['country', 'featured', 'created_at']
    search_fields = ['name', 'country', 'description']
    list_editable = ['featured']

@admin.register(TourPackage)
class TourPackageAdmin(admin.ModelAdmin):
    list_display = ['title', 'destination', 'tour_type', 'price', 'featured', 'created_at']
    list_filter = ['tour_type', 'featured', 'created_at', 'destination']
    search_fields = ['title', 'description', 'destination__name']
    list_editable = ['featured']

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'email', 'subject']
    readonly_fields = ['created_at']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'package', 'travel_date', 'number_of_people', 'status', 'created_at']
    list_filter = ['status', 'travel_date', 'created_at']
    search_fields = ['customer_name', 'customer_email', 'package__title']
    list_editable = ['status']
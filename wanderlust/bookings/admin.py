# bookings/admin.py

from django.contrib import admin
from .models import Booking, Payment

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_number', 'user', 'package', 'travel_date', 'status', 'total_price')
    list_filter = ('status', 'travel_date')
    search_fields = ('booking_number', 'user__username', 'package__name')
    readonly_fields = ('booking_number',)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('booking', 'amount', 'payment_date', 'payment_method', 'is_successful')
    list_filter = ('payment_method', 'is_successful', 'payment_date')
    search_fields = ('transaction_id', 'booking__booking_number')
from django.db import models
from django.contrib.auth.models import User
from destinations.models import Package

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateTimeField(auto_now_add=True)
    travel_date = models.DateField()
    number_of_travelers = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    special_requests = models.TextField(blank=True)
    booking_number = models.CharField(max_length=20, unique=True)
    
    def __str__(self):
        return f"Booking #{self.booking_number} by {self.user.username}"
    
    def save(self, *args, **kwargs):
        if not self.booking_number:
            # Generate a unique booking number
            import random
            import string
            self.booking_number = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
            
        if not self.total_price:
            self.total_price = self.package.price * self.number_of_travelers
            
        super().save(*args, **kwargs)

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = (
        ('credit_card', 'Credit Card'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
    )
    
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    transaction_id = models.CharField(max_length=100, unique=True)
    is_successful = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Payment for Booking #{self.booking.booking_number}"
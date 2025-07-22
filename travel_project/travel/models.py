from django.db import models
from django.urls import reverse

# Create your models here.

class Destination(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='destinations/', blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('destination_detail', kwargs={'pk': self.pk})

class TourPackage(models.Model):
    TOUR_TYPES = [
        ('adventure', 'Adventure'),
        ('cultural', 'Cultural'),
        ('beach', 'Beach'),
        ('mountain', 'Mountain'),
        ('city', 'City Break'),
        ('wildlife', 'Wildlife'),
    ]
    
    title = models.CharField(max_length=200)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='packages')
    tour_type = models.CharField(max_length=20, choices=TOUR_TYPES)
    description = models.TextField()
    image = models.ImageField(upload_to='packages/', blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50)
    max_people = models.IntegerField()
    includes = models.TextField(help_text="What's included in the package")
    excludes = models.TextField(help_text="What's not included", blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.subject}"

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]
    
    package = models.ForeignKey(TourPackage, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    travel_date = models.DateField()
    number_of_people = models.IntegerField()
    special_requests = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.customer_name} - {self.package.title}"
    
    @property
    def total_cost(self):
        return self.package.price * self.number_of_people
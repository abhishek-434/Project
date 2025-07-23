from django.db import models
from django.urls import reverse
from django.utils.text import slugify

class Continent(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    
    def __str__(self):
        return self.name

class Country(models.Model):
    name = models.CharField(max_length=100)
    continent = models.ForeignKey(Continent, on_delete=models.CASCADE, related_name='countries')
    slug = models.SlugField(unique=True)
    
    def __str__(self):
        return self.name

class Destination(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='destinations')
    description = models.TextField()
    highlights = models.TextField()
    main_image = models.ImageField(upload_to='destinations/')
    featured = models.BooleanField(default=False)
    popular = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('destination_detail', kwargs={'slug': self.slug})
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class DestinationImage(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='destinations/gallery/')
    caption = models.CharField(max_length=200, blank=True)
    
    def __str__(self):
        return f"{self.destination.name} - Image {self.id}"

class Package(models.Model):
    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('challenging', 'Challenging'),
    )
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='packages')
    duration = models.PositiveIntegerField(help_text="Duration in days")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    description = models.TextField()
    itinerary = models.TextField()
    inclusions = models.TextField()
    exclusions = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='moderate')
    group_size = models.PositiveIntegerField(default=15)
    featured = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('package_detail', kwargs={'slug': self.slug})
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
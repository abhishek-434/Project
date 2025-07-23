# destinations/admin.py

from django.contrib import admin
from .models import Continent, Country, Destination, DestinationImage, Package

class DestinationImageInline(admin.TabularInline):
    model = DestinationImage
    extra = 3

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'featured', 'popular', 'created_at')
    list_filter = ('country', 'featured', 'popular')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [DestinationImageInline]

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'destination', 'duration', 'price', 'difficulty', 'featured')
    list_filter = ('destination', 'difficulty', 'featured')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

admin.site.register(Continent)
admin.site.register(Country)
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Destination, TourPackage, Contact, Booking
from .forms import ContactForm, BookingForm

def home(request):
    """Home page view with featured destinations and packages"""
    featured_destinations = Destination.objects.filter(featured=True)[:6]
    featured_packages = TourPackage.objects.filter(featured=True)[:3]
    
    context = {
        'featured_destinations': featured_destinations,
        'featured_packages': featured_packages,
    }
    return render(request, 'travel/home.html', context)

def destinations(request):
    """Destinations listing page with search and filter"""
    destinations_list = Destination.objects.all().order_by('-created_at')
    
    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        destinations_list = destinations_list.filter(
            Q(name__icontains=search_query) | 
            Q(country__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(destinations_list, 9)
    page_number = request.GET.get('page')
    destinations = paginator.get_page(page_number)
    
    context = {
        'destinations': destinations,
        'search_query': search_query,
    }
    return render(request, 'travel/destinations.html', context)

def destination_detail(request, pk):
    """Individual destination detail page"""
    destination = get_object_or_404(Destination, pk=pk)
    related_packages = TourPackage.objects.filter(destination=destination)
    
    context = {
        'destination': destination,
        'related_packages': related_packages,
    }
    return render(request, 'travel/destination_detail.html', context)

def packages(request):
    """Tour packages listing page"""
    packages_list = TourPackage.objects.all().order_by('-created_at')
    
    # Filter by tour type
    tour_type = request.GET.get('type')
    if tour_type:
        packages_list = packages_list.filter(tour_type=tour_type)
    
    # Search functionality
    search_query = request.GET.get('search')
    if search_query:
        packages_list = packages_list.filter(
            Q(title__icontains=search_query) | 
            Q(description__icontains=search_query) |
            Q(destination__name__icontains=search_query)
        )
    
    # Pagination
    paginator = Paginator(packages_list, 6)
    page_number = request.GET.get('page')
    packages = paginator.get_page(page_number)
    
    # Get tour types for filter
    tour_types = TourPackage.TOUR_TYPES
    
    context = {
        'packages': packages,
        'tour_types': tour_types,
        'current_type': tour_type,
        'search_query': search_query,
    }
    return render(request, 'travel/packages.html', context)

def package_detail(request, pk):
    """Individual package detail page"""
    package = get_object_or_404(TourPackage, pk=pk)
    
    if request.method == 'POST':
        booking_form = BookingForm(request.POST)
        if booking_form.is_valid():
            booking = booking_form.save(commit=False)
            booking.package = package
            booking.save()
            messages.success(request, 'Your booking request has been submitted successfully!')
            return redirect('package_detail', pk=pk)
    else:
        booking_form = BookingForm()
    
    context = {
        'package': package,
        'booking_form': booking_form,
    }
    return render(request, 'travel/package_detail.html', context)

def about(request):
    """About us page"""
    return render(request, 'travel/about.html')

def contact(request):
    """Contact page with form"""
    if request.method == 'POST':
        contact_form = ContactForm(request.POST)
        if contact_form.is_valid():
            contact_form.save()
            messages.success(request, 'Thank you for your message! We will get back to you soon.')
            return redirect('contact')
    else:
        contact_form = ContactForm()
    
    context = {
        'contact_form': contact_form,
    }
    return render(request, 'travel/contact.html', context)

def gallery(request):
    """Gallery page"""
    destinations = Destination.objects.all()
    packages = TourPackage.objects.all()
    
    context = {
        'destinations': destinations,
        'packages': packages,
    }
    return render(request, 'travel/gallery.html', context)
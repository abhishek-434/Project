from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q, Avg
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Destination, TourPackage, Booking, Review, Contact, Newsletter, GalleryImage
from .forms import BookingForm, ReviewForm, ContactForm, NewsletterForm
import json

def home(request):
    featured_destinations = Destination.objects.filter(featured=True)[:6]
    featured_packages = TourPackage.objects.filter(featured=True)[:4]
    latest_packages = TourPackage.objects.all().order_by('-created_at')[:6]
    
    context = {
        'featured_destinations': featured_destinations,
        'featured_packages': featured_packages,
        'latest_packages': latest_packages,
    }
    return render(request, 'travel_app/home.html', context)

def destinations(request):
    destinations_list = Destination.objects.all()
    paginator = Paginator(destinations_list, 9)
    page_number = request.GET.get('page')
    destinations = paginator.get_page(page_number)
    
    context = {
        'destinations': destinations,
    }
    return render(request, 'travel_app/destinations.html', context)

def destination_detail(request, pk):
    destination = get_object_or_404(Destination, pk=pk)
    packages = TourPackage.objects.filter(destination=destination)
    
    context = {
        'destination': destination,
        'packages': packages,
    }
    return render(request, 'travel_app/destination_detail.html', context)

def packages(request):
    packages_list = TourPackage.objects.all()
    paginator = Paginator(packages_list, 9)
    page_number = request.GET.get('page')
    packages = paginator.get_page(page_number)
    
    context = {
        'packages': packages,
    }
    return render(request, 'travel_app/packages.html', context)

def package_detail(request, pk):
    package = get_object_or_404(TourPackage, pk=pk)
    reviews = Review.objects.filter(package=package).order_by('-created_at')
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
    related_packages = TourPackage.objects.filter(
        destination=package.destination
    ).exclude(pk=pk)[:3]
    
    if request.method == 'POST':
        if 'review_form' in request.POST:
            review_form = ReviewForm(request.POST)
            if review_form.is_valid():
                review = review_form.save(commit=False)
                review.package = package
                review.save()
                messages.success(request, 'Review added successfully!')
                return redirect('package_detail', pk=pk)
        else:
            booking_form = BookingForm(request.POST)
            if booking_form.is_valid():
                booking = booking_form.save(commit=False)
                booking.package = package
                booking.total_amount = package.price * booking.number_of_people
                booking.save()
                messages.success(request, 'Booking request submitted successfully!')
                return redirect('booking_success', booking_id=booking.id)
    else:
        booking_form = BookingForm()
        review_form = ReviewForm()
    
    context = {
        'package': package,
        'reviews': reviews,
        'avg_rating': avg_rating,
        'related_packages': related_packages,
        'booking_form': booking_form,
        'review_form': review_form,
    }
    return render(request, 'travel_app/package_detail.html', context)

def booking_success(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    context = {'booking': booking}
    return render(request, 'travel_app/booking_success.html', context)

def booking_page(request, package_id):
    package = get_object_or_404(TourPackage, pk=package_id)
    
    if request.method == 'POST':
        form = BookingForm(request.POST)
        if form.is_valid():
            booking = form.save(commit=False)
            booking.package = package
            booking.total_amount = package.price * booking.number_of_people
            booking.save()
            messages.success(request, 'Booking submitted successfully!')
            return redirect('booking_success', booking_id=booking.id)
    else:
        form = BookingForm()
        
    context = {
        'package': package,
        'form': form,
    }
    return render(request, 'travel_app/booking_form.html', context)

def about(request):
    return render(request, 'travel_app/about.html')

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Message sent successfully! We will get back to you soon.')
            return redirect('contact')
    else:
        form = ContactForm()
    
    context = {'form': form}
    return render(request, 'travel_app/contact.html', context)

@csrf_exempt
def newsletter_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
        
        if email:
            newsletter, created = Newsletter.objects.get_or_create(email=email)
            if created:
                return JsonResponse({'success': True, 'message': 'Successfully subscribed!'})
            else:
                return JsonResponse({'success': False, 'message': 'Email already subscribed!'})
        
    return JsonResponse({'success': False, 'message': 'Invalid email!'})

def gallery(request):
    images = GalleryImage.objects.all()
    context = {
        'images': images
    }
    return render(request, 'travel_app/gallery.html', context)


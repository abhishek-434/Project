from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils.decorators import method_decorator
from django.views.generic import ListView, DetailView, CreateView
from .models import Booking, Payment
from .forms import BookingForm
from destinations.models import Package

@method_decorator(login_required, name='dispatch')
class BookingListView(ListView):
    model = Booking
    template_name = 'bookings/booking_list.html'
    context_object_name = 'bookings'
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

@method_decorator(login_required, name='dispatch')
class BookingDetailView(DetailView):
    model = Booking
    template_name = 'bookings/booking_detail.html'
    context_object_name = 'booking'
    
    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

@login_required
def create_booking(request, package_slug):
    package = get_object_or_404(Package, slug=package_slug)
    
    if request.method == 'POST':
        form = BookingForm(request.POST)
        if form.is_valid():
            booking = form.save(commit=False)
            booking.user = request.user
            booking.package = package
            booking.total_price = package.price * booking.number_of_travelers
            booking.save()
            
            messages.success(request, 'Your booking has been created successfully!')
            return redirect('booking_detail', pk=booking.pk)
    else:
        form = BookingForm()
    
    return render(request, 'bookings/create_booking.html', {
        'form': form,
        'package': package
    })
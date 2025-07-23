# bookings/forms.py

from django import forms
from .models import Booking

class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = ['travel_date', 'number_of_travelers', 'special_requests']
        widgets = {
            'travel_date': forms.DateInput(attrs={'type': 'date'}),
        }
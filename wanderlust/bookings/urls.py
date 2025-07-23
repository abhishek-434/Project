# bookings/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.BookingListView.as_view(), name='booking_list'),
    path('<int:pk>/', views.BookingDetailView.as_view(), name='booking_detail'),
    path('create/<slug:package_slug>/', views.create_booking, name='create_booking'),
]
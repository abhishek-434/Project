from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('packages/', views.packages, name='packages'),
    path('destinations/', views.destinations, name='destination'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('packages/<int:pk>/', views.package_detail, name='package_detail'),
    path('book/<int:package_id>/', views.booking_page, name='booking_page'),
    path('destination/<int:pk>/', views.destination_detail, name='destination_detail'),
    path('booking-success/<int:booking_id>/', views.booking_success, name='booking_success'),
    path('search/', views.search, name='search'),
    path('newsletter-signup/', views.newsletter_signup, name='newsletter_signup'),
    path('gallery/', views.gallery, name='gallery'),
]

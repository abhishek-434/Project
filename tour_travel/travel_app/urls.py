from django.urls import path
from django.contrib.auth import views as auth_views
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
    
    # Authentication URLs
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='travel_app/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='home'), name='logout'),
    
    # Dashboard URLs
    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard/cancel-booking/<int:booking_id>/', views.cancel_booking, name='cancel_booking'),
]

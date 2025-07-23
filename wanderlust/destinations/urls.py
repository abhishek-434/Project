from django.urls import path
from . import views

urlpatterns = [
    path('', views.DestinationListView.as_view(), name='destination_list'),
    path('<slug:slug>/', views.DestinationDetailView.as_view(), name='destination_detail'),
    path('packages/', views.PackageListView.as_view(), name='package_list'),
    path('packages/<slug:slug>/', views.PackageDetailView.as_view(), name='package_detail'),
]
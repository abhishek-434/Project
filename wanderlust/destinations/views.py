from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView
from .models import Destination, Package, Continent, Country

class DestinationListView(ListView):
    model = Destination
    template_name = 'destinations/destination_list.html'
    context_object_name = 'destinations'
    paginate_by = 9
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['continents'] = Continent.objects.all()
        return context
    
    def get_queryset(self):
        queryset = super().get_queryset()
        continent = self.request.GET.get('continent')
        country = self.request.GET.get('country')
        
        if continent:
            queryset = queryset.filter(country__continent__slug=continent)
        if country:
            queryset = queryset.filter(country__slug=country)
            
        return queryset

class DestinationDetailView(DetailView):
    model = Destination
    template_name = 'destinations/destination_detail.html'
    context_object_name = 'destination'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['related_destinations'] = Destination.objects.filter(
            country=self.object.country
        ).exclude(id=self.object.id)[:3]
        return context

class PackageListView(ListView):
    model = Package
    template_name = 'destinations/package_list.html'
    context_object_name = 'packages'
    paginate_by = 9
    
    def get_queryset(self):
        queryset = super().get_queryset()
        destination = self.request.GET.get('destination')
        
        if destination:
            queryset = queryset.filter(destination__slug=destination)
            
        return queryset

class PackageDetailView(DetailView):
    model = Package
    template_name = 'destinations/package_detail.html'
    context_object_name = 'package'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['related_packages'] = Package.objects.filter(
            destination=self.object.destination
        ).exclude(id=self.object.id)[:3]
        return context
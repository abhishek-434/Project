import os
import django
from django.core.files import File
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_travel.settings')
django.setup()

from travel_app.models import GalleryImage

def populate_gallery():
    # Define source images (reusing existing ones)
    images_data = [
        {
            'source': 'destinations/bali.jpg',
            'caption': 'Beautiful Bali Beaches',
            'tourist_name': 'Sarah & John'
        },
        {
            'source': 'destinations/paris.png',
            'caption': 'Eiffel Tower at Sunset',
            'tourist_name': 'The Smith Family'
        },
        {
            'source': 'destinations/rome.jpg',
            'caption': 'Exploring the Colosseum',
            'tourist_name': 'Mike Chen'
        },
        {
            'source': 'destinations/barcelona.jpg',
            'caption': 'Architecture in Barcelona',
            'tourist_name': 'Emma Davis'
        },
        {
            'source': 'destinations/manali.jpg',
            'caption': 'Mountain Trekking',
            'tourist_name': 'Adventure Seekers'
        },
        {
            'source': 'destinations/lisbon.jpg',
            'caption': 'Streets of Lisbon',
            'tourist_name': 'Solo Traveler'
        }
    ]

    print("Starting gallery population...")
    
    count = 0
    for item in images_data:
        source_path = os.path.join(settings.MEDIA_ROOT, item['source'])
        
        # Check if source exists
        if not os.path.exists(source_path):
            print(f"Skipping {item['source']} - file not found")
            continue
            
        # Check if already exists to avoid duplicates
        if GalleryImage.objects.filter(caption=item['caption']).exists():
            print(f"Skipping {item['caption']} - already exists")
            continue
            
        try:
            with open(source_path, 'rb') as f:
                gallery_img = GalleryImage(
                    caption=item['caption'],
                    tourist_name=item['tourist_name']
                )
                # Save creates a copy in the gallery folder
                gallery_img.image.save(os.path.basename(source_path), File(f), save=True)
                print(f"Added: {item['caption']}")
                count += 1
        except Exception as e:
            print(f"Error adding {item['caption']}: {e}")

    print(f"Successfully added {count} images to the gallery.")

if __name__ == '__main__':
    populate_gallery()

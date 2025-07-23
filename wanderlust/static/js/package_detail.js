// static/js/package_detail.js
document.addEventListener('DOMContentLoaded', function () {
    // Initialize animations
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Initialize LightGallery for photo gallery
    const packageGallery = document.getElementById('packageGallery');
    if (packageGallery) {
        window.lightGallery(packageGallery, {
            selector: '.gallery-item',
            speed: 500,
            download: false,
            counter: true
        });
    }

    // Booking price calculator
    const travelersSelect = document.querySelector('select[name="travelers"]');
    const basePrice = document.querySelector('.price-row:first-child span:last-child');
    const discountRow = document.querySelector('.price-row.discount');
    const totalPrice = document.querySelector('.total-price');
    const travelerCountElements = document.querySelectorAll('.traveler-count');

    if (travelersSelect && basePrice && totalPrice) {
        travelersSelect.addEventListener('change', updatePrice);

        function updatePrice() {
            const travelers = parseInt(travelersSelect.value);

            // Update traveler count display
            travelerCountElements.forEach(el => {
                el.textContent = travelers;
            });

            // Get base price per person
            let basePriceValue = parseFloat(basePrice.textContent.match(/\d+(\.\d+)?/)[0]);

            // Calculate total base price
            const totalBasePrice = basePriceValue * travelers;

            // Calculate discount if applicable
            let totalDiscount = 0;
            if (discountRow) {
                const discountValue = parseFloat(discountRow.querySelector('span:last-child').textContent.match(/\d+(\.\d+)?/)[0]);
                totalDiscount = discountValue * travelers;
            }

            // Calculate and display final price
            const finalPrice = totalBasePrice - totalDiscount;
            totalPrice.textContent = `$${finalPrice.toFixed(2)}`;
        }

        // Initialize price calculation
        updatePrice();
    }

    // Itinerary day toggle
    const itineraryDays = document.querySelectorAll('.itinerary-day');

    itineraryDays.forEach(day => {
        const dayHeader = day.querySelector('.day-header');
        const dayContent = day.querySelector('.day-content');

        dayHeader.addEventListener('click', function () {
            // Toggle expanded class
            day.classList.toggle('expanded');

            // Animate content height
            if (day.classList.contains('expanded')) {
                dayContent.style.maxHeight = dayContent.scrollHeight + 'px';
            } else {
                dayContent.style.maxHeight = '0';
            }
        });
    });

    // Review form star rating - similar to destination_detail.js
    const ratingInputs = document.querySelectorAll('.rating-select input');
    const ratingLabels = document.querySelectorAll('.rating-select label');

    ratingInputs.forEach(input => {
        input.addEventListener('change', function () {
            const rating = this.value;

            // Reset all stars
            ratingLabels.forEach(label => {
                label.innerHTML = '<i class="far fa-star"></i>';
            });

            // Fill stars up to selected rating
            for (let i = 0; i < rating; i++) {
                ratingLabels[4 - i].innerHTML = '<i class="fas fa-star"></i>';
            }
        });
    });

    // Hover effect for rating stars
    ratingLabels.forEach((label, index) => {
        label.addEventListener('mouseenter', function () {
            const rating = 5 - index;

            // Reset all stars
            ratingLabels.forEach(label => {
                label.innerHTML = '<i class="far fa-star"></i>';
            });

            // Fill stars up to hovered rating
            for (let i = 0; i < rating; i++) {
                ratingLabels[4 - i].innerHTML = '<i class="fas fa-star"></i>';
            }
        });

        label.addEventListener('mouseleave', function () {
            // Reset to selected rating
            const selectedRating = document.querySelector('.rating-select input:checked');

            if (selectedRating) {
                const rating = selectedRating.value;

                // Reset all stars
                ratingLabels.forEach(label => {
                    label.innerHTML = '<i class="far fa-star"></i>';
                });

                // Fill stars up to selected rating
                for (let i = 0; i < rating; i++) {
                    ratingLabels[4 - i].innerHTML = '<i class="fas fa-star"></i>';
                }
            } else {
                // If no rating is selected, reset all stars
                ratingLabels.forEach(label => {
                    label.innerHTML = '<i class="far fa-star"></i>';
                });
            }
        });
    });

    // Booking form date validation
    const travelDateInput = document.querySelector('input[name="travel_date"]');

    if (travelDateInput) {
        // Set min date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        travelDateInput.min = tomorrow.toISOString().split('T')[0];

        // Set max date to 1 year from now
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        travelDateInput.max = maxDate.toISOString().split('T')[0];
    }
});
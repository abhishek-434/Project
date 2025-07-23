// static/js/destination_detail.js
document.addEventListener('DOMContentLoaded', function () {
    // Initialize animations
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Initialize LightGallery for photo gallery
    const lightGallery = document.getElementById('lightgallery');
    if (lightGallery) {
        lightGallery.addEventListener('lgInit', function () {
            console.log('Gallery initialized');
        });

        window.lightGallery(lightGallery, {
            selector: '.gallery-item',
            speed: 500,
            download: false,
            counter: true
        });
    }

    // Review form star rating
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

    // Review form submission
    const reviewForm = document.querySelector('form[action*="add_destination_review"], form[action*="add_package_review"]');

    if (reviewForm) {
        reviewForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const rating = reviewForm.querySelector('input[name="rating"]:checked');
            const title = reviewForm.querySelector('input[name="title"]').value.trim();
            const comment = reviewForm.querySelector('textarea[name="comment"]').value.trim();

            if (!rating) {
                alert('Please select a rating.');
                return;
            }

            if (!title) {
                alert('Please enter a review title.');
                return;
            }

            if (!comment) {
                alert('Please enter your review.');
                return;
            }

            // In a real application, you would send this data to the server
            // For demo purposes, we'll just close the modal and show a success message
            const modal = bootstrap.Modal.getInstance(document.getElementById('reviewModal'));
            modal.hide();

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success mt-3';
            successMessage.textContent = 'Thank you for your review! It will be published after moderation.';

            document.querySelector('.write-review-btn').insertAdjacentElement('afterend', successMessage);

            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        });
    }

    // Weather data (simulated)
    // In a real application, this would be fetched from a weather API
    function updateWeather() {
        const weatherContainer = document.querySelector('.weather-container');

        if (weatherContainer) {
            const weatherData = {
                current: {
                    temperature: Math.floor(Math.random() * 15) + 20, // Random temperature between 20-35°C
                    condition: getRandomWeatherCondition()
                },
                forecast: [
                    {
                        day: 'Mon',
                        temperature: Math.floor(Math.random() * 15) + 20,
                        condition: getRandomWeatherCondition()
                    },
                    {
                        day: 'Tue',
                        temperature: Math.floor(Math.random() * 15) + 20,
                        condition: getRandomWeatherCondition()
                    },
                    {
                        day: 'Wed',
                        temperature: Math.floor(Math.random() * 15) + 20,
                        condition: getRandomWeatherCondition()
                    },
                    {
                        day: 'Thu',
                        temperature: Math.floor(Math.random() * 15) + 20,
                        condition: getRandomWeatherCondition()
                    }
                ]
            };

            // Update current weather
            const currentTemp = weatherContainer.querySelector('.temperature');
            const currentDesc = weatherContainer.querySelector('.weather-description');
            const currentIcon = weatherContainer.querySelector('.weather-icon i');

            currentTemp.textContent = `${weatherData.current.temperature}°C`;
            currentDesc.textContent = weatherData.current.condition.description;
            currentIcon.className = `fas fa-${weatherData.current.condition.icon}`;

            // Update forecast
            const forecastDays = weatherContainer.querySelectorAll('.forecast-day');

            forecastDays.forEach((day, index) => {
                const dayTemp = day.querySelector('.day-temp');
                const dayIcon = day.querySelector('.day-icon i');

                dayTemp.textContent = `${weatherData.forecast[index].temperature}°`;
                dayIcon.className = `fas fa-${weatherData.forecast[index].condition.icon}`;
            });
        }
    }

    function getRandomWeatherCondition() {
        const conditions = [
            { icon: 'sun', description: 'Sunny' },
            { icon: 'cloud-sun', description: 'Partly Cloudy' },
            { icon: 'cloud', description: 'Cloudy' },
            { icon: 'cloud-rain', description: 'Rainy' },
            { icon: 'bolt', description: 'Thunderstorm' }
        ];

        return conditions[Math.floor(Math.random() * conditions.length)];
    }

    // Update weather on page load
    updateWeather();
});
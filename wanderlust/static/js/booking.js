// static/js/bookings.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Booking card hover effects
    const bookingCards = document.querySelectorAll('.booking-card');
    
    bookingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Filter dropdown functionality
    const filterDropdown = document.getElementById('filterDropdown');
    
    if (filterDropdown) {
        // Get current filter from URL
        const currentFilter = new URLSearchParams(window.location.search).get('status') || 'all';
        
        // Update dropdown text to reflect current filter
        const filterText = currentFilter === 'all' ? 'All Bookings' :
                          currentFilter === 'upcoming' ? 'Upcoming Trips' :
                          currentFilter === 'past' ? 'Past Trips' :
                          currentFilter === 'cancelled' ? 'Cancelled' : 'Filter Bookings';
        
        filterDropdown.innerHTML = `<i class="fas fa-filter"></i> ${filterText}`;
    }
    
    // Package card hover effects
    const packageCards = document.querySelectorAll('.package-card');
    
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
            this.querySelector('.package-image img').style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
            this.querySelector('.package-image img').style.transform = 'scale(1)';
        });
    });
    
    // Cancel booking confirmation
    const cancelButtons = document.querySelectorAll('.booking-actions a.btn-danger');
    
    cancelButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const confirmed = confirm('Are you sure you want to cancel this booking? This action cannot be undone.');
            
            if (confirmed) {
                // In a real application, you would send a request to the server to cancel the booking
                // For demo purposes, we'll just show an alert
                alert('Your booking has been cancelled. You will receive a confirmation email shortly.');
                
                // Refresh the page or update the UI to reflect the cancellation
                window.location.reload();
            }
        });
    });
});
// static/js/booking_detail.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Itinerary day toggle
    const itineraryDays = document.querySelectorAll('.itinerary-day');
    
    itineraryDays.forEach(day => {
        const dayHeader = day.querySelector('.day-header');
        const dayContent = day.querySelector('.day-content');
        
        dayHeader.addEventListener('click', function() {
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
    
    // Cancel booking confirmation
    const cancelButton = document.querySelector('.modal-footer .btn-danger');
    
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            // Get reason for cancellation
            const reasonSelect = document.getElementById('cancellationReason');
            const detailsTextarea = document.getElementById('cancellationDetails');
            
            if (!reasonSelect.value) {
                alert('Please select a reason for cancellation.');
                return;
            }
            
            // In a real application, you would send this data to the server
            // For demo purposes, we'll just close the modal and show a success message
            const modal = bootstrap.Modal.getInstance(document.getElementById('cancelModal'));
            modal.hide();
            
            // Show success message
            const alertContainer = document.createElement('div');
            alertContainer.className = 'alert alert-success mt-4';
            alertContainer.innerHTML = `
                <h4 class="alert-heading">Booking Cancelled!</h4>
                <p>Your booking has been successfully cancelled. If you are eligible for a refund, it will be processed within 7-10 business days.</p>
                <p class="mb-0">A confirmation email has been sent to your registered email address.</p>
            `;
            
            document.querySelector('.booking-status-wrapper').insertAdjacentElement('afterend', alertContainer);
            
            // Update booking status
            const statusBadge = document.querySelector('.current-status');
            statusBadge.className = 'current-status cancelled';
            statusBadge.innerHTML = 'Current Status: <span>Cancelled</span> <i class="fas fa-times-circle"></i>';
            
            // Update booking actions
            const actionButtons = document.querySelector('.action-buttons');
            actionButtons.innerHTML = `
                <a href="#" class="btn btn-primary w-100 mb-3">View Cancellation Details</a>
                <a href="#" class="btn btn-outline-primary w-100">Contact Support</a>
            `;
            
            // Update status progress bar
            const statusProgress = document.querySelector('.status-progress');
            statusProgress.style.width = '0';
        });
    }
    
    // Download voucher
    const downloadVoucherBtn = document.querySelector('a.btn-primary[href="#"]:contains("Download Voucher")');
    
    if (downloadVoucherBtn) {
        downloadVoucherBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real application, this would trigger a download
            // For demo purposes, we'll just show an alert
            alert('Your booking voucher is being generated. The download will start automatically.');
        });
    }
    
    // Print itinerary
    const printItineraryBtn = document.querySelector('a.btn-outline-primary[href="#"]:contains("Print Itinerary")');
    
    if (printItineraryBtn) {
        printItineraryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real application, this would open a print-friendly page
            // For demo purposes, we'll just use window.print()
            window.print();
        });
    }
});
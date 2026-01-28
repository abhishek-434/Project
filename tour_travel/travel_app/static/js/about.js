document.addEventListener('DOMContentLoaded', function () {
    // Stats Counter Animation
    const stats = document.querySelectorAll('.stat-number');

    const animateStats = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-count');
            const duration = 2000; // Animation duration in ms
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.innerText = target;
                }
            };

            updateCount();
        });
    };

    // Intersection Observer for stats
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});
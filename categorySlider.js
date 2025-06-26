
// Automatic slideshow functionality for category items
document.addEventListener('DOMContentLoaded', function() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        const slides = item.querySelectorAll('.slide');
        let currentSlide = 0;
        let slideInterval;
        
        // Function to show next slide
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
        
        // Start slideshow on hover
        item.addEventListener('mouseenter', function() {
            slideInterval = setInterval(nextSlide, 800); // Change slide every 800ms
        });
        
        // Stop slideshow when mouse leaves
        item.addEventListener('mouseleave', function() {
            clearInterval(slideInterval);
            // Reset to first slide
            slides.forEach(slide => slide.classList.remove('active'));
            slides[0].classList.add('active');
            currentSlide = 0;
        });
    });
});
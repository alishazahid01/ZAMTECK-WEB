document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            console.log('Mobile menu button clicked'); // For debugging
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    function closeMobileMenu() {
        console.log('Closing mobile menu'); // For debugging
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Why Choose Us Carousel Functionality
    initWhyUsCarousel();

    // Initialize hero slider
    initHeroSlider();

    // Initialize project filters
    initProjectFilters();

    // Initialize testimonial slider
    initTestimonialSlider();

    // Initialize scroll animations
    initScrollAnimations();
});

// Why Choose Us Carousel Functionality
function initWhyUsCarousel() {
    const carousel = document.querySelector('.why-us-carousel');
    const grid = document.querySelector('.why-us-grid');
    const cards = document.querySelectorAll('.why-us-card');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    if (!carousel || !grid || !cards.length || !prevBtn || !nextBtn || !dotsContainer) return;
    
    // Calculate how many cards to show based on screen width
    let cardsToShow = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
    let currentIndex = 0;
    const totalSlides = Math.ceil(cards.length / cardsToShow);
    
    // Create dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    // Update dots
    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        
        // Calculate the card width including margins
        const cardWidth = cards[0].offsetWidth + 30; // 30px is the total margin (15px on each side)
        
        // Calculate the translation distance
        const translateX = currentIndex * cardsToShow * cardWidth;
        
        // Apply the transform with a smooth transition
        grid.style.transform = `translateX(-${translateX}px)`;
        
        // Update the active dot
        updateDots();
    }
    
    // Next slide
    function nextSlide() {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        goToSlide(currentIndex);
    }
    
    // Previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = totalSlides - 1;
        }
        goToSlide(currentIndex);
    }
    
    // Add event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const newCardsToShow = window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1;
        
        if (newCardsToShow !== cardsToShow) {
            cardsToShow = newCardsToShow;
            const newTotalSlides = Math.ceil(cards.length / cardsToShow);
            
            // Recreate dots if needed
            if (newTotalSlides !== totalSlides) {
                dotsContainer.innerHTML = '';
                for (let i = 0; i < newTotalSlides; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('carousel-dot');
                    if (i === currentIndex) dot.classList.add('active');
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                }
            }
            
            // Adjust current index if needed
            if (currentIndex >= newTotalSlides) {
                currentIndex = newTotalSlides - 1;
            }
            
            goToSlide(currentIndex);
        }
    });
    
    // Auto-rotate carousel
    setInterval(nextSlide, 5000);
}

// Hero Slider Animation
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.hero-slider-dots');
    
    if (!slides.length || !dotsContainer) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('hero-slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    // Go to specific slide
    function goToSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        const dots = document.querySelectorAll('.hero-slider-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }
    
    // Auto-rotate slides
    setInterval(nextSlide, 5000);
}

// Optimized Project Filtering Function
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterButtons.length || !projectCards.length) return;
    
    // Store initial state
    const projectsData = Array.from(projectCards).map(card => ({
        element: card,
        category: card.getAttribute('data-category')
    }));
    
    // Debounce function to limit how often the filter runs
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Optimized filter function
    const filterProjects = debounce(function(filterValue) {
        // Update active button state
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === filterValue);
        });
        
        // Filter projects with minimal DOM operations
        projectsData.forEach(project => {
            const shouldShow = filterValue === 'all' || project.category === filterValue;
            
            if (shouldShow) {
                project.element.style.display = 'block';
                // Use requestAnimationFrame for smoother animations
                requestAnimationFrame(() => {
                    project.element.style.opacity = '1';
                    project.element.style.transform = 'translateY(0)';
                });
            } else {
                project.element.style.opacity = '0';
                project.element.style.transform = 'translateY(20px)';
                
                // Only hide after transition completes
                setTimeout(() => {
                    if (project.element.style.opacity === '0') {
                        project.element.style.display = 'none';
                    }
                }, 300);
            }
        });
    }, 50);
    
    // Add event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            filterProjects(filterValue);
        });
    });
    
    // Initialize with 'all' filter
    filterProjects('all');
}

// Add this function to your script.js file
function initTestimonialSlider() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (!testimonialSlides.length || !prevBtn || !nextBtn || !dotsContainer) return;
    
    let currentIndex = 0;
    const totalSlides = testimonialSlides.length;
    
    // Create dots
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    // Update dots
    function updateDots() {
        const dots = document.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(index) {
        // Add prev class to current slide for exit animation
        testimonialSlides[currentIndex].classList.add('prev');
        
        // Remove active and prev classes from all slides
        setTimeout(() => {
            testimonialSlides.forEach(slide => {
                slide.classList.remove('active', 'prev');
            });
            
            // Add active class to new slide
            testimonialSlides[index].classList.add('active');
            
            // Update current index
            currentIndex = index;
            
            // Update dots
            updateDots();
        }, 50);
    }
    
    // Next slide
    function nextSlide() {
        const newIndex = (currentIndex + 1) % totalSlides;
        goToSlide(newIndex);
    }
    
    // Previous slide
    function prevSlide() {
        const newIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        goToSlide(newIndex);
    }
    
    // Add event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto-rotate testimonials - CHANGED FROM 7000 to 2000 (2 seconds)
    let autoRotateInterval = setInterval(nextSlide, 2000);
    
    // Pause auto-rotation when hovering over testimonials
    const testimonialContainer = document.querySelector('.testimonials-container');
    testimonialContainer.addEventListener('mouseenter', () => {
        clearInterval(autoRotateInterval);
    });
    
    testimonialContainer.addEventListener('mouseleave', () => {
        clearInterval(autoRotateInterval);
        // CHANGED FROM 7000 to 2000 (2 seconds)
        autoRotateInterval = setInterval(nextSlide, 2000);
    });
}

// Improved Scroll Animation Function
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Check if there are elements to animate
    if (!animatedElements.length) return;
    
    // Function to check if an element is in viewport with better threshold
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Element is considered in viewport when it's 10% visible (more sensitive trigger)
        return (
            rect.top <= windowHeight * 0.9 &&
            rect.bottom >= windowHeight * 0.1
        );
    }
    
    // Throttle function to improve scroll performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Function to handle scroll event with improved performance
    const handleScroll = throttle(function() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('animated')) {
                // Add the animation class based on data attribute or default to fade-in
                const animationType = element.dataset.animation || 'fade-in';
                
                // Use requestAnimationFrame for smoother animations
                requestAnimationFrame(() => {
                    element.classList.add('animated', animationType);
                });
            }
        });
    }, 100);
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Also trigger on resize to catch any layout changes
    window.addEventListener('resize', handleScroll);
    
    // Trigger once on page load with a slight delay to ensure DOM is ready
    setTimeout(handleScroll, 300);
} 
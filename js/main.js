
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('mainNav');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Scroll to Top
        const scrollTopBtn = document.getElementById('scrollTop');

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll to section function
        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                const offsetTop = section.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }

        // Add hover effect to destination cards
        document.querySelectorAll('.destination-card').forEach(card => {
            card.addEventListener('click', function() {
                const destination = this.querySelector('h3').textContent;
                console.log(`Navigating to ${destination} details...`);
            });
        });

        // Blog card interactions
        document.querySelectorAll('.blog-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Opening blog post...');
            });
        });

        // Reusable function for infinite seamless carousel logic
        function setupSmoothCarousel(carouselId, intervalTime = 5000) {
            const carousel = document.getElementById(carouselId);
            const inner = carousel?.querySelector('.carousel-inner');
            const prevBtn = carousel?.querySelector('.carousel-control-prev');
            const nextBtn = carousel?.querySelector('.carousel-control-next');
            const indicators = carousel?.querySelectorAll('.carousel-indicators button');

            if (inner) {
                const originalItems = Array.from(inner.children);
                const originalCount = originalItems.length;
                if (originalCount === 0) return;
                
                // Remove Bootstrap active classes to prevent CSS conflicts
                originalItems.forEach(item => item.classList.remove('active'));

                // Clone items and append them to create a seamless loop buffer
                originalItems.forEach(item => {
                    inner.appendChild(item.cloneNode(true));
                });

                let isScrolling = false;
                let autoScrollTimer;

                const updateIndicators = () => {
                    const firstItem = inner.querySelector('.carousel-item');
                    if (!firstItem || !indicators || indicators.length === 0) return;
                    
                    const itemWidth = firstItem.offsetWidth;
                    // Use a small epsilon to handle sub-pixel rounding
                    const index = Math.round((inner.scrollLeft + 1) / itemWidth) % originalCount;
                    
                    indicators.forEach((dot, i) => {
                        const isActive = i === index;
                        dot.classList.toggle('active', isActive);
                        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
                    });
                };

                inner.addEventListener('scroll', updateIndicators);

                const scrollOne = (direction) => {
                    if (isScrolling) return;
                    
                    const firstItem = inner.querySelector('.carousel-item');
                    if (!firstItem) return;
                    
                    const itemWidth = firstItem.offsetWidth;
                    const originalWidth = itemWidth * originalCount;
                    isScrolling = true;

                    if (direction === 'next') {
                        inner.scrollBy({ left: itemWidth, behavior: 'smooth' });
                        
                        // Silently jump back to the start once the transition into clones is complete
                        setTimeout(() => {
                            if (inner.scrollLeft >= originalWidth - 2) {
                                inner.scrollTo({ left: 0, behavior: 'auto' });
                            }
                            isScrolling = false;
                        }, 500); 
                    } else {
                        if (inner.scrollLeft <= 2) {
                            inner.scrollTo({ left: originalWidth, behavior: 'auto' });
                        }
                        inner.scrollBy({ left: -itemWidth, behavior: 'smooth' });
                        setTimeout(() => { isScrolling = false; }, 500);
                    }
                };

                const startAutoScroll = () => {
                    if (autoScrollTimer) clearInterval(autoScrollTimer);
                    autoScrollTimer = setInterval(() => scrollOne('next'), intervalTime);
                };
                const stopAutoScroll = () => clearInterval(autoScrollTimer);

                startAutoScroll();

                carousel.addEventListener('mouseenter', stopAutoScroll);
                carousel.addEventListener('mouseleave', startAutoScroll);

                indicators?.forEach((dot, i) => {
                    dot.addEventListener('click', (e) => {
                        e.preventDefault();
                        const firstItem = inner.querySelector('.carousel-item');
                        if (!firstItem) return;
                        const itemWidth = firstItem.offsetWidth;
                        inner.scrollTo({ left: i * itemWidth, behavior: 'smooth' });
                        startAutoScroll();
                    });
                });

                carousel.addEventListener('wheel', (e) => {
                    const firstItem = inner.querySelector('.carousel-item');
                    if (!firstItem) return;

                    const itemWidth = firstItem.offsetWidth;
                    const itemsVisible = Math.round(inner.offsetWidth / itemWidth);
                    // Calculate the current index based on scroll position
                    const index = Math.round(inner.scrollLeft / itemWidth) % originalCount;

                    // Release the scroll trap if we are at the boundaries
                    const isAtEnd = index >= (originalCount - itemsVisible);
                    const isAtStart = index === 0;

                    if ((e.deltaY > 0 && isAtEnd) || (e.deltaY < 0 && isAtStart)) {
                        return; // Do nothing, let the browser scroll the page naturally
                    }

                    e.preventDefault();
                    if (isScrolling) return;
                    scrollOne(e.deltaY > 0 ? 'next' : 'prev');
                    startAutoScroll();
                }, { passive: false });

                prevBtn?.addEventListener('click', () => {
                    scrollOne('prev');
                    startAutoScroll();
                });
                nextBtn?.addEventListener('click', () => {
                    scrollOne('next');
                    startAutoScroll();
                });
            }
        }

        // Initialize for both Services and Reviews
        setupSmoothCarousel('servicesCarousel');
        setupSmoothCarousel('reviewsCarousel');

        // Newsletter Popup logic
        let newsletterTriggered = false;
        const showNewsletter = () => {
            if (!newsletterTriggered) {
                newsletterTriggered = true;
                setTimeout(() => {
                    const modalEl = document.getElementById('newsletterModal');
                    const modal = new bootstrap.Modal(modalEl);
                    modal.show();
                }, 5000); // 5 second delay
            }
        };

        // Trigger when user starts scrolling
        window.addEventListener('scroll', showNewsletter, { once: true });

        // Handle Form Submission
        document.getElementById('newsletterForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing to NUUZ Horse Shoe Supply!');
            bootstrap.Modal.getInstance(document.getElementById('newsletterModal')).hide();
        });

        /* Particle effect removed as requested */

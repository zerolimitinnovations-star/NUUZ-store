document.addEventListener('DOMContentLoaded', function() {

        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Navbar scroll effect
        const navbar = document.getElementById('mainNav');
        window.addEventListener('scroll', function() {
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

        // Add hover effect to latest product cards
        document.querySelectorAll('.latest-product-card').forEach(card => {
            card.addEventListener('click', function() {
                const product = this.querySelector('h3').textContent;
                console.log(`Navigating to ${product} details...`);
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
                
                let itemWidth = 0;
                const updateDimensions = () => {
                    const firstItem = inner.querySelector('.carousel-item');
                    if (firstItem) itemWidth = firstItem.offsetWidth;
                };

                updateDimensions();
                window.addEventListener('resize', updateDimensions);

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

        /* Particle effect removed as requested */

        // Shop functionality
        // View switching (Grid/List)
        const gridViewBtn = document.getElementById('gridView');
        const listViewBtn = document.getElementById('listView');
        const productsGrid = document.querySelector('.products-grid');

        if (gridViewBtn && listViewBtn && productsGrid) {
            gridViewBtn.addEventListener('click', function() {
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
                productsGrid.classList.remove('list-view');
                productsGrid.classList.add('row');
            });

            listViewBtn.addEventListener('click', function() {
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
                productsGrid.classList.add('list-view');
                productsGrid.classList.remove('row');
            });
        }

        // Category filtering
        document.querySelectorAll('.category-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                // Here you would filter products based on category
                console.log('Filtering by category:', this.textContent.trim());
            });
        });

        // Size filtering
        document.querySelectorAll('.size-options .btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                // Here you would filter products based on selected sizes
                console.log('Size filter toggled:', this.textContent);
            });
        });

        // Material filtering
        document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                // Here you would filter products based on selected materials
                console.log('Material filter:', this.id, this.checked);
            });
        });

        // Price range slider
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.addEventListener('input', function() {
                // Here you would filter products based on price
                console.log('Price range:', this.value);
            });
        }

        // Add to cart functionality
        document.querySelectorAll('.add-to-cart, .cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('.overlay-title, .card-title').textContent;
                
                console.log('Added to cart:', productName.trim());
                // Here you would add the product to cart
                alert(`${productName} added to cart!`);
            });
        });

        // Quick view functionality
        document.querySelectorAll('.quick-view, .search-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('.overlay-title, .card-title').textContent;

                console.log('Quick view:', productName.trim());
                // Here you would show a quick view modal
                alert(`Quick view for ${productName}`);
            });
        });

        // Wishlist functionality
        document.querySelectorAll('.love-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('.overlay-title, .card-title').textContent;

                console.log('Added to wishlist:', productName.trim());
                // Here you would add the product to wishlist
                this.classList.toggle('active');
                if (this.classList.contains('active')) {
                    this.querySelector('i').style.color = '#e74c3c';
                    alert(`${productName} added to wishlist!`);
                } else {
                    this.querySelector('i').style.color = '';
                    alert(`${productName} removed from wishlist!`);
                }
            });
        });

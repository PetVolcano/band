// JavaScript Document

window.addEventListener('load', () => {
    initializeFlameHoverEffects();
    initializeCarousel();
    initializeIframeCarousel();
    initializeScript();

    // Function to load content into dynamic-content div
    function loadContent(url, targetId, scroll = true) {
        const target = document.getElementById(targetId); // Target div where content will be inserted
        target.innerHTML = ''; // Clear existing content

        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then((html) => {
                target.innerHTML = html; // Replace the content in the target div

                // Smooth scroll to bring the content into view
                if (scroll) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // Reinitialize carousel after dynamic content is loaded
                initializeCarousel();
                initializeIframeCarousel(); // Iframe video carousel re-initialization
            })
            .catch((error) => {
                console.error(`Error fetching ${url}:`, error);
                target.innerHTML = '<p>Failed to load content. Please try again later.</p>';
            });
    }

// Add event listener for the button with id="scroll-to-top"
const scrollToTopBtn = document.getElementById('scroll-to-top');
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector('#dynamic-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// Add event listener for the button with id="backtotop"
const backToTopBtn = document.getElementById('backtotop');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
        e.preventDefault();
        // Scroll to the <p id="home"> element instead of #dynamic-content
        const homeElement = document.querySelector('#home');
        if (homeElement) {
            homeElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Adjust block to "center" for better alignment
        }
    });
}

// Add event listener for the navbar "Home" link
document.querySelectorAll('.navbar a[href="#home"]').forEach((homeLink) => {
    homeLink.addEventListener('click', function (e) {
        e.preventDefault();
        loadContent('home.html', 'dynamic-content', false);
        document.querySelector('#dynamic-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

	
    // Smooth scroll for the static "scroll-to-hiding" button
    document.getElementById('scroll-to-hiding').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default behavior

        // Smooth scroll to #zombride
        const target = document.querySelector('#zombride');
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 1000); // 1-second delay
        }
    });

    // Add event delegation for "scroll-to-hiding2" in dynamically loaded content
    document.getElementById('dynamic-content').addEventListener('click', function (e) {
        const clickedElement = e.target;

        // Check if the clicked element is the button or its child (e.g., the img inside the button)
        if (clickedElement.id === 'scroll-to-hiding2' || clickedElement.closest('#scroll-to-hiding2')) {
            e.preventDefault(); // Prevent default behavior

            // Smooth scroll to #zombride
            const target = document.querySelector('#zombride');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });

    // Generalized navbar link handling for dynamically loaded content
    document.querySelectorAll('.navbar a').forEach((navLink) => {
        const targetId = navLink.getAttribute('href').substring(1); // Extract target ID
        if (targetId && targetId !== 'home') {
            navLink.addEventListener('click', function (e) {
                e.preventDefault(); // Prevent default behavior
                loadContent(`${targetId}.html`, 'dynamic-content'); // Load the corresponding content
            });
        }
    });

    // Flame layer hover effect
    function initializeFlameHoverEffects() {
        const buttons = document.querySelectorAll('.button button');
        const layer3Image = document.getElementById('layer3');

        if (layer3Image) {
            buttons.forEach((button) => {
                button.removeEventListener('mouseenter', handleMouseEnter);
                button.removeEventListener('mouseleave', handleMouseLeave);

                function handleMouseEnter() {
                    layer3Image.src = 'flamelayer.png';
                }

                function handleMouseLeave() {
                    layer3Image.src = 'image3.gif';
                }

                button.addEventListener('mouseenter', handleMouseEnter);
                button.addEventListener('mouseleave', handleMouseLeave);
            });
        }
    }

    // Initialize the carousel
    function initializeCarousel() {
        const carouselSlide = document.querySelector('.carousel-slide');
        const carouselImages = document.querySelectorAll('.carousel-slide img');

        if (!carouselSlide || !carouselImages.length) return; // Check if elements exist

        const prevBtn = document.querySelector('#prevBtn');
        const nextBtn = document.querySelector('#nextBtn');

        let counter = 1;
        const size = carouselImages[0].clientWidth;

        carouselSlide.style.transform = 'translateX(' + -size * counter + 'px)';

        nextBtn?.addEventListener('click', () => {
            carouselSlide.style.transition = 'transform 0.4s ease-in-out';
            counter++;
            if (counter >= carouselImages.length - 1) counter = 0;
            carouselSlide.style.transform = 'translateX(' + -size * counter + 'px)';
        });

        prevBtn?.addEventListener('click', () => {
            carouselSlide.style.transition = 'transform 0.4s ease-in-out';
            counter--;
            if (counter < 0) counter = carouselImages.length - 2;
            carouselSlide.style.transform = 'translateX(' + -size * counter + 'px)';
        });
    }

  // Initialize the iframe carousel
function initializeIframeCarousel() {
    const carouselSlide = document.querySelector('.carousel-slide-tv');
    const carouselItems = document.querySelectorAll('.carousel-slide-tv iframe');

    const prevBtn = document.querySelector('#prevBtn2');
    const nextBtn = document.querySelector('#nextBtn2');
    const stopBtn = document.querySelector('#stopBtn2'); // Stop button

    if (carouselSlide && carouselItems.length > 0 && prevBtn && nextBtn && stopBtn) {
        let counter = 0; // Start at the first visible item
        const size = carouselItems[0].clientWidth;
        let autoplayOn = true; // Flag to track autoplay status

        // Initialize position
        carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';

        // Helper function to update autoplay status
        const updateAutoplay = () => {
            carouselItems.forEach((iframe, index) => {
                if (index === counter) {
                    // Do not modify the src of the active video
                    iframe.setAttribute('allow', 'autoplay; fullscreen');
                } else {
                    // Reset src for non-active videos to stop them
                    const baseSrc = iframe.src.split('&autoplay=1')[0];
                    iframe.src = baseSrc;
                }
            });
        };

        // Set autoplay for the initial video
        updateAutoplay();

        // Next button
        nextBtn.addEventListener('click', () => {
            if (counter >= carouselItems.length - 1) return; // Prevent going out of bounds
            carouselSlide.style.transition = 'transform 0.4s ease-in-out';
            counter++;
            if (counter >= carouselItems.length) counter = 0; // Restart from the first video if at the end
            carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
            updateAutoplay();
        });

        // Previous button
        prevBtn.addEventListener('click', () => {
            if (counter <= 0) return; // Prevent going out of bounds
            carouselSlide.style.transition = 'transform 0.4s ease-in-out';
            counter--;
            if (counter < 0) counter = carouselItems.length - 1; // Go to the last video if at the start
            carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
            updateAutoplay();
        });

        // Helper function to start autoplay for the currently visible iframe
        const startAutoplay = () => {
            carouselItems.forEach((iframe, index) => {
                const src = iframe.src.replace('&autoplay=1', ''); // Remove autoplay if present
                if (index === counter) {
                    iframe.src = src + '&autoplay=1'; // Add autoplay for the visible video
                }
            });
        };

        // Stop button functionality
        stopBtn.addEventListener('click', () => {
            carouselItems.forEach((iframe) => {
                const src = iframe.src.replace('&autoplay=1', ''); // Remove autoplay
                iframe.src = src; // Stop autoplay for all videos
            });
        });

        // Start button functionality
        document.querySelector('#startBtn2').addEventListener('click', () => {
            carouselItems.forEach((iframe, index) => {
                if (index === counter) {
                    const src = iframe.src.split('&autoplay=1')[0]; // Remove existing autoplay if present
                    iframe.src = src + '&autoplay=1'; // Add autoplay for the visible video
                    iframe.style.pointerEvents = 'auto'; // Enable iframe interaction
                } else {
                    iframe.style.pointerEvents = 'none'; // Disable interaction for non-visible videos
                }
            });
        });

        // Handle transition events
        carouselSlide.addEventListener('transitionend', () => {
            // No clones, so no need to handle clones
        });
    } else {
        console.error('Iframe carousel elements not found in DOM.');
    }
}


    // Load the home.html content initially when the page loads
    loadContent('home.html', 'dynamic-content', false);
    
    // Re-initialize hover effect for the newly loaded content
    initializeScript();
    
    // Initialize the carousel
    initializeCarousel();
});

// JavaScript for handling click effects
function initializeScript() {
    const images = document.querySelectorAll('.logo');

    images.forEach((image) => {
        let isScaled = false; // Track whether the image is scaled or not

        // Click effect: Scale the image on first click and revert on second click
        image.addEventListener('click', () => {
            if (isScaled) {
                image.style.transform = 'scale(1)'; 
            } else {
                image.style.transform = 'scale(1.1)';
            }
            isScaled = !isScaled;
        });
    });
}
// Modern JavaScript Application Module
const sageApp = (() => {
    'use strict';

    // Configuration
    const config = {
        apiEndpoint: '/api',
        lazyLoadThreshold: 0.1,
        animationDuration: 300,
        debounceDelay: 250
    };

    // Utility functions
    const utils = {
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle: (func, limit) => {
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
        },

        isElementInViewport: (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        scrollToSection: (sectionId) => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        },

        formatDate: (dateString) => {
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return new Date(dateString).toLocaleDateString('en-US', options);
        }
    };

    // Lazy loading implementation
    const lazyLoader = {
        observer: null,
        
        init: () => {
            if ('IntersectionObserver' in window) {
                lazyLoader.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const element = entry.target;
                            lazyLoader.loadElement(element);
                            lazyLoader.observer.unobserve(element);
                        }
                    });
                }, {
                    rootMargin: '50px',
                    threshold: config.lazyLoadThreshold
                });
            }
        },

        loadElement: (element) => {
            if (element.dataset.src) {
                element.src = element.dataset.src;
                element.classList.add('loaded');
            }
            if (element.dataset.srcset) {
                element.srcset = element.dataset.srcset;
            }
            if (element.classList.contains('lazy-section')) {
                lazyLoader.loadSection(element);
            }
        },

        loadSection: (section) => {
            section.classList.add('loaded');
            // Trigger any section-specific loading
            const event = new CustomEvent('sectionLoaded', { detail: section });
            document.dispatchEvent(event);
        },

        observe: (elements) => {
            if (lazyLoader.observer) {
                elements.forEach(element => {
                    lazyLoader.observer.observe(element);
                });
            } else {
                // Fallback for browsers without IntersectionObserver
                elements.forEach(element => {
                    lazyLoader.loadElement(element);
                });
            }
        }
    };

    // Form handling
    const formHandler = {
        init: () => {
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', formHandler.handleContactSubmit);
            }
        },

        handleContactSubmit: async (event) => {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            
            // Basic validation
            if (!formHandler.validateForm(form)) {
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('.submit-button');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Simulate API call
                await formHandler.sendContactEmail(formData);
                formHandler.showSuccess(form);
                form.reset();
            } catch (error) {
                formHandler.showError(form, error.message);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        },

        validateForm: (form) => {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                const errorMessage = input.parentNode.querySelector('.error-message');
                
                if (!input.value.trim()) {
                    errorMessage.textContent = `${input.labels[0].textContent} is required`;
                    input.classList.add('error');
                    isValid = false;
                } else if (input.type === 'email' && !formHandler.isValidEmail(input.value)) {
                    errorMessage.textContent = 'Please enter a valid email address';
                    input.classList.add('error');
                    isValid = false;
                } else {
                    errorMessage.textContent = '';
                    input.classList.remove('error');
                }
            });

            return isValid;
        },

        isValidEmail: (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        sendContactEmail: async (formData) => {
            // In a real application, this would send to your backend
            return new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
        },

        showSuccess: (form) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'form-success';
            messageDiv.textContent = 'Thank you! Your message has been sent successfully.';
            messageDiv.setAttribute('role', 'alert');
            form.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        },

        showError: (form, message) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'form-error';
            messageDiv.textContent = message || 'Sorry, there was an error sending your message. Please try again.';
            messageDiv.setAttribute('role', 'alert');
            form.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    };

    // Navigation handling
    const navigation = {
        init: () => {
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            if (mobileToggle) {
                mobileToggle.addEventListener('click', navigation.toggleMobileMenu);
            }

            // Close mobile menu when clicking outside
            document.addEventListener('click', (event) => {
                if (!event.target.closest('.nav-container')) {
                    navigation.closeMobileMenu();
                }
            });

            // Handle navigation links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', navigation.handleNavClick);
            });
        },

        toggleMobileMenu: () => {
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        },

        closeMobileMenu: () => {
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const navMenu = document.querySelector('.nav-menu');
            
            mobileToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        },

        handleNavClick: (event) => {
            const href = event.target.getAttribute('href');
            
            if (href.startsWith('#')) {
                event.preventDefault();
                const sectionId = href.substring(1);
                utils.scrollToSection(sectionId);
                navigation.closeMobileMenu();
                
                // Update active state
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                });
                event.target.classList.add('active');
                event.target.setAttribute('aria-current', 'page');
            }
        }
    };

    // Performance monitoring
    const performanceMonitor = {
        init: () => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        console.log('Performance entry:', entry);
                    }
                });
                observer.observe({ entryTypes: ['navigation', 'resource'] });
            }
        },

        measurePageLoad: () => {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);
                }, 0);
            });
        }
    };

    // Initialize application
    const init = () => {
        // Initialize all modules
        lazyLoader.init();
        formHandler.init();
        navigation.init();
        performanceMonitor.init();
        performanceMonitor.measurePageLoad();

        // Observe lazy elements
        const lazyElements = document.querySelectorAll('[data-src], .lazy-section');
        lazyLoader.observe(lazyElements);

        // Add scroll-based animations
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        lazyLoader.observe(animatedElements);

        console.log('SAGE App initialized successfully');
    };

    // Public API
    return {
        init,
        utils,
        config
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sageApp.init);
} else {
    sageApp.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = sageApp;
}

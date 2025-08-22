/**
 * SAGE - Professional JavaScript Module
 * Sustainability Action for Green Education
 * Handles slider functionality and navigation
 */

class SAGEApp {
    constructor() {
        this.config = {
            autoSlideInterval: 5000,
            transitionDuration: 500,
            breakpoints: {
                mobile: 768,
                tablet: 1024
            }
        };
        
        this.state = {
            currentSlide: 0,
            isAutoSliding: false,
            isPaused: false
        };
        
        this.elements = {
            slides: null,
            dots: null,
            sliderContainer: null,
            navMenu: null,
            hamburger: null
        };
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.initializeSlider();
        this.setupNavigation();
        this.setupAccessibility();
    }

    cacheElements() {
        this.elements.slides = document.querySelectorAll('.slide');
        this.elements.dots = document.querySelectorAll('.dot');
        this.elements.sliderContainer = document.querySelector('.slider-container');
        this.elements.navMenu = document.querySelector('.nav-menu');
        this.elements.hamburger = document.querySelector('.hamburger');
    }

    bindEvents() {
        // Use event delegation for better performance
        document.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // Optimize resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(this.handleResize.bind(this), 250);
        });
    }

    initializeSlider() {
        if (this.elements.slides.length === 0) return;
        
        this.showSlide(0);
        this.startAutoSlide();
        this.setupTouchEvents();
    }

    showSlide(index) {
        const { slides, dots } = this.elements;
        
        // Ensure index is within bounds
        this.state.currentSlide = (index + slides.length) % slides.length;
        
        // Update slide visibility
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === this.state.currentSlide);
            slide.setAttribute('aria-hidden', i !== this.state.currentSlide);
        });
        
        // Update dot indicators
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.state.currentSlide);
            dot.setAttribute('aria-current', i === this.state.currentSlide ? 'true' : 'false');
        });
        
        // Announce slide change for screen readers
        this.announceSlideChange();
    }

    changeSlide(direction) {
        this.showSlide(this.state.currentSlide + direction);
        this.resetAutoSlide();
    }

    goToSlide(index) {
        this.showSlide(index - 1);
        this.resetAutoSlide();
    }

    startAutoSlide() {
        if (this.state.isAutoSliding || this.state.isPaused) return;
        
        this.state.isAutoSliding = true;
        this.autoSlideInterval = setInterval(() => {
            if (!this.state.isPaused) {
                this.showSlide(this.state.currentSlide + 1);
            }
        }, this.config.autoSlideInterval);
    }

    stopAutoSlide() {
        this.state.isAutoSliding = false;
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    setupTouchEvents() {
        if (!this.elements.sliderContainer) return;
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.elements.sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.elements.sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.changeSlide(1);
            } else {
                this.changeSlide(-1);
            }
        }
    }

    setupNavigation() {
        if (!this.elements.hamburger || !this.elements.navMenu) return;
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && this.elements.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    handleClick(e) {
        // Handle slider navigation
        if (e.target.matches('.slider-btn.prev') || e.target.closest('.slider-btn.prev')) {
            e.preventDefault();
            this.changeSlide(-1);
        } else if (e.target.matches('.slider-btn.next') || e.target.closest('.slider-btn.next')) {
            e.preventDefault();
            this.changeSlide(1);
        } else if (e.target.matches('.dot')) {
            e.preventDefault();
            const slideIndex = Array.from(this.elements.dots).indexOf(e.target) + 1;
            this.goToSlide(slideIndex);
        }
        
        // Handle mobile menu
        if (e.target.matches('.hamburger') || e.target.closest('.hamburger')) {
            e.preventDefault();
            this.toggleMobileMenu();
        } else if (e.target.matches('.nav-link')) {
            this.closeMobileMenu();
        }
    }

    handleKeydown(e) {
        if (e.target.closest('.slider-container')) {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.changeSlide(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.changeSlide(1);
                    break;
                case ' ':
                    e.preventDefault();
                    this.toggleAutoSlide();
                    break;
            }
        }
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > this.config.breakpoints.mobile) {
            this.closeMobileMenu();
        }
    }

    toggleMobileMenu() {
        this.elements.hamburger.classList.toggle('active');
        this.elements.navMenu.classList.toggle('active');
        
        // Update ARIA attributes
        const isOpen = this.elements.navMenu.classList.contains('active');
        this.elements.hamburger.setAttribute('aria-expanded', isOpen);
        this.elements.navMenu.setAttribute('aria-hidden', !isOpen);
    }

    closeMobileMenu() {
        this.elements.hamburger.classList.remove('active');
        this.elements.navMenu.classList.remove('active');
        this.elements.hamburger.setAttribute('aria-expanded', 'false');
        this.elements.navMenu.setAttribute('aria-hidden', 'true');
    }

    toggleAutoSlide() {
        this.state.isPaused = !this.state.isPaused;
        if (this.state.isPaused) {
            this.stopAutoSlide();
        } else {
            this.startAutoSlide();
        }
    }

    setupAccessibility() {
        // Add keyboard navigation
        this.elements.dots.forEach((dot, index) => {
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        });
        
        // Add pause/play button for screen readers
        if (this.elements.sliderContainer) {
            const pauseButton = document.createElement('button');
            pauseButton.className = 'sr-only';
            pauseButton.setAttribute('aria-label', 'Pause automatic slide rotation');
            pauseButton.addEventListener('click', this.toggleAutoSlide.bind(this));
            this.elements.sliderContainer.appendChild(pauseButton);
        }
    }

    announceSlideChange() {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Slide ${this.state.currentSlide + 1} of ${this.elements.slides.length}`;
        
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    // Public API methods
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    destroy() {
        this.stopAutoSlide();
        // Remove all event listeners
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeydown);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sageApp = new SAGEApp();
});

// Form handling with validation
class ContactForm {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupValidation();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearError.bind(this));
        });
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const isValid = this.validateFieldValue(field, value);
        
        this.toggleFieldError(field, !isValid);
        return isValid;
    }

    validateFieldValue(field, value) {
        const type = field.type;
        const required = field.required;
        
        if (required && !value) return false;
        
        switch(type) {
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 'tel':
                return /^[\d\s\-\+\(\)]+$/.test(value);
            default:
                return true;
        }
    }

    toggleFieldError(field, hasError) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (hasError) {
            if (!errorElement) {
                const error = document.createElement('span');
                error.className = 'error-message';
                error.style.color = '#e74c3c';
                error.style.fontSize = '0.9rem';
                error.textContent = this.getErrorMessage(field);
                formGroup.appendChild(error);
            }
            field.setAttribute('aria-invalid', 'true');
        } else {
            errorElement?.remove();
            field.setAttribute('aria-invalid', 'false');
        }
    }

    getErrorMessage(field) {
        const label = field.previousElementSibling?.textContent || field.placeholder;
        
        if (field.required && !field.value.trim()) {
            return `${label} is required`;
        }
        
        switch(field.type) {
            case 'email':
                return 'Please enter a valid email address';
            case 'tel':
                return 'Please enter a valid phone number';
            default:
                return 'Please enter a valid value';
        }
    }

    clearError(e) {
        const field = e.target;
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
            field.setAttribute('aria-invalid', 'false');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const isValid = this.validateForm();
        if (!isValid) return;
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            await this.submitForm(data);
            this.showSuccess();
            this.form.reset();
        } catch (error) {
            this.showError(error.message);
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateFieldValue(input, input.value.trim())) {
                this.toggleFieldError(input, true);
                isValid = false;
            }
        });
        
        return isValid;
    }

    async submitForm(data) {
        // Send email using EmailJS
        try {
            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                throw new Error('Email service not available. Please try again later.');
            }

            // Prepare email parameters
            const templateParams = {
                from_name: data.name,
                from_email: data.email,
                subject: data.subject || 'General Inquiry',
                message: data.message,
                to_email: 'sagecluborganisation@gmail.com'
            };

            // Send email using EmailJS
            const response = await emailjs.send(
                'service_v01pll7', 
                'template_rfc0wxo', 
                templateParams,
                'O7k1qDDP2avoMEPR4' 
            );

            if (response.status === 200) {
                return { success: true, message: 'Email sent successfully' };
            } else {
                throw new Error('Failed to send email. Please try again.');
            }
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error(error.message || 'Failed to send email. Please try again.');
        }
    }

    showSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.cssText = `
            background: #2ecc71;
            color: white;
            padding: 1.5rem;
            border-radius: 8px;
            margin: 1rem 0;
            text-align: center;
            font-size: 1.1rem;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
            position: relative;
            overflow: hidden;
        `;
        
        // Create emoji animation container
        const emojiContainer = document.createElement('div');
        emojiContainer.style.cssText = `
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            animation: bounce 1s ease infinite;
        `;
        emojiContainer.textContent = '🎉';
        
        // Create message text
        const messageText = document.createElement('div');
        messageText.textContent = 'Email sent successfully!';
        messageText.style.marginBottom = '0.5rem';
        
        // Create thank you text
        const thankYouText = document.createElement('div');
        thankYouText.textContent = 'Thank you for your message!';
        thankYouText.style.fontSize = '0.9rem';
        thankYouText.style.opacity = '0.9';
        
        // Add CSS animation for the emoji
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-10px);
                }
                60% {
                    transform: translateY(-5px);
                }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .success-message {
                animation: fadeInUp 0.5s ease-out;
            }
        `;
        document.head.appendChild(style);
        
        // Assemble the success message
        successMessage.appendChild(emojiContainer);
        successMessage.appendChild(messageText);
        successMessage.appendChild(thankYouText);
        
        this.form.insertAdjacentElement('beforebegin', successMessage);
        
        // Auto-remove after 5 seconds with fade out animation
        setTimeout(() => {
            successMessage.style.transition = 'opacity 0.5s ease-out';
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 500);
        }, 5000);
    }

    showError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.style.cssText = `
            background: #e74c3c;
            color: white;
            padding: 1rem;
            border-radius: 5px;
            margin: 1rem 0;
            text-align: center;
        `;
        errorMessage.textContent = message;
        
        this.form.insertAdjacentElement('beforebegin', errorMessage);
        setTimeout(() => errorMessage.remove(), 5000);
    }
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', () => {
    window.sageApp = new SAGEApp();
    new ContactForm('#contactForm');
});

// Utility functions
const Utils = {
    debounce(func, wait) {
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

    throttle(func, limit) {
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
};

// Location sharing and copying functionality
class LocationManager {
    constructor() {
        this.locationDetails = {
            address: 'Parklands/Highridge Red Hill Rd, Off Limuru Rd, Gigiri, Nairobi, Kenya',
            coordinates: '-1.2500, 36.8000',
            mapUrl: 'https://maps.google.com/?q=Parklands/Highridge+Red+Hill+Rd,+Off+Limuru+Rd,+Gigiri,+Nairobi,+Kenya'
        };
        
        this.init();
    }

    init() {
        this.bindLocationEvents();
    }

    bindLocationEvents() {
        // Share button functionality
        const shareBtn = document.querySelector('.share-btn');
        const copyBtn = document.querySelector('.copy-btn');
        
        if (shareBtn) {
            shareBtn.addEventListener('click', this.shareLocation.bind(this));
        }
        
        if (copyBtn) {
            copyBtn.addEventListener('click', this.copyLocation.bind(this));
        }
    }

    async shareLocation() {
        const shareData = {
            title: 'SAGE Office Location',
            text: `Visit SAGE at ${this.locationDetails.address}`,
            url: this.locationDetails.mapUrl
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.showFeedback('Location shared successfully!');
            } else {
                // Fallback to copying URL
                this.copyToClipboard(this.locationDetails.mapUrl);
                this.showFeedback('Location URL copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing location:', error);
            this.showFeedback('Error sharing location. URL copied to clipboard instead.');
            this.copyToClipboard(this.locationDetails.mapUrl);
        }
    }

    copyLocation() {
        this.copyToClipboard(this.locationDetails.address);
        this.showFeedback('Location address copied to clipboard!');
    }

    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                this.showFeedback('Copied to clipboard!');
            } else {
                // Fallback for older browsers
                this.fallbackCopyToClipboard(text);
            }
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.fallbackCopyToClipboard(text);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            this.showFeedback(successful ? 'Copied to clipboard!' : 'Failed to copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            this.showFeedback('Failed to copy to clipboard');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    showFeedback(message) {
        const feedback = document.getElementById('share-feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.style.display = 'block';
            feedback.classList.add('show');
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                feedback.style.display = 'none';
                feedback.classList.remove('show');
            }, 3000);
        } else {
            // Fallback alert if element not found
            alert(message);
        }
    }
}

// Initialize location manager
document.addEventListener('DOMContentLoaded', () => {
    new LocationManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SAGEApp, ContactForm, Utils, LocationManager };
}
// End of script.js        
// Newsletter functionality
class NewsletterManager {
    constructor() {
        this.form = document.getElementById('newsletterForm');
        this.emailInput = document.getElementById('newsletterEmail');
        this.errorElement = document.querySelector('.newsletter-error');
        this.successElement = document.querySelector('.newsletter-success');

        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            this.emailInput.addEventListener('input', this.clearErrors.bind(this));
            this.emailInput.addEventListener('blur', this.validateEmail.bind(this));
        }
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            this.showError('Email address is required');
            return false;
        }

        if (!emailRegex.test(email)) {
            this.showError('Please enter a valid email address');
            return false;
        }

        this.clearErrors();
        return true;
    }

    showError(message) {
        this.errorElement.textContent = message;
        this.errorElement.style.display = 'block';
        this.emailInput.classList.add('error');
    }

    clearErrors() {
        this.errorElement.textContent = '';
        this.errorElement.style.display = 'none';
        this.emailInput.classList.remove('error');
    }

    showSuccess(message = 'Thank you for subscribing! Check your email for confirmation.') {
        this.successElement.textContent = message;
        this.successElement.classList.add('show');
        this.form.reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
            this.successElement.classList.remove('show');
        }, 5000);
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateEmail()) {
            return;
        }

        const email = this.emailInput.value.trim();

        // Show loading state
        const submitBtn = this.form.querySelector('.newsletter-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        try {
            // Simulate API call (replace with actual newsletter service)
            await this.subscribeToNewsletter(email);

            this.showSuccess();

        } catch (error) {
            console.error('Newsletter subscription error:', error);
            this.showError('Failed to subscribe. Please try again later.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async subscribeToNewsletter(email) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Here you would integrate with your newsletter service
        // Examples: Mailchimp, ConvertKit, EmailJS, etc.

        // For now, we'll just simulate success
        console.log('Newsletter subscription for:', email);

        // Example with EmailJS (uncomment and configure if using EmailJS):
        /*
        return emailjs.send(
            'YOUR_SERVICE_ID',
            'YOUR_NEWSLETTER_TEMPLATE_ID',
            {
                email: email,
                subscription_date: new Date().toLocaleDateString()
            }
        );
        */

        return { success: true };
    }
}

// Testimonials functionality
class TestimonialsManager {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial-card');
        this.currentIndex = 0;
        this.autoRotate = true;
        this.interval = null;

        this.init();
    }

    init() {
        if (this.testimonials.length > 0) {
            this.addIntersectionObserver();
            if (this.autoRotate && this.testimonials.length > 1) {
                this.startAutoRotate();
            }
        }
    }

    addIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        this.testimonials.forEach((testimonial, index) => {
            testimonial.style.opacity = '0';
            testimonial.style.transform = 'translateY(20px)';
            testimonial.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
            observer.observe(testimonial);
        });
    }

    startAutoRotate() {
        this.interval = setInterval(() => {
            this.rotateTestimonials();
        }, 5000); // Change testimonial every 5 seconds
    }

    rotateTestimonials() {
        // Add fade effect for rotation
        this.testimonials.forEach(testimonial => {
            testimonial.style.transition = 'opacity 0.5s ease';
            testimonial.style.opacity = '0.3';
        });

        setTimeout(() => {
            this.testimonials.forEach(testimonial => {
                testimonial.style.opacity = '1';
            });
        }, 500);
    }

    stopAutoRotate() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize newsletter functionality
    new NewsletterManager();

    // Initialize testimonials functionality
    new TestimonialsManager();
});

// Add some CSS for error states
const style = document.createElement('style');
style.textContent = `
    #newsletterEmail.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .newsletter-error {
        display: none;
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        text-align: left;
    }

    .newsletter-success {
        color: #10b981;
        font-weight: 600;
        margin-top: 1rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .newsletter-success.show {
        opacity: 1;
    }
`;
document.head.appendChild(style);

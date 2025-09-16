// Lazy loading implementation for SAGE website
class LazyLoader {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        // Create intersection observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadElement(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Observe lazy elements
        this.observeLazyElements();
    }

    observeLazyElements() {
        // Observe images
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            this.observer.observe(img);
        });

        // Observe lazy sections
        const lazySections = document.querySelectorAll('.lazy-section[data-lazy="true"]');
        lazySections.forEach(section => {
            this.observer.observe(section);
        });
    }

    loadElement(element) {
        if (element.tagName === 'IMG') {
            this.loadImage(element);
        } else if (element.classList.contains('lazy-section')) {
            this.loadSection(element);
        }

        // Stop observing once loaded
        this.observer.unobserve(element);
    }

    loadImage(img) {
        // Image is already loaded with loading="lazy"
        // Add loaded class for styling
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });

        // Handle load errors
        img.addEventListener('error', () => {
            console.warn('Failed to load image:', img.src);
            img.classList.add('error');
        });
    }

    loadSection(section) {
        const sectionType = section.dataset.sectionType;
        const placeholder = section.querySelector('.loading-placeholder');

        // Remove loading placeholder
        if (placeholder) {
            placeholder.remove();
        }

        // Load section content based on type
        switch(sectionType) {
            case 'mission-vision':
                this.loadMissionVision(section);
                break;
            case 'slider':
                this.loadSlider(section);
                break;
            default:
                // Section is already loaded
                break;
        }

        // Add loaded class
        section.classList.add('loaded');
    }

    loadMissionVision(section) {
        // Mission & Vision content is already in HTML
        // Just ensure it's visible
        section.style.opacity = '1';
    }

    loadSlider(section) {
        // Slider content is already in HTML
        // Just ensure it's visible
        section.style.opacity = '1';
    }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LazyLoader();
});

// Add CSS for lazy loading
const lazyLoadStyles = `
.lazy-section {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.lazy-section.loaded {
    opacity: 1;
}

.loading-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    background: #f8f9fa;
    border-radius: 8px;
}

.loading-placeholder .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e9ecef;
    border-top: 4px solid #1abc9c;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

img.loaded {
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = lazyLoadStyles;
document.head.appendChild(styleSheet);

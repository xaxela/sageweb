// Poster Gallery JavaScript Functionality

// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('poster-search');
    const posterCards = document.querySelectorAll('.poster-card');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();

        posterCards.forEach(card => {
            const title = card.querySelector('h3, h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Lightbox functionality
    const lightbox = document.getElementById('poster-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    let images = [];

    // Collect all poster images
    posterCards.forEach(card => {
        const img = card.querySelector('img');
        if (img) {
            images.push({
                src: img.src,
                alt: img.alt,
                title: card.querySelector('h3, h4').textContent,
                description: card.querySelector('p').textContent
            });
        }
    });

    // Open lightbox when clicking on poster images
    posterCards.forEach((card, index) => {
        const img = card.querySelector('img');
        img.addEventListener('click', function() {
            currentImageIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        const image = images[currentImageIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = `${image.title} - ${image.description}`;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        openLightbox();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        openLightbox();
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });
});

// Download functionality
function downloadImage(imageSrc, filename) {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Share functionality
function shareOnFacebook(imageSrc, title) {
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(title)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareOnTwitter(imageSrc, title) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${title} - Check out this poster from SAGE!`);
    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp(imageSrc, title) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${title} - Check out this poster from SAGE! ${url}`);
    const shareUrl = `https://wa.me/?text=${text}`;
    window.open(shareUrl, '_blank');
}

function shareOnLinkedIn(imageSrc, title) {
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

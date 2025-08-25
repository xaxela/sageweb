window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    
    // Simulate loading time (2 seconds)
    setTimeout(() => {
        // Add loaded class to body for CSS transitions
        document.body.classList.add('loaded');
        
        // Remove loader from DOM after transition completes
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // Match this with the CSS transition time
    }, 2000);
});

// GitHub CMS Configuration
const CONFIG = {
    owner: 'your-username', // Will be auto-detected
    repo: 'your-repo', // Will be auto-detected
    branch: 'main',
    baseUrl: 'https://raw.githubusercontent.com'
};

// Content paths configuration
const CONTENT_PATHS = {
    slider: '../IMAGES/slider/',
    team: '../IMAGES/TEAM/',
    patrons: '../IMAGES/PATRONS/',
    updates: '../UPDATES/'
};

// Initialize CMS
document.addEventListener('DOMContentLoaded', function() {
    detectGitHubRepo();
    loadAllContent();
});

function detectGitHubRepo() {
    // Auto-detect GitHub repository from current URL
    const url = window.location.href;
    const match = url.match(/github\.io\/([^/]+)/);
    if (match) {
        CONFIG.repo = match[1];
        CONFIG.owner = url.match(/([^/.]+)\.github\.io/)[1];
    }
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.remove('hidden');
    
    // Update active button
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

async function loadAllContent() {
    await Promise.all([
        loadSliderImages(),
        loadTeamPhotos(),
        loadPatrons(),
        loadUpdates()
    ]);
}

async function loadSliderImages() {
    const container = document.getElementById('slider-container');
    container.innerHTML = '<div class="loading">Loading slider images...</div>';
    
    try {
        const images = await getImagesFromPath(CONTENT_PATHS.slider);
        displayImages(container, images, 'Slider Image');
    } catch (error) {
        container.innerHTML = '<div class="error">Error loading slider images</div>';
    }
}

async function loadTeamPhotos() {
    const container = document.getElementById('team-container');
    container.innerHTML = '<div class="loading">Loading team photos...</div>';
    
    try {
        const images = await getImagesFromPath(CONTENT_PATHS.team);
        displayImages(container, images, 'Team Member');
    } catch (error) {
        container.innerHTML = '<div class="error">Error loading team photos</div>';
    }
}

async function loadPatrons() {
    const container = document.getElementById('patrons-container');
    container.innerHTML = '<div class="loading">Loading patrons...</div>';
    
    try {
        const images = await getImagesFromPath(CONTENT_PATHS.patrons);
        displayImages(container, images, 'Club Patron');
    } catch (error) {
        container.innerHTML = '<div class="error">Error loading patrons</div>';
    }
}

async function loadUpdates() {
    const container = document.getElementById('updates-container');
    container.innerHTML = '<div class="loading">Loading updates...</div>';
    
    try {
        const updates = await getUpdates();
        displayUpdates(container, updates);
    } catch (error) {
        container.innerHTML = '<div class="error">Error loading updates</div>';
    }
}

async function getImagesFromPath(path) {
    // This function will scan the directory for images
    // Since GitHub Pages doesn't allow server-side scanning, we'll use a predefined list
    // and check if images exist
    
const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'];
    const images = [];
    
    // Common image names to check
    const commonNames = ['image', 'photo', 'pic', 'img', 'slide', 'team', 'patron'];
    
    // Try to load images based on existing structure
    const baseUrl = window.location.origin + window.location.pathname.replace('/cms/', '/');
    
    // Enhanced: Scan directory for all images with supported extensions
    async function getImagesFromDirectory(path) {
        const images = [];
        const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'];
        const baseUrl = window.location.origin + window.location.pathname.replace('/cms/', '/');
        
        // Since no server-side directory listing, simulate by checking common image names or use a manifest file
        // For demo, check for images named image1, image2,... image20 with all extensions
        for (let i = 1; i <= 20; i++) {
            for (const ext of supportedExtensions) {
                const imageName = `image${i}.${ext}`;
                const imageUrl = baseUrl + path + imageName;
                if (await imageExists(imageUrl)) {
                    images.push({
                        url: imageUrl,
                        name: `Image ${i}`,
                        description: `Image ${i} with extension ${ext}`
                    });
                }
            }
        }
        return images;
    }
    
    // Use enhanced function for all image loading
    return await getImagesFromDirectory(path);
}

async function imageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

async function getUpdates() {
    // Load updates from a JSON file or markdown files
    const updates = [];
    
    try {
        // Try to load updates.json
        const response = await fetch('../UPDATES/updates.json');
        if (response.ok) {
            const data = await response.json();
            return data.updates || [];
        }
    } catch (error) {
        console.log('No updates.json found, using sample updates');
    }
    
    // Fallback to sample updates
    return [
        {
            title: "Welcome to our new CMS!",
            date: new Date().toISOString().split('T')[0],
            content: "Our new content management system is now live. You can now easily manage slider images, team photos, and updates directly through GitHub."
        },
        {
            title: "New Team Members Joined",
            date: "2024-01-15",
            content: "We are excited to welcome new members to our leadership team. Check out the team section for updated photos and bios."
        }
    ];
}

function displayImages(container, images, type) {
    if (images.length === 0) {
        container.innerHTML = `<div class="error">No ${type.toLowerCase()} images found</div>`;
        return;
    }
    
    container.innerHTML = '';
    
    images.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <img src="${image.url}" alt="${image.description}" loading="lazy">
            <div class="caption">
                <strong>${image.name}</strong>
                <br>
                <small>${type} ${index + 1}</small>
            </div>
        `;
        container.appendChild(imageItem);
    });
}

function displayUpdates(container, updates) {
    if (updates.length === 0) {
        container.innerHTML = '<div class="error">No updates found</div>';
        return;
    }
    
    container.innerHTML = '';
    
    updates.forEach(update => {
        const updateItem = document.createElement('div');
        updateItem.className = 'update-item';
        updateItem.innerHTML = `
            <h3>${update.title}</h3>
            <p class="date">${new Date(update.date).toLocaleDateString()}</p>
            <p>${update.content}</p>
        `;
        container.appendChild(updateItem);
    });
}

// Auto-refresh functionality
setInterval(() => {
    loadAllContent();
}, 300000); // Refresh every 5 minutes

// Manual refresh button
function addRefreshButton() {
    const header = document.querySelector('header');
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Refresh Content';
    refreshBtn.onclick = loadAllContent;
    refreshBtn.style.cssText = 'margin-left: 1rem; padding: 0.5rem; background: #1abc9c; color: white; border: none; border-radius: 4px; cursor: pointer;';
    header.appendChild(refreshBtn);
}

// Add refresh button after page loads
setTimeout(addRefreshButton, 1000);

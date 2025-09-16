class CMSDashboard {
    constructor() {
        this.config = {
            owner: 'xaxela',
            repo: 'sageweb',
            branch: 'main',
            baseUrl: 'https://raw.githubusercontent.com'
        };
        
        this.contentPaths = {
            slider: '../IMAGES/slider/',
            team: '../IMAGES/TEAM/',
            patrons: '../IMAGES/PATRONS/',
            updates: '../UPDATES/updates.json'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboard();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.dataset.section);
            });
        });

        // Settings
        document.getElementById('github-owner').value = this.config.owner;
        document.getElementById('github-repo').value = this.config.repo;
        document.getElementById('github-branch').value = this.config.branch;
        document.getElementById('github-token').value = cmsAuth.token || '';
    }

    setupNavigation() {
        // Show dashboard by default
        this.showSection('dashboard');
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Load section content
        this.loadSectionContent(sectionName);
    }

    async loadSectionContent(sectionName) {
        switch(sectionName) {
            case 'dashboard':
                await this.loadDashboardStats();
                break;
            case 'slider':
                await this.loadSliderImages();
                break;
            case 'team':
                await this.loadTeamMembers();
                break;
            case 'patrons':
                await this.loadPatrons();
                break;
            case 'updates':
                await this.loadUpdates();
                break;
        }
    }

    async loadDashboard() {
        await this.loadDashboardStats();
        this.loadRecentActivity();
    }

    async loadDashboardStats() {
        try {
            const [sliderImages, teamMembers, patrons, updates] = await Promise.all([
                this.getImagesFromPath(this.contentPaths.slider),
                this.getImagesFromPath(this.contentPaths.team),
                this.getImagesFromPath(this.contentPaths.patrons),
                this.getUpdates()
            ]);

            document.getElementById('slider-count').textContent = sliderImages.length;
            document.getElementById('team-count').textContent = teamMembers.length;
            document.getElementById('patrons-count').textContent = patrons.length;
            document.getElementById('updates-count').textContent = updates.length;
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }

    async loadSliderImages() {
        const container = document.getElementById('slider-grid');
        container.innerHTML = '<div class="loading">Loading slider images...</div>';
        
        try {
            const images = await this.getImagesFromPath(this.contentPaths.slider);
            this.displayImages(container, images, 'slider');
        } catch (error) {
            container.innerHTML = '<div class="error">Error loading slider images</div>';
        }
    }

    async loadTeamMembers() {
        const container = document.getElementById('team-grid');
        container.innerHTML = '<div class="loading">Loading team members...</div>';
        
        try {
            const images = await this.getImagesFromPath(this.contentPaths.team);
            this.displayImages(container, images, 'team');
        } catch (error) {
            container.innerHTML = '<div class="error">Error loading team members</div>';
        }
    }

    async loadPatrons() {
        const container = document.getElementById('patrons-grid');
        container.innerHTML = '<div class="loading">Loading patrons...</div>';
        
        try {
            const images = await this.getImagesFromPath(this.contentPaths.patrons);
            this.displayImages(container, images, 'patrons');
        } catch (error) {
            container.innerHTML = '<div class="error">Error loading patrons</div>';
        }
    }

    async loadUpdates() {
        const container = document.getElementById('updates-list');
        container.innerHTML = '<div class="loading">Loading updates...</div>';
        
        try {
            const updates = await this.getUpdates();
            this.displayUpdates(container, updates);
        } catch (error) {
            container.innerHTML = '<div class="error">Error loading updates</div>';
        }
    }

    async getImagesFromPath(path) {
        const images = [];
        const baseUrl = window.location.origin + window.location.pathname.replace('/cms/', '/');
        const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'];

        // Enhanced: Scan directory for all images with supported extensions
        async function getImagesFromDirectory(path) {
            const images = [];

            // Check for images named image1, image2,... image20 with all extensions
            for (let i = 1; i <= 20; i++) {
                for (const ext of supportedExtensions) {
                    const imageName = `image${i}.${ext}`;
                    const imageUrl = baseUrl + path + imageName;
                    if (await this.imageExists(imageUrl)) {
                        images.push({
                            url: imageUrl,
                            name: `Image ${i}`,
                            description: `Image ${i} with extension ${ext}`,
                            type: path.includes('slider') ? 'slider' : path.includes('TEAM') ? 'team' : 'patrons'
                        });
                    }
                }
            }

            // Also check for existing hardcoded names for backward compatibility
            if (path.includes('slider')) {
                for (let i = 1; i <= 10; i++) {
                    const imageName = `slidder${i}.jpeg`;
                    const imageUrl = baseUrl + 'IMAGES/slider/' + imageName;
                    if (await this.imageExists(imageUrl)) {
                        images.push({
                            url: imageUrl,
                            name: `Slider ${i}`,
                            description: `Slider image ${i}`,
                            type: 'slider'
                        });
                    }
                }
            }

            // For team members and patrons, check the actual image names used in index.html
            if (path.includes('TEAM')) {
                const teamMembers = [
                    'president.jpg', 'deno.jpg', 'lorna.jpg', 'rose.jpg',
                    'ken.jpg', 'brian.jpg', 'vini.jpg', 'nick.jpg',
                    'DAN.png', 'alex.jpg'
                ];

                for (const member of teamMembers) {
                    const imageUrl = baseUrl + 'IMAGES/TEAM/' + member;
                    if (await this.imageExists(imageUrl)) {
                        images.push({
                            url: imageUrl,
                            name: member.replace('.jpg', '').replace('.png', '').replace('-', ' '),
                            description: `Team member: ${member.replace('.jpg', '').replace('.png', '').replace('-', ' ')}`,
                            type: 'team'
                        });
                    }
                }
            }

            if (path.includes('PATRONS')) {
                const patrons = ['patron1.jpg', 'patron2.jpg'];
                for (const patron of patrons) {
                    const imageUrl = baseUrl + 'IMAGES/TEAM/' + patron;
                    if (await this.imageExists(imageUrl)) {
                        images.push({
                            url: imageUrl,
                            name: patron.replace('.jpg', ''),
                            description: `Club patron: ${patron.replace('.jpg', '')}`,
                            type: 'patrons'
                        });
                    }
                }
            }

            return images;
        }

        return await getImagesFromDirectory.call(this, path);
    }

    async imageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    async getUpdates() {
        try {
            const response = await fetch(this.contentPaths.updates);
            if (response.ok) {
                const data = await response.json();
                return data.updates || [];
            }
        } catch (error) {
            console.log('No updates.json found, using sample updates');
        }
        
        return [
            {
                title: "Welcome to our new CMS!",
                date: new Date().toISOString().split('T')[0],
                content: "Our new content management system is now live. You can now easily manage slider images, team photos, and updates directly through GitHub."
            }
        ];
    }

    displayImages(container, images, type) {
        container.innerHTML = '';
        
        if (images.length === 0) {
            container.innerHTML = `<div class="error">No ${type} images found</div>`;
            return;
        }
        
        images.forEach((image, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item fade-in';
            imageItem.innerHTML = `
                <img src="${image.url}" alt="${image.description}" loading="lazy">
                <div class="caption">
                    <strong>${image.name}</strong>
                    <br>
                    <small>${image.description}</small>
                </div>
                <div class="image-actions">
                    <button class="btn btn-secondary" onclick="cms.editImage('${image.url}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="cms.deleteImage('${image.url}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            container.appendChild(imageItem);
        });
    }

    displayUpdates(container, updates) {
        container.innerHTML = '';
        
        if (updates.length === 0) {
            container.innerHTML = '<div class="error">No updates found</div>';
            return;
        }
        
        updates.forEach((update, index) => {
            const updateItem = document.createElement('div');
            updateItem.className = 'update-item fade-in';
            updateItem.innerHTML = `
                <h3>${update.title}</h3>
                <p class="date">${new Date(update.date).toLocaleDateString()}</p>
                <p>${update.content}</p>
                <div class="update-actions">
                    <button class="btn btn-secondary" onclick="cms.editUpdate(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="cms.deleteUpdate(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            container.appendChild(updateItem);
        });
    }

    loadRecentActivity() {
        const container = document.getElementById('activity-feed');
        container.innerHTML = `
            <div class="activity-item">
                <i class="fas fa-images"></i>
                <span>CMS Dashboard loaded successfully</span>
                <small>${new Date().toLocaleTimeString()}</small>
            </div>
        `;
    }

    editImage(url) {
        console.log('Edit image:', url);
        // Implementation for image editing
    }

    deleteImage(url) {
        if (confirm('Are you sure you want to delete this image?')) {
            console.log('Delete image:', url);
            // Implementation for image deletion
        }
    }

    editUpdate(index) {
        console.log('Edit update:', index);
        // Implementation for update editing
    }

    deleteUpdate(index) {
        if (confirm('Are you sure you want to delete this update?')) {
            console.log('Delete update:', index);
            // Implementation for update deletion
        }
    }

    saveSettings() {
        const owner = document.getElementById('github-owner').value;
        const repo = document.getElementById('github-repo').value;
        const branch = document.getElementById('github-branch').value;
        const token = document.getElementById('github-token').value;

        this.config.owner = owner;
        this.config.repo = repo;
        this.config.branch = branch;

        localStorage.setItem('cms-config', JSON.stringify(this.config));

        if (token) {
            cmsAuth.setToken(token);
            alert('Settings saved successfully! GitHub integration enabled.');
        } else {
            alert('Settings saved successfully! Note: GitHub token not provided - uploads will be simulated.');
        }
    }
}

// Initialize CMS Dashboard
const cms = new CMSDashboard();

// Global functions
function refreshAllContent() {
    cms.loadDashboard();
}

function showAddContentModal() {
    console.log('Add content modal');
}

function uploadSliderImage() {
    document.getElementById('upload-modal').classList.remove('hidden');
}

function addTeamMember() {
    document.getElementById('upload-modal').classList.remove('hidden');
}

function addPatron() {
    document.getElementById('upload-modal').classList.remove('hidden');
}

function addUpdate() {
    console.log('Add update');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Auto-refresh every 5 minutes
setInterval(() => {
    cms.loadDashboard();
}, 300000);

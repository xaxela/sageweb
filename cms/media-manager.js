// SAGE Club CMS Media Manager
// Handles image uploads, editing, and deletion

class MediaManager {
    constructor() {
        this.currentUploadType = null;
        this.init();
    }

    init() {
        this.setupUploadForm();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Upload form submission
        const uploadForm = document.getElementById('upload-form');
        if (uploadForm) {
            uploadForm.addEventListener('submit', this.handleUpload.bind(this));
        }

        // File input change
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', this.previewImage.bind(this));
        }
    }

    setupUploadForm() {
        // Initialize the upload form with proper validation
        const uploadForm = document.getElementById('upload-form');
        if (uploadForm) {
            uploadForm.reset();
        }
    }

    async handleUpload(e) {
        e.preventDefault();
        
        const formData = new FormData();
        const fileInput = document.getElementById('file-input');
        const titleInput = document.getElementById('image-title');
        const descriptionInput = document.getElementById('image-description');

        if (!fileInput.files[0]) {
            alert('Please select an image file');
            return;
        }

        if (!titleInput.value.trim()) {
            alert('Please enter a title for the image');
            return;
        }

        // Show loading overlay
        this.showLoading(true);

        try {
            formData.append('image', fileInput.files[0]);
            formData.append('title', titleInput.value);
            formData.append('description', descriptionInput.value);
            formData.append('type', this.currentUploadType);

            // Simulate upload process (replace with actual API call)
            await this.simulateUpload(formData);
            
            // Close modal and refresh content
            this.closeModal('upload-modal');
            this.refreshContent();
            
            alert('Image uploaded successfully!');
            
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error uploading image. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async simulateUpload(formData) {
        // Simulate upload delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Uploading:', {
                    fileName: formData.get('image').name,
                    title: formData.get('title'),
                    description: formData.get('description'),
                    type: formData.get('type')
                });
                resolve();
            }, 2000);
        });
    }

    previewImage(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type - support all common image formats
        const supportedTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'image/svg+xml', 'image/bmp', 'image/tiff'
        ];
        const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'];

        const isValidType = supportedTypes.includes(file.type) ||
                           supportedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

        if (!isValidType) {
            alert('Please select a supported image file (JPEG, PNG, GIF, WebP, SVG, BMP, TIFF)');
            e.target.value = '';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            e.target.value = '';
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = function(e) {
            // Remove existing preview if any
            const existingPreview = document.getElementById('image-preview');
            if (existingPreview) {
                existingPreview.remove();
            }

            // Create preview container
            const previewContainer = document.createElement('div');
            previewContainer.id = 'image-preview';
            previewContainer.style.cssText = `
                margin: 1rem 0;
                text-align: center;
            `;

            // Create preview image
            const previewImg = document.createElement('img');
            previewImg.src = e.target.result;
            previewImg.style.cssText = `
                max-width: 100%;
                max-height: 200px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;

            // Create file info
            const fileInfo = document.createElement('div');
            fileInfo.style.cssText = `
                font-size: 0.875rem;
                color: #666;
                margin-top: 0.5rem;
            `;
            fileInfo.textContent = `${file.name} (${this.formatFileSize(file.size)})`;

            previewContainer.appendChild(previewImg);
            previewContainer.appendChild(fileInfo);

            // Insert after file input
            const fileInput = document.getElementById('file-input');
            fileInput.parentNode.insertBefore(previewContainer, fileInput.nextSibling);
        }.bind(this);

        reader.readAsDataURL(file);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.toggle('hidden', !show);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
        
        // Reset form
        const uploadForm = document.getElementById('upload-form');
        if (uploadForm) {
            uploadForm.reset();
        }
        
        // Remove preview
        const preview = document.getElementById('image-preview');
        if (preview) {
            preview.remove();
        }
    }

    refreshContent() {
        // Refresh the current section content
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            const sectionId = activeSection.id.replace('-section', '');
            cms.loadSectionContent(sectionId);
        }
    }

    // Image editing functionality
    editImage(imageUrl) {
        console.log('Editing image:', imageUrl);
        // Open edit modal with image details
        this.openEditModal(imageUrl);
    }

    openEditModal(imageUrl) {
        // Create or show edit modal
        let editModal = document.getElementById('edit-modal');
        
        if (!editModal) {
            editModal = document.createElement('div');
            editModal.id = 'edit-modal';
            editModal.className = 'modal hidden';
            editModal.innerHTML = `
                <div class="modal-content">
                    <span class="close" onclick="mediaManager.closeModal('edit-modal')">&times;</span>
                    <h3>Edit Image</h3>
                    <form id="edit-form">
                        <div class="form-group">
                            <label for="edit-title">Title</label>
                            <input type="text" id="edit-title" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-description">Description</label>
                            <textarea id="edit-description" rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </form>
                </div>
            `;
            document.body.appendChild(editModal);
            
            // Add form submit handler
            const editForm = document.getElementById('edit-form');
            editForm.addEventListener('submit', this.handleEdit.bind(this));
        }
        
        // Populate form with current data
        // This would typically come from your data store
        document.getElementById('edit-title').value = 'Current Image Title';
        document.getElementById('edit-description').value = 'Current image description';
        
        // Show modal
        editModal.classList.remove('hidden');
    }

    async handleEdit(e) {
        e.preventDefault();
        
        const title = document.getElementById('edit-title').value;
        const description = document.getElementById('edit-description').value;
        
        // Show loading
        this.showLoading(true);
        
        try {
            // Simulate edit process
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Image edited:', { title, description });
            
            // Close modal and refresh
            this.closeModal('edit-modal');
            this.refreshContent();
            
            alert('Image updated successfully!');
            
        } catch (error) {
            console.error('Edit error:', error);
            alert('Error updating image. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async deleteImage(imageUrl) {
        if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
            return;
        }
        
        this.showLoading(true);
        
        try {
            // Simulate delete process
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Image deleted:', imageUrl);
            
            // Refresh content
            this.refreshContent();
            
            alert('Image deleted successfully!');
            
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting image. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    // Set upload type for different sections
    setUploadType(type) {
        this.currentUploadType = type;
        
        // Update modal title based on upload type
        const modalTitle = document.querySelector('#upload-modal h3');
        if (modalTitle) {
            switch(type) {
                case 'slider':
                    modalTitle.textContent = 'Upload Slider Image';
                    break;
                case 'team':
                    modalTitle.textContent = 'Add Team Member';
                    break;
                case 'patrons':
                    modalTitle.textContent = 'Add Club Patron';
                    break;
                default:
                    modalTitle.textContent = 'Upload Image';
            }
        }
    }
}

// Initialize Media Manager
const mediaManager = new MediaManager();

// Global functions for modal operations
function uploadSliderImage() {
    mediaManager.setUploadType('slider');
    document.getElementById('upload-modal').classList.remove('hidden');
}

function addTeamMember() {
    mediaManager.setUploadType('team');
    document.getElementById('upload-modal').classList.remove('hidden');
}

function addPatron() {
    mediaManager.setUploadType('patrons');
    document.getElementById('upload-modal').classList.remove('hidden');
}

function closeModal(modalId) {
    mediaManager.closeModal(modalId);
}

// SAGE Club CMS - Media Manager for File Uploads

class MediaManager {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        this.uploadPath = '../IMAGES/';
    }

    async uploadImage(file, type, metadata = {}) {
        if (!this.validateFile(file)) {
            return false;
        }

        try {
            this.showLoading(true);
            
            // Create FormData
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            formData.append('metadata', JSON.stringify(metadata));

            // Since GitHub Pages doesn't support server-side uploads,
            // we'll provide instructions for manual upload
            const instructions = this.generateUploadInstructions(file, type, metadata);
            this.showUploadInstructions(instructions);
            
            return true;
        } catch (error) {
            console.error('Upload error:', error);
            this.showError('Upload failed. Please try again.');
            return false;
        } finally {
            this.showLoading(false);
        }
    }

    validateFile(file) {
        // Check file size
        if (file.size > this.maxFileSize) {
            this.showError('File size must be less than 5MB');
            return false;
        }

        // Check file type
        if (!this.allowedTypes.includes(file.type)) {
            this.showError('Only JPEG, PNG, GIF, and WebP images are allowed');
            return false;
        }

        return true;
    }

    generateUploadInstructions(file, type, metadata) {
        const fileName = this.generateFileName(file, type);
        const targetPath = this.getTargetPath(type);
        
        return {
            fileName,
            targetPath,
            metadata,
            instructions: `
                <h3>Manual Upload Instructions</h3>
                <p>Since this is a GitHub Pages site, please follow these steps:</p>
                <ol>
                    <li>Rename your file to: <strong>${fileName}</strong></li>
                    <li>Upload it to: <strong>${targetPath}</strong></li>
                    <li>Commit the changes to your repository</li>
                    <li>Wait 2-3 minutes for GitHub Pages to update</li>
                    <li>Refresh this page to see your new content</li>
                </ol>
                <p><strong>Recommended image size:</strong> ${type === 'slider' ? '1920x1080px' : '400x400px'}</p>
            `
        };
    }

    generateFileName(file, type) {
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        
        switch(type) {
            case 'slider':
                return `slidder${this.getNextSliderNumber()}.${extension}`;
            case 'team':
                return `team-member-${timestamp}.${extension}`;
            case 'patrons':
                return `patron-${timestamp}.${extension}`;
            default:
                return `${type}-${timestamp}.${extension}`;
        }
    }

    getNextSliderNumber() {
        // This would need to be determined by checking existing files
        return 1; // Placeholder
    }

    getTargetPath(type) {
        switch(type) {
            case 'slider':
                return 'IMAGES/slider/';
            case 'team':
                return 'IMAGES/TEAM/';
            case 'patrons':
                return 'IMAGES/PATRONS/';
            default:
                return 'IMAGES/';
        }
    }

    showUploadInstructions(instructions) {
        const modal = document.getElementById('upload-modal');
        const content = modal.querySelector('.modal-content');
        
        content.innerHTML = `
            <span class="close" onclick="closeModal('upload-modal')">&times;</span>
            ${instructions.instructions}
            <div class="upload-preview">
                <h4>Preview</h4>
                <img id="preview-image" style="max-width: 100%; max-height: 200px;">
            </div>
            <button class="btn btn-primary" onclick="downloadInstructions()">
                <i class="fas fa-download"></i> Download Instructions
            </button>
        `;
        
        // Show preview
        const fileInput = document.getElementById('file-input');
        if (fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('preview-image').src = e.target.result;
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    }

    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        `;
        
        // Add to modal or main content
        const container = document.querySelector('.main-content');
        container.insertBefore(errorDiv, container.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${message}
        `;
        
        const container = document.querySelector('.main-content');
        container.insertBefore(successDiv, container.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Image optimization
    async optimizeImage(file, maxWidth = 1920, maxHeight = 1080) {
        return new Promise((resolve) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            img.onload = () => {
                let { width, height } = img;
                
                // Calculate new dimensions
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, file.type, 0.9);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    // Bulk operations
    async bulkUpload(files, type) {
        const results = [];
        
        for (const file of files) {
            const result = await this.uploadImage(file, type);
            results.push(result);
        }
        
        return results;
    }

    // Drag and drop support
    setupDragAndDrop(dropZoneId, type) {
        const dropZone = document.getElementById(dropZoneId);
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            const files = Array.from(e.dataTransfer.files);
            const imageFiles = files.filter(file => this.allowedTypes.includes(file.type));
            
            if (imageFiles.length > 0) {
                this.bulkUpload(imageFiles, type);
            }
        });
    }
}

// Initialize Media Manager
const mediaManager = new MediaManager();

// Global upload functions
function uploadSliderImage() {
    const modal = document.getElementById('upload-modal');
    modal.classList.remove('hidden');
    
    // Setup form for slider upload
    const form = document.getElementById('upload-form');
    form.onsubmit = (e) => {
        e.preventDefault();
        const file = document.getElementById('file-input').files[0];
        const title = document.getElementById('image-title').value;
        const description = document.getElementById('image-description').value;
        
        if (file) {
            mediaManager.uploadImage(file, 'slider', { title, description });
        }
    };
}

// File input preview
document.getElementById('file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('img');
            preview.src = e.target.result;
            preview.style.maxWidth = '100%';
            preview.style.maxHeight = '200px';
            
            const form = document.getElementById('upload-form');
            const existingPreview = form.querySelector('img');
            if (existingPreview) {
                existingPreview.remove();
            }
            form.insertBefore(preview, form.lastElementChild);
        };
        reader.readAsDataURL(file);
    }
});

// Download instructions
function downloadInstructions() {
    const instructions = document.querySelector('.modal-content').innerText;
    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'upload-instructions.txt';
    a.click();
    URL.revokeObjectURL(url);
}

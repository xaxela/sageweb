// SAGE Club CMS Content Editor
// Handles updates and announcements management

class ContentEditor {
    constructor() {
        this.updates = [];
        this.currentEditIndex = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUpdates();
    }

    setupEventListeners() {
        // Add update button
        const addUpdateBtn = document.querySelector('[onclick="addUpdate()"]');
        if (addUpdateBtn) {
            addUpdateBtn.onclick = this.showAddUpdateModal.bind(this);
        }

        // Modal form submission
        const updateForm = document.getElementById('update-form');
        if (updateForm) {
            updateForm.addEventListener('submit', this.handleUpdateSubmit.bind(this));
        }
    }

    async loadUpdates() {
        try {
            const response = await fetch('../UPDATES/updates.json');
            if (response.ok) {
                const data = await response.json();
                this.updates = data.updates || [];
            }
        } catch (error) {
            console.log('No updates.json found, using empty array');
            this.updates = [];
        }
        
        this.displayUpdates();
    }

    displayUpdates() {
        const container = document.getElementById('updates-list');
        if (!container) return;

        container.innerHTML = '';

        if (this.updates.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-newspaper" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3>No Updates Yet</h3>
                    <p>Start by adding your first update or announcement.</p>
                    <button class="btn btn-primary" onclick="contentEditor.showAddUpdateModal()">
                        <i class="fas fa-plus"></i> Add First Update
                    </button>
                </div>
            `;
            return;
        }

        this.updates.forEach((update, index) => {
            const updateItem = document.createElement('div');
            updateItem.className = 'update-item fade-in';
            updateItem.innerHTML = `
                <div class="update-header">
                    <h3>${this.escapeHtml(update.title)}</h3>
                    <span class="update-date">${new Date(update.date).toLocaleDateString()}</span>
                </div>
                <div class="update-content">
                    <p>${this.escapeHtml(update.content)}</p>
                </div>
                <div class="update-actions">
                    <button class="btn btn-secondary" onclick="contentEditor.editUpdate(${index})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="contentEditor.deleteUpdate(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            container.appendChild(updateItem);
        });
    }

    showAddUpdateModal() {
        this.currentEditIndex = null;
        this.openUpdateModal();
    }

    openUpdateModal(update = null) {
        let modal = document.getElementById('update-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'update-modal';
            modal.className = 'modal hidden';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close" onclick="contentEditor.closeModal('update-modal')">&times;</span>
                    <h3>${update ? 'Edit Update' : 'Add New Update'}</h3>
                    <form id="update-form">
                        <div class="form-group">
                            <label for="update-title">Title *</label>
                            <input type="text" id="update-title" required>
                        </div>
                        <div class="form-group">
                            <label for="update-date">Date *</label>
                            <input type="date" id="update-date" required>
                        </div>
                        <div class="form-group">
                            <label for="update-content">Content *</label>
                            <textarea id="update-content" rows="6" required></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="contentEditor.closeModal('update-modal')">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-primary">
                                ${update ? 'Save Changes' : 'Add Update'}
                            </button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
            
            const form = document.getElementById('update-form');
            form.addEventListener('submit', this.handleUpdateSubmit.bind(this));
        }

        // Set current date as default if adding new update
        if (!update) {
            document.getElementById('update-date').value = new Date().toISOString().split('T')[0];
        } else {
            document.getElementById('update-title').value = update.title;
            document.getElementById('update-date').value = update.date;
            document.getElementById('update-content').value = update.content;
        }

        modal.classList.remove('hidden');
        document.getElementById('update-title').focus();
    }

    async handleUpdateSubmit(e) {
        e.preventDefault();
        
        const title = document.getElementById('update-title').value.trim();
        const date = document.getElementById('update-date').value;
        const content = document.getElementById('update-content').value.trim();

        if (!title || !date || !content) {
            alert('Please fill in all required fields');
            return;
        }

        const updateData = { title, date, content };

        try {
            if (this.currentEditIndex !== null) {
                // Editing existing update
                this.updates[this.currentEditIndex] = updateData;
            } else {
                // Adding new update
                this.updates.unshift(updateData); // Add to beginning
            }

            await this.saveUpdates();
            this.closeModal('update-modal');
            this.displayUpdates();

            alert(`Update ${this.currentEditIndex !== null ? 'updated' : 'added'} successfully!`);
        } catch (error) {
            console.error('Error saving update:', error);
            alert('Error saving update. Please try again.');
        }
    }

    async saveUpdates() {
        if (!cmsAuth.isAuthenticated()) {
            // Fallback to localStorage if no token
            localStorage.setItem('sage-updates', JSON.stringify({
                updates: this.updates,
                lastUpdated: new Date().toISOString()
            }));
            return;
        }

        try {
            // Prepare new content
            const content = {
                updates: this.updates,
                lastUpdated: new Date().toISOString()
            };

            // Commit changes to GitHub using the updateJSONFile method
            const message = this.currentEditIndex !== null ? 'Update announcement via CMS' : 'Add announcement via CMS';
            await cmsAuth.updateJSONFile('UPDATES/updates.json', content, message);

        } catch (error) {
            console.error('GitHub update error:', error);
            throw error;
        }
    }



    editUpdate(index) {
        this.currentEditIndex = index;
        this.openUpdateModal(this.updates[index]);
    }

    async deleteUpdate(index) {
        if (!confirm('Are you sure you want to delete this update? This action cannot be undone.')) {
            return;
        }

        try {
            this.updates.splice(index, 1);
            await this.saveUpdates();
            this.displayUpdates();
            alert('Update deleted successfully!');
        } catch (error) {
            console.error('Error deleting update:', error);
            alert('Error deleting update. Please try again.');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
        
        // Reset form
        const form = document.getElementById('update-form');
        if (form) {
            form.reset();
        }
        
        this.currentEditIndex = null;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Utility methods for external access
    getUpdatesCount() {
        return this.updates.length;
    }

    getRecentUpdates(limit = 5) {
        return this.updates.slice(0, limit);
    }
}

// Initialize Content Editor
const contentEditor = new ContentEditor();

// Global functions
function addUpdate() {
    contentEditor.showAddUpdateModal();
}

// Add CSS for update items
const updateStyles = `
.update-item {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s ease;
}

.update-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.update-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.update-header h3 {
    color: #2c3e50;
    margin: 0;
    flex: 1;
}

.update-date {
    color: #6c757d;
    font-size: 0.875rem;
    white-space: nowrap;
    margin-left: 1rem;
}

.update-content {
    color: #343a40;
    line-height: 1.6;
}

.update-actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
}

.empty-state {
    text-align: center;
    padding: 3rem 2rem;
    color: #6c757d;
}

.empty-state h3 {
    margin-bottom: 0.5rem;
    color: #343a40;
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
}

@media (max-width: 768px) {
    .update-header {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .update-date {
        margin-left: 0;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .form-actions button {
        width: 100%;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = updateStyles;
document.head.appendChild(styleSheet);

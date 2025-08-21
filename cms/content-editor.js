// SAGE Club CMS - Content Editor for Updates

class ContentEditor {
    constructor() {
        this.updates = [];
        this.currentEditIndex = -1;
        this.init();
    }

    init() {
        this.setupEditor();
        this.loadUpdates();
    }

    setupEditor() {
        // Create rich text editor container
        const editorContainer = document.createElement('div');
        editorContainer.id = 'content-editor';
        editorContainer.className = 'hidden';
        editorContainer.innerHTML = `
            <div class="editor-header">
                <h3>Content Editor</h3>
                <button class="btn btn-secondary" onclick="contentEditor.closeEditor()">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
            <div class="editor-body">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" id="update-title" placeholder="Update title..." required>
                </div>
                <div class="form-group">
                    <label>Date</label>
                    <input type="date" id="update-date" required>
                </div>
                <div class="form-group">
                    <label>Content</label>
                    <div id="editor-toolbar">
                        <button type="button" onclick="contentEditor.formatText('bold')">
                            <i class="fas fa-bold"></i>
                        </button>
                        <button type="button" onclick="contentEditor.formatText('italic')">
                            <i class="fas fa-italic"></i>
                        </button>
                        <button type="button" onclick="contentEditor.formatText('underline')">
                            <i class="fas fa-underline"></i>
                        </button>
                        <button type="button" onclick="contentEditor.insertList('ul')">
                            <i class="fas fa-list-ul"></i>
                        </button>
                        <button type="button" onclick="contentEditor.insertList('ol')">
                            <i class="fas fa-list-ol"></i>
                        </button>
                        <button type="button" onclick="contentEditor.insertLink()">
                            <i class="fas fa-link"></i>
                        </button>
                    </div>
                    <div id="editor-content" contenteditable="true" class="editor-content"></div>
                </div>
                <div class="editor-actions">
                    <button class="btn btn-primary" onclick="contentEditor.saveUpdate()">
                        <i class="fas fa-save"></i> Save Update
                    </button>
                    <button class="btn btn-secondary" onclick="contentEditor.previewUpdate()">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                </div>
            </div>
            <div id="editor-preview" class="hidden">
                <h4>Preview</h4>
                <div id="preview-content"></div>
            </div>
        `;
        
        document.body.appendChild(editorContainer);
        
        // Set today's date as default
        document.getElementById('update-date').value = new Date().toISOString().split('T')[0];
    }

    async loadUpdates() {
        try {
            const response = await fetch('../UPDATES/updates.json');
            if (response.ok) {
                const data = await response.json();
                this.updates = data.updates || [];
            }
        } catch (error) {
            console.log('Using sample updates');
            this.updates = [
                {
                    title: "Welcome to our new CMS!",
                    date: new Date().toISOString().split('T')[0],
                    content: "Our new content management system is now live."
                }
            ];
        }
    }

    addUpdate() {
        this.currentEditIndex = -1;
        this.openEditor();
    }

    editUpdate(index) {
        this.currentEditIndex = index;
        const update = this.updates[index];
        
        document.getElementById('update-title').value = update.title;
        document.getElementById('update-date').value = update.date;
        document.getElementById('editor-content').innerHTML = this.htmlToContent(update.content);
        
        this.openEditor();
    }

    deleteUpdate(index) {
        if (confirm('Are you sure you want to delete this update?')) {
            this.updates.splice(index, 1);
            this.saveUpdates();
            this.refreshUpdatesList();
        }
    }

    openEditor() {
        document.getElementById('content-editor').classList.remove('hidden');
    }

    closeEditor() {
        document.getElementById('content-editor').classList.add('hidden');
        this.clearEditor();
    }

    clearEditor() {
        document.getElementById('update-title').value = '';
        document.getElementById('update-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('editor-content').innerHTML = '';
        document.getElementById('editor-preview').classList.add('hidden');
    }

    formatText(command) {
        document.execCommand(command, false, null);
        document.getElementById('editor-content').focus();
    }

    insertList(type) {
        const listType = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList';
        document.execCommand(listType, false, null);
    }

    insertLink() {
        const url = prompt('Enter URL:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    }

    previewUpdate() {
        const title = document.getElementById('update-title').value;
        const date = document.getElementById('update-date').value;
        const content = document.getElementById('editor-content').innerHTML;
        
        const preview = document.getElementById('preview-content');
        preview.innerHTML = `
            <h3>${title}</h3>
            <p class="date">${new Date(date).toLocaleDateString()}</p>
            <div class="content">${content}</div>
        `;
        
        document.getElementById('editor-preview').classList.remove('hidden');
    }

    saveUpdate() {
        const title = document.getElementById('update-title').value.trim();
        const date = document.getElementById('update-date').value;
        const content = this.contentToHtml(document.getElementById('editor-content').innerHTML);
        
        if (!title || !date || !content) {
            alert('Please fill in all fields');
            return;
        }
        
        const update = {
            title,
            date,
            content: this.stripHtml(content)
        };
        
        if (this.currentEditIndex >= 0) {
            this.updates[this.currentEditIndex] = update;
        } else {
            this.updates.unshift(update);
        }
        
        this.saveUpdates();
        this.closeEditor();
        this.refreshUpdatesList();
    }

    contentToHtml(content) {
        // Clean up content for storage
        return content
            .replace(/<div>/g, '\n')
            .replace(/<\/div>/g, '')
            .replace(/<br>/g, '\n')
            .trim();
    }

    htmlToContent(html) {
        // Convert plain text to HTML for editor
        return html
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    stripHtml(html) {
        // Remove HTML tags for plain text storage
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    async saveUpdates() {
        const updatesData = {
            updates: this.updates
        };
        
        // Generate JSON file content
        const jsonContent = JSON.stringify(updatesData, null, 2);
        
        // Create download link for updates.json
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create instructions for manual upload
        const instructions = `
            <h3>Save Updates to Repository</h3>
            <p>To save your changes to the repository:</p>
            <ol>
                <li>Download the updated <strong>updates.json</strong> file below</li>
                <li>Replace the existing file in your <strong>UPDATES/</strong> folder</li>
                <li>Commit and push the changes to GitHub</li>
                <li>Wait 2-3 minutes for GitHub Pages to update</li>
            </ol>
            <a href="${url}" download="updates.json" class="btn btn-primary">
                <i class="fas fa-download"></i> Download updates.json
            </a>
        `;
        
        this.showInstructionsModal(instructions);
    }

    showInstructionsModal(instructions) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.remove()">&times;</span>
                ${instructions}
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    refreshUpdatesList() {
        // Refresh the updates list in the dashboard
        if (window.cms) {
            window.cms.loadUpdates();
        }
    }
}

// Initialize Content Editor
const contentEditor = new ContentEditor();

// Global functions for updates
function addUpdate() {
    contentEditor.addUpdate();
}

// CSS for content editor
const editorStyles = `
<style>
#content-editor {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 3000;
    display: flex;
    flex-direction: column;
}

.editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--light-gray);
}

.editor-body {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--secondary-color);
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 1rem;
}

#editor-toolbar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
}

#editor-toolbar button {
    padding: 0.5rem;
    border: none;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: var(--transition);
}

#editor-toolbar button:hover {
    background: var(--primary-color);
    color: white;
}

.editor-content {
    min-height: 200px;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 1rem;
    line-height: 1.6;
}

.editor-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

#editor-preview {
    margin-top: 2rem;
    padding: 1.5rem;
    background: var(--light-gray);
    border-radius: var(--border-radius);
}

#editor-preview h4 {
    margin-bottom: 1rem;
    color: var(--secondary-color);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', editorStyles);

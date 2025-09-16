// SAGE Club CMS Authentication and GitHub API Integration

class CMSAuth {
    constructor() {
        this.token = null;
        this.config = null;
        this.baseURL = 'https://api.github.com';
        this.init();
    }

    init() {
        this.loadConfig();
        this.loadToken();
    }

    loadConfig() {
        const savedConfig = localStorage.getItem('cms-config');
        if (savedConfig) {
            this.config = JSON.parse(savedConfig);
        } else {
            // Default config
            this.config = {
                owner: 'xaxela',
                repo: 'myweb',
                branch: 'main'
            };
        }
    }

    loadToken() {
        this.token = sessionStorage.getItem('github-token');
    }

    setToken(token) {
        this.token = token;
        sessionStorage.setItem('github-token', token);
    }

    isAuthenticated() {
        return this.token && this.config;
    }

    async makeAPIRequest(endpoint, options = {}) {
        if (!this.isAuthenticated()) {
            throw new Error('Not authenticated. Please set GitHub token in settings.');
        }

        const url = `${this.baseURL}/repos/${this.config.owner}/${this.config.repo}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(url, { ...defaultOptions, ...options });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`GitHub API Error: ${response.status} - ${error.message}`);
        }

        return response.json();
    }

    async getLatestCommit() {
        const commits = await this.makeAPIRequest(`/commits?per_page=1`);
        return commits[0];
    }

    async getFileContent(path) {
        try {
            const response = await this.makeAPIRequest(`/contents/${path}`);
            return response;
        } catch (error) {
            if (error.message.includes('404')) {
                return null; // File doesn't exist
            }
            throw error;
        }
    }

    async createBlob(content, encoding = 'base64') {
        const response = await this.makeAPIRequest('/git/blobs', {
            method: 'POST',
            body: JSON.stringify({
                content: content,
                encoding: encoding
            })
        });
        return response.sha;
    }

    async createTree(baseTreeSha, changes) {
        const tree = changes.map(change => ({
            path: change.path,
            mode: '100644', // blob
            type: 'blob',
            sha: change.sha
        }));

        const response = await this.makeAPIRequest('/git/trees', {
            method: 'POST',
            body: JSON.stringify({
                base_tree: baseTreeSha,
                tree: tree
            })
        });
        return response.sha;
    }

    async createCommit(message, treeSha, parentSha) {
        const response = await this.makeAPIRequest('/git/commits', {
            method: 'POST',
            body: JSON.stringify({
                message: message,
                tree: treeSha,
                parents: [parentSha]
            })
        });
        return response.sha;
    }

    async updateReference(ref, sha) {
        await this.makeAPIRequest(`/git/refs/${ref}`, {
            method: 'PATCH',
            body: JSON.stringify({
                sha: sha
            })
        });
    }

    async commitChanges(changes, message) {
        try {
            // Get latest commit
            const latestCommit = await this.getLatestCommit();
            const baseTreeSha = latestCommit.commit.tree.sha;

            // Create blobs for new files
            const blobPromises = changes.map(async (change) => {
                const sha = await this.createBlob(change.content, change.encoding || 'base64');
                return {
                    path: change.path,
                    sha: sha
                };
            });

            const blobs = await Promise.all(blobPromises);

            // Create new tree
            const newTreeSha = await this.createTree(baseTreeSha, blobs);

            // Create commit
            const newCommitSha = await this.createCommit(message, newTreeSha, latestCommit.sha);

            // Update branch reference
            await this.updateReference(`heads/${this.config.branch}`, newCommitSha);

            return newCommitSha;
        } catch (error) {
            console.error('Commit error:', error);
            throw new Error(`Failed to commit changes: ${error.message}`);
        }
    }

    async uploadFile(path, content, message = 'Upload file via CMS') {
        const changes = [{
            path: path,
            content: content,
            encoding: 'base64'
        }];

        return await this.commitChanges(changes, message);
    }

    async updateJSONFile(path, data, message = 'Update JSON file via CMS') {
        const jsonContent = btoa(JSON.stringify(data, null, 2));
        return await this.uploadFile(path, jsonContent, message);
    }
}

// Initialize authentication
const cmsAuth = new CMSAuth();

// Export for global access
window.cmsAuth = cmsAuth;

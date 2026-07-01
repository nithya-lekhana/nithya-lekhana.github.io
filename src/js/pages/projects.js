import { fetchRepositories, fetchReadme } from '../services/githubService.js';
import { createProjectCardHTML } from '../ui/projectCard.js';

let allProjects = [];

const renderSkeleton = (container, count = 6) => {
    container.innerHTML = Array(count).fill(`
        <div class="feature-card" style="padding: 32px; height: 350px; display: flex; flex-direction: column; gap: 16px; opacity: 0.7; animation: pulse 1.5s infinite;">
            <div style="background: var(--border); height: 48px; width: 48px; border-radius: 50%;"></div>
            <div style="background: var(--border); height: 24px; width: 60%; border-radius: 4px;"></div>
            <div style="background: var(--border); height: 16px; width: 100%; border-radius: 4px;"></div>
            <div style="background: var(--border); height: 16px; width: 80%; border-radius: 4px;"></div>
            <div style="margin-top: auto; display: flex; gap: 8px;">
                <div style="background: var(--border); height: 36px; flex-grow: 1; border-radius: 4px;"></div>
                <div style="background: var(--border); height: 36px; flex-grow: 1; border-radius: 4px;"></div>
            </div>
        </div>
    `).join('');
};

const renderProjects = (projects) => {
    const container = document.getElementById('projects-grid');
    const countDisplay = document.getElementById('projects-count');
    
    if (countDisplay) {
        countDisplay.textContent = `Showing ${projects.length} project${projects.length !== 1 ? 's' : ''}`;
    }

    if (projects.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 64px; background: var(--bg-white); border-radius: var(--radius-lg); box-shadow: var(--clay-shadow-inset);">
                <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
                <h3>No projects found</h3>
                <p style="color: var(--text-muted);">Try adjusting your search or filters.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = projects.map(repo => createProjectCardHTML(repo)).join('');
    bindDetailsButtons();
};

const bindDetailsButtons = () => {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    
    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', async (e) => {
            const repoName = e.target.getAttribute('data-repo');
            if (!repoName) return;

            // Show modal and loading state
            modal.style.display = 'flex';
            modalContent.innerHTML = '<div style="text-align: center; padding: 40px; font-size: 1.25rem;">Loading README...</div>';
            
            const markdown = await fetchReadme(repoName);
            
            if (markdown) {
                // Check if marked is available (CDN script)
                if (typeof marked !== 'undefined') {
                    modalContent.innerHTML = marked.parse(markdown);
                } else {
                    // Fallback if marked didn't load
                    modalContent.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word; font-family: monospace;">${markdown}</pre>`;
                }
                
                // Add some basic styling to parsed markdown inside the modal
                const styleBlocks = `
                    <style>
                        #modal-content img { max-width: 100%; height: auto; border-radius: var(--radius-sm); margin-bottom: 16px; }
                        #modal-content h1, #modal-content h2, #modal-content h3 { margin-top: 24px; margin-bottom: 16px; color: var(--primary); }
                        #modal-content a { color: var(--primary); text-decoration: underline; }
                        #modal-content pre { background: var(--bg-main); padding: 16px; border-radius: var(--radius-sm); overflow-x: auto; margin-bottom: 16px; }
                        #modal-content code { background: var(--bg-main); padding: 2px 6px; border-radius: 4px; font-family: monospace; }
                        #modal-content ul, #modal-content ol { margin-left: 24px; margin-bottom: 16px; }
                        #modal-content blockquote { border-left: 4px solid var(--primary); padding-left: 16px; color: var(--text-muted); margin-bottom: 16px; }
                    </style>
                `;
                modalContent.innerHTML = styleBlocks + modalContent.innerHTML;

            } else {
                modalContent.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 3rem; margin-bottom: 16px;">📄</div>
                        <h3 style="color: var(--text-dark);">No README found</h3>
                        <p style="color: var(--text-muted);">This repository does not have a README file.</p>
                    </div>
                `;
            }
        });
    });
};

const handleSearchAndFilter = () => {
    const searchInput = document.getElementById('search-input')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('type-filter')?.value || 'all';

    const filtered = allProjects.filter(repo => {
        // Search matching
        const matchesSearch = 
            (repo.name && repo.name.toLowerCase().includes(searchInput)) ||
            (repo.description && repo.description.toLowerCase().includes(searchInput)) ||
            (repo.language && repo.language.toLowerCase().includes(searchInput));
        
        // Type matching
        const matchesType = typeFilter === 'all' || repo.projectType === typeFilter;

        return matchesSearch && matchesType;
    });

    renderProjects(filtered);
};

const init = async () => {
    const gridContainer = document.getElementById('projects-grid');
    if (!gridContainer) return;

    renderSkeleton(gridContainer);

    // Fetch data
    allProjects = await fetchRepositories(false); // don't include forks
    renderProjects(allProjects);

    // Bind event listeners
    const searchInput = document.getElementById('search-input');
    const typeFilter = document.getElementById('type-filter');

    if (searchInput) searchInput.addEventListener('input', handleSearchAndFilter);
    if (typeFilter) typeFilter.addEventListener('change', handleSearchAndFilter);

    // Modal Close Logic
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close on outside click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
};

// Add pulse animation for skeleton loading
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { opacity: 0.5; }
        50% { opacity: 0.8; }
        100% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);

// Run init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

/**
 * Generates the HTML string for a Project Card in Claymorphism style.
 */

const getLanguageIcon = (lang) => {
    // Simple mapping for visual flair
    const icons = {
        'javascript': 'JS',
        'python': 'Py',
        'html': 'HTML',
        'css': 'CSS',
        'java': 'Java',
        'c': 'C'
    };
    return icons[lang?.toLowerCase()] || '📁';
};

export const createProjectCardHTML = (repo) => {
    // Badges for tech stack
    const badgesHtml = repo.techStack.map(tech => 
        `<span class="badge" style="background: var(--bg-white); color: var(--text-dark); padding: 4px 8px; font-size: 0.8rem; margin-right: 4px; margin-bottom: 4px; display: inline-block;">${tech}</span>`
    ).join('');

    const homepageHtml = repo.homepage 
        ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.9rem;">Live Demo</a>` 
        : '';

    const lastUpdated = new Date(repo.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    return `
        <div class="feature-card" style="display: flex; flex-direction: column; height: 100%; text-align: left; padding: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div class="feature-icon" style="margin: 0; width: 48px; height: 48px; font-size: 1.5rem; display: flex; align-items: center; justify-content: center;">
                    ${getLanguageIcon(repo.language)}
                </div>
                <div style="text-align: right;">
                    <span style="font-size: 0.85rem; color: var(--text-muted); display: block;">${repo.projectType}</span>
                    <span style="font-size: 0.85rem; color: var(--text-muted);">⭐ ${repo.stargazers_count}</span>
                </div>
            </div>
            
            <h3 style="margin-bottom: 12px; font-size: 1.25rem;">
                <a href="${repo.html_url}" target="_blank" style="color: var(--primary); text-decoration: none;">${repo.name}</a>
            </h3>
            
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px; flex-grow: 1; line-height: 1.6;">
                ${repo.description || 'No description provided.'}
            </p>
            
            <div style="margin-bottom: 24px; min-height: 28px;">
                ${badgesHtml}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 16px; margin-bottom: 16px;">
                <span style="font-size: 0.85rem; color: var(--text-muted);">Updated: ${lastUpdated}</span>
                <span style="font-size: 0.85rem; color: var(--text-muted);">${repo.language || 'Mixed'}</span>
            </div>
            
            <div style="display: flex; gap: 12px; margin-top: auto;">
                ${homepageHtml}
                <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.9rem; flex-grow: 1; text-align: center;">Code</a>
                <button class="btn btn-primary btn-details" data-repo="${repo.name}" style="padding: 8px 16px; font-size: 0.9rem; flex-grow: 1;">Details</button>
            </div>
        </div>
    `;
};

/**
 * UI Renderer for Skills & Certifications Page
 */

const getProgressBarHTML = (progress) => {
    // Generate a simple text-based progress bar (e.g. ████████░░)
    const totalBlocks = 10;
    const filledBlocks = Math.round((progress / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    
    const filledStr = '█'.repeat(filledBlocks);
    const emptyStr = '░'.repeat(emptyBlocks);
    
    return `<span style="font-family: monospace; color: var(--primary); font-size: 1.1rem; letter-spacing: 2px;">${filledStr}<span style="opacity: 0.3;">${emptyStr}</span></span>`;
};

export const renderSkillCategory = (category) => {
    const skillsHtml = category.skills.map(skill => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border);">
            <div style="flex: 1;">
                <strong style="color: var(--text-dark); display: block; font-size: 1.1rem; margin-bottom: 4px;">${skill.name}</strong>
                <span style="color: var(--text-muted); font-size: 0.85rem;">${skill.level}</span>
            </div>
            <div style="text-align: right;">
                ${getProgressBarHTML(skill.progress)}
            </div>
        </div>
    `).join('');

    return `
        <div class="feature-card" style="background: var(--bg-white); border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--clay-shadow-inset);">
            <h3 style="color: var(--primary); margin-bottom: 24px; border-bottom: 2px solid var(--border); padding-bottom: 8px;">${category.name}</h3>
            <div style="display: flex; flex-direction: column;">
                ${skillsHtml}
            </div>
        </div>
    `;
};

export const renderCertificate = (cert) => {
    return `
        <div class="feature-card" style="background: var(--bg-white); border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--clay-shadow-inset); text-align: left; display: flex; flex-direction: column; height: 100%;">
            <div style="font-size: 2.5rem; margin-bottom: 16px;">🎓</div>
            <h3 style="color: var(--primary); margin-bottom: 8px; font-size: 1.25rem;">${cert.title}</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px;">Provider: <strong>${cert.provider}</strong> | ${cert.date}</p>
            
            <div style="margin-bottom: 24px; flex-grow: 1;">
                <p style="color: var(--text-dark); font-size: 0.9rem; margin-bottom: 8px;">Skills Learned:</p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${cert.skills.map(skill => `<span class="badge" style="background: var(--bg-main); color: var(--text-dark); padding: 4px 8px; font-size: 0.8rem;">${skill}</span>`).join('')}
                </div>
            </div>

            <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">
                Credential ID: ${cert.credentialId}
            </div>
            
            <a href="${cert.url}" target="_blank" rel="noopener" class="btn btn-secondary" style="text-align: center; display: block; padding: 12px;">View Certificate</a>
        </div>
    `;
};

export const renderRoadmapTimeline = (timeline) => {
    return timeline.map((item, index) => `
        <div style="display: flex; gap: 24px; position: relative;">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="background: var(--primary); color: white; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; z-index: 1;">
                    ${item.year.slice(-2)}
                </div>
                ${index !== timeline.length - 1 ? '<div style="width: 2px; flex-grow: 1; background: var(--border); margin: 8px 0;"></div>' : ''}
            </div>
            <div style="padding-bottom: 32px; padding-top: 8px;">
                <h4 style="margin-bottom: 8px; font-size: 1.1rem; color: var(--text-dark);">${item.title}</h4>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${item.description}</p>
            </div>
        </div>
    `).join('');
};

export const renderGitHubStats = (stats) => {
    if (!stats) return '<p>Could not load GitHub stats.</p>';

    return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 24px; text-align: center;">
            <div style="background: var(--bg-main); padding: 24px; border-radius: var(--radius-md);">
                <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 8px;">${stats.public_repos || 0}</div>
                <div style="color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Repositories</div>
            </div>
            <div style="background: var(--bg-main); padding: 24px; border-radius: var(--radius-md);">
                <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 8px;">${stats.followers || 0}</div>
                <div style="color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Followers</div>
            </div>
            <div style="background: var(--bg-main); padding: 24px; border-radius: var(--radius-md);">
                <div style="font-size: 2.5rem; font-weight: 700; color: var(--primary); margin-bottom: 8px;">${stats.following || 0}</div>
                <div style="color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Following</div>
            </div>
        </div>
    `;
};

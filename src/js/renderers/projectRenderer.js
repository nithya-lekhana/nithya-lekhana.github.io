export const renderProjects = (projects) => {
    if (!projects || projects.length === 0) return '';
    return projects.map(p => \`
        <div class="project-card clay-card">
            <h3>\${p.name}</h3>
            <p>\${p.description || 'A software engineering project.'}</p>
            <div class="project-meta">
                <span class="lang">\${p.language || 'Code'}</span>
                <span class="stars">⭐ \${p.stargazers_count}</span>
            </div>
            <a href="\${p.html_url}" target="_blank" class="btn btn-sm">View Project &rarr;</a>
        </div>
    \`).join('');
};

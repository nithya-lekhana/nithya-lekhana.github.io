import { GithubService } from '../services/githubService.js';

import { renderProjects } from '../renderers/projectRenderer.js';

async function initDashboard() {
    const githubService = new GithubService('nithya-lekhana');
    
    // Developer Dashboard Stats
    const repoCountElement = document.getElementById('gh-repo-count');
    if (repoCountElement) {
        githubService.getDashboardMetrics().then(stats => {
            if (stats && stats.repos) {
                repoCountElement.textContent = stats.repos;
            }
        });
    }
    
    // Latest Repo
    const latestRepoContainer = document.getElementById('latestRepoContainer');
    if (latestRepoContainer) {
        githubService.getLatestRepo().then(repo => {
            if (repo) {
                const date = new Date(repo.pushed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                latestRepoContainer.innerHTML = `
                    <a href="${repo.html_url}" target="_blank" class="clay-card" style="display: block; text-decoration: none; padding: 40px; transition: all 0.3s; position: relative; overflow: hidden; background: linear-gradient(135deg, white, rgba(241, 245, 249, 0.5)); border: 1px solid rgba(112, 71, 235, 0.2);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 16px;">
                            <h3 style="color: var(--primary); font-size: 1.8rem; margin: 0; display: flex; align-items: center; gap: 12px; font-weight: 800;">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                                ${repo.name}
                            </h3>
                            <span style="background: rgba(112, 71, 235, 0.1); color: var(--primary); padding: 6px 16px; border-radius: 20px; font-size: 0.9rem; font-weight: 700;">Latest Push</span>
                        </div>
                        <p style="color: var(--text-dark); font-size: 1.15rem; line-height: 1.6; margin-bottom: 24px;">${repo.description || 'No description provided.'}</p>
                        <div style="display: flex; gap: 24px; color: var(--text-muted); font-size: 1rem; font-weight: 500; flex-wrap: wrap;">
                            ${repo.language ? `<span style="display: flex; align-items: center; gap: 8px;"><span style="width: 12px; height: 12px; border-radius: 50%; background: var(--primary);"></span>${repo.language}</span>` : ''}
                            <span style="display: flex; align-items: center; gap: 8px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Updated on ${date}
                            </span>
                        </div>
                    </a>
                `;
            } else {
                latestRepoContainer.innerHTML = \`<div class="clay-card" style="text-align: center; padding: 48px;"><p style="color: var(--text-muted);">Could not load latest repository.</p></div>\`;
            }
        });
    }

    // Featured Projects
    const projectsContainer = document.getElementById('featuredProjectsContainer');
    if (projectsContainer) {
        githubService.getFeaturedProjects().then(projects => {
            if (projects) {
                projectsContainer.innerHTML = renderProjects(projects);
            }
        });
    }
}

function setupTypewriter() {
    const titles = [
        "Computer Science Engineering Student",
        "Software Engineer",
        "Full-Stack Developer",
        "AI & Machine Learning Enthusiast",
        "Problem Solver"
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');

    function type() {
        if (!typewriterElement) return;
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentTitle.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 500; // Pause before typing next
        }

        setTimeout(type, typeSpeed);
    }
    
    if (typewriterElement) {
        setTimeout(type, 1000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initDashboard();
        setupTypewriter();
    });
} else {
    initDashboard();
    setupTypewriter();
}

import { fetchUserStats } from '../services/githubService.js';
import { 
    renderSkillCategory, 
    renderCertificate, 
    renderRoadmapTimeline, 
    renderGitHubStats 
} from '../ui/skillsRenderer.js';

const loadLocalData = async (path) => {
    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Could not load ${path}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

const initSkillsPage = async () => {
    // 1. Load Data
    const [skillsData, certsData, roadmapData, githubStats] = await Promise.all([
        loadLocalData('src/data/skills.json'),
        loadLocalData('src/data/certifications.json'),
        loadLocalData('src/data/roadmap.json'),
        fetchUserStats()
    ]);

    // 2. Render Technical Skills
    if (skillsData && skillsData.categories) {
        const skillsGrid = document.getElementById('technical-skills-grid');
        if (skillsGrid) {
            skillsGrid.innerHTML = skillsData.categories
                .map(category => renderSkillCategory(category))
                .join('');
        }
    }

    // 3. Render GitHub Stats
    if (githubStats) {
        const statsContainer = document.getElementById('github-stats-container');
        if (statsContainer) {
            statsContainer.innerHTML = renderGitHubStats(githubStats);
        }
    }

    // 4. Render Certifications
    if (certsData && Array.isArray(certsData)) {
        const certsGrid = document.getElementById('certifications-grid');
        if (certsGrid) {
            certsGrid.innerHTML = certsData
                .map(cert => renderCertificate(cert))
                .join('');
        }
    }

    // 5. Render Roadmap
    if (roadmapData && roadmapData.timeline) {
        const timelineContainer = document.getElementById('roadmap-timeline');
        if (timelineContainer) {
            timelineContainer.innerHTML = renderRoadmapTimeline(roadmapData.timeline);
        }

        const futureContainer = document.getElementById('future-goals-list');
        if (futureContainer && roadmapData.futureGoals) {
            futureContainer.innerHTML = roadmapData.futureGoals
                .map(goal => `<span class="badge" style="background: var(--bg-white); color: var(--primary); padding: 8px 16px; font-size: 1rem; box-shadow: var(--clay-shadow-inset);">🎯 ${goal}</span>`)
                .join('');
        }
    }

    // 6. Render Quick Lists (Soft Skills, Languages, Currently Learning)
    if (skillsData) {
        const renderList = (id, items) => {
            const el = document.getElementById(id);
            if (el && items) {
                el.innerHTML = items.map(item => `<span class="badge" style="background: var(--bg-white); color: var(--text-dark); padding: 8px 16px; margin: 4px;">${item}</span>`).join('');
            }
        };

        renderList('soft-skills-list', skillsData.softSkills);
        renderList('languages-list', skillsData.languages);
        renderList('currently-learning-list', skillsData.currentlyLearning);
    }
};

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', initSkillsPage);

// Mega Footer Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    initGithubStats();
});

function initThemeManager() {
    const root = document.documentElement;
    
    // Load saved preferences
    const savedTheme = localStorage.getItem('mf-theme') || 'system';
    const savedColor = localStorage.getItem('mf-color') || 'purple';
    
    applyTheme(savedTheme);
    applyColor(savedColor);
    
    // Setup listeners
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const theme = e.currentTarget.dataset.theme;
            applyTheme(theme);
        });
    });
    
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const color = e.currentTarget.dataset.color;
            applyColor(color);
        });
    });
    
    function applyTheme(theme) {
        localStorage.setItem('mf-theme', theme);
        
        document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
        const btn = document.querySelector(`.theme-btn[data-theme="${theme}"]`);
        if (btn) btn.classList.add('active');
        
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            root.setAttribute('data-theme', theme);
        }
    }
    
    function applyColor(color) {
        localStorage.setItem('mf-color', color);
        
        document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
        const btn = document.querySelector(`.color-btn[data-color="${color}"]`);
        if (btn) btn.classList.add('active');
        
        root.setAttribute('data-accent', color);
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (localStorage.getItem('mf-theme') === 'system') {
            root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

async function initGithubStats() {
    const username = 'nithya-lekhana';
    const cacheKey = `gh_stats_${username}`;
    
    // Try cache first
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
        renderGithubStats(JSON.parse(cached));
        return;
    }
    
    try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        
        if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API Error");
        
        const userData = await userRes.json();
        const reposData = await reposRes.json();
        
        let totalStars = 0;
        let languages = new Set();
        
        reposData.forEach(repo => {
            totalStars += repo.stargazers_count;
            if (repo.language) languages.add(repo.language);
        });
        
        const stats = {
            repos: userData.public_repos,
            followers: userData.followers,
            stars: totalStars,
            langs: languages.size,
            latestUpdate: reposData.sort((a,b) => new Date(b.pushed_at) - new Date(a.pushed_at))[0]
        };
        
        sessionStorage.setItem(cacheKey, JSON.stringify(stats));
        renderGithubStats(stats);
        
    } catch (e) {
        console.error("Failed to fetch GitHub stats:", e);
    }
}

function renderGithubStats(stats) {
    const reposEl = document.getElementById('gh-stat-repos');
    const starsEl = document.getElementById('gh-stat-stars');
    const followersEl = document.getElementById('gh-stat-followers');
    const langsEl = document.getElementById('gh-stat-langs');
    const activityEl = document.getElementById('gh-activity-text');
    
    if (reposEl) reposEl.textContent = stats.repos;
    if (starsEl) starsEl.textContent = stats.stars;
    if (followersEl) followersEl.textContent = stats.followers;
    if (langsEl) langsEl.textContent = stats.langs;
    
    if (activityEl && stats.latestUpdate) {
        const timeAgo = getTimeAgo(new Date(stats.latestUpdate.pushed_at));
        activityEl.innerHTML = `Pushed to <strong>${stats.latestUpdate.name}</strong> ${timeAgo}`;
    }
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

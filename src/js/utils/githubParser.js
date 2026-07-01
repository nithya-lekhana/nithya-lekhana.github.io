/**
 * Utility for parsing and enriching GitHub repository data.
 */

export const parseTechStack = (repo) => {
    const techStack = new Set();
    
    // 1. Add primary language
    if (repo.language) {
        techStack.add(repo.language);
    }
    
    // 2. Map known topics to tech stack friendly names
    const topicMap = {
        'reactjs': 'React',
        'react': 'React',
        'nodejs': 'Node.js',
        'node': 'Node.js',
        'expressjs': 'Express',
        'express': 'Express',
        'machine-learning': 'Machine Learning',
        'ai': 'AI',
        'tailwindcss': 'Tailwind CSS',
        'tailwind': 'Tailwind CSS',
        'mongodb': 'MongoDB',
        'python3': 'Python',
        'html5': 'HTML',
        'css3': 'CSS'
    };

    if (repo.topics && Array.isArray(repo.topics)) {
        repo.topics.forEach(topic => {
            const normalized = topicMap[topic.toLowerCase()] || topic;
            // Filter out generic topics if they aren't tech specific, 
            // but for simplicity we'll add them and capitalize them if they weren't mapped.
            if (!topicMap[topic.toLowerCase()]) {
                // simple capitalize
                const cap = topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' ');
                techStack.add(cap);
            } else {
                techStack.add(normalized);
            }
        });
    }

    // Convert Set to Array and return up to 5 main techs for display
    return Array.from(techStack).slice(0, 5);
};

export const calculateRepoScore = (repo) => {
    let score = 0;
    
    // Stars are heavily weighted
    score += (repo.stargazers_count || 0) * 10;
    
    // Forks show engagement
    score += (repo.forks_count || 0) * 5;
    
    // Has homepage / live demo
    if (repo.homepage && repo.homepage.trim() !== '') {
        score += 20;
    }
    
    // Has description
    if (repo.description && repo.description.trim() !== '') {
        score += 10;
    }

    // Is it featured via topics?
    if (repo.topics && repo.topics.includes('portfolio-featured')) {
        score += 50;
    }

    return score;
};

export const determineProjectType = (repo) => {
    if (!repo.topics) return 'Project';
    
    const types = ['portfolio', 'api', 'dashboard', 'library', 'automation', 'cli'];
    for (const t of types) {
        if (repo.topics.includes(t)) {
            return t.charAt(0).toUpperCase() + t.slice(1);
        }
    }
    
    if (repo.homepage) return 'Web App';
    return 'Project';
};

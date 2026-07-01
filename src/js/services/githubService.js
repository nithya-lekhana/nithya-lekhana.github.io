export class GithubService {
    constructor(username) {
        this.username = username;
        this.baseUrl = 'https://api.github.com/users';
        this.cachePrefix = `gh_${username}_`;
        this.cacheExpiry = 60 * 60 * 1000; // 1 hour
    }

    async _fetchWithCache(endpoint, cacheKey) {
        const fullCacheKey = this.cachePrefix + cacheKey;
        const cached = sessionStorage.getItem(fullCacheKey);
        
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < this.cacheExpiry) {
                return data;
            }
        }

        try {
            const response = await fetch(`${this.baseUrl}/${this.username}${endpoint}`);
            if (!response.ok) throw new Error(\`GitHub API Error: \${response.statusText}\`);
            const data = await response.json();
            
            sessionStorage.setItem(fullCacheKey, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
            
            return data;
        } catch (error) {
            console.error('Failed to fetch from GitHub API:', error);
            return null;
        }
    }

    async getUserStats() {
        const data = await this._fetchWithCache('', 'user_stats');
        if (!data) return null;
        return {
            repos: data.public_repos,
            followers: data.followers,
            following: data.following,
            gists: data.public_gists
        };
    }

    async getRepos() {
        return await this._fetchWithCache('/repos?per_page=100&sort=pushed', 'repos');
    }

    async getDashboardMetrics() {
        const stats = await this.getUserStats();
        const repos = await this.getRepos();
        
        if (!stats || !repos) return null;

        let totalStars = 0;
        let languages = new Set();
        let commitsEstimate = stats.repos * 25; // Rough estimate since we can't easily fetch total commits without auth

        repos.forEach(repo => {
            totalStars += repo.stargazers_count;
            if (repo.language) languages.add(repo.language);
        });

        return {
            repos: stats.repos,
            stars: totalStars,
            followers: stats.followers,
            languages: languages.size,
            commits: \`\${commitsEstimate}+\`
        };
    }

    async getFeaturedProjects() {
        const repos = await this.getRepos();
        if (!repos) return [];

        // Sort by stars and prioritize specific repos if needed, fallback to latest pushed
        return repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
    }
}

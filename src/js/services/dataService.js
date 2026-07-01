export class DataService {
    async fetchJson(filename) {
        try {
            const response = await fetch(\`src/data/\${filename}\`);
            if (!response.ok) throw new Error(\`Failed to fetch \${filename}\`);
            return await response.json();
        } catch (error) {
            console.error('DataService Error:', error);
            return null;
        }
    }

    async getFocus() {
        return await this.fetchJson('focus.json');
    }

    async getRoadmap() {
        return await this.fetchJson('roadmap.json');
    }

    async getTimeline() {
        return await this.fetchJson('timeline.json');
    }

    async getBlog() {
        return await this.fetchJson('blog.json');
    }

    async getAchievements() {
        return await this.fetchJson('achievements.json');
    }
}

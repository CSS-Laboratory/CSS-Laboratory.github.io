document.addEventListener('DOMContentLoaded', function() {
    const masterListPath = 'data/blog/blogInfo.csv';
    const postsContainer = document.getElementById('blog-posts-container');

    if (!postsContainer) {
        console.error('Blog posts container not found on the page.');
        return;
    }

    /**
     * A robust CSV parser that handles commas inside quoted fields.
     */
    function parseCSV(text) {
        const lines = text.trim().split('\n');
        const header = lines[0].split(',').map(h => h.trim());
        const rows = [];

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            const row = {};
            // This regex handles commas inside of double-quoted fields.
            const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
            for (let j = 0; j < header.length; j++) {
                if (values[j]) {
                    let value = values[j].trim();
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.substring(1, value.length - 1);
                    }
                    row[header[j]] = value;
                }
            }
            rows.push(row);
        }
        return rows;
    }

    async function fetchBlogPosts() {
        try {
            const response = await fetch(masterListPath);
            if (!response.ok) {
                throw new Error(`Failed to load blog info: ${response.status}`);
            }
            const text = await response.text();
            return parseCSV(text);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            postsContainer.innerHTML = '<p>Could not load blog posts. Please try again later.</p>';
            return null;
        }
    }

    function createPostCard(post) {
        const card = document.createElement('article');
        card.className = 'blog-card';

        const tags = post.tags ? post.tags.split(';').map(tag => `<span class="tag">${tag.trim()}</span>`).join('') : '';

        card.innerHTML = `
            <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="card-link">
                <img src="${post.image}" alt="${post.title}" class="card-image">
                <div class="card-content">
                    <p class="card-date">${post.date}</p>
                    <h3 class="card-title">${post.title}</h3>
                    <p class="card-description">${post.description}</p>
                </div>
            </a>
            <div class="card-footer">
                <div class="card-tags">${tags}</div>
                <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="read-more-btn">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        return card;
    }

    async function loadBlog() {
        const posts = await fetchBlogPosts();
        if (posts) {
            // Sort posts by date, newest first
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            posts.forEach(post => {
                const card = createPostCard(post);
                postsContainer.appendChild(card);
            });
        }
    }

    loadBlog();
});

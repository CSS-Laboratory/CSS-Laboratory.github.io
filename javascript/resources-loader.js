// javascript/resources-loader.js (v5 - Final)

document.addEventListener('DOMContentLoaded', function() {
    const masterListPath = 'data/resources/ResourceInfo.csv';
    const datasetsContainer = document.getElementById('datasets-container');
    const toolsContainer = document.getElementById('tools-container');

    if (!datasetsContainer || !toolsContainer) {
        console.error('Resource containers not found on the page.');
        return;
    }

    /**
     * A robust CSV parser that handles commas inside quoted fields.
     * @param {string} text The raw CSV text.
     * @returns {Array<Object>} An array of objects representing the data.
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
                    // Remove quotes from start and end of the value
                    if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                        value = value.substring(1, value.length - 1);
                    }
                    row[header[j]] = value;
                }
            }
            rows.push(row);
        }
        return rows;
    }

    async function fetchAndParse(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to load: ${response.status}`);
            const text = await response.text();
            if (path.endsWith('.csv')) {
                return parseCSV(text);
            }
            return null;
        } catch (error) {
            console.error(`Error fetching or parsing from ${path}:`, error);
            return null;
        }
    }

    function createResourceCard(resource, cardDetails) {
        const card = document.createElement('div');
        card.className = 'resource-card';

        const imageHtml = resource.image ? `<img src="${resource.image}" alt="${resource.name}" class="resource-icon">` : '<div class="resource-icon-placeholder"></div>';

        let detailsHtml = '<ul class="details-list">';
        // Add details from the specific CSV (e.g., wordfish.csv)
        if (cardDetails) {
            cardDetails.forEach(detail => {
                if (detail.key && detail.value) {
                    detailsHtml += `<li><strong>${detail.key}:</strong> ${detail.value}</li>`;
                }
            });
        }
        
        // **NEW SIMPLIFIED LOGIC FOR SOURCE**
        // Add the source from the main ResourceInfo.csv if it exists
        if (resource.source && resource.source.trim() !== '') {
             detailsHtml += `<li><strong>Source:</strong> ${resource.source}</li>`;
        }
        detailsHtml += '</ul>';

        card.innerHTML = `
            <div class="card-header">
                ${imageHtml}
                <h3>${resource.name}</h3>
            </div>
            <div class="card-body">
                ${detailsHtml}
            </div>
            <div class="card-footer">
                <a href="${resource.link || '#'}" class="btn-details" target="_blank" rel="noopener noreferrer">Access/Request This Resource</a>
            </div>
        `;
        return card;
    }

    async function loadResources() {
        const masterList = await fetchAndParse(masterListPath);
        if (!masterList) {
            datasetsContainer.innerHTML = '<p>Could not load resource information.</p>';
            return;
        }

        for (const resource of masterList) {
            if (!resource || !resource.card_info) continue;

            const cardDetails = await fetchAndParse(resource.card_info);
            const cardElement = createResourceCard(resource, cardDetails);

            if (resource.type && resource.type.toLowerCase() === 'dataset') {
                datasetsContainer.appendChild(cardElement);
            } else if (resource.type && resource.type.toLowerCase() === 'tool') {
                toolsContainer.appendChild(cardElement);
            }
        }
    }

    loadResources();
});
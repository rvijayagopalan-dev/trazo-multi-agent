// ============================================
// TRAZO Search Demo
// ============================================

const searchInput = document.getElementById('searchInput');
const resultsSection = document.getElementById('resultsSection');
const emptyState = document.getElementById('emptyState');
const resultsByType = document.getElementById('resultsByType');
const resultsTitle = document.getElementById('resultsTitle');
const resultsCount = document.getElementById('resultsCount');

// Search results database
const searchDatabase = {
    'customer data': {
        results: [
            { type: 'Data Product', name: 'Customer Master', description: 'Central customer repository with master data', matches: ['customer', 'data'], relevance: 0.98 },
            { type: 'Dataset', name: 'Customer Analytics', description: 'Processed customer analytics and behavior data', matches: ['customer', 'data'], relevance: 0.92 },
            { type: 'Application', name: 'Customer Portal', description: 'Public-facing customer portal application', matches: ['customer'], relevance: 0.85 }
        ]
    },
    'payment systems': {
        results: [
            { type: 'Application', name: 'Payment Gateway', description: 'Primary payment processing system', matches: ['payment', 'systems'], relevance: 0.99 },
            { type: 'API', name: 'Payment API', description: 'REST API for payment processing', matches: ['payment'], relevance: 0.95 },
            { type: 'Process', name: 'Payment Processing', description: 'Business process for handling payments', matches: ['payment'], relevance: 0.90 }
        ]
    },
    'gdpr controls': {
        results: [
            { type: 'Control', name: 'Data Processing Agreement', description: 'Legal control for GDPR compliance', matches: ['gdpr'], relevance: 0.98 },
            { type: 'Policy', name: 'Data Privacy Policy', description: 'Enterprise data privacy policy', matches: ['gdpr'], relevance: 0.92 },
            { type: 'Compliance', name: 'GDPR Compliance Status', description: 'Overall GDPR compliance tracking', matches: ['gdpr'], relevance: 0.88 }
        ]
    },
    'critical applications': {
        results: [
            { type: 'Application', name: 'Payment Gateway', description: 'Critical payment processing system', matches: ['critical', 'applications'], relevance: 0.98 },
            { type: 'Application', name: 'Customer Portal', description: 'Critical customer-facing application', matches: ['critical', 'applications'], relevance: 0.96 },
            { type: 'Application', name: 'Order Management', description: 'High-criticality order processing system', matches: ['critical'], relevance: 0.88 }
        ]
    }
};

// Event listeners
searchInput.addEventListener('input', debounce(performSearch, 300));
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Debounce function
function debounce(func, delay) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };
}

// Main search function
function search(query) {
    searchInput.value = query;
    performSearch();
    searchInput.focus();
}

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
        resultsSection.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    // Check for exact match in database
    let results = [];
    if (searchDatabase[query]) {
        results = searchDatabase[query].results;
    } else {
        // Perform fuzzy search
        results = performFuzzySearch(query);
    }

    if (results.length === 0) {
        displayNoResults(query);
        return;
    }

    // Group results by type
    const groupedResults = groupByType(results);

    // Display results
    emptyState.style.display = 'none';
    resultsSection.style.display = 'block';
    resultsTitle.textContent = `Search Results for "${query}"`;
    resultsCount.innerHTML = `Found <strong>${results.length}</strong> results`;

    displayResults(groupedResults);
}

function performFuzzySearch(query) {
    const allResults = [];

    // Search in applications
    const appResults = mockData.applications.filter(app =>
        app.name.toLowerCase().includes(query) ||
        app.owner.toLowerCase().includes(query)
    ).map(app => ({
        type: 'Application',
        name: app.name,
        description: `Owned by ${app.owner}. Criticality: ${app.criticality}`,
        matches: [query],
        relevance: app.name.toLowerCase().includes(query) ? 0.95 : 0.75
    }));

    // Search in data products
    const dataResults = mockData.dataProducts.filter(data =>
        data.name.toLowerCase().includes(query) ||
        data.owner.toLowerCase().includes(query)
    ).map(data => ({
        type: 'Data Product',
        name: data.name,
        description: `Format: ${data.format}. Consumers: ${data.consumers}`,
        matches: [query],
        relevance: data.name.toLowerCase().includes(query) ? 0.90 : 0.70
    }));

    // Search in APIs
    const apiResults = mockData.apis.filter(api =>
        api.name.toLowerCase().includes(query)
    ).map(api => ({
        type: 'API',
        name: api.name,
        description: `Version ${api.version}. Consumers: ${api.consumers}`,
        matches: [query],
        relevance: 0.85
    }));

    return [...appResults, ...dataResults, ...apiResults].sort((a, b) => b.relevance - a.relevance).slice(0, 10);
}

function groupByType(results) {
    const grouped = {};

    results.forEach(result => {
        if (!grouped[result.type]) {
            grouped[result.type] = [];
        }
        grouped[result.type].push(result);
    });

    return grouped;
}

function displayResults(groupedResults) {
    resultsByType.innerHTML = '';

    Object.entries(groupedResults).forEach(([type, items]) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'result-category';

        let icon = '<i class="fas fa-box"></i>';
        if (type === 'Application') icon = '<i class="fas fa-cube"></i>';
        if (type === 'Data Product') icon = '<i class="fas fa-database"></i>';
        if (type === 'API') icon = '<i class="fas fa-plug"></i>';
        if (type === 'Process') icon = '<i class="fas fa-sitemap"></i>';
        if (type === 'Control') icon = '<i class="fas fa-shield-alt"></i>';
        if (type === 'Compliance') icon = '<i class="fas fa-check-circle"></i>';
        if (type === 'Policy') icon = '<i class="fas fa-file-alt"></i>';

        categoryDiv.innerHTML = `
            <div class="result-category-header">
                ${icon}
                <h3>${type}</h3>
                <span class="count">${items.length}</span>
            </div>
            <div class="result-items"></div>
        `;

        const itemsContainer = categoryDiv.querySelector('.result-items');

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'result-item';
            itemDiv.style.cursor = 'pointer';
            itemDiv.onclick = () => selectResult(item);

            const matchesHtml = item.matches.map(match =>
                `<span class="highlight-text">${match}</span>`
            ).join(' ');

            itemDiv.innerHTML = `
                <p class="result-title">${highlightMatches(item.name, item.matches)}</p>
                <p class="result-description">${item.description}</p>
                <div class="result-meta">
                    <div class="result-meta-item">
                        <i class="fas fa-star"></i>
                        <span>Relevance: ${Math.round(item.relevance * 100)}%</span>
                    </div>
                    <div class="result-meta-item">
                        <i class="fas fa-tag"></i>
                        <span class="result-badge">${type}</span>
                    </div>
                </div>
            `;

            itemsContainer.appendChild(itemDiv);
        });

        resultsByType.appendChild(categoryDiv);
    });
}

function displayNoResults(query) {
    emptyState.style.display = 'block';
    emptyState.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon"><i class="fas fa-search"></i></div>
            <p>No results found for "<strong>${query}</strong>"</p>
            <div class="no-results-suggestions">
                <button class="suggestion-button" onclick="search('customer data')">Customer Data</button>
                <button class="suggestion-button" onclick="search('payment systems')">Payment Systems</button>
                <button class="suggestion-button" onclick="search('critical applications')">Critical Apps</button>
            </div>
        </div>
    `;
    resultsSection.style.display = 'none';
}

function highlightMatches(text, matches) {
    let result = text;
    matches.forEach(match => {
        const regex = new RegExp(`(${match})`, 'gi');
        result = result.replace(regex, '<span class="highlight-text">$1</span>');
    });
    return result;
}

function selectResult(item) {
    showToast(`Selected: ${item.name}`, 'success');
    // Could navigate to detail page here
}

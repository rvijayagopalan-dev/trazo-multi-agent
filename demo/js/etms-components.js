// ============================================
// ETMS Components Demo
// ============================================

const etmsComponents = [
    {
        id: 1,
        name: 'Strategy Management',
        category: 'strategy',
        description: 'Strategic goal definition, OKR management, planning cycles',
        features: ['Goal Management', 'OKR Tracking', 'Strategic Roadmaps', 'Planning Cycles'],
        entities: ['Strategic Goal', 'Objective', 'OKR', 'KPI', 'Initiative'],
        outputs: ['Strategy Map', 'OKR Dashboard', 'Roadmap'],
        owner: 'Chief Strategy Officer'
    },
    {
        id: 2,
        name: 'Portfolio Management',
        category: 'strategy',
        description: 'Investment portfolio management, funding, scenario planning',
        features: ['Portfolio Registry', 'Investment Tracking', 'Budget Allocation', 'Scenario Planning', 'ROI Analysis'],
        entities: ['Portfolio', 'Investment', 'Budget'],
        outputs: ['Portfolio Report', 'Investment Dashboard', 'Funding Plan'],
        owner: 'Chief Financial Officer'
    },
    {
        id: 3,
        name: 'Program Management',
        category: 'execution',
        description: 'Transformation programs, dependency tracking, benefit realization',
        features: ['Program Registry', 'Dependency Management', 'Benefit Tracking', 'Milestone Tracking'],
        entities: ['Program', 'Program Release', 'Milestone', 'Benefit'],
        outputs: ['Program Schedule', 'Dependency Map', 'Benefits Forecast'],
        owner: 'Chief Program Officer'
    },
    {
        id: 4,
        name: 'Project Management',
        category: 'execution',
        description: 'Project execution, scope, schedule, resource, and risk management',
        features: ['Project Registry', 'Scope Management', 'Schedule Management', 'Resource Planning', 'Risk Management'],
        entities: ['Project', 'Workstream', 'Task', 'Resource'],
        outputs: ['Project Plan', 'Risk Register', 'Status Report'],
        owner: 'Program/Project Manager'
    },
    {
        id: 5,
        name: 'Product Management',
        category: 'execution',
        description: 'Product catalog, lifecycle, roadmaps, metrics',
        features: ['Product Catalog', 'Product Lifecycle', 'Roadmaps', 'Metrics', 'Customer Journey Mapping'],
        entities: ['Product', 'Product Version', 'Feature', 'User Story'],
        outputs: ['Product Roadmap', 'Feature Backlog', 'Product Health Dashboard'],
        owner: 'Chief Product Officer'
    },
    {
        id: 6,
        name: 'Business Architecture',
        category: 'architecture',
        description: 'Business capabilities, value streams, processes, customer journeys',
        features: ['Capability Maps', 'Value Streams', 'Process Models', 'Customer Journeys', 'Organization Mapping'],
        entities: ['Capability', 'Value Stream', 'Process', 'Business Service'],
        outputs: ['Capability Model', 'Process Map', 'Organization Chart'],
        owner: 'Chief Architect'
    },
    {
        id: 7,
        name: 'Solution Architecture',
        category: 'architecture',
        description: 'Solution design, architecture decisions, integration patterns',
        features: ['Solution Blueprints', 'Architecture Decisions', 'Integration Maps', 'NFR Tracking', 'Standards'],
        entities: ['Solution', 'Architecture Decision', 'Integration'],
        outputs: ['Solution Design', 'ADR Log', 'Integration Architecture'],
        owner: 'Solution Architect'
    },
    {
        id: 8,
        name: 'Application Architecture',
        category: 'architecture',
        description: 'Application catalog, ownership, lifecycle, technical debt',
        features: ['Application Catalog', 'Ownership Registry', 'Lifecycle Tracking', 'Tech Debt Tracking', 'Rationalization'],
        entities: ['Application', 'Service', 'API', 'Component'],
        outputs: ['Application Map', 'Tech Debt Report', 'Rationalization Plan'],
        owner: 'Enterprise Architect'
    },
    {
        id: 9,
        name: 'Data Architecture',
        category: 'architecture',
        description: 'Data catalog, data products, lineage, quality metrics',
        features: ['Data Catalog', 'Data Products', 'Data Ownership', 'Lineage Tracking', 'Quality Metrics'],
        entities: ['Data Domain', 'Data Product', 'Dataset', 'Pipeline'],
        outputs: ['Data Lineage', 'Data Catalog', 'Quality Report'],
        owner: 'Chief Data Officer'
    },
    {
        id: 10,
        name: 'Technology Architecture',
        category: 'strategy',
        description: 'Technology catalog, cloud inventory, platforms, standards',
        features: ['Technology Catalog', 'Cloud Inventory', 'Platform Inventory', 'Standards Management'],
        entities: ['Technology', 'Platform', 'Cloud Service', 'Standard'],
        outputs: ['Tech Stack', 'Cloud Inventory', 'Standards Guide'],
        owner: 'CTO'
    },
    {
        id: 11,
        name: 'Benefits Realization',
        category: 'execution',
        description: 'Benefit tracking, KPI measurement, ROI analysis, value realization',
        features: ['Benefit Registry', 'KPI Tracking', 'Value Tracking', 'ROI Analysis', 'Outcome Measurement'],
        entities: ['Benefit', 'KPI', 'Value', 'Outcome'],
        outputs: ['Benefits Report', 'ROI Dashboard', 'Value Tracker'],
        owner: 'Chief Financial Officer'
    },
    {
        id: 12,
        name: 'Governance Layer',
        category: 'governance',
        description: 'Architecture reviews, exception management, risk, compliance, audit',
        features: ['Architecture Reviews', 'Exception Management', 'Risk Management', 'Compliance Tracking', 'Audit Management'],
        entities: ['Policy', 'Control', 'Risk', 'Audit Finding'],
        outputs: ['Governance Report', 'Risk Register', 'Audit Trail'],
        owner: 'Chief Compliance Officer'
    },
    {
        id: 13,
        name: 'Knowledge Graph',
        category: 'governance',
        description: 'Unified queryable enterprise model with complete relationships',
        features: ['Graph Database', 'Entity Management', 'Relationship Management', 'Query Engine', 'Analytics'],
        entities: ['Node', 'Relationship', 'Property'],
        outputs: ['Enterprise Graph', 'Analytics Reports', 'Impact Analysis'],
        owner: 'Chief Architect'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    renderComponents('all');
});

function filterComponents(category) {
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Render filtered components
    renderComponents(category);
}

function renderComponents(category) {
    const grid = document.getElementById('componentsGrid');
    grid.innerHTML = '';

    let filtered = etmsComponents;
    if (category !== 'all') {
        filtered = etmsComponents.filter(comp => comp.category === category);
    }

    filtered.forEach(component => {
        const card = document.createElement('div');
        card.className = 'component-details-card';
        card.style.cursor = 'pointer';
        card.onclick = () => showComponentModal(component);

        card.innerHTML = `
            <div class="component-header">
                <span class="component-badge">#${component.id}</span>
                <span class="component-category">${capitalizeFirstLetter(component.category)}</span>
            </div>
            <h3>${component.name}</h3>
            <p class="component-description">${component.description}</p>
            <div class="component-owner">
                <i class="fas fa-user"></i>
                <span>${component.owner}</span>
            </div>
            <div class="component-features-list">
                ${component.features.slice(0, 3).map(f => `<span class="feature-tag">${f}</span>`).join('')}
            </div>
            <p class="click-hint"><i class="fas fa-expand"></i> Click for details</p>
        `;

        grid.appendChild(card);
    });

    // Add CSS for new elements
    if (!document.getElementById('component-card-styles')) {
        const style = document.createElement('style');
        style.id = 'component-card-styles';
        style.textContent = `
            .component-details-card {
                background: white;
                padding: 1.5rem;
                border-radius: 0.75rem;
                box-shadow: var(--shadow);
                transition: all 0.3s ease;
                border-top: 4px solid var(--primary-color);
            }

            .component-details-card:hover {
                transform: translateY(-5px);
                box-shadow: var(--shadow-lg);
            }

            .component-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .component-badge {
                background: var(--primary-light);
                color: var(--primary-color);
                padding: 0.3rem 0.75rem;
                border-radius: 0.25rem;
                font-weight: 600;
                font-size: 0.85rem;
            }

            .component-category {
                background: rgba(16, 185, 129, 0.1);
                color: var(--success-color);
                padding: 0.3rem 0.75rem;
                border-radius: 0.25rem;
                font-weight: 600;
                font-size: 0.85rem;
            }

            .component-details-card h3 {
                margin: 0 0 0.75rem;
                color: var(--text-color);
            }

            .component-description {
                margin: 0 0 1rem;
                color: var(--text-light);
                font-size: 0.95rem;
            }

            .component-owner {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
                font-size: 0.9rem;
                color: var(--text-light);
            }

            .component-owner i {
                color: var(--primary-color);
            }

            .component-features-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .feature-tag {
                background: var(--primary-light);
                color: var(--primary-color);
                padding: 0.3rem 0.7rem;
                border-radius: 0.25rem;
                font-size: 0.8rem;
                font-weight: 600;
            }

            .click-hint {
                margin: 0;
                text-align: center;
                color: var(--primary-color);
                font-size: 0.85rem;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
}

function showComponentModal(component) {
    const modal = document.getElementById('componentModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <h2>${component.name}</h2>
        <p class="modal-subtitle">${component.description}</p>

        <div class="modal-section">
            <h3>Features</h3>
            <ul>
                ${component.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
        </div>

        <div class="modal-section">
            <h3>Key Entities</h3>
            <div class="entity-list">
                ${component.entities.map(e => `<span class="entity-badge">${e}</span>`).join('')}
            </div>
        </div>

        <div class="modal-section">
            <h3>Outputs</h3>
            <ul>
                ${component.outputs.map(o => `<li>${o}</li>`).join('')}
            </ul>
        </div>

        <div class="modal-section">
            <h3>Owner</h3>
            <p><strong>${component.owner}</strong></p>
        </div>

        <div class="modal-section">
            <h3>Category</h3>
            <span class="category-badge">${capitalizeFirstLetter(component.category)}</span>
        </div>
    `;

    modal.style.display = 'block';

    // Add modal styles if not already present
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal-subtitle {
                color: var(--text-light);
                font-size: 1rem;
                margin-bottom: 1.5rem;
            }

            .modal-section {
                margin-bottom: 1.5rem;
            }

            .modal-section h3 {
                margin: 0 0 1rem;
                color: var(--text-color);
            }

            .modal-section ul {
                margin: 0;
                padding-left: 1.5rem;
            }

            .modal-section li {
                margin-bottom: 0.5rem;
                color: var(--text-light);
            }

            .entity-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.75rem;
            }

            .entity-badge {
                background: var(--primary-light);
                color: var(--primary-color);
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                font-weight: 600;
                font-size: 0.9rem;
            }

            .category-badge {
                background: rgba(16, 185, 129, 0.1);
                color: var(--success-color);
                padding: 0.5rem 1rem;
                border-radius: 0.375rem;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
}

function closeModal() {
    document.getElementById('componentModal').style.display = 'none';
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('componentModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

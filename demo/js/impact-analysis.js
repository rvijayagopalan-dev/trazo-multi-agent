// ============================================
// TRAZO Impact Analysis Demo
// ============================================

// Mock impact data
const impactDatabase = {
    'application_payment': {
        name: 'Payment Gateway',
        type: 'Application',
        change: 'decommission',
        directImpact: 12,
        indirectImpact: 28,
        risks: 5,
        effort: '3-4',
        impacted: [
            { name: 'Customer Portal', type: 'Application', severity: 'high', reason: 'Depends on payment processing' },
            { name: 'Order Management', type: 'Application', severity: 'high', reason: 'Uses payment API' },
            { name: 'Mobile App', type: 'Application', severity: 'medium', reason: 'Secondary dependency' },
            { name: 'Payment Webhook Service', type: 'Service', severity: 'high', reason: 'Direct dependency' },
            { name: 'Finance Reconciliation', type: 'Process', severity: 'high', reason: 'Critical for operations' }
        ],
        risks: [
            { name: 'Service Disruption', score: 9.2, description: 'Payment processing interruption affecting revenue' },
            { name: 'Data Loss', score: 7.5, description: 'Potential loss of transaction history' },
            { name: 'Compliance Violation', score: 8.1, description: 'PCI-DSS requirements may not be met during transition' }
        ],
        mitigation: [
            { step: 1, title: 'Plan Migration', description: 'Define migration strategy and timeline' },
            { step: 2, title: 'Data Migration', description: 'Migrate historical transaction data safely' },
            { step: 3, title: 'Integration Testing', description: 'Test all dependent systems' },
            { step: 4, title: 'Cutover', description: 'Execute cutover with monitoring' },
            { step: 5, title: 'Validation', description: 'Verify all systems functioning correctly' }
        ]
    },
    'application_crm': {
        name: 'CRM System',
        type: 'Application',
        change: 'decommission',
        directImpact: 8,
        indirectImpact: 15,
        risks: 3,
        effort: '2-3',
        impacted: [
            { name: 'Sales Portal', type: 'Application', severity: 'high', reason: 'Primary user interface' },
            { name: 'Customer Data', type: 'Data Product', severity: 'high', reason: 'Data source' },
            { name: 'Marketing Automation', type: 'Application', severity: 'medium', reason: 'Feed integration' }
        ],
        risks: [
            { name: 'Lost Customer Data', score: 8.5, description: 'Incomplete data migration' },
            { name: 'Sales Team Disruption', score: 7.8, description: 'Change management issues' }
        ],
        mitigation: [
            { step: 1, title: 'Data Audit', description: 'Complete inventory of CRM data' },
            { step: 2, title: 'User Training', description: 'Train sales team on new system' },
            { step: 3, title: 'Parallel Run', description: 'Run both systems in parallel' },
            { step: 4, title: 'Cutover', description: 'Switch to new system' }
        ]
    },
    'api_upgrade': {
        name: 'Customer API v2.0',
        type: 'API',
        change: 'update',
        directImpact: 5,
        indirectImpact: 8,
        risks: 2,
        effort: '1-2',
        impacted: [
            { name: 'Mobile App', type: 'Application', severity: 'medium', reason: 'Needs code update' },
            { name: 'Third-party Integrations', type: 'Integration', severity: 'low', reason: 'May need adjustments' }
        ],
        risks: [
            { name: 'Breaking Changes', score: 6.2, description: 'Potential API incompatibilities' }
        ],
        mitigation: [
            { step: 1, title: 'API Documentation', description: 'Review breaking changes' },
            { step: 2, title: 'Staging Testing', description: 'Test with new API version' },
            { step: 3, title: 'Gradual Rollout', description: 'Canary deployment' }
        ]
    }
};

// Entity lists
const entities = {
    application: ['Payment Gateway', 'CRM System', 'Customer Portal', 'Order Management'],
    api: ['Customer API v2.0', 'Payment API', 'User API'],
    dataproduct: ['Customer Master', 'Transaction History'],
    process: ['Payment Processing', 'Order Processing']
};

// Initialize
document.getElementById('depthSlider').addEventListener('input', function() {
    document.getElementById('depthValue').textContent = this.value;
});

function updateEntities() {
    const type = document.getElementById('entityType').value;
    const select = document.getElementById('entitySelect');

    select.innerHTML = '<option value="">Choose entity...</option>';

    if (type && entities[type]) {
        entities[type].forEach(entity => {
            const option = document.createElement('option');
            option.value = entity.toLowerCase().replace(/\s+/g, '_');
            option.textContent = entity;
            select.appendChild(option);
        });
    }
}

function analyzeImpact() {
    const type = document.getElementById('entityType').value;
    const entity = document.getElementById('entitySelect').value;
    const changeType = document.getElementById('changeType').value;

    if (!type || !entity || !changeType) {
        showToast('Please select all fields', 'error');
        return;
    }

    // Determine database key
    let dbKey = '';
    if (type === 'application' && entity.includes('payment')) {
        dbKey = 'application_payment';
    } else if (type === 'application' && entity.includes('crm')) {
        dbKey = 'application_crm';
    } else if (type === 'api') {
        dbKey = 'api_upgrade';
    }

    if (!impactDatabase[dbKey]) {
        showToast('Impact analysis not available for this selection', 'info');
        return;
    }

    displayImpactAnalysis(impactDatabase[dbKey]);
    document.getElementById('examplesSection').style.display = 'none';
}

function displayImpactAnalysis(data) {
    const resultsSection = document.getElementById('resultsSection');

    // Update metrics
    document.getElementById('directImpact').textContent = data.directImpact;
    document.getElementById('indirectImpact').textContent = data.indirectImpact;
    document.getElementById('associatedRisks').textContent = data.risks.length;
    document.getElementById('estimatedEffort').textContent = data.effort;

    // Selected entity
    const entityCard = document.getElementById('selectedEntity');
    entityCard.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="font-size: 2rem; color: var(--primary-color);">
                <i class="fas fa-cube"></i>
            </div>
            <div>
                <h3 style="margin: 0; color: var(--text-color);">${data.name}</h3>
                <p style="margin: 0.25rem 0 0; color: var(--text-light);">Type: ${data.type}</p>
            </div>
        </div>
    `;

    // Impacted systems
    const impactedList = document.getElementById('impactedList');
    impactedList.innerHTML = data.impacted.map(item => `
        <div class="impact-item">
            <div class="impact-item-header">
                <div class="impact-icon"><i class="fas fa-sitemap"></i></div>
                <div>
                    <p class="impact-title">${item.name}</p>
                    <p class="impact-type">${item.type}</p>
                </div>
            </div>
            <p style="margin: 0.5rem 0 0; color: var(--text-light); font-size: 0.9rem;">${item.reason}</p>
            <span class="impact-severity ${item.severity.toLowerCase()}">${item.severity.toUpperCase()}</span>
        </div>
    `).join('');

    // Risks
    const risksList = document.getElementById('risksList');
    risksList.innerHTML = data.risks.map(risk => `
        <div class="risk-item">
            <div class="risk-header">
                <p class="risk-name">${risk.name}</p>
                <span class="risk-score">${(risk.score * 10).toFixed(0)}/100</span>
            </div>
            <p class="risk-description">${risk.description}</p>
        </div>
    `).join('');

    // Mitigation steps
    const mitigationSteps = document.getElementById('mitigationSteps');
    mitigationSteps.innerHTML = `<div class="mitigation-steps">${data.mitigation.map(step => `
        <div class="mitigation-step">
            <div class="step-number">${step.step}</div>
            <div class="step-content">
                <p class="step-title">${step.title}</p>
                <p class="step-description">${step.description}</p>
            </div>
        </div>
    `).join('')}</div>`;

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function loadExample(example) {
    if (example === 'payment') {
        document.getElementById('entityType').value = 'application';
        updateEntities();
        document.getElementById('entitySelect').value = 'payment_gateway';
        document.getElementById('changeType').value = 'migrate';
    } else if (example === 'crm') {
        document.getElementById('entityType').value = 'application';
        updateEntities();
        document.getElementById('entitySelect').value = 'crm_system';
        document.getElementById('changeType').value = 'decommission';
    } else if (example === 'api') {
        document.getElementById('entityType').value = 'api';
        updateEntities();
        document.getElementById('entitySelect').value = 'customer_api_v2.0';
        document.getElementById('changeType').value = 'update';
    } else if (example === 'database') {
        document.getElementById('entityType').value = 'dataproduct';
        updateEntities();
        document.getElementById('entitySelect').value = 'customer_master';
        document.getElementById('changeType').value = 'migrate';
    }

    setTimeout(analyzeImpact, 100);
}

function exportAnalysis() {
    showToast('Analysis exported as PDF', 'success');
}

function shareAnalysis() {
    showToast('Analysis link copied to clipboard', 'success');
}

function resetAnalysis() {
    document.getElementById('entityType').value = '';
    document.getElementById('entitySelect').value = '';
    document.getElementById('changeType').value = '';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('examplesSection').style.display = 'block';
}

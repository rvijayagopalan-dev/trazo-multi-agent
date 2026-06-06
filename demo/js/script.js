// ============================================
// TRAZO Demo - Main Script
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const element = document.querySelector(href);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Update depth slider display
    const depthSlider = document.getElementById('depthSlider');
    if (depthSlider) {
        depthSlider.addEventListener('input', function() {
            const depthValue = document.getElementById('depthValue');
            if (depthValue) {
                depthValue.textContent = this.value;
            }
        });
    }
});

// Utility functions
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

function getTimeAgo(hours) {
    if (hours === 0) return 'just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0066ff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Mock data for demos
const mockData = {
    applications: [
        {
            id: 'app-001',
            name: 'Payment Gateway',
            owner: 'Finance Team',
            criticality: 'CRITICAL',
            status: 'ACTIVE',
            dependents: 12,
            dependencies: 5,
            risks: 2
        },
        {
            id: 'app-002',
            name: 'Customer Portal',
            owner: 'Product Team',
            criticality: 'CRITICAL',
            status: 'ACTIVE',
            dependents: 8,
            dependencies: 3,
            risks: 1
        },
        {
            id: 'app-003',
            name: 'Order Management',
            owner: 'Operations Team',
            criticality: 'HIGH',
            status: 'ACTIVE',
            dependents: 5,
            dependencies: 4,
            risks: 3
        }
    ],

    dataProducts: [
        {
            id: 'data-001',
            name: 'Customer Master',
            owner: 'Data Team',
            format: 'PARQUET',
            consumers: 15,
            producers: 2,
            contains_pii: true
        },
        {
            id: 'data-002',
            name: 'Transaction History',
            owner: 'Data Team',
            format: 'DELTA',
            consumers: 8,
            producers: 1,
            contains_pii: false
        }
    ],

    apis: [
        {
            id: 'api-001',
            name: 'User API',
            version: '3.0',
            consumers: 12,
            status: 'ACTIVE'
        },
        {
            id: 'api-002',
            name: 'Payment API',
            version: '2.1',
            consumers: 5,
            status: 'ACTIVE'
        }
    ]
};

// Export for use in other scripts
window.mockData = mockData;

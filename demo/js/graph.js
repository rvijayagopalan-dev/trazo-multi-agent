// ============================================
// TRAZO Knowledge Graph Visualization
// ============================================

let network = null;
let nodes = null;
let edges = null;

// Graph data
const graphDatabase = {
    'objective-001': {
        id: 'objective-001',
        label: 'Digital Transformation',
        type: 'objective',
        color: '#0066ff',
        size: 40
    },
    'capability-001': {
        id: 'capability-001',
        label: 'Payment Processing',
        type: 'capability',
        color: '#10b981',
        size: 35
    },
    'process-001': {
        id: 'process-001',
        label: 'Order Processing',
        type: 'process',
        color: '#10b981',
        size: 30
    },
    'app-001': {
        id: 'app-001',
        label: 'Payment Gateway',
        type: 'application',
        color: '#f59e0b',
        size: 35
    },
    'app-002': {
        id: 'app-002',
        label: 'Customer Portal',
        type: 'application',
        color: '#f59e0b',
        size: 33
    },
    'api-001': {
        id: 'api-001',
        label: 'Payment API',
        type: 'api',
        color: '#f59e0b',
        size: 28
    },
    'data-001': {
        id: 'data-001',
        label: 'Customer Master',
        type: 'data',
        color: '#8b5cf6',
        size: 30
    },
    'risk-001': {
        id: 'risk-001',
        label: 'Service Disruption',
        type: 'risk',
        color: '#ef4444',
        size: 25
    }
};

const relationshipDatabase = {
    'objective-001_capability-001': {
        from: 'objective-001',
        to: 'capability-001',
        label: 'SUPPORTS'
    },
    'capability-001_process-001': {
        from: 'capability-001',
        to: 'process-001',
        label: 'IMPLEMENTS'
    },
    'process-001_app-001': {
        from: 'process-001',
        to: 'app-001',
        label: 'USES'
    },
    'app-001_api-001': {
        from: 'app-001',
        to: 'api-001',
        label: 'EXPOSES'
    },
    'app-001_data-001': {
        from: 'app-001',
        to: 'data-001',
        label: 'CONSUMES'
    },
    'app-002_api-001': {
        from: 'app-002',
        to: 'api-001',
        label: 'USES'
    },
    'app-001_risk-001': {
        from: 'app-001',
        to: 'risk-001',
        label: 'EXPOSED_TO'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeGraph();
    updateGraph();
});

function initializeGraph() {
    const container = document.getElementById('graph-container');

    const options = {
        physics: {
            enabled: true,
            barnesHut: {
                gravitationalConstant: -26000,
                centralGravity: 0.3,
                springLength: 200,
                springConstant: 0.05
            },
            maxVelocity: 50,
            solver: 'barnesHut',
            timestep: 0.35
        },
        nodes: {
            font: {
                size: 14,
                face: 'Arial',
                color: '#1f2937'
            },
            borderWidth: 2,
            borderWidthSelected: 3,
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.2)',
                size: 10,
                x: 5,
                y: 5
            }
        },
        edges: {
            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: 0.5
                }
            },
            color: {
                color: '#9ca3af',
                highlight: '#0066ff'
            },
            font: {
                size: 12,
                face: 'Arial'
            },
            smooth: {
                type: 'continuous'
            }
        },
        interaction: {
            navigationButtons: true,
            keyboard: true
        }
    };

    // Initialize network once
    if (!network) {
        const data = {
            nodes: new vis.DataSet([]),
            edges: new vis.DataSet([])
        };

        network = new vis.Network(container, data, options);

        // Handle node selection
        network.on('click', function(params) {
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                document.getElementById('selectedNode').textContent = graphDatabase[nodeId]?.label || 'Unknown';
            }
        });
    }
}

function updateGraph() {
    const startNode = document.getElementById('startNode').value || 'objective-001';
    const depth = parseInt(document.getElementById('depthSlider').value);

    // Get connected nodes
    const connectedNodes = getConnectedNodes(startNode, depth);

    // Create nodes array
    const nodesArray = connectedNodes.map(nodeId => {
        const nodeData = graphDatabase[nodeId];
        return {
            id: nodeId,
            label: nodeData.label,
            color: nodeData.color,
            size: nodeData.size,
            title: nodeData.label,
            font: {
                size: nodeData.size / 1.5
            }
        };
    });

    // Create edges array
    const edgesArray = [];
    Object.values(relationshipDatabase).forEach(rel => {
        if (connectedNodes.includes(rel.from) && connectedNodes.includes(rel.to)) {
            edgesArray.push({
                from: rel.from,
                to: rel.to,
                label: rel.label,
                title: rel.label
            });
        }
    });

    // Update network data
    network.setData({
        nodes: new vis.DataSet(nodesArray),
        edges: new vis.DataSet(edgesArray)
    });

    // Update info
    document.getElementById('nodeCount').textContent = nodesArray.length;
    document.getElementById('relationshipCount').textContent = edgesArray.length;

    // Fit to bounds
    network.fit({ animation: { duration: 500 } });
}

function getConnectedNodes(startNodeId, maxDepth) {
    const visited = new Set();
    const queue = [{id: startNodeId, depth: 0}];

    while (queue.length > 0) {
        const current = queue.shift();

        if (visited.has(current.id) || current.depth > maxDepth) {
            continue;
        }

        visited.add(current.id);

        // Find connected nodes
        Object.values(relationshipDatabase).forEach(rel => {
            if (rel.from === current.id && !visited.has(rel.to) && current.depth < maxDepth) {
                queue.push({id: rel.to, depth: current.depth + 1});
            }
            if (rel.to === current.id && !visited.has(rel.from) && current.depth < maxDepth) {
                queue.push({id: rel.from, depth: current.depth + 1});
            }
        });
    }

    return Array.from(visited);
}

function resetGraph() {
    document.getElementById('startNode').value = 'objective-001';
    document.getElementById('filterType').value = '';
    document.getElementById('depthSlider').value = '3';
    document.getElementById('depthValue').textContent = '3';
    document.getElementById('selectedNode').textContent = 'None';
    updateGraph();
    showToast('Graph reset', 'success');
}

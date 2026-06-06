// ============================================
// ETMS Traceability Demo
// ============================================

function showPath(pathName) {
    // Hide all paths
    document.querySelectorAll('.path-flow').forEach(path => {
        path.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.path-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected path
    const pathElement = document.getElementById(pathName + '-path');
    if (pathElement) {
        pathElement.classList.add('active');
    }

    // Add active class to clicked button
    event.target.closest('.path-btn').classList.add('active');

    // Scroll to path
    pathElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Example: Show revenue path by default
document.addEventListener('DOMContentLoaded', function() {
    showToast('View the complete strategic traceability path from goal to execution', 'info');
});

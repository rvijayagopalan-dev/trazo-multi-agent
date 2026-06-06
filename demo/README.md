# TRAZO Demo - Interactive HTML Demo

A comprehensive, interactive HTML5 demo showcasing the TRAZO Enterprise Traceability Platform.

## Overview

This demo provides an interactive walkthrough of TRAZO's key features including:
- **Dashboard**: Real-time metrics, KPIs, and insights
- **Enterprise Search**: Semantic search across enterprise knowledge
- **Impact Analysis**: Predict change impacts before implementation
- **Knowledge Graph**: Visualize enterprise relationships and dependencies
- **Architecture Navigation**: Explore multi-layer enterprise architecture

## File Structure

```
demo/
├── index.html                 # Landing page & feature overview
├── dashboard.html             # Analytics dashboard
├── search.html               # Enterprise search demo
├── impact-analysis.html       # Impact analysis tool
├── graph.html               # Knowledge graph visualization
├── css/
│   ├── style.css            # Global styles
│   ├── dashboard.css        # Dashboard-specific styles
│   ├── search.css           # Search page styles
│   ├── impact-analysis.css  # Impact analysis styles
│   └── graph.css            # Graph visualization styles
├── js/
│   ├── script.js            # Main JavaScript & utilities
│   ├── search.js            # Search functionality
│   ├── impact-analysis.js   # Impact analysis logic
│   └── graph.js             # Graph visualization (vis.js)
└── README.md                # This file
```

## Getting Started

### Quick Start

1. **Open in Browser**: Simply open `index.html` in a modern web browser
2. **Navigate**: Use the navigation menu or click feature cards
3. **Explore**: Try the interactive demos

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No backend server required (fully client-side)

## Features

### Landing Page (`index.html`)

- Hero section with feature highlights
- Product overview and value proposition
- 13 autonomous agents showcase
- Enterprise architecture diagram
- Technology stack information
- 40+ integrations display
- Call-to-action buttons

### Dashboard (`dashboard.html`)

**Metrics Section**
- Application inventory count
- Data products count
- APIs count
- Active risks count

**Visualization Charts**
- Application status breakdown (active, deprecated, planned)
- Risk distribution heatmap (critical, high, medium, low)
- Compliance status circles (GDPR, HIPAA, SOC2, PCI-DSS)
- Recent changes timeline
- Top critical applications table
- KPI trends with mini charts

**AI-Generated Insights**
- Dependency optimization suggestions
- Security control gaps
- Cost optimization recommendations

### Enterprise Search (`search.html`)

**Features**
- Semantic search bar with autocomplete
- Popular search suggestions
- Fuzzy search algorithm
- Results grouped by entity type
- Relevance scoring (0-100%)
- Type badges and metadata

**Search Examples**
- "customer data"
- "payment systems"
- "GDPR controls"
- "critical applications"

### Impact Analysis (`impact-analysis.html`)

**Analysis Input**
- Entity type selection (Application, API, Data Product, Process)
- Entity selection
- Change type selection (Decommission, Migrate, Update, Dependency, Scale)

**Results Display**
- Selected entity card with details
- Impact metrics:
  - Direct impact count
  - Indirect impact count
  - Associated risks
  - Estimated effort
- Impacted systems list with severity
- Associated risks with scores
- Recommended mitigation plan (step-by-step)
- Export/Share/Reset actions

**Example Scenarios**
- Payment Gateway Migration
- CRM System Decommission
- API Upgrade (Customer API v3.0)
- Database Migration

### Knowledge Graph (`graph.html`)

**Interactive Visualization**
- Graph powered by vis.js library
- Pan, zoom, drag nodes
- Physics-based layout

**Controls**
- Start node selection
- Entity type filter
- Depth slider (1-5 layers)
- Reset button

**Information Panels**
- Node count display
- Relationship count display
- Selected node display
- Relationship legend

**Relationship Types**
- SUPPORTS: Capability → Process
- IMPLEMENTS: Process → Requirement
- DEPENDS_ON: Application → API
- PRODUCES: Pipeline → Dataset
- MITIGATES: Control → Risk
- OWNS: Organization → Entity

## Colors & Design

### Color Scheme
```
Primary Blue:    #0066ff
Dark Blue:       #0052cc
Light Blue:      #e6f0ff
Success Green:   #10b981
Warning Orange:  #f59e0b
Danger Red:      #ef4444
Purple:          #8b5cf6
Text Dark:       #1f2937
Text Light:      #6b7280
Border:          #e5e7eb
Background:      #f9fafb
```

### Typography
- **Font**: System font stack (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Sizes**: H1 (3.5rem), H2 (2.5rem), H3 (1.5rem), Body (1rem)
- **Weight**: Regular (400), Semibold (600), Bold (700)

## Interactive Elements

### Buttons
- **Primary** (Blue): Main actions
- **Secondary** (Blue outline): Alternative actions
- **Large**: Extended padding for prominent CTAs

### Cards
- Hover effects with elevation
- Smooth transitions
- Border accents on hover

### Forms
- Dropdown selectors
- Range sliders
- Animated focus states

### Feedback
- Toast notifications (success, error, info)
- Real-time search updates
- Dynamic result grouping
- Loading states

## Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full support |
| Firefox | 88+     | ✅ Full support |
| Safari  | 14+     | ✅ Full support |
| Edge    | 90+     | ✅ Full support |

## Performance

- **Page Load**: < 2 seconds
- **Search Response**: < 300ms (debounced)
- **Graph Render**: < 1 second
- **Animations**: 60 FPS smooth

## Responsive Design

- **Desktop**: Full layout with multi-column grids
- **Tablet** (≤ 1024px): Adjusted grid columns, hidden sidebars
- **Mobile** (≤ 768px): Single column layout, stacked cards
- **Small Mobile** (≤ 480px): Minimal padding, compact text

## Usage Tips

### Search Demo
1. Click "Smart Search" or navigate to search.html
2. Try pre-filled suggestions or type custom queries
3. Click results to see details
4. Hover over results for more info

### Impact Analysis Demo
1. Select an entity type (Application)
2. Choose an entity (e.g., "Payment Gateway")
3. Select change type (e.g., "Decommission")
4. Click "Analyze Impact"
5. Review the comprehensive analysis report

### Knowledge Graph Demo
1. Select starting node (e.g., "Digital Transformation")
2. Adjust depth slider to see more layers
3. Drag nodes to rearrange
4. Click nodes for details

### Dashboard Demo
1. View pre-populated metrics
2. Scroll to see all sections
3. Hover over charts for details
4. Click cards for more information

## Customization

### Adding New Data

Edit mock data objects in JavaScript files:
```javascript
// In js/script.js
window.mockData = {
    applications: [...],
    dataProducts: [...],
    apis: [...]
};

// In js/search.js
const searchDatabase = { ... };

// In js/impact-analysis.js
const impactDatabase = { ... };

// In js/graph.js
const graphDatabase = { ... };
```

### Styling

Modify CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #0066ff;
    --success-color: #10b981;
    /* ... other variables ... */
}
```

### Adding New Pages

1. Create `new-page.html` with same structure as existing pages
2. Add navigation link in navbar
3. Create corresponding CSS file in `css/`
4. Create JavaScript file in `js/` if needed
5. Update README

## External Dependencies

- **Vis.js** (v4.21.0): Graph visualization
  - CDN: cdnjs.cloudflare.com
  - Used in: graph.html
  
- **Font Awesome** (v6.4.0): Icons
  - CDN: cdnjs.cloudflare.com
  - Used globally for icons

## Known Limitations

- Graph visualization is simulated (not connected to real database)
- Search results are from static mock data
- Impact analysis uses predefined scenarios
- No real-time data updates
- No backend API integration

## Future Enhancements

- [ ] Real API integration
- [ ] Real-time data streaming
- [ ] Advanced filtering options
- [ ] Custom dashboard builder
- [ ] Report generation & export
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Advanced graph controls (zoom, filter, layout)

## Troubleshooting

### Graph not rendering
- Ensure JavaScript is enabled
- Check browser console for errors
- Clear browser cache and reload

### Search not working
- Verify search.js is loaded
- Check browser console for errors
- Try with example queries first

### Styling issues
- Clear browser cache (Ctrl+Shift+Del)
- Verify CSS files are loaded (check Network tab)
- Try different browser

## Support

For issues or questions about the demo:
1. Check browser console for error messages
2. Verify all files are present
3. Try opening in different browser
4. Refer to documentation in `/docs` folder

## License

TRAZO Demo © 2026. All rights reserved.

## Credits

- **Design**: TRAZO Design Team
- **Development**: AI-assisted development
- **Icons**: Font Awesome
- **Visualization**: Vis.js Library
- **Fonts**: System Font Stack + Google Fonts

---

**Ready to explore TRAZO?** Open `index.html` in your browser to get started!

Visit the [TRAZO Documentation](../docs/README.md) for more information about the platform.

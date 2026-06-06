# TRAZO Getting Started Guide

**Document Version:** 1.0  
**Last Updated:** 2026-06-06  
**Status:** Active

---

## Welcome to TRAZO

TRAZO is an AI-Native Enterprise Operating System that transforms how enterprises understand their strategy, technology, data, and operations through continuous, autonomous intelligence.

This guide will get you started with TRAZO in 30 minutes.

---

## 1. Accessing TRAZO

### 1.1 Web Portal

1. Navigate to: https://trazo.enterprise.com
2. Click "Sign In"
3. Authenticate with your company credentials
4. Accept MFA challenge
5. You're in!

### 1.2 Mobile App

Download from:
- **iOS**: App Store - "TRAZO Enterprise"
- **Android**: Google Play - "TRAZO Enterprise"

### 1.3 Slack Integration

1. Type `/trazo` in any Slack channel
2. Follow the OAuth flow
3. Start asking questions directly in Slack

**Examples**:
```
/trazo Show all applications impacted by the CRM migration
/trazo What controls mitigate our top risks?
/trazo Which data products are accessed by the mobile app?
```

---

## 2. Your Dashboard

### 2.1 Dashboard Overview

When you first log in, you'll see:

1. **Executive Summary**
   - Total applications in inventory
   - Number of critical systems
   - Open risks
   - Compliance status

2. **Recent Changes**
   - New applications discovered
   - Updated architectures
   - Completed initiatives
   - Closed risks

3. **Your Domains**
   - Domains you own
   - Recent updates
   - Action items

4. **Saved Searches**
   - Frequently run queries
   - Team collaborations
   - Reports

### 2.2 Customizing Your Dashboard

1. Click the **three-dot menu** (top right)
2. Select "Customize Dashboard"
3. Add/remove widgets
4. Reorder cards
5. Click "Save"

---

## 3. Key Concepts

### 3.1 The Knowledge Graph

TRAZO stores all enterprise information as a knowledge graph:

```
Strategy
  ├── Objectives
  ├── Capabilities
  ├── Processes
  └── Products

Technology
  ├── Applications
  ├── APIs
  ├── Services
  └── Infrastructure

Data
  ├── Data Products
  ├── Datasets
  ├── Pipelines
  └── Dashboards

Governance
  ├── Risks
  ├── Controls
  ├── Policies
  └── Compliance
```

### 3.2 Relationships

Entities are connected by relationships:
- **SUPPORTS**: Capability supports Process
- **IMPLEMENTS**: Process implements Requirement
- **DEPENDS_ON**: Application depends on API
- **PRODUCES**: Pipeline produces Dataset
- **MITIGATES**: Control mitigates Risk

---

## 4. Core Features

### 4.1 Enterprise Search

**Find anything in your enterprise with natural language**

```
Search examples:
"Show me all customer-facing applications"
"Which systems store payment data?"
"What's impacted by the database migration?"
"Find all GDPR-relevant processes"
```

**How to search**:
1. Click the **Search** button (top left)
2. Type your question
3. Press Enter or click Search
4. Explore results

### 4.2 Impact Analysis

**Predict the impact of changes before implementing**

**How to use**:
1. Navigate to an entity (Application, DataProduct, etc.)
2. Click the **Impact Analysis** button
3. Select the change type (Decommission, Migrate, Update)
4. Review the impact map
5. See affected systems, risks, and controls

**Example result**:
```
Decommissioning CRM System (APP123)

Direct Impact:
- 5 dependent applications
- 12 business processes
- 3 data pipelines

Indirect Impact:
- 23 additional systems affected
- 8 strategic objectives impacted

Risks:
- Service disruption (HIGH probability)
- Data loss if migration fails

Recommendations:
- Migrate dependent systems first
- Plan 6-month transition
```

### 4.3 Root Cause Analysis

**Understand the root cause of issues**

**How to use**:
1. Navigate to the problem entity
2. Click **Root Cause Analysis**
3. Review upstream dependencies
4. Identify failure points
5. Get remediation recommendations

### 4.4 Traceability Paths

**See the complete lineage from strategy to execution**

**Example path**:
```
Strategic Objective
  ↓ (enables)
Business Capability
  ↓ (implements)
Business Process
  ↓ (supported by)
Application
  ↓ (exposes)
API
  ↓ (consumes)
Data Product
  ↓ (composed of)
Dataset
```

---

## 5. Navigating the Graph

### 5.1 Entity Types

**Click on any entity to explore it**

Common entity types:
- **Application**: Software systems
- **API**: Integration points
- **DataProduct**: Curated data
- **Process**: Business processes
- **Capability**: Business capabilities
- **Risk**: Enterprise risks
- **Control**: Risk controls

### 5.2 Viewing Relationships

When you open an entity, you'll see:

1. **Upstream**: What supports this entity
2. **Downstream**: What depends on this entity
3. **Related**: Linked entities
4. **Properties**: Detailed attributes
5. **History**: Changes over time

### 5.3 Graph Visualization

Click the **Graph** tab to see visual relationships:

```
┌─────────────────────────────────────┐
│  Select a relationship to explore    │
│  Hover over nodes for details       │
│  Drag to move layout                │
│  Double-click to expand             │
└─────────────────────────────────────┘
```

---

## 6. Running Reports

### 6.1 Pre-built Reports

**Analytics** → **Reports**

Available reports:
- Application Inventory
- Risk Assessment
- Compliance Status
- Data Lineage
- Architecture Overview
- Transformation Progress

### 6.2 Creating Custom Reports

1. Click **Create Report**
2. Select entity types to include
3. Add filters (status, owner, etc.)
4. Choose visualization (table, chart, map)
5. Click "Generate"
6. Save or export

### 6.3 Exporting Data

**Download reports in multiple formats**:
- PDF (for presentations)
- Excel (for analysis)
- CSV (for integration)
- JSON (for APIs)

---

## 7. Asking Questions

### 7.1 Using the Executive Copilot

TRAZO's AI can answer enterprise questions naturally:

```
Question: "Show all business capabilities impacted by the cloud migration"

Behind the scenes:
1. TRAZO understands your intent
2. Plans the query across the knowledge graph
3. Executes complex graph traversals
4. Synthesizes the answer
5. Shows you the results with visualizations
```

### 7.2 Example Questions

**Strategy**:
- "How is the digital transformation initiative progressing?"
- "Which objectives are at risk?"

**Technology**:
- "What's the impact of retiring the legacy payment system?"
- "Which applications are using outdated frameworks?"

**Data**:
- "Show me all datasets containing customer PII"
- "What's the lineage of our customer master data?"

**Governance**:
- "Which controls are most effective?"
- "What's our compliance status against GDPR?"

---

## 8. Collaboration Features

### 8.1 Comments & Notes

Add comments to any entity:

1. Open an entity
2. Scroll to **Comments** section
3. Click **Add Comment**
4. Type your comment
5. Mention colleagues with `@name`
6. Submit

### 8.2 Sharing Insights

Share what you discover:

1. Click the **Share** button (top right)
2. Select format (Link, Slack, Email)
3. Add a message
4. Choose recipients
5. Send

### 8.3 Creating Collections

Organize related entities:

1. Click **Collections** (left sidebar)
2. Click **Create Collection**
3. Name your collection (e.g., "CRM Migration")
4. Add entities by searching
5. Share with team

---

## 9. Configuring Your Account

### 9.1 Profile Settings

1. Click your **profile icon** (top right)
2. Select **Settings**
3. Update personal information
4. Set notification preferences
5. Configure integrations
6. Save

### 9.2 Notification Preferences

Choose how you want to be notified:

**Channel options**:
- [ ] Email
- [ ] Slack
- [ ] Teams
- [ ] In-app notifications

**Notification types**:
- [ ] New risks discovered
- [ ] Compliance gaps
- [ ] Architecture changes
- [ ] Data quality issues
- [ ] Initiative updates

### 9.3 API Tokens

**For integrating with other systems**:

1. Click **Settings** → **API Tokens**
2. Click **Create Token**
3. Name your token (e.g., "Jira Sync")
4. Select permissions
5. Copy and store securely
6. Add to external system configuration

---

## 10. Common Workflows

### 10.1 Discover an Application

1. Search for application name
2. Click to open
3. Review properties (owner, status, criticality)
4. Check dependencies (UPSTREAM/DOWNSTREAM)
5. View associated data products
6. See compliance & risk status

### 10.2 Plan a System Migration

1. Open source application
2. Click **Impact Analysis**
3. Select "Migrate to new platform"
4. Review impacted systems
5. Check for data migrations needed
6. Identify associated risks
7. Create action items

### 10.3 Assess Compliance Status

1. Go to **Governance** → **Compliance**
2. Select regulation (GDPR, HIPAA, etc.)
3. Review requirement coverage
4. Check evidence
5. Identify gaps
6. Export compliance report

### 10.4 Investigate a Failure

1. Navigate to affected application
2. Click **Root Cause Analysis**
3. Review dependency chain
4. Identify failure points
5. Check associated incidents
6. Get remediation recommendations

---

## 11. Best Practices

### 11.1 Data Accuracy

- Keep owner information current
- Update status regularly
- Link related entities
- Document major changes
- Review quarterly

### 11.2 Using the Graph

- Start with what you know
- Explore relationships gradually
- Use filters to narrow results
- Save useful searches
- Create collections for recurring needs

### 11.3 Collaboration

- Tag relevant stakeholders
- Explain complex relationships
- Share insights with team
- Document decisions
- Keep audit trail

---

## 12. Getting Help

### 12.1 In-App Support

1. Click the **?** button (bottom right)
2. Search for help topics
3. View video tutorials
4. Access documentation
5. Contact support

### 12.2 Slack Community

Join **#trazo-help** for:
- Tips and tricks
- Best practices
- Troubleshooting
- Feature announcements

### 12.3 Training Resources

- **Video Tutorials**: https://learn.trazo.io
- **Documentation**: https://docs.trazo.io
- **Community Forum**: https://community.trazo.io
- **Office Hours**: Every Thursday, 2 PM UTC

---

## 13. What's Next?

### 13.1 Explore Your Enterprise

Spend 15 minutes exploring:
1. Your organization's applications
2. Key business processes
3. Critical data products
4. Current risks and controls
5. Compliance status

### 13.2 Create Your First Saved Search

1. Search for something interesting
2. Click **Save Search**
3. Name it (e.g., "Critical Apps")
4. Save

### 13.3 Ask a Question

1. Click the **Copilot** icon
2. Ask something about your enterprise
3. Explore the answer
4. Save useful insights

---

## 14. Quick Reference

### Entity Icons

| Icon | Entity Type |
|------|------------|
| 🏢 | Application |
| 🔌 | API |
| 📊 | Data Product |
| 🔄 | Process |
| 🎯 | Capability |
| ⚠️ | Risk |
| 🛡️ | Control |
| 📋 | Policy |

### Common Shortcuts

```
Cmd/Ctrl + K     : Open search
Cmd/Ctrl + J     : Open Copilot
Cmd/Ctrl + S     : Save current view
Cmd/Ctrl + ?     : Help menu
/                : Command palette
```

---

## 15. Feedback

We'd love to hear from you!

- **Feature Requests**: https://feedback.trazo.io
- **Report Bug**: support@trazo.io
- **Join Webinar**: https://events.trazo.io
- **Email Newsletter**: Sign up in Settings

---

## Next Steps

1. ✅ Explore your dashboard
2. ✅ Search for your domain
3. ✅ Review an application detail
4. ✅ Run an impact analysis
5. ✅ Ask the Copilot a question
6. ✅ Save a useful search
7. ✅ Share an insight with your team

**Happy exploring! 🚀**


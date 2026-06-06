# TRAZO API Specification

**Document Version:** 1.0  
**Last Updated:** 2026-06-06  
**Status:** Active

---

## Overview

This document specifies the TRAZO REST API for programmatic access to the platform. The API enables external systems to query the knowledge graph, manage entities, and integrate with TRAZO.

---

## 1. API Architecture

### Base URL
```
https://trazo.enterprise.com/api/v1
```

### Authentication
All API requests require authentication via OAuth 2.0 Bearer token:
```
Authorization: Bearer {access_token}
```

### Response Format
All responses are JSON with standard envelope:
```json
{
  "status": "success|error",
  "code": 200,
  "data": {},
  "error": null,
  "timestamp": "2026-06-06T10:30:00Z",
  "request_id": "req-12345"
}
```

---

## 2. Core Entity Endpoints

### 2.1 Applications

#### List Applications
```
GET /applications
```

**Parameters**:
```
status: [ACTIVE, DEPRECATED, PLANNED]
owner: String
limit: Integer (default: 100, max: 1000)
offset: Integer (default: 0)
sort_by: [name, created_at, status]
```

**Response**:
```json
{
  "data": [
    {
      "app_id": "APP001",
      "name": "Customer Portal",
      "description": "Public-facing portal",
      "status": "ACTIVE",
      "criticality": "HIGH",
      "owner": "john.doe@company.com",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-06-06T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 100,
    "offset": 0
  }
}
```

---

#### Get Application Details
```
GET /applications/{app_id}
```

**Response**:
```json
{
  "data": {
    "app_id": "APP001",
    "name": "Customer Portal",
    "description": "Public-facing portal",
    "status": "ACTIVE",
    "criticality": "HIGH",
    "owner": "john.doe@company.com",
    "vendor": "Custom Built",
    "tech_stack": ["React", "Node.js", "PostgreSQL"],
    "dependencies": [
      {"app_id": "APP002", "relationship": "DEPENDS_ON"},
      {"app_id": "APP003", "relationship": "CONSUMES"}
    ],
    "services": [
      {"service_id": "SVC001", "name": "Auth Service"},
      {"service_id": "SVC002", "name": "API Gateway"}
    ],
    "apis": [
      {"api_id": "API001", "name": "User API", "type": "REST"}
    ],
    "data_products": [
      {"product_id": "DP001", "name": "Customer Master"}
    ],
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-06-06T10:00:00Z"
  }
}
```

---

#### Create Application
```
POST /applications
```

**Request Body**:
```json
{
  "name": "New Application",
  "description": "Description of app",
  "application_type": "CUSTOM",
  "criticality": "MEDIUM",
  "owner": "jane.smith@company.com",
  "tech_stack": ["Java", "Spring Boot"],
  "vendor": "Internal"
}
```

---

#### Update Application
```
PUT /applications/{app_id}
```

**Request Body**: (Partial update supported)
```json
{
  "status": "DEPRECATED",
  "criticality": "LOW"
}
```

---

#### Delete Application
```
DELETE /applications/{app_id}
```

---

### 2.2 Data Products

#### List Data Products
```
GET /data-products
```

**Parameters**:
```
domain_id: String (filter by domain)
owner: String
status: [ACTIVE, DEVELOPMENT, DEPRECATED]
format: [PARQUET, CSV, JSON, DELTA]
limit: Integer
offset: Integer
```

---

#### Get Data Product Lineage
```
GET /data-products/{product_id}/lineage
```

**Parameters**:
```
direction: [UPSTREAM, DOWNSTREAM, BOTH]
depth: Integer (default: 3, max: 10)
```

**Response**:
```json
{
  "data": {
    "product_id": "DP001",
    "name": "Customer Master",
    "upstream": [
      {
        "dataset_id": "DS001",
        "name": "CRM Raw Data",
        "pipeline_id": "PIPE001",
        "lag_minutes": 15
      }
    ],
    "downstream": [
      {
        "dataset_id": "DS002",
        "name": "Customer Analytics",
        "application_id": "APP001",
        "last_access": "2026-06-06T09:00:00Z"
      }
    ]
  }
}
```

---

### 2.3 APIs

#### List APIs
```
GET /apis
```

**Parameters**:
```
application_id: String
api_type: [REST, GRAPHQL, GRPC, SOAP]
status: [ACTIVE, DEPRECATED, PLANNED]
```

---

#### Get API Consumers & Producers
```
GET /apis/{api_id}/relationships
```

**Response**:
```json
{
  "data": {
    "api_id": "API001",
    "name": "User API",
    "producers": [
      {"service_id": "SVC001", "name": "User Service"}
    ],
    "consumers": [
      {"application_id": "APP001", "name": "Web Portal"},
      {"application_id": "APP002", "name": "Mobile App"}
    ],
    "dependent_apis": [
      {"api_id": "API002", "name": "Authentication API"}
    ]
  }
}
```

---

## 3. Graph Query Endpoints

### 3.1 Path Query

**Purpose**: Find all paths between two entities

```
POST /graph/paths
```

**Request**:
```json
{
  "from": {
    "entity_type": "Objective",
    "entity_id": "OBJ001"
  },
  "to": {
    "entity_type": "Application",
    "entity_id": "APP001"
  },
  "max_depth": 10,
  "relationship_filters": ["SUPPORTS", "IMPLEMENTS", "DEPENDS_ON"]
}
```

**Response**:
```json
{
  "data": [
    {
      "path_id": "path-001",
      "length": 6,
      "nodes": [
        {"entity_type": "Objective", "entity_id": "OBJ001", "name": "Improve Customer Experience"},
        {"entity_type": "Capability", "entity_id": "CAP001", "name": "Order Management"},
        {"entity_type": "Process", "entity_id": "PROC001", "name": "Order Processing"},
        {"entity_type": "Application", "entity_id": "APP001", "name": "Order System"}
      ],
      "relationships": [
        {"type": "SUPPORTS", "weight": 1},
        {"type": "IMPLEMENTS", "weight": 1},
        {"type": "DEPENDS_ON", "weight": 1}
      ]
    }
  ]
}
```

---

### 3.2 Impact Analysis

**Purpose**: Analyze potential impact of changes

```
POST /graph/impact-analysis
```

**Request**:
```json
{
  "change": {
    "entity_type": "Application",
    "entity_id": "APP001",
    "change_type": "DECOMMISSION"
  },
  "analysis_depth": 5,
  "include_risks": true
}
```

**Response**:
```json
{
  "data": {
    "primary_impact": {
      "directly_impacted": 5,
      "indirectly_impacted": 23,
      "total_entities": 28
    },
    "impacted_entities": [
      {
        "entity_type": "Application",
        "entity_id": "APP002",
        "name": "Dependent App",
        "relationship": "DEPENDS_ON",
        "impact_level": "HIGH",
        "remediation_required": true
      }
    ],
    "associated_risks": [
      {
        "risk_id": "RISK001",
        "name": "Service Disruption",
        "probability": 0.8,
        "impact": "HIGH"
      }
    ],
    "mitigation_plan": "Decommission dependent systems first"
  }
}
```

---

### 3.3 Root Cause Analysis

**Purpose**: Find root causes of issues

```
POST /graph/root-cause-analysis
```

**Request**:
```json
{
  "symptom": {
    "entity_type": "Application",
    "entity_id": "APP001",
    "issue": "Performance Degradation"
  },
  "analysis_type": "UPSTREAM",
  "max_depth": 5
}
```

---

## 4. Search Endpoints

### 4.1 Semantic Search

**Purpose**: Search across enterprise knowledge using natural language

```
GET /search
```

**Parameters**:
```
q: String (search query)
entity_types: [Application, DataProduct, Process, etc.]
limit: Integer (default: 10, max: 100)
```

**Example**:
```
GET /search?q=customer+data&entity_types=DataProduct,Dataset&limit=20
```

**Response**:
```json
{
  "data": [
    {
      "rank": 1,
      "entity_type": "DataProduct",
      "entity_id": "DP001",
      "name": "Customer Master Data",
      "description": "Central customer repository",
      "relevance_score": 0.98,
      "matches": ["customer", "data"]
    },
    {
      "rank": 2,
      "entity_type": "Dataset",
      "entity_id": "DS001",
      "name": "Customer Analytics",
      "relevance_score": 0.85
    }
  ]
}
```

---

### 4.2 Advanced Query

**Purpose**: Complex queries using graph query language

```
POST /search/advanced
```

**Request**:
```json
{
  "query": "MATCH (app:Application)-[:DEPENDS_ON]->(dep:Application) WHERE app.criticality='CRITICAL' RETURN app, dep"
}
```

---

## 5. Analytics Endpoints

### 5.1 Dashboard Data

```
GET /analytics/dashboard/{dashboard_id}
```

**Response**:
```json
{
  "data": {
    "dashboard_id": "DASH001",
    "name": "Executive Overview",
    "widgets": [
      {
        "widget_id": "W001",
        "title": "Application Inventory",
        "type": "BAR_CHART",
        "data": {
          "active": 45,
          "deprecated": 12,
          "planned": 8
        }
      },
      {
        "widget_id": "W002",
        "title": "Top Risks",
        "type": "TABLE",
        "data": [
          {"rank": 1, "risk": "Legacy System Failure", "exposure": 850}
        ]
      }
    ]
  }
}
```

---

### 5.2 KPI Tracking

```
GET /analytics/kpis/{kpi_id}
```

**Parameters**:
```
period: [TODAY, THIS_WEEK, THIS_MONTH, THIS_QUARTER, THIS_YEAR]
comparison: [PREVIOUS_PERIOD, YEAR_OVER_YEAR]
```

---

## 6. Governance Endpoints

### 6.1 Compliance Status

```
GET /governance/compliance/{regulation_id}
```

**Response**:
```json
{
  "data": {
    "regulation_id": "GDPR",
    "name": "GDPR",
    "overall_status": "COMPLIANT",
    "requirements": [
      {
        "requirement_id": "GDPR-001",
        "name": "Data Processing Agreement",
        "status": "COMPLIANT",
        "evidence": "Contract signed 2026-01-15",
        "responsible": "legal@company.com"
      }
    ],
    "gaps": 0,
    "last_assessment": "2026-06-01T00:00:00Z"
  }
}
```

---

### 6.2 Control Status

```
GET /governance/controls/{control_id}
```

**Response**:
```json
{
  "data": {
    "control_id": "CTRL001",
    "name": "Access Control Review",
    "testing_status": "PASSED",
    "last_tested": "2026-05-01T00:00:00Z",
    "effectiveness": 0.95,
    "mitigates_risks": ["RISK001", "RISK002"],
    "evidence": ["test-report-001.pdf"]
  }
}
```

---

## 7. Webhook Endpoints

### 7.1 Create Webhook

```
POST /webhooks
```

**Request**:
```json
{
  "name": "Application Change Webhook",
  "url": "https://external-system.com/trazo-webhook",
  "events": ["application.created", "application.updated", "application.deleted"],
  "active": true
}
```

---

### 7.2 List Webhooks

```
GET /webhooks
```

---

### 7.3 Delete Webhook

```
DELETE /webhooks/{webhook_id}
```

---

## 8. Error Responses

### Standard Error Format

```json
{
  "status": "error",
  "code": 400,
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "app_id",
        "message": "app_id is required"
      }
    ]
  },
  "timestamp": "2026-06-06T10:30:00Z",
  "request_id": "req-12345"
}
```

### Common Error Codes

| Code | Message | Resolution |
|------|---------|-----------|
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Provide valid access token |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify entity ID |
| 429 | Rate Limited | Implement backoff |
| 500 | Server Error | Retry with exponential backoff |

---

## 9. Rate Limiting

**Rate Limits**:
- Standard: 1000 requests per minute
- Burst: 100 requests per second
- Batch: 10 concurrent requests

**Headers**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1717668600
```

---

## 10. Pagination

**Query Parameters**:
```
limit: Integer (default: 100, max: 1000)
offset: Integer (default: 0)
```

**Response Envelope**:
```json
{
  "data": [...],
  "pagination": {
    "total": 5000,
    "limit": 100,
    "offset": 200,
    "has_more": true
  }
}
```

---

## 11. API Versioning

TRAZO uses URL-based versioning:
- Current: `/api/v1`
- Deprecated: `/api/v0` (sunset 2027-01-01)

---

## 12. SDK Availability

### Python SDK
```python
from trazo import Client

client = Client(
    base_url="https://trazo.enterprise.com",
    access_token="your-token"
)

apps = client.applications.list(status="ACTIVE")
impact = client.graph.impact_analysis(
    entity_type="Application",
    entity_id="APP001",
    change_type="DECOMMISSION"
)
```

### JavaScript SDK
```javascript
const trazo = new TrazoClient({
    baseUrl: 'https://trazo.enterprise.com',
    accessToken: 'your-token'
});

const apps = await trazo.applications.list({ status: 'ACTIVE' });
const impact = await trazo.graph.impactAnalysis({...});
```

---

## 13. API Roadmap

### Q3 2026
- GraphQL API support
- Batch operation endpoint
- Advanced filtering on all resources

### Q4 2026
- Real-time WebSocket updates
- Custom query builder UI
- API usage analytics


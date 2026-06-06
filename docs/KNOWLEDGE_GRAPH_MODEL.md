# TRAZO Enterprise Knowledge Graph Data Model

**Document Version:** 1.0  
**Last Updated:** 2026-06-06  
**Status:** Active

---

## Overview

This document defines the entity types, relationships, and properties that comprise the TRAZO Enterprise Knowledge Graph. The graph is a property graph model using Neo4j with support for rich attributes, temporal properties, and relationship semantics.

---

## 1. Graph Architecture Principles

- **Property Graph Model**: Nodes (entities) with properties and labeled relationships
- **Domain Isolation**: 8 distinct domains with separate but interconnected entity types
- **Relationship Semantics**: Typed relationships with directional meaning
- **Temporal Support**: All entities have creation/modification timestamps
- **Audit Trail**: Every change is logged with actor and reason

---

## 2. Strategy Domain

### Vision (Node Label: `Vision`)

**Purpose**: Highest-level enterprise aspiration

**Properties**:
```
vision_id: String (unique)
name: String
description: String
created_by: String
created_at: Timestamp
updated_at: Timestamp
status: Enum [ACTIVE, ARCHIVED]
```

**Example**:
```cypher
CREATE (v:Vision {
  vision_id: "V001",
  name: "Customer-Centric Digital Enterprise",
  description: "Become the industry leader in customer experience",
  status: "ACTIVE",
  created_at: timestamp(),
  updated_at: timestamp()
})
```

---

### Objective (Node Label: `Objective`)

**Purpose**: Strategic goals derived from vision

**Properties**:
```
objective_id: String (unique)
name: String
description: String
planned_completion: Date
owner: String (person/team)
priority: Enum [HIGH, MEDIUM, LOW]
status: Enum [PLANNING, IN_PROGRESS, AT_RISK, COMPLETED]
created_at: Timestamp
updated_at: Timestamp
```

---

### OKR (Node Label: `OKR`)

**Purpose**: Objectives and Key Results for measurable outcomes

**Properties**:
```
okr_id: String (unique)
objective: String
key_result: String
target_value: String
current_value: String
measurement_unit: String
period: String (e.g., "Q2 2026")
owner: String
confidence: Float (0-1)
created_at: Timestamp
updated_at: Timestamp
```

---

### KPI (Node Label: `KPI`)

**Purpose**: Key Performance Indicators for continuous monitoring

**Properties**:
```
kpi_id: String (unique)
name: String
description: String
measurement_unit: String
current_value: Float
target_value: Float
threshold_yellow: Float
threshold_red: Float
owner: String
frequency: Enum [DAILY, WEEKLY, MONTHLY, QUARTERLY]
last_measured: Timestamp
created_at: Timestamp
updated_at: Timestamp
```

---

### Initiative (Node Label: `Initiative`)

**Purpose**: Programs of work aligned to strategic objectives

**Properties**:
```
initiative_id: String (unique)
name: String
description: String
planned_start: Date
planned_end: Date
actual_start: Date
actual_end: Date
budget: Float
spent: Float
owner: String
status: Enum [PROPOSED, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED]
business_case: String
expected_benefits: String
created_at: Timestamp
updated_at: Timestamp
```

---

## 3. Business Domain

### Capability (Node Label: `Capability`)

**Purpose**: Business capabilities organized in a capability model

**Properties**:
```
capability_id: String (unique)
name: String
description: String
capability_level: Integer (1-5, maturity level)
owner: String (person/team)
parent_capability_id: String (hierarchical)
business_unit: String
status: Enum [PLANNED, EMERGING, MANAGED, OPTIMIZED]
criticality: Enum [CRITICAL, HIGH, MEDIUM, LOW]
created_at: Timestamp
updated_at: Timestamp
```

---

### Value Stream (Node Label: `ValueStream`)

**Purpose**: End-to-end flow of value to customers

**Properties**:
```
value_stream_id: String (unique)
name: String
description: String
customer_segment: String
primary_capability: String
owner: String
metrics: String (JSON array of KPI references)
status: Enum [ACTIVE, OPTIMIZING, DEPRECATED]
created_at: Timestamp
updated_at: Timestamp
```

---

### Process (Node Label: `Process`)

**Purpose**: Business processes (BPMN aligned)

**Properties**:
```
process_id: String (unique)
name: String
description: String
bpmn_definition: String (URL or embedded)
owner: String
process_category: String
cycle_time: Integer (minutes)
cost_per_execution: Float
volume_per_month: Integer
status: Enum [ACTIVE, REDESIGNING, DEPRECATED]
created_at: Timestamp
updated_at: Timestamp
```

---

### Product (Node Label: `Product`)

**Purpose**: Business products or services

**Properties**:
```
product_id: String (unique)
name: String
description: String
product_line: String
owner: String
market_segment: String
annual_revenue: Float
customer_count: Integer
launch_date: Date
status: Enum [ROADMAP, LIVE, DECLINING, SUNSET]
created_at: Timestamp
updated_at: Timestamp
```

---

### Organization (Node Label: `Organization`)

**Purpose**: Organizational units and teams

**Properties**:
```
org_id: String (unique)
name: String
org_type: Enum [DEPARTMENT, TEAM, DIVISION, BOARD]
parent_org_id: String (hierarchical)
budget: Float
head_count: Integer
cfo_code: String (cost center)
owner: String (executive)
created_at: Timestamp
updated_at: Timestamp
```

---

## 4. Requirements Domain

### Epic (Node Label: `Epic`)

**Purpose**: High-level requirements grouping

**Properties**:
```
epic_id: String (unique)
name: String
description: String
jira_key: String (external reference)
priority: Enum [P0, P1, P2, P3, P4]
capability_id: String (related capability)
status: Enum [BACKLOG, IN_PROGRESS, DONE, DEPRECATED]
due_date: Date
owner: String
created_at: Timestamp
updated_at: Timestamp
```

---

### Feature (Node Label: `Feature`)

**Purpose**: Implemented features or user-facing functionality

**Properties**:
```
feature_id: String (unique)
name: String
description: String
jira_key: String
epic_id: String (parent)
story_count: Integer
status: Enum [BACKLOG, IN_PROGRESS, IN_REVIEW, DONE]
owner: String
release_version: String
created_at: Timestamp
updated_at: Timestamp
```

---

### UserStory (Node Label: `UserStory`)

**Purpose**: Individual requirements in Agile format

**Properties**:
```
story_id: String (unique)
title: String
description: String (As a... I want... So that...)
jira_key: String
feature_id: String (parent)
acceptance_criteria: String (JSON array)
story_points: Integer
status: Enum [BACKLOG, SPRINT, IN_PROGRESS, IN_REVIEW, DONE]
assignee: String
created_at: Timestamp
updated_at: Timestamp
```

---

### Requirement (Node Label: `Requirement`)

**Purpose**: Formal requirements (functional and non-functional)

**Properties**:
```
requirement_id: String (unique)
name: String
description: String
requirement_type: Enum [FUNCTIONAL, NON_FUNCTIONAL, REGULATORY, PERFORMANCE]
priority: Enum [MUST, SHOULD, COULD, WONT]
status: Enum [DRAFT, APPROVED, IMPLEMENTED, DEPRECATED]
owner: String
related_story_ids: String[] (array)
related_control_ids: String[] (array)
created_at: Timestamp
updated_at: Timestamp
```

---

### TestCase (Node Label: `TestCase`)

**Purpose**: Formal test specifications

**Properties**:
```
test_id: String (unique)
name: String
description: String
test_type: Enum [UNIT, INTEGRATION, SYSTEM, ACCEPTANCE]
story_id: String (what story it tests)
expected_result: String
status: Enum [DRAFT, READY, EXECUTED, PASSED, FAILED]
execution_date: Timestamp
created_at: Timestamp
updated_at: Timestamp
```

---

## 5. Application Domain

### Application (Node Label: `Application`)

**Purpose**: Enterprise applications and systems

**Properties**:
```
app_id: String (unique)
name: String
description: String
cmdb_id: String (external reference)
application_type: Enum [COTS, CUSTOM, SAAS, LEGACY, CLOUD_NATIVE]
owner: String
criticality: Enum [CRITICAL, HIGH, MEDIUM, LOW]
status: Enum [ACTIVE, PLANNED, DEPRECATED, SUNSET]
tech_stack: String[] (array)
vendor: String
cost_per_year: Float
created_at: Timestamp
updated_at: Timestamp
```

---

### Service (Node Label: `Service`)

**Purpose**: Microservices or service components

**Properties**:
```
service_id: String (unique)
name: String
description: String
app_id: String (parent application)
service_type: Enum [MICROSERVICE, API, BACKEND, FRONTEND]
framework: String
language: String
repository_url: String
owner: String (team)
status: Enum [IN_DEVELOPMENT, ACTIVE, DEPRECATED]
sla_uptime: Float (0-100)
created_at: Timestamp
updated_at: Timestamp
```

---

### API (Node Label: `API`)

**Purpose**: REST, GraphQL, gRPC, or other APIs

**Properties**:
```
api_id: String (unique)
name: String
description: String
service_id: String (parent service)
api_type: Enum [REST, GRAPHQL, GRPC, SOAP]
base_url: String
documentation_url: String
version: String
owner: String
status: Enum [ACTIVE, DEPRECATED, PLANNED]
rate_limit: Integer (requests per minute)
created_at: Timestamp
updated_at: Timestamp
```

---

### Component (Node Label: `Component`)

**Purpose**: Software components or modules

**Properties**:
```
component_id: String (unique)
name: String
description: String
service_id: String (parent service)
component_type: Enum [MODULE, LIBRARY, PLUGIN, ADAPTER]
language: String
repository_path: String
owner: String
created_at: Timestamp
updated_at: Timestamp
```

---

### Repository (Node Label: `Repository`)

**Purpose**: Source code repositories

**Properties**:
```
repo_id: String (unique)
name: String
url: String
repository_type: Enum [GIT, SVNTECH]
language: String
team: String
visibility: Enum [PUBLIC, PRIVATE, INTERNAL]
last_commit: Timestamp
created_at: Timestamp
updated_at: Timestamp
```

---

## 6. Data Domain

### DataDomain (Node Label: `DataDomain`)

**Purpose**: Logical data domains

**Properties**:
```
domain_id: String (unique)
name: String
description: String
data_steward: String
owner: String
data_quality_score: Float (0-100)
created_at: Timestamp
updated_at: Timestamp
```

---

### DataProduct (Node Label: `DataProduct`)

**Purpose**: Products of data engineering efforts

**Properties**:
```
product_id: String (unique)
name: String
description: String
domain_id: String (parent domain)
owner: String (data product owner)
sla: String (availability, freshness)
schema: String (JSON schema URL)
format: Enum [PARQUET, CSV, JSON, DELTA, ICEBERG]
size_gb: Float
rowcount: Integer
last_updated: Timestamp
created_at: Timestamp
updated_at: Timestamp
```

---

### Dataset (Node Label: `Dataset`)

**Purpose**: Individual datasets

**Properties**:
```
dataset_id: String (unique)
name: String
description: String
product_id: String (parent product)
domain_id: String
location: String (cloud path)
access_level: Enum [PUBLIC, INTERNAL, RESTRICTED, CONFIDENTIAL]
pii_fields: String[] (array of column names)
owner: String
retention_days: Integer
created_at: Timestamp
updated_at: Timestamp
```

---

### Pipeline (Node Label: `Pipeline`)

**Purpose**: ETL/ELT data pipelines

**Properties**:
```
pipeline_id: String (unique)
name: String
description: String
pipeline_tool: Enum [AIRFLOW, DAGSTER, PREFECT, DBT, SPARK]
schedule: String (cron expression)
owner: String
status: Enum [ACTIVE, DEVELOPMENT, DEPRECATED]
run_frequency: String
avg_duration_minutes: Integer
last_run: Timestamp
created_at: Timestamp
updated_at: Timestamp
```

---

### Dashboard (Node Label: `Dashboard`)

**Purpose**: Data visualization dashboards

**Properties**:
```
dashboard_id: String (unique)
name: String
description: String
platform: String (Tableau, Looker, Power BI, etc.)
owner: String
audience: String[] (array)
refresh_frequency: String
url: String
datasets: String[] (array of dataset IDs)
created_at: Timestamp
updated_at: Timestamp
```

---

### Report (Node Label: `Report`)

**Purpose**: Formal reports and analytics

**Properties**:
```
report_id: String (unique)
name: String
description: String
report_type: Enum [OPERATIONAL, ANALYTICAL, COMPLIANCE, EXECUTIVE]
owner: String
distribution_list: String[]
refresh_frequency: String
datasets: String[] (array)
created_at: Timestamp
updated_at: Timestamp
```

---

## 7. Technology Domain

### Platform (Node Label: `Platform`)

**Purpose**: Technology platforms and runtimes

**Properties**:
```
platform_id: String (unique)
name: String
description: String
platform_type: Enum [KUBERNETES, OPENSHIFT, CLOUD, BAREMETAL]
owner: String
capacity_cpu: Integer (cores)
capacity_memory: Integer (GB)
capacity_storage: Integer (TB)
region: String
status: Enum [ACTIVE, SCALING, MAINTENANCE, DEPRECATED]
created_at: Timestamp
updated_at: Timestamp
```

---

### Container (Node Label: `Container`)

**Purpose**: Container images and deployments

**Properties**:
```
container_id: String (unique)
name: String
image_registry: String
image_tag: String
service_id: String (parent service)
image_size_mb: Integer
vulnerability_count: Integer
base_image: String
owner: String
last_scanned: Timestamp
created_at: Timestamp
updated_at: Timestamp
```

---

### Cluster (Node Label: `Cluster`)

**Purpose**: Kubernetes or container orchestration clusters

**Properties**:
```
cluster_id: String (unique)
name: String
cluster_type: Enum [KUBERNETES, ECS, FARGATE]
cloud_provider: String
region: String
node_count: Integer
platform_id: String (parent platform)
owner: String
status: Enum [ACTIVE, SCALING, MAINTENANCE]
created_at: Timestamp
updated_at: Timestamp
```

---

### Database (Node Label: `Database`)

**Purpose**: Databases and data stores

**Properties**:
```
database_id: String (unique)
name: String
database_type: Enum [RELATIONAL, NOSQL, GRAPH, TIMESERIES]
technology: String (PostgreSQL, MongoDB, Neo4j, etc.)
location: String (cloud region)
size_gb: Float
backup_enabled: Boolean
owner: String
status: Enum [ACTIVE, PLANNED, DEPRECATED]
created_at: Timestamp
updated_at: Timestamp
```

---

### CloudResource (Node Label: `CloudResource`)

**Purpose**: Cloud infrastructure resources

**Properties**:
```
resource_id: String (unique)
name: String
resource_type: Enum [COMPUTE, STORAGE, NETWORK, DATABASE, ANALYTICS]
cloud_provider: Enum [AWS, AZURE, GCP]
service_type: String (EC2, S3, VPC, RDS, etc.)
region: String
tags: String (JSON)
monthly_cost: Float
owner: String (team/application)
status: Enum [ACTIVE, SCALING, DEPRECATED]
created_at: Timestamp
updated_at: Timestamp
```

---

## 8. Governance Domain

### Risk (Node Label: `Risk`)

**Purpose**: Enterprise risks and threats

**Properties**:
```
risk_id: String (unique)
name: String
description: String
risk_category: Enum [STRATEGIC, OPERATIONAL, FINANCIAL, COMPLIANCE, SECURITY]
probability: Float (0-1)
impact_level: Enum [CRITICAL, HIGH, MEDIUM, LOW]
exposure_score: Float (probability * impact)
owner: String
mitigation_strategy: String
status: Enum [ACTIVE, MITIGATED, CLOSED]
target_closure_date: Date
created_at: Timestamp
updated_at: Timestamp
```

---

### Control (Node Label: `Control`)

**Purpose**: Risk controls and security controls

**Properties**:
```
control_id: String (unique)
name: String
description: String
control_type: Enum [PREVENTIVE, DETECTIVE, CORRECTIVE]
control_category: Enum [TECHNICAL, OPERATIONAL, MANAGEMENT]
owner: String
testing_frequency: Enum [CONTINUOUS, MONTHLY, QUARTERLY, ANNUALLY]
effectiveness: Float (0-100)
last_tested: Timestamp
status: Enum [ACTIVE, DEGRADED, INACTIVE]
created_at: Timestamp
updated_at: Timestamp
```

---

### Policy (Node Label: `Policy`)

**Purpose**: Enterprise policies and standards

**Properties**:
```
policy_id: String (unique)
name: String
description: String
policy_type: Enum [SECURITY, PRIVACY, DATA, GOVERNANCE, OPERATIONAL]
owner: String
enforcement_level: Enum [MANDATORY, RECOMMENDED, GUIDANCE]
effective_date: Date
expiration_date: Date
version: String
status: Enum [ACTIVE, DEPRECATED, ARCHIVED]
created_at: Timestamp
updated_at: Timestamp
```

---

### Regulation (Node Label: `Regulation`)

**Purpose**: External regulations and standards

**Properties**:
```
regulation_id: String (unique)
name: String
description: String
regulation_type: Enum [GDPR, HIPAA, PCI_DSS, SOC2, ISO27001, CCPA]
jurisdiction: String
effective_date: Date
requirements_count: Integer
owner: String (compliance officer)
status: Enum [ACTIVE, EFFECTIVE, DEPRECATED]
created_at: Timestamp
updated_at: Timestamp
```

---

### ComplianceRequirement (Node Label: `ComplianceRequirement`)

**Purpose**: Specific compliance requirements

**Properties**:
```
requirement_id: String (unique)
name: String
description: String
regulation_id: String (parent)
requirement_number: String (e.g., "GDPR-Article-5")
owner: String
status: Enum [OPEN, IN_PROGRESS, COMPLIANT, NON_COMPLIANT]
due_date: Date
evidence_provided: Boolean
created_at: Timestamp
updated_at: Timestamp
```

---

### Audit (Node Label: `Audit`)

**Purpose**: Audit findings and assessments

**Properties**:
```
audit_id: String (unique)
name: String
audit_type: Enum [INTERNAL, EXTERNAL, COMPLIANCE, SECURITY]
auditor: String
audit_date: Date
scope: String
findings_count: Integer
remediation_count: Integer
status: Enum [SCHEDULED, IN_PROGRESS, COMPLETED]
report_url: String
created_at: Timestamp
updated_at: Timestamp
```

---

## 9. AI Domain

### AIAgent (Node Label: `AIAgent`)

**Purpose**: Autonomous AI agents

**Properties**:
```
agent_id: String (unique)
name: String
description: String
agent_type: Enum [DISCOVERY, MAPPING, GOVERNANCE, REASONING, AUTOMATION]
domain: String (agent's domain)
owner: String (development team)
llm_model: String (Claude 3.5, GPT-4, etc.)
version: String
status: Enum [ACTIVE, DEVELOPMENT, DEPRECATED]
created_at: Timestamp
updated_at: Timestamp
```

---

### Model (Node Label: `Model`)

**Purpose**: ML/AI models

**Properties**:
```
model_id: String (unique)
name: String
description: String
model_type: Enum [LLM, CLASSIFICATION, REGRESSION, CLUSTERING]
owner: String
framework: String (PyTorch, TensorFlow, etc.)
version: String
accuracy: Float
training_date: Date
evaluation_metrics: String (JSON)
status: Enum [DEVELOPMENT, PRODUCTION, DEPRECATED]
created_at: Timestamp
updated_at: Timestamp
```

---

### Prompt (Node Label: `Prompt`)

**Purpose**: Prompts used by agents

**Properties**:
```
prompt_id: String (unique)
name: String
description: String
agent_id: String (parent agent)
prompt_text: String
version: String
expected_output_format: String
testing_status: Enum [DRAFT, TESTED, OPTIMIZED]
owner: String
created_at: Timestamp
updated_at: Timestamp
```

---

### Decision (Node Label: `Decision`)

**Purpose**: AI-driven decisions and outcomes

**Properties**:
```
decision_id: String (unique)
decision_type: String
agent_id: String (who made it)
timestamp: Timestamp
inputs: String (JSON)
reasoning: String
recommended_action: String
human_approval_required: Boolean
actual_outcome: String
outcome_timestamp: Timestamp
created_at: Timestamp
updated_at: Timestamp
```

---

### Workflow (Node Label: `Workflow`)

**Purpose**: Multi-agent workflows

**Properties**:
```
workflow_id: String (unique)
name: String
description: String
workflow_type: Enum [DISCOVERY, ANALYSIS, REMEDIATION, REPORTING]
steps: String[] (array of agent IDs in sequence)
owner: String
trigger_event: String
status: Enum [ACTIVE, DEVELOPMENT, DEPRECATED]
created_at: Timestamp
updated_at: Timestamp
```

---

## 10. Core Relationship Types

### Strategy Relationships
```
(:Objective) -[IMPLEMENTS]-> (:Vision)
(:OKR) -[MEASURES]-> (:Objective)
(:KPI) -[TRACKS]-> (:OKR)
(:Initiative) -[CONTRIBUTES_TO]-> (:Objective)
(:Initiative) -[CONTAINS]-> (:Project)
```

### Business Relationships
```
(:Capability) -[ENABLES]-> (:ValueStream)
(:ValueStream) -[CONSISTS_OF]-> (:Process)
(:Process) -[OWNED_BY]-> (:Organization)
(:Capability) -[SUPPORTS]-> (:Product)
(:Product) -[OFFERED_BY]-> (:Organization)
```

### Requirements Relationships
```
(:Epic) -[CONTAINS]-> (:Feature)
(:Feature) -[CONTAINS]-> (:UserStory)
(:UserStory) -[IMPLEMENTS]-> (:Requirement)
(:UserStory) -[TESTED_BY]-> (:TestCase)
(:Requirement) -[SUPPORTS]-> (:Capability)
```

### Application Relationships
```
(:Application) -[EXPOSES]-> (:API)
(:API) -[CALLS]-> (:API)
(:Service) -[PART_OF]-> (:Application)
(:Component) -[PART_OF]-> (:Service)
(:Repository) -[SOURCES]-> (:Service)
(:Application) -[DEPENDS_ON]-> (:Application)
(:Service) -[DEPLOYED_ON]-> (:Container)
(:Container) -[RUNS_ON]-> (:Cluster)
```

### Data Relationships
```
(:Pipeline) -[PRODUCES]-> (:Dataset)
(:Pipeline) -[CONSUMES]-> (:Dataset)
(:Dataset) -[PART_OF]-> (:DataProduct)
(:DataProduct) -[IN_DOMAIN]-> (:DataDomain)
(:Dataset) -[ANALYZED_BY]-> (:Dashboard)
(:Dataset) -[SOURCE_OF]-> (:Report)
```

### Technology Relationships
```
(:Service) -[DEPLOYED_ON]-> (:Platform)
(:Application) -[USES]-> (:Database)
(:Application) -[RUNS_ON]-> (:CloudResource)
(:CloudResource) -[IN_REGION]-> (:Region)
```

### Governance Relationships
```
(:Risk) -[MITIGATED_BY]-> (:Control)
(:Control) -[MANAGES]-> (:Risk)
(:Control) -[IMPLEMENTS]-> (:Policy)
(:Policy) -[ALIGNED_WITH]-> (:Regulation)
(:ComplianceRequirement) -[FULFILLED_BY]-> (:Control)
(:Audit) -[ASSESSES]-> (:Control)
```

### AI Relationships
```
(:AIAgent) -[USES]-> (:Model)
(:Model) -[TRAINED_ON]-> (:Dataset)
(:Prompt) -[EXECUTES_VIA]-> (:AIAgent)
(:AIAgent) -[MAKES]-> (:Decision)
(:Workflow) -[ORCHESTRATES]-> (:AIAgent)
```

---

## 11. Query Patterns

### End-to-End Traceability
```cypher
MATCH path = (:Objective)-[:CONTRIBUTES_TO*]->(:ValueStream)
  -[:CONSISTS_OF]->(:Process)
  -[:IMPLEMENTED_BY]->(:Application)
  -[:EXPOSES]->(:API)
  -[:CONSUMES]->(:Dataset)
RETURN path
```

### Impact Analysis
```cypher
MATCH (app:Application {app_id: 'APP001'})
MATCH (impacted) <-[rel:DEPENDS_ON|CONSUMES|USES*]- (app)
RETURN DISTINCT impacted, COUNT(*) as impact_level
ORDER BY impact_level DESC
```

### Compliance Coverage
```cypher
MATCH (reg:Regulation {regulation_id: 'GDPR'})
MATCH (reg)-[:REQUIRES]->(cr:ComplianceRequirement)
OPTIONAL MATCH (cr)-[:FULFILLED_BY]->(c:Control)
RETURN reg, cr, c, CASE WHEN c IS NULL THEN 'GAP' ELSE 'COVERED' END as status
```

---

## 12. Schema Management

### Entity Cardinality
- Strategy: 100-1000 (small to medium enterprises)
- Business: 500-5000
- Requirements: 1000-100000
- Applications: 100-1000
- Data: 1000-100000
- Technology: 5000-50000
- Governance: 100-1000
- AI: 50-500

### Performance Indexes
- Create indexes on: `{entity_id}`, `{status}`, `{created_at}`
- Create compound indexes on: `{domain_id, status}`, `{owner, status}`

### Backup & Recovery
- Full backup daily
- Incremental backup hourly
- Audit log retention: 7 years
- Entity retention: 5 years

---

## 13. Data Quality Rules

### Validation Rules
1. All IDs must be globally unique
2. All entities must have owner
3. All relationships must have creation timestamp
4. Status must be from defined enums
5. Dates must be logically consistent
6. Cost/metric values must be non-negative

### Reconciliation Rules
1. External references must resolve to entities
2. Hierarchical relationships must be acyclic
3. Ownership must follow org hierarchy
4. Compliance must have audit trail


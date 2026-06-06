# TRAZO Integration Framework

**Document Version:** 1.0  
**Last Updated:** 2026-06-06  
**Status:** Active

---

## Overview

This document describes the integration architecture, patterns, and specifications for connecting TRAZO to enterprise systems. The framework supports multiple integration patterns (pull, push, event-driven, and batch) while ensuring data quality, security, and performance.

---

## 1. Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Enterprise Systems                          │
│  (Jira, ServiceNow, Snowflake, AWS, GitHub, etc.)      │
└─────────────────────────────────────────────────────────┘
                          ▲
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    ┌───▼────┐      ┌─────▼─────┐      ┌───▼────┐
    │  REST  │      │  Webhooks │      │  Batch │
    │ Polling│      │  (Events) │      │ Import │
    └───┬────┘      └─────┬─────┘      └───┬────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                    ┌─────▼──────┐
                    │ Connector   │
                    │ Layer       │
                    └─────┬──────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
      ┌─────▼──┐    ┌─────▼──┐    ┌────▼───┐
      │Validation
      │        │    │Transform│    │Cache   │
      └────┬───┘    └────┬────┘    └───┬────┘
           │             │            │
           └─────────────┼────────────┘
                         │
                  ┌──────▼───────┐
                  │  Kafka Topic │
                  └──────┬───────┘
                         │
                  ┌──────▼──────────────────┐
                  │ Agentic Processing     │
                  │ (Discovery, Mapping)   │
                  └──────┬──────────────────┘
                         │
                  ┌──────▼──────────────────┐
                  │ Knowledge Graph        │
                  │ (Neo4j Update)         │
                  └───────────────────────┘
```

---

## 2. Integration Patterns

### 2.1 Pull Pattern (Scheduled API Polling)

**Best For**: Non-real-time sources, read-only data

**Characteristics**:
- Connector polls source system via REST API
- Scheduled execution (e.g., daily, hourly)
- Graceful handling of rate limits
- Incremental data fetch

**Implementation**:
```python
class PullConnector:
    def __init__(self, source, schedule):
        self.source = source
        self.schedule = schedule
    
    def fetch_data(self):
        """Fetch delta from last poll"""
        last_sync = self.get_last_sync_time()
        data = self.source.list(since=last_sync)
        return data
    
    def process(self):
        data = self.fetch_data()
        validated = self.validate(data)
        transformed = self.transform(validated)
        self.publish_to_kafka(transformed)
```

---

### 2.2 Push Pattern (Webhooks/Events)

**Best For**: Real-time updates, streaming data

**Characteristics**:
- Source system pushes events to TRAZO
- Webhook endpoint receives events
- Near real-time latency (< 1 second)
- Requires callback registration

**Implementation**:
```python
class WebhookReceiver:
    @app.post('/webhook/{source_type}')
    async def receive_event(source_type: str, payload: dict):
        """Handle webhook event from source system"""
        event = Event.from_webhook(source_type, payload)
        await validate_event(event)
        await publish_to_kafka(event)
        return {"status": "received"}
```

---

### 2.3 Event-Streaming Pattern (Kafka)

**Best For**: High-volume, real-time data

**Characteristics**:
- Source system publishes to Kafka
- TRAZO subscribes to topic
- Message ordering preserved
- Consumer group for scaling

**Implementation**:
```python
class KafkaConnector:
    def consume_events(self, topic):
        consumer = KafkaConsumer(topic)
        for message in consumer:
            event = json.loads(message.value)
            transformed = self.transform(event)
            self.update_graph(transformed)
```

---

### 2.4 Batch Import Pattern

**Best For**: Large-scale imports, migrations, one-time loads

**Characteristics**:
- Upload CSV, JSON, or Excel files
- Batch processing with validation
- Progress tracking
- Rollback capability

**Implementation**:
```python
class BatchImporter:
    def import_file(self, file_path, entity_type):
        """Import batch data from file"""
        data = self.parse_file(file_path)
        validated = self.validate_batch(data, entity_type)
        
        with transaction():
            for record in validated:
                entity = self.transform_record(record)
                self.graph.create_entity(entity)
        
        return {"imported": len(validated), "errors": 0}
```

---

## 3. Connector Specifications

### 3.1 Generic Connector Interface

```python
class BaseConnector(ABC):
    """Base class for all TRAZO connectors"""
    
    @abstractmethod
    def authenticate(self) -> bool:
        """Authenticate with source system"""
        pass
    
    @abstractmethod
    def discover(self) -> List[Dict]:
        """Discover available metadata"""
        pass
    
    @abstractmethod
    def fetch(self, query: Dict) -> List[Dict]:
        """Fetch data based on query"""
        pass
    
    def validate(self, data: List[Dict]) -> List[Dict]:
        """Validate data against schema"""
        validated = []
        for record in data:
            if self.is_valid(record):
                validated.append(record)
            else:
                self.log_error(f"Invalid record: {record}")
        return validated
    
    def transform(self, data: List[Dict]) -> List[Dict]:
        """Transform to TRAZO schema"""
        return [self.transform_record(r) for r in data]
    
    @abstractmethod
    def transform_record(self, record: Dict) -> Dict:
        """Transform single record"""
        pass
```

---

### 3.2 Connector Configuration

```yaml
connector:
  name: "Jira Cloud"
  type: "pull"
  source_system: "jira"
  
  authentication:
    method: "oauth"
    endpoints:
      auth: "https://auth.atlassian.com"
      api: "https://api.atlassian.com"
    credentials:
      client_id: "${JIRA_CLIENT_ID}"
      client_secret: "${JIRA_CLIENT_SECRET}"
  
  schedule:
    frequency: "hourly"
    start_time: "00:00"
    timeout: 600
  
  data_mappings:
    project: "Project"
    issue: "UserStory"
    epic: "Epic"
  
  rate_limiting:
    requests_per_minute: 600
    burst_size: 100
  
  error_handling:
    retry_policy: "exponential_backoff"
    max_retries: 3
    fallback_enabled: true
```

---

## 4. Supported Connectors

### Enterprise Architecture
- **LeanIX**: Pull (REST API), Real-time webhook support
- **Ardoq**: Pull (REST API), Webhook support
- **HOPEX**: Pull (REST API)
- **Sparx EA**: Batch (XML export)

### Agile/DevOps
- **Jira Cloud**: Pull/Webhook, Cloud-native
- **Jira Server**: Pull, Self-hosted
- **Azure DevOps**: Pull/Webhook
- **GitHub**: Pull/Webhook (events)
- **GitLab**: Pull/Webhook

### ITSM
- **ServiceNow**: Pull/Webhook, CMDB support
- **BMC Remedy**: Pull (REST API)

### Data Platforms
- **Snowflake**: Pull (Direct connection)
- **BigQuery**: Pull (Direct connection)
- **Databricks**: Pull (Direct connection)
- **Atlan**: Pull/Webhook, Metadata-native
- **DataHub**: Pull/Webhook, OpenMetadata-native
- **OpenMetadata**: Pull/Webhook

### Cloud Platforms
- **AWS**: Pull (SDK), CloudTrail events
- **Azure**: Pull (SDK), Event Grid
- **GCP**: Pull (SDK), Pub/Sub events

### Security
- **CrowdStrike**: Pull (API)
- **Splunk**: Pull/Webhook (HTTP Event Collector)
- **Palo Alto Networks**: Pull (API)

### Workflow
- **Apache Airflow**: Pull (REST API)
- **Dagster**: Pull (REST API)
- **Prefect**: Pull/Webhook

---

## 5. Data Transformation

### 5.1 Transformation Patterns

#### Identity Mapping
```yaml
mapping:
  source:
    entity_type: "issue"
    identifier_field: "key"
  target:
    entity_type: "UserStory"
    identifier_field: "story_id"
  
  field_mappings:
    key: "story_id"
    summary: "title"
    description: "description"
    status: "status"
    assignee: "assignee"
```

#### Relationship Creation
```yaml
relationships:
  - source: "issue.epic_link"
    target: "Epic"
    relationship_type: "CONTAINS"
  
  - source: "issue.assignee"
    target: "User"
    relationship_type: "OWNED_BY"
  
  - source: "issue.linked_issues"
    target: "UserStory"
    relationship_type: "DEPENDS_ON"
```

#### Type Conversion
```python
def transform_status(jira_status: str) -> str:
    mapping = {
        "To Do": "BACKLOG",
        "In Progress": "IN_PROGRESS",
        "In Review": "IN_REVIEW",
        "Done": "DONE"
    }
    return mapping.get(jira_status, "UNKNOWN")
```

---

### 5.2 Validation Rules

```python
class ValidationRules:
    @staticmethod
    def validate_record(record: Dict) -> Tuple[bool, str]:
        """Validate record against rules"""
        
        # Required fields
        required = ["id", "name", "type"]
        for field in required:
            if field not in record:
                return False, f"Missing required field: {field}"
        
        # Type validation
        if not isinstance(record["id"], str):
            return False, "ID must be string"
        
        # Format validation
        if not re.match(r'^[A-Z0-9\-]+$', record["id"]):
            return False, "Invalid ID format"
        
        return True, "Valid"
```

---

## 6. Data Quality Framework

### Quality Metrics

| Metric | Target | Monitoring |
|--------|--------|-----------|
| Completeness | > 95% | Missing fields |
| Accuracy | > 99% | Reconciliation with source |
| Timeliness | < 1 hour | Sync latency |
| Consistency | 100% | Schema validation |
| Uniqueness | 100% | Duplicate detection |

### Quality Checks

```python
class QualityAssurance:
    def check_completeness(self, data: List[Dict]) -> float:
        """% of required fields populated"""
        required_fields = {"id", "name", "type"}
        complete = sum(1 for r in data if all(f in r for f in required_fields))
        return complete / len(data) * 100
    
    def check_freshness(self, last_sync: Timestamp) -> bool:
        """Data updated within SLA"""
        sla_hours = 24
        return (datetime.now() - last_sync).total_seconds() < sla_hours * 3600
    
    def check_duplicates(self, data: List[Dict]) -> List[Dict]:
        """Detect duplicate entities"""
        seen = {}
        duplicates = []
        for record in data:
            id_val = record["id"]
            if id_val in seen:
                duplicates.append(record)
            seen[id_val] = record
        return duplicates
```

---

## 7. Security & Authentication

### Authentication Methods

#### OAuth 2.0
```python
oauth = OAuth2PasswordBearer(tokenUrl="token")

def get_token(credentials: HTTPAuthenticationCredentials):
    """OAuth token exchange"""
    token = requests.post(
        "https://auth.atlassian.com/oauth/token",
        data={
            "grant_type": "client_credentials",
            "client_id": credentials.username,
            "client_secret": credentials.password
        }
    )
    return token.json()["access_token"]
```

#### API Keys
```python
def authenticate_with_key(api_key: str) -> bool:
    """Verify API key"""
    key_hash = hashlib.sha256(api_key.encode()).hexdigest()
    return db.validate_api_key(key_hash)
```

#### mTLS (Mutual TLS)
```python
def create_mtls_session():
    """Create session with mutual TLS"""
    session = requests.Session()
    session.cert = ('/path/to/client.crt', '/path/to/client.key')
    session.verify = '/path/to/ca.crt'
    return session
```

### Secret Management

```python
class SecretManager:
    def get_credential(self, credential_name: str) -> str:
        """Retrieve credential from vault"""
        return vault.get_secret(f"trazo/connectors/{credential_name}")
    
    def store_credential(self, name: str, value: str):
        """Store credential securely"""
        vault.set_secret(f"trazo/connectors/{name}", value)
```

---

## 8. Error Handling & Retry Logic

### Retry Policy

```python
class RetryPolicy:
    def __init__(self, max_retries: int = 3, base_delay: int = 1):
        self.max_retries = max_retries
        self.base_delay = base_delay
    
    def should_retry(self, exception: Exception) -> bool:
        """Determine if error is retryable"""
        retryable_errors = [
            ConnectionError,
            TimeoutError,
            requests.exceptions.RequestException
        ]
        return isinstance(exception, tuple(retryable_errors))
    
    def calculate_delay(self, attempt: int) -> int:
        """Exponential backoff with jitter"""
        delay = self.base_delay * (2 ** attempt)
        jitter = random.uniform(0, delay * 0.1)
        return delay + jitter

@retry(policy=RetryPolicy())
def fetch_with_retry(connector, query):
    """Fetch data with automatic retry"""
    return connector.fetch(query)
```

---

## 9. Monitoring & Observability

### Connector Metrics

```python
class ConnectorMetrics:
    def track_fetch(self, connector_name: str, record_count: int, duration: float):
        """Track connector fetch operation"""
        metrics.record(
            f"connector.{connector_name}.fetch",
            record_count,
            {"duration": duration, "timestamp": datetime.now()}
        )
    
    def track_error(self, connector_name: str, error: Exception):
        """Track connector errors"""
        metrics.increment(
            f"connector.{connector_name}.errors",
            tags={"error_type": type(error).__name__}
        )
    
    def track_latency(self, connector_name: str, latency_ms: int):
        """Track connector latency"""
        metrics.histogram(
            f"connector.{connector_name}.latency",
            latency_ms
        )
```

### Observability Dashboard

Key metrics to monitor:
- Connector health (uptime, error rate)
- Data freshness (time since last sync)
- Processing latency (fetch to graph update)
- Data quality (completeness, accuracy)
- Integration coverage (# of systems connected)

---

## 10. Integration Testing

### Test Framework

```python
class ConnectorTest:
    def test_authentication(self):
        """Test credential validation"""
        assert connector.authenticate()
    
    def test_data_discovery(self):
        """Test metadata discovery"""
        data = connector.discover()
        assert len(data) > 0
    
    def test_data_fetch(self):
        """Test data retrieval"""
        results = connector.fetch({"limit": 10})
        assert len(results) <= 10
    
    def test_transformation(self):
        """Test data transformation"""
        raw_data = {"key": "JIRA-123", "summary": "Test Issue"}
        transformed = connector.transform([raw_data])
        assert transformed[0]["story_id"] == "JIRA-123"
    
    def test_error_handling(self):
        """Test error recovery"""
        with pytest.raises(RetryableException):
            connector.fetch({"invalid": True})
```

---

## 11. Connector Development Guide

### Creating a New Connector

```python
from trazo.connectors import BaseConnector

class CustomConnector(BaseConnector):
    """Connector for Custom System"""
    
    def authenticate(self) -> bool:
        """Authenticate with custom system"""
        auth = CustomAuth(self.config)
        self.session = auth.create_session()
        return True
    
    def discover(self) -> List[Dict]:
        """Discover entities in custom system"""
        response = self.session.get("/api/entities")
        return response.json()
    
    def fetch(self, query: Dict) -> List[Dict]:
        """Fetch data based on query"""
        response = self.session.get(
            "/api/entities",
            params=query
        )
        return response.json()
    
    def transform_record(self, record: Dict) -> Dict:
        """Transform to TRAZO schema"""
        return {
            "entity_id": record["customId"],
            "name": record["customName"],
            "type": "CustomEntity",
            "source": "custom_system"
        }
```

---

## 12. Connector Roadmap

### Planned Connectors
- **Okta** (Identity)
- **Splunk** (Logging & Analytics)
- **Dynatrace** (Observability)
- **New Relic** (APM)
- **CloudHealth** (Cloud Cost Management)
- **Lacework** (Cloud Security)

### Integration Enhancements
- Native support for GraphQL APIs
- Streaming data pipelines
- Real-time change data capture (CDC)
- Machine learning for entity matching


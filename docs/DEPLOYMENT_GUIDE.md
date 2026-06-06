# TRAZO Deployment Guide

**Document Version:** 1.0  
**Last Updated:** 2026-06-06  
**Status:** Active

---

## Overview

This guide provides comprehensive instructions for deploying TRAZO across different deployment models (SaaS, Private Cloud, Hybrid Cloud, On-Premises).

---

## 1. Deployment Models

### 1.1 SaaS (Recommended for trials)
- Fully managed by TRAZO
- Multi-tenant architecture
- Automatic updates
- Minimal operational overhead

### 1.2 Private Cloud
- Dedicated infrastructure
- Single-tenant deployment
- Customer manages operations
- Full data control

### 1.3 Hybrid Cloud
- Enterprise data on-premises
- Intelligence in cloud
- Secure tunnel for communication
- Best of both worlds

### 1.4 On-Premises
- Fully internal deployment
- Maximum control
- Higher operational complexity
- Data never leaves enterprise

---

## 2. Prerequisites

### System Requirements

#### Kubernetes Cluster
```yaml
requirements:
  kubernetes:
    version: "1.24+"
    nodes: 3+ (for HA)
    
  compute:
    master_nodes: 2 vCPU, 8 GB RAM each
    worker_nodes: 4 vCPU, 16 GB RAM each
    
  storage:
    local: 500 GB SSD
    persistent: 2 TB NVMe
    
  network:
    bandwidth: 1 Gbps minimum
    latency: < 50ms (intra-cluster)
```

#### Database Requirements
```yaml
neo4j:
  version: "5.0+"
  mode: "cluster"
  nodes: 3+ (for HA)
  storage: 1 TB SSD
  backup: Daily snapshots

elasticsearch:
  version: "8.0+"
  nodes: 3+ (for HA)
  storage: 500 GB
```

#### Kafka Cluster
```yaml
kafka:
  version: "3.0+"
  brokers: 3+ (for HA)
  replication_factor: 3
  storage: 500 GB
```

### Software Dependencies
- Docker 20.10+
- Kubernetes 1.24+
- Helm 3.10+
- Terraform 1.0+ (for IaC)
- OpenSSL 1.1+ (for certs)

### Network Prerequisites
- Outbound HTTPS access (for LLM APIs)
- Internal cluster networking
- VPN tunnel (for Hybrid/On-Prem)
- DNS resolution

---

## 3. Pre-Deployment Checklist

### Security
- [ ] Encryption keys generated and stored in vault
- [ ] SSL/TLS certificates obtained
- [ ] OAuth2 provider configured
- [ ] RBAC roles defined
- [ ] Network policies defined

### Infrastructure
- [ ] Kubernetes cluster provisioned
- [ ] Storage classes created
- [ ] Load balancer configured
- [ ] Ingress controller installed
- [ ] Monitoring stack deployed

### Data
- [ ] Data retention policies defined
- [ ] Backup strategy approved
- [ ] Data classification completed
- [ ] PII handling plan documented

### Documentation
- [ ] Architecture diagrams updated
- [ ] Runbooks created
- [ ] Escalation procedures defined
- [ ] Training completed

---

## 4. Installation Steps

### 4.1 Kubernetes Deployment

#### Step 1: Create Namespace
```bash
kubectl create namespace trazo
kubectl label namespace trazo monitoring=enabled
```

#### Step 2: Create Secrets
```bash
# OAuth credentials
kubectl create secret generic oauth-credentials \
  --from-literal=client-id=$CLIENT_ID \
  --from-literal=client-secret=$CLIENT_SECRET \
  -n trazo

# Database credentials
kubectl create secret generic db-credentials \
  --from-literal=neo4j-password=$NEO4J_PASSWORD \
  --from-literal=postgres-password=$POSTGRES_PASSWORD \
  -n trazo

# API keys
kubectl create secret generic api-keys \
  --from-literal=llm-api-key=$LLM_API_KEY \
  --from-literal=openlineage-key=$OPENLINEAGE_KEY \
  -n trazo
```

#### Step 3: Install Helm Chart
```bash
# Add TRAZO Helm repository
helm repo add trazo https://helm.trazo.io
helm repo update

# Install TRAZO
helm install trazo trazo/trazo \
  --namespace trazo \
  --values values.yaml \
  --version 1.0.0

# Verify installation
kubectl get pods -n trazo
kubectl get services -n trazo
```

#### Step 4: Configure Services

**values.yaml** example:
```yaml
global:
  environment: production
  domain: trazo.enterprise.com
  
replicaCount: 3

image:
  registry: docker.io
  repository: trazo/platform
  tag: "1.0.0"
  pullPolicy: IfNotPresent

neo4j:
  enabled: true
  replicas: 3
  storage:
    size: 1Ti
    storageClass: nvme-ssd
  auth:
    password: ${NEO4J_PASSWORD}

elasticsearch:
  enabled: true
  replicas: 3
  storage:
    size: 500Gi

kafka:
  enabled: true
  brokers: 3
  replication: 3

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: trazo.enterprise.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: trazo-tls
      hosts:
        - trazo.enterprise.com

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilization: 70

resources:
  requests:
    cpu: 2
    memory: 4Gi
  limits:
    cpu: 4
    memory: 8Gi

monitoring:
  enabled: true
  prometheus:
    enabled: true
```

---

### 4.2 Verification

```bash
# Check pod status
kubectl get pods -n trazo -w

# Check service status
kubectl get svc -n trazo

# View logs
kubectl logs -n trazo -l app=trazo-api --tail=100

# Test connectivity
kubectl port-forward -n trazo svc/trazo-api 8080:8080
curl http://localhost:8080/health
```

---

## 5. Data Integration

### 5.1 Initialize Knowledge Graph

```bash
# Connect to Neo4j
kubectl port-forward -n trazo svc/neo4j 7687:7687

# Create indexes
cypher-shell -u neo4j -p $NEO4J_PASSWORD << 'EOF'
CREATE INDEX idx_app_id FOR (a:Application) ON (a.app_id);
CREATE INDEX idx_entity_status FOR (e:Entity) ON (e.status);
CREATE INDEX idx_created_at FOR (e:Entity) ON (e.created_at);
EOF
```

### 5.2 Deploy Connectors

```bash
# Apply connector configurations
kubectl apply -f connectors/ -n trazo

# Verify connectors are running
kubectl get pods -n trazo -l type=connector
```

### 5.3 Initial Data Load

```bash
# Run batch import
kubectl exec -it -n trazo trazo-api-0 -- \
  python -m trazo.cli import \
    --format csv \
    --entity-type Application \
    --file /data/applications.csv

# Monitor import progress
kubectl logs -n trazo job/data-import-001
```

---

## 6. High Availability Configuration

### 6.1 Pod Disruption Budgets

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: trazo-api-pdb
  namespace: trazo
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: trazo-api
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: neo4j-pdb
  namespace: trazo
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: neo4j
```

### 6.2 Multi-Zone Deployment

```yaml
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
            - key: app
              operator: In
              values:
                - trazo-api
        topologyKey: topology.kubernetes.io/zone
```

---

## 7. Security Hardening

### 7.1 Network Policies

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: trazo-network-policy
  namespace: trazo
spec:
  podSelector:
    matchLabels:
      app: trazo-api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: trazo
      ports:
        - protocol: TCP
          port: 8080
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: trazo
      ports:
        - protocol: TCP
          port: 7687  # Neo4j
        - protocol: TCP
          port: 9200  # Elasticsearch
        - protocol: TCP
          port: 9092  # Kafka
```

### 7.2 RBAC Configuration

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: trazo-api-role
  namespace: trazo
rules:
  - apiGroups: [""]
    resources: ["configmaps", "secrets"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: trazo-api-binding
  namespace: trazo
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: trazo-api-role
subjects:
  - kind: ServiceAccount
    name: trazo-api
    namespace: trazo
```

### 7.3 Pod Security Policy

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: trazo-restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - configMap
    - secret
    - emptyDir
  runAsUser:
    rule: MustRunAsNonRoot
  fsGroup:
    rule: MustRunAs
    ranges:
      - min: 1000
        max: 65535
```

---

## 8. Backup & Disaster Recovery

### 8.1 Backup Strategy

```bash
# Daily Neo4j backups
0 2 * * * kubectl exec -n trazo neo4j-0 -- \
  neo4j-admin backup --backup-dir=/backup --database=neo4j

# Kafka topic backups
0 3 * * * kubectl exec -n trazo kafka-0 -- \
  kafka-mirror-maker-2.sh --bootstrap-server kafka:9092 \
  --target-cluster backup-cluster --source-cluster primary

# Database snapshots
0 4 * * * aws s3 sync /backup s3://trazo-backups/$(date +%Y-%m-%d)/
```

### 8.2 Recovery Procedures

```bash
# Restore from backup
kubectl exec -it -n trazo neo4j-0 -- \
  neo4j-admin restore --from-path=/backup/neo4j \
  --database=neo4j --force

# Verify recovery
kubectl logs -n trazo neo4j-0 | grep "Started"
```

---

## 9. Monitoring & Observability

### 9.1 Prometheus Configuration

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'trazo'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
            - trazo
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
```

### 9.2 Grafana Dashboards

Key metrics to monitor:
- API response time (p50, p95, p99)
- Error rate by endpoint
- Knowledge graph size (# nodes, relationships)
- Kafka consumer lag
- Neo4j query performance
- Memory/CPU utilization

---

## 10. Post-Deployment

### 10.1 Health Checks

```bash
# API health
curl https://trazo.enterprise.com/health

# Database health
curl https://trazo.enterprise.com/health/db

# Kafka connectivity
kubectl exec -n trazo trazo-api-0 -- \
  kafka-console-consumer.sh --bootstrap-server kafka:9092 \
  --topic test --from-beginning --max-messages 1
```

### 10.2 Initial Configuration

```bash
# Create admin user
kubectl exec -it -n trazo trazo-api-0 -- \
  trazo-cli admin create-user \
    --email admin@company.com \
    --role ADMIN

# Configure OAuth
kubectl set env deployment/trazo-api \
  -n trazo \
  OAUTH_PROVIDER_URL=https://auth.company.com \
  OAUTH_CLIENT_ID=$CLIENT_ID \
  OAUTH_CLIENT_SECRET=$CLIENT_SECRET

# Setup initial connectors
kubectl apply -f initial-connectors.yaml -n trazo
```

---

## 11. Upgrade Procedures

### 11.1 Zero-Downtime Upgrade

```bash
# Check current version
helm list -n trazo

# Update Helm chart
helm repo update
helm upgrade trazo trazo/trazo \
  --namespace trazo \
  --values values.yaml \
  --version 1.1.0 \
  --wait \
  --timeout 10m

# Verify upgrade
kubectl rollout status deployment/trazo-api -n trazo
kubectl get pods -n trazo
```

### 11.2 Rollback

```bash
helm rollback trazo -n trazo
```

---

## 12. Troubleshooting

### Common Issues

| Issue | Symptom | Resolution |
|-------|---------|-----------|
| Pod CrashLoop | Pod continuously restarting | Check logs: `kubectl logs -n trazo <pod>` |
| Connection Timeout | Cannot connect to Neo4j | Verify network policies, DNS resolution |
| High Memory Usage | Memory > limits | Increase resource limits, check query leaks |
| Slow Queries | API responses > 5s | Add database indexes, optimize queries |

---

## 13. Deployment Checklist

- [ ] Infrastructure provisioned
- [ ] Secrets created and stored in vault
- [ ] Helm chart installed
- [ ] Services verified running
- [ ] Data imported
- [ ] Connectors operational
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Security hardened
- [ ] Team trained


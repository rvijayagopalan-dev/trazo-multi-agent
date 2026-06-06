# TRAZO Operations Guide

**Document Version:** 1.0  
**Last Updated:** 2026-06-06  
**Status:** Active

---

## Overview

This guide provides operational procedures for maintaining, monitoring, and troubleshooting TRAZO in production environments.

---

## 1. Daily Operations

### 1.1 Morning Health Check

**Run at: 09:00 daily**

```bash
#!/bin/bash
# Daily health check script

echo "=== TRAZO Morning Health Check ==="

# 1. Service availability
echo "Checking service health..."
curl -s https://trazo.enterprise.com/health | jq .

# 2. Pod status
echo "Checking pod status..."
kubectl get pods -n trazo --no-headers | grep -v Running && echo "ALERT: Non-running pods detected"

# 3. Storage capacity
echo "Checking storage..."
kubectl get pvc -n trazo --no-headers | awk '{print $4, $5, $3}' | column -t

# 4. Database connectivity
echo "Checking database..."
kubectl exec -it -n trazo neo4j-0 -- cypher-shell -u neo4j "RETURN 1" 2>/dev/null && echo "✓ Neo4j OK" || echo "✗ Neo4j FAILED"

# 5. Kafka connectivity
echo "Checking Kafka..."
kubectl exec -it -n trazo kafka-0 -- \
  kafka-broker-api-versions.sh --bootstrap-server localhost:9092 && echo "✓ Kafka OK" || echo "✗ Kafka FAILED"

# 6. Connector status
echo "Checking connectors..."
kubectl get pods -n trazo -l type=connector --no-headers | \
  awk '{print $1, $3}' | column -t

# 7. Recent errors in logs
echo "Checking for errors..."
kubectl logs -n trazo --selector app=trazo-api --tail=100 | grep -i "error" | head -5
```

### 1.2 Dashboard Review

**Grafana Dashboard**: https://grafana.enterprise.com/d/trazo-overview

Key metrics to review:
1. Request latency (p50, p95, p99)
2. Error rate
3. Knowledge graph size
4. Database query performance
5. Memory/CPU usage
6. Connector sync status

---

## 2. Weekly Maintenance

### 2.1 Data Quality Review

```bash
# Check for inconsistencies
kubectl exec -it -n trazo trazo-api-0 -- python -m trazo.cli \
  data-quality-report --period weekly > report.html
```

**Review checklist:**
- [ ] Data completeness > 95%
- [ ] Duplicate entity count < 100
- [ ] Orphaned relationships < 50
- [ ] Unresolved references < 100

### 2.2 Connector Sync Verification

```bash
# Verify all connectors synced in last 24 hours
kubectl logs -n trazo -l type=connector --since=24h | \
  grep "sync_completed" | wc -l

# Check for failed syncs
kubectl logs -n trazo -l type=connector --since=24h | \
  grep "ERROR" | tail -20
```

### 2.3 Backup Verification

```bash
# Verify last backup completed successfully
aws s3 ls s3://trazo-backups/ --recursive --human-readable | head -10

# Test backup restore (in test environment)
kubectl run -it --rm restore-test --image=neo4j:5.0 -- \
  neo4j-admin restore --from-path=/backup/weekly.bak
```

---

## 3. Monthly Operations

### 3.1 Storage Optimization

```bash
# Analyze storage usage
du -sh /data/trazo/* | sort -hr

# Compress old data
tar -czf /backup/archive-$(date +%Y-%m).tar.gz \
  --exclude="/data/trazo/active" /data/trazo/

# Clean up old backups (> 30 days)
aws s3 rm s3://trazo-backups/ \
  --recursive \
  --exclude "*" \
  --include "*/$(date -d '30 days ago' +%Y/%m/%d)/*"
```

### 3.2 Security Audit

```bash
# Review user access
kubectl exec -it -n trazo trazo-api-0 -- \
  trazo-cli audit list-users --recent-logins

# Check for orphaned permissions
kubectl exec -it -n trazo trazo-api-0 -- \
  trazo-cli audit find-orphaned-permissions

# Review API token usage
kubectl exec -it -n trazo trazo-api-0 -- \
  trazo-cli audit list-api-tokens --unused-for-days 90
```

### 3.3 Performance Tuning

```bash
# Database statistics
kubectl exec -n trazo neo4j-0 -- cypher-shell -u neo4j << 'EOF'
CALL db.stats.collecting() YIELD hasData, nodesCount, relationshipsCount
RETURN hasData, nodesCount, relationshipsCount;

CALL db.indexes() YIELD name, state, type
RETURN name, state, type;
EOF

# Query slow log
kubectl logs -n trazo neo4j-0 | grep "Query took" | sort -k4 -nr | head -10
```

---

## 4. Monitoring & Alerting

### 4.1 Key Metrics to Monitor

```yaml
critical_metrics:
  api_availability:
    target: "> 99.9%"
    check_interval: 1 minute
    alert_threshold: "≤ 99%"
  
  knowledge_graph_sync_lag:
    target: "< 30 seconds"
    check_interval: 5 minutes
    alert_threshold: "> 5 minutes"
  
  database_connection_pool:
    target: "< 80% utilization"
    check_interval: 1 minute
    alert_threshold: "> 90%"
  
  kafka_consumer_lag:
    target: "< 100 messages"
    check_interval: 5 minutes
    alert_threshold: "> 1000 messages"
  
  storage_usage:
    target: "< 80% capacity"
    check_interval: 1 hour
    alert_threshold: "> 85%"

high_priority_metrics:
  error_rate:
    target: "< 0.1%"
    alert_threshold: "> 1%"
  
  memory_usage:
    target: "< 80%"
    alert_threshold: "> 90%"
  
  disk_io:
    target: "< 70% utilization"
    alert_threshold: "> 85%"
```

### 4.2 Alert Routing

```yaml
alerting:
  channels:
    - name: "critical"
      destinations:
        - "oncall@company.pagerduty.com"
        - "slack://#trazo-critical"
      response_time_sla: "5 minutes"
    
    - name: "high"
      destinations:
        - "slack://#trazo-alerts"
      response_time_sla: "15 minutes"
    
    - name: "medium"
      destinations:
        - "slack://#trazo-info"
      response_time_sla: "1 hour"
    
    - name: "low"
      destinations:
        - "email://ops-team@company.com"
      response_time_sla: "24 hours"
```

---

## 5. Scaling Operations

### 5.1 Horizontal Scaling

```bash
# Check current resource utilization
kubectl top pods -n trazo --containers | grep trazo-api

# Scale API replicas
kubectl scale deployment trazo-api -n trazo --replicas=5

# Monitor scaling progress
kubectl get deployment trazo-api -n trazo -w

# Check load distribution
kubectl exec -it -n trazo trazo-api-0 -- \
  curl localhost:8080/metrics | grep http_requests_total
```

### 5.2 Vertical Scaling

```bash
# Update resource requests
kubectl patch deployment trazo-api -n trazo --type='json' \
  -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/resources/requests/memory", "value":"8Gi"}]'

# Update resource limits
kubectl set resources deployment trazo-api -n trazo \
  --limits=cpu=4,memory=8Gi \
  --requests=cpu=2,memory=4Gi
```

### 5.3 Knowledge Graph Scaling

```bash
# Monitor graph growth
kubectl exec -n trazo neo4j-0 -- cypher-shell -u neo4j << 'EOF'
MATCH (n) RETURN labels(n)[0] as Label, count(*) as Count ORDER BY Count DESC;
MATCH ()-[r]-() RETURN type(r) as RelType, count(*) as Count ORDER BY Count DESC;
EOF

# Add more Neo4j cluster members
kubectl scale statefulset neo4j -n trazo --replicas=5

# Monitor cluster rebalancing
kubectl exec -n trazo neo4j-0 -- cypher-shell -u neo4j << 'EOF'
CALL dbms.cluster.overview() YIELD id, role, addresses;
EOF
```

---

## 6. Troubleshooting Procedures

### 6.1 API Latency Issues

```bash
# 1. Check current latency
curl -w "@curl-format.txt" -o /dev/null -s https://trazo.enterprise.com/api/health

# 2. Review slow queries
kubectl logs -n trazo trazo-api-0 --tail=1000 | grep "slow_query"

# 3. Check Neo4j query performance
kubectl exec -n trazo neo4j-0 -- cypher-shell -u neo4j << 'EOF'
CALL db.stats.status() YIELD result, value RETURN result, value;
PROFILE MATCH (a:Application)-[r]->() RETURN COUNT(*);
EOF

# 4. Check resource utilization
kubectl top pods -n trazo --containers | grep trazo-api

# 5. Increase logging for debugging
kubectl set env deployment/trazo-api -n trazo LOG_LEVEL=DEBUG

# 6. Scale horizontally if needed
kubectl scale deployment trazo-api -n trazo --replicas=5
```

### 6.2 Connector Sync Failures

```bash
# 1. Check connector pod status
kubectl get pods -n trazo -l type=connector -o wide

# 2. Review connector logs
kubectl logs -n trazo connector-jira-0 --tail=100

# 3. Verify source system connectivity
kubectl exec -n trazo connector-jira-0 -- \
  curl -v https://jira.company.com/api/health

# 4. Check authentication credentials
kubectl get secret -n trazo connector-credentials -o yaml | grep "jira"

# 5. Verify Kafka connectivity
kubectl exec -n trazo connector-jira-0 -- \
  kafka-console-producer.sh --broker-list kafka:9092 --topic test

# 6. Restart connector
kubectl rollout restart deployment connector-jira -n trazo

# 7. Monitor sync completion
watch -n 5 'kubectl logs -n trazo connector-jira-0 --tail=5'
```

### 6.3 Database Connection Issues

```bash
# 1. Check Neo4j pod status
kubectl get pods -n trazo neo4j-0 -o wide

# 2. Review Neo4j logs
kubectl logs -n trazo neo4j-0 --tail=100 | tail -20

# 3. Test connectivity
kubectl run -it --rm debug --image=neo4j:5.0 -- \
  cypher-shell -a bolt://neo4j:7687 -u neo4j -p $PASSWORD "RETURN 1"

# 4. Check connection pool
kubectl exec -n trazo trazo-api-0 -- \
  curl localhost:8080/metrics | grep database_connections

# 5. Monitor cluster status
kubectl exec -n trazo neo4j-0 -- cypher-shell -u neo4j \
  "CALL dbms.cluster.overview()"

# 6. Restart Neo4j if needed
kubectl rollout restart statefulset neo4j -n trazo
```

### 6.4 Storage Issues

```bash
# 1. Check storage usage
kubectl get pvc -n trazo -o wide
df -h /data/trazo

# 2. Identify large datasets
du -sh /data/trazo/* | sort -hr | head -10

# 3. Check for disk errors
kubectl exec -n trazo trazo-api-0 -- dmesg | tail -20

# 4. Expand PVC
kubectl patch pvc neo4j-data -n trazo \
  -p '{"spec":{"resources":{"requests":{"storage":"2Ti"}}}}'

# 5. Clean up old data
kubectl exec -n trazo trazo-api-0 -- \
  trazo-cli cleanup --older-than 90days --dry-run
```

---

## 7. Runbooks

### 7.1 Runbook: Service Degradation

```
1. ASSESS
   - Check dashboard: https://grafana.enterprise.com/d/trazo
   - Run morning health check
   - Identify affected component (API/DB/Kafka)

2. ALERT
   - Post to #trazo-critical
   - Notify oncall engineer
   - Update status page

3. DIAGNOSE
   - Collect logs from affected component
   - Check recent changes (git log)
   - Run diagnostics script

4. REMEDIATE
   - Apply hotfix if available
   - Scale resources if needed
   - Restart services if necessary

5. VERIFY
   - Check metrics return to normal
   - Run health check
   - Confirm customer impact resolved

6. FOLLOW-UP
   - Document in incident tracker
   - Schedule post-mortem
   - Implement preventive controls
```

### 7.2 Runbook: Data Corruption

```
1. STOP
   - Pause all writes: kubectl scale deployment trazo-api -n trazo --replicas=0
   - Check backup status

2. ASSESS
   - Query for corrupted data
   - Determine scope of corruption
   - Check backup viability

3. RESTORE
   - Restore from most recent backup
   - Verify data integrity
   - Test read/write operations

4. REPLAY
   - Identify changes since backup
   - Manually re-apply legitimate changes
   - Re-test thoroughly

5. RESUME
   - Scale API replicas back: kubectl scale deployment trazo-api -n trazo --replicas=3
   - Monitor for issues

6. PREVENT
   - Implement additional validation rules
   - Add data quality monitoring
   - Review backup strategy
```

---

## 8. Performance Optimization

### 8.1 Database Query Optimization

```bash
# Identify slow queries
kubectl exec -n trazo neo4j-0 -- cypher-shell -u neo4j << 'EOF'
CALL dbms.queryData.collect() YIELD result, value;
RETURN * ORDER BY value.time DESC LIMIT 10;
EOF

# Add missing indexes
CREATE INDEX ON :Application(status);
CREATE INDEX ON :DataProduct(domain_id);
CREATE INDEX ON :UserStory(feature_id);

# Analyze query plans
PROFILE MATCH (a:Application)-[:DEPENDS_ON]->(b:Application) RETURN COUNT(*);

# Query result caching
CALL apoc.cache.put('critical_apps', result, 3600);
```

### 8.2 Connector Performance

```yaml
connector_tuning:
  batch_size: 100  # Process records in batches
  fetch_timeout: 300  # 5 minutes
  retry_attempts: 3
  rate_limit_respect: true
  parallel_workers: 5
  cache_ttl: 3600
```

### 8.3 API Response Optimization

```python
# Enable response caching
@app.get("/api/applications/{app_id}", cache=3600)
def get_application(app_id: str):
    return db.get_application(app_id)

# Implement pagination
@app.get("/api/applications")
def list_applications(limit: int = 100, offset: int = 0):
    return db.list_applications(limit, offset)

# Compress responses
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

---

## 9. Disaster Recovery

### 9.1 Recovery Time Objectives (RTO)

| Scenario | RTO | Recovery Steps |
|----------|-----|---|
| Pod crash | 5 minutes | Kubernetes auto-restart |
| Node failure | 15 minutes | Drain & reschedule pods |
| Database corruption | 1 hour | Restore from backup |
| Complete data loss | 4 hours | Full database restore |

### 9.2 Recovery Procedures

```bash
# Test disaster recovery (monthly)
1. Create backup
2. Isolate backup
3. Restore to test environment
4. Validate data integrity
5. Document recovery time
6. Archive test results
```

---

## 10. On-Call Guide

### 10.1 On-Call Responsibilities

```
Weekly Schedule:
- Monday-Friday: Primary + Secondary oncall
- Weekends: Primary + Secondary oncall

Response SLA:
- Critical: 5 minutes
- High: 15 minutes
- Medium: 1 hour
```

### 10.2 Escalation Path

```
Level 1: On-call Engineer
  ↓ (unresolved after 15 min)
Level 2: Team Lead
  ↓ (unresolved after 30 min)
Level 3: Platform Engineering Manager
  ↓ (unresolved after 1 hour)
Level 4: VP Engineering
```

---

## 11. Change Management

### 11.1 Change Request Process

```
1. CREATE → 2. REVIEW → 3. APPROVE → 4. TEST → 5. DEPLOY → 6. VERIFY
```

### 11.2 Deployment Window

```yaml
deployment_window:
  preferred: "Tuesday-Thursday, 10:00-12:00 UTC"
  maintenance_window: "Sundays, 02:00-04:00 UTC"
  no_deploy: "Friday afternoon, Weekends"
```

### 11.3 Rollback Criteria

```
Auto-rollback if:
- Error rate > 5%
- Latency p99 > 5 seconds
- More than 2 pods in CrashLoop
- Database connectivity lost
```


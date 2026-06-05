# Workflow 7 — Compliance audit trail and incident response

| Attribute | Value |
|---|---|
| Actors | Compliance Lead, Super Admin, Education Manager (escalation), External counsel (escalation) |
| Trigger | Continuous (audit log) + on-demand (incident, regulator inquiry) |
| Outcome | Tamper-evident audit log; defensible incident response; regulator-ready evidence packets |
| Languages | EN |

## Step-by-step

### 1. Continuous audit logging
Every significant action emits AuditLog entry: visa file sign-off, payout approval, exception decision, role change, document edit attempt, login from new device, suspected misrepresentation flag. Each entry: actor, action, target, before/after, IP, UA, timestamp, hash of previous entry.

### 2. Audit log explorer (Compliance + Super Admin only)
Search by actor, action, target, date range. Read-only. Export to PDF or CSV with hash-chain proof attached.

### 3. Visa file audit trail
Per visa file, one-click viewable trail: created by, edits, signed by, version signed, registration number, submitted when. Exportable as PDF dossier for regulator inquiry.

### 4. Regulator inquiry response
Education Manager flags incoming inquiry. Compliance + Super Admin assemble evidence packet: relevant audit entries, visa file dossiers, role assignments at the time, training records. Time-bounded response.

### 5. Incident response
Super Admin detects (or alerted). Incident channel auto-created. Runbook from Super Admin SOP §6 executes. External counsel notified if data exposure suspected. Post-incident review scheduled.

### 6. Misrepresentation reporting
Discovered post-sign-off → regulator notification flow: capture facts, draft notification per regulator template, external counsel review, dispatch when approved, audit log entry.

## Hash chain integrity

Every AuditLog entry and every Event entry contains `chain_hash = sha256(json(this_entry) || previous_chain_hash)`. The chain begins with a genesis hash. Tampering with any entry breaks all subsequent hashes; this is detected at export time and flagged.

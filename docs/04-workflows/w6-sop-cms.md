# Workflow 6 — SOP authoring and publishing

| Attribute | Value |
|---|---|
| Actors | SOP Owner (per role), Reviewer, Affected role users |
| Trigger | New SOP or revision needed |
| Outcome | SOP edited, reviewed, published to in-app contextual surfaces in 4 languages where required |
| Languages | Internal SOPs in EN; customer-facing scripts and templates in 4 languages |

## The SOP-into-app architecture

See `CLAUDE.md` Section 8 for the full architecture. Key concepts:
- Block types: paragraph, heading, list, table, script, template, decision_tree, checklist, kpi, compliance_warning, trigger_rule
- Trigger rules: declarative conditions that determine when a block surfaces
- Six ways SOPs surface in product: contextual help, decision wizards, inline scripts/templates, auto-checked quality gates, versioned with diffs, searchable

## Step-by-step

### 1. SOP authoring
Owner opens `/admin/sop`. Lists SOPs they own. Each SOP is a structured document with 12 sections; editor is markdown-with-blocks.

### 2. Translation
For customer-facing roles, specific blocks (script, template, FAQ) require BN/HI/NE translation. CMS shows per-block translation status. Queued to certified translators.

### 3. Review
Owner submits to Reviewer. Side-by-side current vs proposed. Reviewer can approve, reject with feedback, request changes. Named Reviewer required per SOP Matrix.

### 4. Publish
Approved → new version published. Affected users see "SOP updated" banner with diff on next login. Audit log captures version views. Old versions archived.

### 5. Contextual surfacing
Trigger rules in SOP blocks evaluate continuously. Relevant snippet appears in right rail or inline guidance per matching screen.

## Block type → surface mapping

| Block | How it renders |
|---|---|
| paragraph | Right-rail or inline panel |
| heading | Section header |
| list/table | Inline |
| script | One-tap insert in dialer/chat |
| template | Message with `{{variables}}` |
| decision_tree | Wizard form, branching |
| checklist | Enforced gate (must be green to proceed) |
| kpi | Live value vs target on role dashboard |
| compliance_warning | Real-time keyword detection; modal on hit |
| trigger_rule | Declarative condition for surfacing |

# SOP corpus

This directory holds the full operating-manual content per role. Each
role gets its own markdown file. The SOP CMS (Workflow 6) imports
these as the seed content, then takes over for ongoing edits.

## Files

- `r01-super-admin.md` — Super Admin SOP (12 sections)
- `r02-education-manager.md`
- `r03-counsellor-manager.md`
- `r04-counsellor.md` — densest; contains scripts + objections + edge cases
- `r05-operations-manager.md`
- `r06-operations-team.md`
- `r07-compliance.md`
- `r08-finance.md`
- `r09-student.md` — student-facing help content
- `r10-parent.md` — parent-facing help + FAQ

## Structure of each SOP

Twelve fixed sections per the operating manual format:

1. Purpose & scope
2. Day-in-the-life
3. Daily / weekly / monthly cadence
4. Tools & systems
5. Decision trees
6. Templates & scripts
7. KPIs & SLAs
8. Handoffs
9. Escalation paths
10. Quality standards
11. Edge cases & known issues
12. Compliance & data handling

## Block-typed authoring

When the SOP CMS imports these markdown files, headings, lists, tables,
code blocks become typed blocks (paragraph, heading, list, table). Special
syntax for the typed blocks:

````
```script trigger="call_started AND first_call_with_student"
"Hi [Student Name]..."
```

```template variables="student_name,counsellor_name"
Hi {{student_name}}, ...
```

```decision_tree
- if: student.profile_completeness < 95
  then: block
  message: "Profile must be 95% complete to lock"
- else: allow
```

```checklist gate="shortlist_lock"
- profile_completeness >= 95
- english_proficiency != null
- destinations.length > 0
```

```kpi metric="lead_to_application_conversion" target="0.25" direction="higher_better"
```

```compliance_warning keywords="I guarantee,100% visa,definitely get visa"
⚠ Visa guarantee detected. Please rephrase.
```

```trigger_rule
when: counsellor_opens_lead_detail
if: student.english_proficiency == 'none'
surface: lead_detail.right_rail
show: sop_snippet[no_ielts_pathways]
```
````

## Phase 1 priority

Build the SOP CMS (Workflow 6) before populating r05-r10 in depth. The
CMS is what makes the SOPs useful operationally; without it, the markdown
files are just static reference.

The seed content for r01-r10 lives in the EduNomad Operating Manual
(separate docx); this directory will be populated from that during the
W6 workflow.

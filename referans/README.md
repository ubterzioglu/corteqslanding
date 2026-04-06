# Reference Integration Workflow

Use the `referans/` directory as the intake area for future example projects, plugins, snippets, or feature references.

## Intake Process

1. Add the reference material under a dated or clearly named subfolder in `referans/`.
2. Include a short note describing the source and the feature area it should influence.
3. Keep binary assets only if they are necessary for comparison.

## Comparison Categories

For each new reference, compare differences across these buckets:

- `ui`: layout, sections, visual hierarchy, content blocks
- `backend`: API flows, form handling, data writes, server logic
- `auth`: login, roles, admin access, session handling
- `mail`: notifications, templates, providers, delivery triggers
- `db`: schema, migrations, policies, indexes
- `content`: copy, language, CTAs, labels

## Change Log Template

Copy this block into the relevant reference folder whenever a new comparison starts:

```md
# Reference Review

- Source:
- Date:
- Goal:

## Observed Differences
- ui:
- backend:
- auth:
- mail:
- db:
- content:

## Proposed CorteQS Changes
- 

## Applied Changes
- 

## Deferred Items
- 
```

## Working Rules

- Prefer adapting the existing CorteQS architecture over copying reference code directly.
- Treat references as inputs for diff analysis, not as the source of truth.
- Document every accepted and rejected difference so future iterations stay traceable.

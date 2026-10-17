# Chart Renderer — Examples

## Architecture flow for a README
You are writing the "request lifecycle" section of a README.

**Action:** pick the Flowchart template, adapt it to your pipeline, export SVG.
**Result:** a vector figure that stays sharp at any zoom. The source is just text you can commit alongside the doc — far easier to version than screenshots or third-party editor files.

## Clarifying a login sequence
You need to explain to teammates how the front end obtains a token.

**Action:** pick the Sequence template, declare three participants (User / Frontend / Server) and draw the arrows.
**Result:** one diagram conveys call order and payloads better than paragraphs — and since nothing is uploaded, interface details stay private.

## ER diagram before a schema review
A table-design review needs an entity relationship view.

**Action:** pick the Entity Relationship template and spell out cardinalities like `USER ||--o{ ORDER`, then export SVG into the review doc.
**Result:** one-to-many and many-to-many relationships become obvious at a glance.

## Planning project milestones
Quarterly planning needs a schedule chart.

**Action:** pick the Gantt template, express dependencies with `dateFormat YYYY-MM-DD` and `after a1`, export PNG for slides.
**Result:** dependencies and parallel work are visible; PNG is ready to paste, SVG kept for print.

## Summarizing a structure
You want one picture that summarizes a topic's structure.

**Action:** pick the Mindmap template, express hierarchy with indentation and `root((topic))` as the center node.
**Result:** nested levels read naturally — great for study notes or outline slides.

## Intranet / confidential docs
You are writing a design doc that must not leave the building.

**Note:** everything renders locally, source is never uploaded, and it works offline — unlike online diagram tools that require network saves, there is no outbound-data risk.

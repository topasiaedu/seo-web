# raw/ — immutable sources

Agents **read** this tree and **never edit** files here (except filing from `inbox/` → `research/` when the human asks).

| Path | Use |
|------|-----|
| `inbox/` | Drop new clips, notes, PDFs-as-md here for ingest |
| `research/` | Classified immutable research dumps |

After ingest, the agent writes summaries under `wiki/sources/` and updates the wiki — not the raw file.

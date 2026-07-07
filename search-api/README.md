# Product Search API

Python (FastAPI) service for smart product search over the МеталлоДвор catalog.
Combines keyword search with fuzzy text matching:

- **Typo tolerance** — Levenshtein edit distance ("рабитса" → Сетка рабица)
- **Transliteration** — Latin-keyboard queries ("setka svarnaya" → Сетка сварная)
- **Word forms** — "сварной сетки" matches "Сетка сварная"
- **Weighted fields** — matches in the title rank higher than in descriptions

The same algorithm is ported to client-side JavaScript (`src/utils/fuzzySearch.js`)
so the live site runs it with zero hosting cost. This service is the standalone
Python version that can be deployed separately if the catalog grows.

## Run locally

```bash
cd search-api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Then try:

- http://127.0.0.1:8000/search?q=рабитса
- http://127.0.0.1:8000/search?q=setka+svarnaya
- http://127.0.0.1:8000/docs — interactive API docs

`products.json` is exported from `src/data/products.js`.

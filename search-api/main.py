"""FastAPI service exposing the fuzzy product search.

Run:  uvicorn main:app --reload
Try:  http://127.0.0.1:8000/search?q=setka+svarnaya
Docs: http://127.0.0.1:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from search import search_products

app = FastAPI(title="MetalloDvor Product Search API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/search")
def search(q: str = ""):
    results = search_products(q)
    return {"query": q, "count": len(results), "results": results}

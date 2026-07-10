"""Precompute "related products" with sentence embeddings.

Embeds every product's text with a multilingual sentence-transformer,
ranks neighbors by cosine similarity, and writes the top matches to
src/data/relatedProducts.json — so the live site ships ML-computed
recommendations without any runtime server.

Rerun after editing the catalog:
    python build_related.py
"""

import json
from pathlib import Path

import numpy as np
from sentence_transformers import SentenceTransformer

MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
TOP_N = 3

root = Path(__file__).parent
products = json.loads((root / "products.json").read_text(encoding="utf-8"))

texts = [
    f"{p['title']}. {p['categoryTitle']}. {p['shortDescription']} {p['fullDescription']}"
    for p in products
]

model = SentenceTransformer(MODEL_NAME)
embeddings = model.encode(texts, normalize_embeddings=True)
similarity = embeddings @ embeddings.T  # cosine similarity of normalized vectors

related = {}
for i, product in enumerate(products):
    neighbors = [j for j in np.argsort(-similarity[i]) if j != i][:TOP_N]
    related[product["id"]] = [products[j]["id"] for j in neighbors]
    print(f"{product['title']}")
    for j in neighbors:
        print(f"    {similarity[i][j]:.3f}  {products[j]['title']}")

out_path = root.parent / "src" / "data" / "relatedProducts.json"
out_path.write_text(
    json.dumps(related, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(f"\nWrote {out_path.relative_to(root.parent)} for {len(products)} products")

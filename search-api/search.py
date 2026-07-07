"""Fuzzy product search: keyword matching with typo tolerance (Levenshtein
distance) and Cyrillic-to-Latin transliteration, so queries like "рабитса"
or "setka svarnaya" still find the right products.

Same algorithm as src/utils/fuzzySearch.js — this is the Python service
version; the JS port runs client-side on the live site.
"""

import json
import re
from pathlib import Path

CYR_TO_LAT = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ж": "zh",
    "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m", "н": "n",
    "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f",
    "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sch", "ъ": "",
    "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
}

STOP_WORDS = {"для", "и", "в", "на", "с", "по", "из", "под", "от", "до"}

FIELD_WEIGHTS = [
    ("title", 3.0),
    ("categoryTitle", 2.5),
    ("size", 1.5),
    ("shortDescription", 1.0),
    ("fullDescription", 0.5),
]


def transliterate(word: str) -> str:
    return "".join(CYR_TO_LAT.get(char, char) for char in word)


def normalize(text: str) -> str:
    text = text.lower().replace("ё", "е").replace("×", "x")
    return re.sub(r"(\d)х(?=\d)", r"\1x", text)


def tokenize(text: str) -> list[str]:
    tokens = re.split(r"[^a-zа-я0-9.]+", normalize(text))
    return [t for t in tokens if len(t) >= 2 and t not in STOP_WORDS]


def levenshtein(a: str, b: str) -> int:
    prev = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        current = [i]
        for j in range(1, len(b) + 1):
            substitution_cost = 0 if a[i - 1] == b[j - 1] else 1
            current.append(min(prev[j] + 1, current[j - 1] + 1, prev[j - 1] + substitution_cost))
        prev = current
    return prev[len(b)]


def token_similarity(query_token: str, index_token: str) -> float:
    """Similarity in [0, 1]: exact match, then prefix/substring, then edit distance."""
    if query_token == index_token:
        return 1.0
    if len(query_token) >= 3 or query_token[0].isdigit():
        if index_token.startswith(query_token):
            return 0.9
        if query_token in index_token:
            return 0.7
    max_distance = 1 if len(query_token) <= 4 else 2
    distance = levenshtein(query_token, index_token)
    if distance > max_distance:
        return 0.0
    return 1 - distance / max(len(query_token), len(index_token))


def build_token_variants(text: str) -> list[list[str]]:
    """Store each token with its transliteration, so a Latin-keyboard query
    ("truba") matches the Cyrillic catalog ("труба") without a dictionary."""
    variants = []
    for token in tokenize(text):
        latin = transliterate(token)
        variants.append([token] if latin == token else [token, latin])
    return variants


def load_index(path: Path) -> list[dict]:
    products = json.loads(path.read_text(encoding="utf-8"))
    return [
        {
            "product": product,
            "fields": [
                {"weight": weight, "tokens": build_token_variants(product.get(field, ""))}
                for field, weight in FIELD_WEIGHTS
            ],
        }
        for product in products
    ]


SEARCH_INDEX = load_index(Path(__file__).parent / "products.json")
ALL_PRODUCTS = [entry["product"] for entry in SEARCH_INDEX]


def search_products(query: str) -> list[dict]:
    query_tokens = tokenize(query)
    if not query_tokens:
        return ALL_PRODUCTS

    scored = []
    for entry in SEARCH_INDEX:
        score = 0.0
        matched_tokens = 0

        for query_token in query_tokens:
            best_similarity = 0.0
            best_weighted = 0.0

            for field in entry["fields"]:
                for variants in field["tokens"]:
                    for variant in variants:
                        similarity = token_similarity(query_token, variant)
                        best_similarity = max(best_similarity, similarity)
                        best_weighted = max(best_weighted, similarity * field["weight"])

            if best_similarity >= 0.5:
                matched_tokens += 1
                score += best_weighted

        scored.append({"product": entry["product"], "matched": matched_tokens, "score": score})

    # Prefer products matching every query word; fall back to partial matches
    # so a query never returns an empty page because of one unknown word.
    results = [s for s in scored if s["matched"] == len(query_tokens)]
    if not results:
        results = [s for s in scored if s["matched"] > 0]

    results.sort(key=lambda s: (s["score"], s["matched"]), reverse=True)
    return [s["product"] for s in results]

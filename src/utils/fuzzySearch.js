// Client-side fuzzy product search: keyword matching with typo tolerance
// (Levenshtein distance) and Cyrillic-to-Latin transliteration, so queries
// like "рабитса" or "setka svarnaya" still find the right products.
import { products } from '../data/products.js';
import { getCategoryTitle } from '../data/categories.js';

const CYR_TO_LAT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p',
  р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch',
  ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

const STOP_WORDS = new Set(['для', 'и', 'в', 'на', 'с', 'по', 'из', 'под', 'от', 'до']);

const transliterate = (word) =>
  word
    .split('')
    .map((char) => CYR_TO_LAT[char] ?? char)
    .join('');

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/×/g, 'x')
    .replace(/(\d)х(?=\d)/g, '$1x');

const tokenize = (text) =>
  normalize(text)
    .split(/[^a-zа-я0-9.]+/)
    .filter((token) => token.length >= 2 && !STOP_WORDS.has(token));

const levenshtein = (a, b) => {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(prev[j] + 1, current[j - 1] + 1, prev[j - 1] + substitutionCost);
    }
    prev = current;
  }
  return prev[b.length];
};

// Similarity in [0, 1]: exact match, then prefix/substring, then edit distance.
const tokenSimilarity = (queryToken, indexToken) => {
  if (queryToken === indexToken) return 1;
  if (queryToken.length >= 3 || /^\d/.test(queryToken)) {
    if (indexToken.startsWith(queryToken)) return 0.9;
    if (indexToken.includes(queryToken)) return 0.7;
  }
  const maxDistance = queryToken.length <= 4 ? 1 : 2;
  const distance = levenshtein(queryToken, indexToken);
  if (distance > maxDistance) return 0;
  return 1 - distance / Math.max(queryToken.length, indexToken.length);
};

const FIELD_WEIGHTS = [
  ['title', 3],
  ['categoryTitle', 2.5],
  ['size', 1.5],
  ['shortDescription', 1],
  ['fullDescription', 0.5],
];

// Each token is stored together with its transliteration, so a Latin-keyboard
// query ("truba") matches the Cyrillic catalog ("труба") without a dictionary.
const buildTokenVariants = (text) =>
  tokenize(text).map((token) => {
    const latin = transliterate(token);
    return latin === token ? [token] : [token, latin];
  });

const searchIndex = products.map((product) => ({
  product,
  fields: FIELD_WEIGHTS.map(([field, weight]) => ({
    weight,
    tokens: buildTokenVariants(
      field === 'categoryTitle' ? getCategoryTitle(product.category) : product[field] || '',
    ),
  })),
}));

export function searchProducts(query) {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return products;

  const scored = searchIndex.map(({ product, fields }) => {
    let score = 0;
    let matchedTokens = 0;

    for (const queryToken of queryTokens) {
      let bestSimilarity = 0;
      let bestWeighted = 0;

      for (const { weight, tokens } of fields) {
        for (const variants of tokens) {
          for (const variant of variants) {
            const similarity = tokenSimilarity(queryToken, variant);
            if (similarity > bestSimilarity) bestSimilarity = similarity;
            if (similarity * weight > bestWeighted) bestWeighted = similarity * weight;
          }
        }
      }

      if (bestSimilarity >= 0.5) {
        matchedTokens += 1;
        score += bestWeighted;
      }
    }

    return { product, matchedTokens, score };
  });

  // Prefer products matching every query word; fall back to partial matches
  // so a query never returns an empty page because of one unknown word.
  let results = scored.filter((entry) => entry.matchedTokens === queryTokens.length);
  if (results.length === 0) {
    results = scored.filter((entry) => entry.matchedTokens > 0);
  }

  return results
    .sort((a, b) => b.score - a.score || b.matchedTokens - a.matchedTokens)
    .map((entry) => entry.product);
}

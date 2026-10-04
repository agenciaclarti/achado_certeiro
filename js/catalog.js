import { normalizeText } from "./utils.js";

const REQUIRED_FIELDS = ["id", "name", "slug", "category", "image", "affiliateUrl", "createdAt", "developmentOnly"];

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function toTimestamp(value) {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
}

function compareOptional(a, b, direction = "asc") {
  const aMissing = a === undefined || a === null;
  const bMissing = b === undefined || b === null;
  if (aMissing && bMissing) return 0;
  if (aMissing) return 1;
  if (bMissing) return -1;
  const result = typeof a === "string" ? a.localeCompare(b, "pt-BR") : a - b;
  return direction === "desc" ? -result : result;
}

export function findProductById(productList, id) {
  return productList.find((product) => product.id === id) ?? null;
}

export function findProductBySlug(productList, slug) {
  const normalizedSlug = normalizeText(slug);
  return productList.find((product) => normalizeText(product.slug) === normalizedSlug) ?? null;
}

export function filterProductsByCategory(productList, category, subcategory) {
  if (!category || category === "all") return subcategory ? productList.filter((product) => product.subcategory === subcategory) : [...productList];
  return productList.filter((product) => product.category === category && (!subcategory || product.subcategory === subcategory));
}

export function filterProductsByPrice(productList, { min, max, includeWithoutPrice = false } = {}) {
  const hasRange = (min !== undefined && min !== null) || (max !== undefined && max !== null);
  if (!hasRange) return [...productList];
  return productList.filter((product) => {
    if (product.price === undefined || product.price === null) return includeWithoutPrice;
    if (min !== undefined && min !== null && product.price < min) return false;
    if (max !== undefined && max !== null && product.price > max) return false;
    return true;
  });
}

export function filterProductsByTags(productList, tags, { match = "any" } = {}) {
  const requestedTags = asArray(tags).map(normalizeText).filter(Boolean);
  if (!requestedTags.length) return [...productList];

  return productList.filter((product) => {
    const productTags = asArray(product.tags).map(normalizeText);
    return match === "all"
      ? requestedTags.every((tag) => productTags.includes(tag))
      : requestedTags.some((tag) => productTags.includes(tag));
  });
}

export function filterProductsByCollection(productList, collection) {
  if (!collection || collection === "all") return [...productList];
  if (collection === "featured") return getFeaturedProducts(productList);
  if (collection === "under25") return filterProductsByPrice(productList, { max: 25 });
  if (collection === "under50") return filterProductsByPrice(productList, { max: 50 });
  if (collection === "latest") return getNewProducts(productList);
  return productList.filter((product) => asArray(product.collections).includes(collection));
}

export function searchProducts(productList, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [...productList];

  return productList.filter((product) => {
    const searchableFields = [
      product.name,
      product.slug,
      product.shortDescription,
      product.description,
      product.category,
      product.subcategory,
      product.badge,
      ...asArray(product.tags)
    ];
    return normalizeText(searchableFields.filter(Boolean).join(" ")).includes(normalizedQuery);
  });
}

export function sortProducts(productList, sortBy = "featured") {
  const indexedProducts = productList.map((product, index) => ({ product, index }));
  const comparators = {
    relevance: (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || compareOptional(toTimestamp(a.createdAt), toTimestamp(b.createdAt), "desc"),
    "lowest-price": (a, b) => compareOptional(a.price, b.price, "asc"),
    "price-asc": (a, b) => compareOptional(a.price, b.price, "asc"),
    "highest-price": (a, b) => compareOptional(a.price, b.price, "desc"),
    "price-desc": (a, b) => compareOptional(a.price, b.price, "desc"),
    "highest-rating": (a, b) => compareOptional(a.rating, b.rating, "desc") || compareOptional(a.reviews, b.reviews, "desc"),
    "rating-desc": (a, b) => compareOptional(a.rating, b.rating, "desc") || compareOptional(a.reviews, b.reviews, "desc"),
    "discount-desc": (a, b) => compareOptional(a.discount, b.discount, "desc"),
    newest: (a, b) => compareOptional(toTimestamp(a.createdAt), toTimestamp(b.createdAt), "desc"),
    oldest: (a, b) => compareOptional(toTimestamp(a.createdAt), toTimestamp(b.createdAt), "asc"),
    name: (a, b) => compareOptional(a.name, b.name, "asc"),
    featured: (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || compareOptional(toTimestamp(a.createdAt), toTimestamp(b.createdAt), "desc")
  };
  const comparator = comparators[sortBy] ?? comparators.featured;

  return indexedProducts
    .sort((a, b) => comparator(a.product, b.product) || a.index - b.index)
    .map(({ product }) => product);
}

export function isNewProduct(product, { days = 30, now = new Date() } = {}) {
  const createdAt = toTimestamp(product.createdAt);
  const referenceTime = toTimestamp(now);
  if (createdAt === null || referenceTime === null || days < 0) return false;
  const ageInMilliseconds = referenceTime - createdAt;
  return ageInMilliseconds >= 0 && ageInMilliseconds <= days * 24 * 60 * 60 * 1000;
}

export function getNewProducts(productList, options = {}) {
  return sortProducts(productList.filter((product) => isNewProduct(product, options)), "newest");
}

export function isFeaturedProduct(product) {
  return product.featured === true;
}

export function getFeaturedProducts(productList) {
  return sortProducts(productList.filter(isFeaturedProduct), "featured");
}

export function getRelatedProducts(productList, productOrId, { limit = 4 } = {}) {
  const currentProduct = typeof productOrId === "string" ? findProductById(productList, productOrId) : productOrId;
  if (!currentProduct) return [];
  const currentTags = new Set(asArray(currentProduct.tags).map(normalizeText));

  return productList
    .filter((product) => product.id !== currentProduct.id)
    .map((product, index) => {
      const sharedTags = asArray(product.tags).map(normalizeText).filter((tag) => currentTags.has(tag)).length;
      const score = (product.category === currentProduct.category ? 4 : 0)
        + (product.subcategory && product.subcategory === currentProduct.subcategory ? 3 : 0)
        + sharedTags * 2
        + (product.featured ? 1 : 0);
      return { product, score, index };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, Math.max(0, limit))
    .map(({ product }) => product);
}

export function queryProducts(productList, options = {}) {
  let result = searchProducts(productList, options.query);
  result = filterProductsByCategory(result, options.category, options.subcategory);
  result = filterProductsByPrice(result, { min: options.minPrice, max: options.maxPrice, includeWithoutPrice: options.includeWithoutPrice });
  result = filterProductsByTags(result, options.tags, { match: options.tagMatch });
  result = filterProductsByCollection(result, options.collection);
  if (options.minDiscount !== undefined && options.minDiscount !== null) {
    result = result.filter((product) => product.discount !== undefined && product.discount >= options.minDiscount);
  }
  if (options.minRating !== undefined && options.minRating !== null) {
    result = result.filter((product) => product.rating !== undefined && product.rating >= options.minRating);
  }
  if (options.featured === true) result = result.filter(isFeaturedProduct);
  return sortProducts(result, options.sortBy);
}

export function validateProduct(product) {
  const errors = REQUIRED_FIELDS
    .filter((field) => product[field] === undefined || product[field] === null || product[field] === "")
    .map((field) => `Campo obrigatório ausente: ${field}`);

  if (product.price !== undefined && (typeof product.price !== "number" || product.price < 0)) errors.push("price deve ser um número não negativo");
  if (product.oldPrice !== undefined && (typeof product.oldPrice !== "number" || product.oldPrice < 0)) errors.push("oldPrice deve ser um número não negativo");
  if (product.rating !== undefined && (typeof product.rating !== "number" || product.rating < 0 || product.rating > 5)) errors.push("rating deve estar entre 0 e 5");
  if (toTimestamp(product.createdAt) === null) errors.push("createdAt deve ser uma data válida");
  if (product.tags !== undefined && !Array.isArray(product.tags)) errors.push("tags deve ser um array");
  return { valid: errors.length === 0, errors };
}

export function validateCatalog(productList) {
  const seenIds = new Set();
  const seenSlugs = new Set();

  return productList.flatMap((product, index) => {
    const { errors } = validateProduct(product);
    if (seenIds.has(product.id)) errors.push(`id duplicado: ${product.id}`);
    if (seenSlugs.has(product.slug)) errors.push(`slug duplicado: ${product.slug}`);
    seenIds.add(product.id);
    seenSlugs.add(product.slug);
    return errors.map((message) => ({ index, id: product.id ?? null, message }));
  });
}

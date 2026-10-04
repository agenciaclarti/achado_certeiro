import { categories, editorialCollections, products } from "./data.js";
import { queryProducts } from "./catalog.js";
import { renderProducts } from "./products.js";
import { createElement, icon } from "./utils.js";

const PAGE_SIZE = 12;
const VALID_SORTS = new Set(["relevance", "newest", "price-asc", "price-desc", "discount-desc", "rating-desc"]);
const VALID_COLLECTIONS = new Set([...editorialCollections.map(({ id }) => id), "latest"]);
const categoryMap = new Map(categories.map((category) => [category.id, category]));
const collectionMap = new Map(editorialCollections.map((collection) => [collection.id, collection]));
const allTags = [...new Set(products.flatMap((product) => product.tags ?? []))].sort((a, b) => a.localeCompare(b, "pt-BR"));

const elements = {
  panel: document.querySelector("[data-filter-panel]"),
  backdrop: document.querySelector("[data-filter-close].filter-backdrop"),
  form: document.querySelector("[data-filter-form]"),
  category: document.querySelector("[data-filter-category]"),
  subcategory: document.querySelector("[data-filter-subcategory]"),
  minPrice: document.querySelector("[data-filter-min-price]"),
  maxPrice: document.querySelector("[data-filter-max-price]"),
  discount: document.querySelector("[data-filter-discount]"),
  rating: document.querySelector("[data-filter-rating]"),
  tags: document.querySelector("[data-filter-tags]"),
  featured: document.querySelector("[data-filter-featured]"),
  sortDesktop: document.querySelector("[data-sort-desktop]"),
  sortMobile: document.querySelector("[data-sort-mobile]"),
  grid: document.querySelector("[data-product-grid]"),
  resultCount: document.querySelector("[data-result-count]"),
  empty: document.querySelector("[data-empty-state]"),
  loadMoreWrap: document.querySelector("[data-load-more-wrap]"),
  paginationStatus: document.querySelector("[data-pagination-status]"),
  activeFilters: document.querySelector("[data-active-filters]"),
  activeFilterCount: document.querySelector("[data-active-filter-count]"),
  pageTitle: document.querySelector("[data-page-title]"),
  pageDescription: document.querySelector("[data-page-description]"),
  breadcrumb: document.querySelector("[data-breadcrumb-current]"),
  searchInputs: document.querySelectorAll("[data-search-input]")
};

let state = readStateFromUrl();
let favorites = loadFavorites();
let lastFilterTrigger = null;

function numberFromParam(params, key) {
  const rawValue = params.get(key);
  if (rawValue === null || rawValue === "") return null;
  const value = Number(rawValue);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function readStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("categoria") ?? "all";
  const collection = params.get("collection") ?? "all";
  const requestedSort = params.get("sort") ?? "relevance";
  const requestedPage = Number.parseInt(params.get("page") ?? "1", 10);

  return {
    query: params.get("q")?.trim() ?? "",
    category: categoryMap.has(category) ? category : "all",
    subcategory: params.get("subcategoria") ?? "all",
    minPrice: numberFromParam(params, "minPrice"),
    maxPrice: numberFromParam(params, "maxPrice"),
    minDiscount: numberFromParam(params, "minDiscount"),
    minRating: numberFromParam(params, "minRating"),
    tags: (params.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter((tag) => allTags.includes(tag)),
    featured: params.get("featured") === "1",
    collection: VALID_COLLECTIONS.has(collection) ? collection : "all",
    sort: VALID_SORTS.has(requestedSort) ? requestedSort : "relevance",
    page: Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  };
}

function writeStateToUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category !== "all") params.set("categoria", state.category);
  if (state.subcategory !== "all") params.set("subcategoria", state.subcategory);
  if (state.minPrice !== null) params.set("minPrice", state.minPrice);
  if (state.maxPrice !== null) params.set("maxPrice", state.maxPrice);
  if (state.minDiscount !== null) params.set("minDiscount", state.minDiscount);
  if (state.minRating !== null) params.set("minRating", state.minRating);
  if (state.tags.length) params.set("tags", state.tags.join(","));
  if (state.featured) params.set("featured", "1");
  if (state.collection !== "all") params.set("collection", state.collection);
  if (state.sort !== "relevance") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", state.page);
  const queryString = params.toString();
  history.replaceState({}, "", `${window.location.pathname}${queryString ? `?${queryString}` : ""}`);
}

function loadFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem("achado-certeiro:favorites") ?? "[]");
    return new Set(Array.isArray(stored) ? stored : []);
  } catch {
    return new Set();
  }
}

function saveFavorites() {
  try { localStorage.setItem("achado-certeiro:favorites", JSON.stringify([...favorites])); } catch { /* O catálogo continua funcional sem armazenamento. */ }
}

function labelFromId(value) {
  return value.replaceAll("-", " ").replace(/(^|\s)\S/g, (letter) => letter.toLocaleUpperCase("pt-BR"));
}

function populateCategories() {
  const fragment = document.createDocumentFragment();
  categories.forEach((category) => fragment.append(createElement("option", { text: category.label, attributes: { value: category.id } })));
  elements.category.append(fragment);
}

function populateSubcategories(category = "all", selected = "all") {
  const availableProducts = category === "all" ? products : products.filter((product) => product.category === category);
  const subcategories = [...new Set(availableProducts.map((product) => product.subcategory).filter(Boolean))].sort();
  const fragment = document.createDocumentFragment();
  fragment.append(createElement("option", { text: "Todas as subcategorias", attributes: { value: "all" } }));
  subcategories.forEach((subcategory) => fragment.append(createElement("option", { text: labelFromId(subcategory), attributes: { value: subcategory } })));
  elements.subcategory.replaceChildren(fragment);
  elements.subcategory.value = subcategories.includes(selected) ? selected : "all";
}

function populateTags() {
  const fragment = document.createDocumentFragment();
  allTags.forEach((tag) => {
    const label = createElement("label", { className: "tag-option" });
    label.append(
      createElement("input", { attributes: { type: "checkbox", name: "tags", value: tag, "data-filter-tag": "" } }),
      createElement("span", { text: tag })
    );
    fragment.append(label);
  });
  elements.tags.replaceChildren(fragment);
}

function syncControls() {
  elements.category.value = state.category;
  populateSubcategories(state.category, state.subcategory);
  elements.minPrice.value = state.minPrice ?? "";
  elements.maxPrice.value = state.maxPrice ?? "";
  elements.discount.value = state.minDiscount ?? "";
  elements.rating.value = state.minRating ?? "";
  elements.featured.checked = state.featured;
  elements.sortDesktop.value = state.sort;
  elements.sortMobile.value = state.sort;
  elements.searchInputs.forEach((input) => { input.value = state.query; });
  elements.tags.querySelectorAll("[data-filter-tag]").forEach((input) => { input.checked = state.tags.includes(input.value); });
}

function getFilteredProducts() {
  return queryProducts(products, {
    query: state.query,
    category: state.category,
    subcategory: state.subcategory === "all" ? undefined : state.subcategory,
    minPrice: state.minPrice,
    maxPrice: state.maxPrice,
    minDiscount: state.minDiscount,
    minRating: state.minRating,
    tags: state.tags,
    featured: state.featured,
    collection: state.collection,
    sortBy: state.sort
  });
}

function getHeading() {
  if (state.query) return { title: `Resultados para “${state.query}”`, eyebrow: "Resultado da busca" };
  if (state.category !== "all") return { title: categoryMap.get(state.category)?.label ?? "Categoria", eyebrow: "Produtos da categoria" };
  if (state.collection !== "all") {
    const collection = collectionMap.get(state.collection);
    return { title: state.collection === "latest" ? "Últimos produtos adicionados" : collection?.title ?? "Seleção de produtos", eyebrow: collection?.eyebrow ?? "Curadoria" };
  }
  return { title: "Todos os produtos", eyebrow: "Explore os achados" };
}

function makeActiveFilter(label, key, value = "") {
  const chip = createElement("span", { className: "active-filter", text: label });
  const remove = createElement("button", { attributes: { type: "button", "data-remove-filter": key, "data-remove-value": value, "aria-label": `Remover filtro ${label}` } });
  remove.append(icon("close"));
  chip.append(remove);
  return chip;
}

function renderActiveFilters() {
  const filters = [];
  if (state.query) filters.push(makeActiveFilter(`Busca: ${state.query}`, "query"));
  if (state.category !== "all") filters.push(makeActiveFilter(categoryMap.get(state.category)?.label ?? state.category, "category"));
  if (state.subcategory !== "all") filters.push(makeActiveFilter(labelFromId(state.subcategory), "subcategory"));
  if (state.minPrice !== null) filters.push(makeActiveFilter(`A partir de R$ ${state.minPrice}`, "minPrice"));
  if (state.maxPrice !== null) filters.push(makeActiveFilter(`Até R$ ${state.maxPrice}`, "maxPrice"));
  if (state.minDiscount !== null) filters.push(makeActiveFilter(`${state.minDiscount}% de desconto`, "minDiscount"));
  if (state.minRating !== null) filters.push(makeActiveFilter(`${state.minRating}+ estrelas`, "minRating"));
  state.tags.forEach((tag) => filters.push(makeActiveFilter(tag, "tag", tag)));
  if (state.featured) filters.push(makeActiveFilter("Em destaque", "featured"));
  if (state.collection !== "all") filters.push(makeActiveFilter(collectionMap.get(state.collection)?.title ?? "Novidades", "collection"));
  elements.activeFilters.replaceChildren(...filters);
  elements.activeFilters.hidden = filters.length === 0;
  elements.activeFilterCount.textContent = filters.length;
  elements.activeFilterCount.hidden = filters.length === 0;
}

function render() {
  const results = getFilteredProducts();
  const maxPage = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  state.page = Math.min(state.page, maxPage);
  const visibleProducts = results.slice(0, state.page * PAGE_SIZE);
  const heading = getHeading();

  document.title = `${heading.title} — Achado Certeiro`;
  elements.pageTitle.textContent = heading.title;
  elements.pageTitle.previousElementSibling.textContent = heading.eyebrow;
  elements.breadcrumb.textContent = heading.title;
  elements.pageDescription.textContent = results.length ? "Combine filtros e ordenação para refinar esta seleção." : "Não encontramos itens com os critérios escolhidos.";
  elements.resultCount.textContent = `${results.length} ${results.length === 1 ? "produto encontrado" : "produtos encontrados"}`;
  renderProducts(elements.grid, visibleProducts, categories, favorites);
  elements.grid.hidden = results.length === 0;
  elements.empty.hidden = results.length > 0;
  elements.loadMoreWrap.hidden = visibleProducts.length >= results.length || results.length === 0;
  elements.paginationStatus.textContent = `Exibindo ${visibleProducts.length} de ${results.length}`;
  renderActiveFilters();
  syncControls();
  writeStateToUrl();
}

function readFiltersFromForm() {
  const selectedTags = [...elements.tags.querySelectorAll("[data-filter-tag]:checked")].map((input) => input.value);
  const parseInput = (input) => input.value === "" ? null : Number(input.value);
  state = {
    ...state,
    category: elements.category.value,
    subcategory: elements.subcategory.value,
    minPrice: parseInput(elements.minPrice),
    maxPrice: parseInput(elements.maxPrice),
    minDiscount: parseInput(elements.discount),
    minRating: parseInput(elements.rating),
    tags: selectedTags,
    featured: elements.featured.checked,
    page: 1
  };
}

function clearFilters() {
  state = { query: "", category: "all", subcategory: "all", minPrice: null, maxPrice: null, minDiscount: null, minRating: null, tags: [], featured: false, collection: "all", sort: "relevance", page: 1 };
  closeFilters();
  render();
}

function openFilters() {
  lastFilterTrigger = document.activeElement;
  elements.panel.classList.add("is-open");
  elements.panel.inert = false;
  elements.panel.setAttribute("role", "dialog");
  elements.panel.setAttribute("aria-modal", "true");
  elements.backdrop.hidden = false;
  document.body.classList.add("has-overlay");
  elements.panel.querySelector("select, input, button")?.focus();
}

function closeFilters() {
  const wasOpen = elements.panel.classList.contains("is-open");
  elements.panel.classList.remove("is-open");
  elements.panel.removeAttribute("role");
  elements.panel.removeAttribute("aria-modal");
  elements.backdrop.hidden = true;
  document.body.classList.remove("has-overlay");
  if (window.matchMedia("(max-width: 63.99rem)").matches) elements.panel.inert = true;
  if (wasOpen) lastFilterTrigger?.focus();
}

populateCategories();
populateTags();
syncControls();
render();
closeFilters();

elements.form.addEventListener("submit", (event) => { event.preventDefault(); readFiltersFromForm(); closeFilters(); render(); });
elements.category.addEventListener("change", () => populateSubcategories(elements.category.value));
document.querySelector("[data-filter-open]").addEventListener("click", openFilters);
document.querySelectorAll("[data-filter-close]").forEach((button) => button.addEventListener("click", closeFilters));
document.querySelectorAll("[data-clear-filters]").forEach((button) => button.addEventListener("click", clearFilters));
document.querySelector("[data-load-more]").addEventListener("click", () => { state.page += 1; render(); });

[elements.sortDesktop, elements.sortMobile].forEach((select) => {
  select.addEventListener("change", () => { state.sort = select.value; state.page = 1; render(); });
});

document.querySelectorAll("[data-search-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    state.query = form.querySelector("[data-search-input]").value.trim();
    state.page = 1;
    render();
  });
});

elements.activeFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-filter]");
  if (!button) return;
  const key = button.dataset.removeFilter;
  if (key === "tag") state.tags = state.tags.filter((tag) => tag !== button.dataset.removeValue);
  else if (["minPrice", "maxPrice", "minDiscount", "minRating"].includes(key)) state[key] = null;
  else if (key === "featured") state.featured = false;
  else if (key === "query") state.query = "";
  else state[key] = "all";
  if (key === "category") state.subcategory = "all";
  state.page = 1;
  render();
});

elements.grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-favorite-id]");
  if (!button) return;
  const id = button.dataset.favoriteId;
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  saveFavorites();
  render();
});

window.addEventListener("popstate", () => { state = readStateFromUrl(); render(); });
window.matchMedia("(min-width: 64rem)").addEventListener("change", (event) => {
  if (event.matches) { elements.panel.inert = false; elements.panel.classList.remove("is-open"); elements.backdrop.hidden = true; document.body.classList.remove("has-overlay"); }
  else closeFilters();
});

document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeFilters(); });

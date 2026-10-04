import { categories, editorialCollections, products } from "./data.js";
import { filterProductsByCollection, findProductById, validateCatalog } from "./catalog.js";
import { createCatalogFilter } from "./filters.js";
import { renderCategories, renderFavoriteItems, renderFilterChips, renderMobileCategories, renderPopularRanking, renderProducts } from "./products.js";

const elements = {
  categoryList: document.querySelector("[data-category-list]"),
  headerCategories: document.querySelector("[data-header-categories]"),
  mobileCategories: document.querySelector("[data-mobile-categories]"),
  categoryMenu: document.querySelector("[data-category-menu]"),
  categoryToggle: document.querySelector("[data-category-toggle]"),
  mobileMenu: document.querySelector("[data-mobile-menu]"),
  menuButton: document.querySelector("[data-menu-button]"),
  catalogSection: document.querySelector("[data-catalog-section]"),
  catalogGrid: document.querySelector("[data-catalog-grid]"),
  catalogTitle: document.querySelector("[data-catalog-title]"),
  catalogEyebrow: document.querySelector("[data-catalog-eyebrow]"),
  chips: document.querySelector("[data-filter-chips]"),
  sort: document.querySelector("[data-sort-select]"),
  status: document.querySelector("[data-results-status]"),
  empty: document.querySelector("[data-empty-state]"),
  favoriteCount: document.querySelector("[data-favorite-count]"),
  favoriteDrawer: document.querySelector("[data-favorites-drawer]"),
  favoriteList: document.querySelector("[data-favorites-list]"),
  searchForms: document.querySelectorAll("[data-search-form]"),
  searchInputs: document.querySelectorAll("[data-search-input]")
};

const catalog = createCatalogFilter(products);
const collectionNames = new Map(editorialCollections.map((collection) => [collection.id, collection]));
const catalogErrors = validateCatalog(products);
let favorites = loadFavorites();
let lastFocusedElement = null;

if (catalogErrors.length) console.error("O catálogo local contém dados inválidos:", catalogErrors);

function loadFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem("achado-certeiro:favorites") ?? "[]");
    return new Set(Array.isArray(stored) ? stored.filter((id) => findProductById(products, id)) : []);
  } catch {
    return new Set();
  }
}

function saveFavorites() {
  try { localStorage.setItem("achado-certeiro:favorites", JSON.stringify([...favorites])); } catch { /* A interface continua funcional sem armazenamento. */ }
}

function productsFromCollection(collectionId) {
  return filterProductsByCollection(products, collectionId);
}

function renderHomeShelves() {
  document.querySelectorAll("[data-product-section]").forEach((container) => {
    const list = productsFromCollection(container.dataset.productSection);
    const limit = Number(container.dataset.limit) || list.length;
    renderProducts(container, list.slice(0, limit), categories, favorites);
  });
  renderPopularRanking(document.querySelector("[data-popular-ranking]"), productsFromCollection("popular"), favorites);
}

function updateCatalog() {
  const results = catalog.getResults();
  renderProducts(elements.catalogGrid, results, categories, favorites);
  renderFilterChips(elements.chips, categories, catalog.state.category);
  elements.catalogGrid.hidden = results.length === 0;
  elements.empty.hidden = results.length > 0;
  elements.status.textContent = `${results.length} ${results.length === 1 ? "produto encontrado" : "produtos encontrados"}`;
}

function showCatalog({ collection = "all", category = "all", query = "", title = "Todos os produtos", eyebrow = "Catálogo completo" } = {}) {
  const params = new URLSearchParams();
  if (collection !== "all") params.set("collection", collection);
  if (category !== "all") params.set("categoria", category);
  if (query) params.set("q", query);
  window.location.assign(`catalogo.html${params.size ? `?${params}` : ""}`);
}

function toggleFavorite(productId) {
  if (!findProductById(products, productId)) return;
  favorites.has(productId) ? favorites.delete(productId) : favorites.add(productId);
  saveFavorites();
  renderHomeShelves();
  if (!elements.catalogSection.hidden) updateCatalog();
  updateFavoritesDrawer();
}

function updateFavoritesDrawer() {
  elements.favoriteCount.textContent = favorites.size;
  elements.favoriteCount.hidden = favorites.size === 0;
  const favoriteProducts = [...favorites].map((id) => findProductById(products, id)).filter(Boolean);
  renderFavoriteItems(elements.favoriteList, favoriteProducts);
}

function setOverlayState() {
  document.body.classList.toggle("has-overlay", !elements.mobileMenu.hidden || !elements.favoriteDrawer.hidden);
}

function openFavorites(trigger) {
  lastFocusedElement = trigger;
  elements.favoriteDrawer.hidden = false;
  setOverlayState();
  elements.favoriteDrawer.querySelector("[data-favorites-close]")?.focus();
}

function closeFavorites() {
  elements.favoriteDrawer.hidden = true;
  setOverlayState();
  lastFocusedElement?.focus();
}

function closeMobileMenu() {
  elements.mobileMenu.hidden = true;
  elements.menuButton.setAttribute("aria-expanded", "false");
  elements.menuButton.querySelector(".sr-only").textContent = "Abrir menu";
  setOverlayState();
}

function closeCategoryMenu() {
  elements.categoryMenu.hidden = true;
  elements.categoryToggle.setAttribute("aria-expanded", "false");
}

renderCategories(elements.categoryList, categories);
renderCategories(elements.headerCategories, categories, "menu");
renderMobileCategories(elements.mobileCategories, categories);
renderHomeShelves();
updateFavoritesDrawer();

elements.searchForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("[data-search-input]");
    elements.searchInputs.forEach((otherInput) => { otherInput.value = input.value; });
    showCatalog({ query: input.value, title: input.value ? `Resultados para “${input.value}”` : "Todos os produtos", eyebrow: "Resultado da busca" });
  });
});

document.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite-id]");
  if (favoriteButton) { toggleFavorite(favoriteButton.dataset.favoriteId); return; }

  const openButton = event.target.closest("[data-favorites-open]");
  if (openButton) { openFavorites(openButton); return; }
  if (event.target.closest("[data-favorites-close]")) { closeFavorites(); return; }

  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    const category = categories.find(({ id }) => id === categoryButton.dataset.category);
    closeMobileMenu();
    closeCategoryMenu();
    showCatalog({ category: categoryButton.dataset.category, title: category?.label ?? "Categoria", eyebrow: "Produtos da categoria" });
    return;
  }

  const collectionButton = event.target.closest("[data-view-collection]");
  if (collectionButton) {
    event.preventDefault();
    const id = collectionButton.dataset.viewCollection;
    const collection = collectionNames.get(id);
    showCatalog({ collection: id, title: id === "latest" ? "Últimos produtos adicionados" : collection?.title ?? "Produtos selecionados", eyebrow: collection?.eyebrow ?? "Novidades" });
  }
});

elements.chips.addEventListener("click", (event) => {
  const chip = event.target.closest("[data-filter-category]");
  if (!chip) return;
  catalog.update({ category: chip.dataset.filterCategory });
  updateCatalog();
});

elements.sort.addEventListener("change", () => { catalog.update({ sort: elements.sort.value }); updateCatalog(); });
document.querySelector("[data-clear-filters]").addEventListener("click", () => {
  catalog.reset();
  elements.sort.value = "featured";
  elements.searchInputs.forEach((input) => { input.value = ""; });
  elements.catalogTitle.textContent = "Todos os produtos";
  updateCatalog();
});
document.querySelector("[data-close-catalog]").addEventListener("click", () => { elements.catalogSection.hidden = true; });

elements.categoryToggle.addEventListener("click", () => {
  const willOpen = elements.categoryMenu.hidden;
  elements.categoryMenu.hidden = !willOpen;
  elements.categoryToggle.setAttribute("aria-expanded", String(willOpen));
});
document.querySelector("[data-category-toggle-secondary]").addEventListener("click", () => document.querySelector("#categorias").scrollIntoView({ behavior: "smooth" }));
document.querySelector("[data-category-close]").addEventListener("click", closeCategoryMenu);

elements.menuButton.addEventListener("click", () => {
  elements.mobileMenu.hidden = false;
  elements.menuButton.setAttribute("aria-expanded", "true");
  elements.menuButton.querySelector(".sr-only").textContent = "Fechar menu";
  setOverlayState();
});
elements.mobileMenu.querySelectorAll("[data-menu-close]").forEach((button) => button.addEventListener("click", closeMobileMenu));
elements.mobileMenu.querySelector("nav").addEventListener("click", (event) => { if (event.target.closest("a")) closeMobileMenu(); });

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!elements.favoriteDrawer.hidden) closeFavorites();
  if (!elements.mobileMenu.hidden) closeMobileMenu();
  if (!elements.categoryMenu.hidden) closeCategoryMenu();
});

document.querySelectorAll("[data-current-year]").forEach((element) => { element.textContent = new Date().getFullYear(); });

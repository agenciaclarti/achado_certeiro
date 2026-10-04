import { createElement, currency, icon, integer } from "./utils.js";

export function renderCategories(container, categories, variant = "cards") {
  const fragment = document.createDocumentFragment();
  categories.forEach((category) => {
    const button = createElement("button", {
      className: variant === "cards" ? "category-card" : "category-menu__item",
      attributes: { type: "button", "data-category": category.id, style: `--category-bg:${category.background};--category-accent:${category.accent}` }
    });
    if (variant === "cards") {
      const visual = createElement("span", { className: "category-card__icon" });
      const label = createElement("strong", { text: category.label });
      visual.append(icon(category.icon));
      label.append(icon("arrow"));
      button.append(visual, label);
    } else {
      button.append(icon(category.icon), createElement("span", { text: category.label }));
    }
    fragment.append(button);
  });
  container.replaceChildren(fragment);
}

export function renderMobileCategories(container, categories) {
  const fragment = document.createDocumentFragment();
  categories.forEach((category) => fragment.append(createElement("button", { text: category.label, attributes: { type: "button", "data-category": category.id } })));
  container.replaceChildren(fragment);
}

export function renderFilterChips(container, categories, activeCategory) {
  const fragment = document.createDocumentFragment();
  [{ id: "all", label: "Todos" }, ...categories].forEach((category) => {
    fragment.append(createElement("button", { className: "chip", text: category.label, attributes: { type: "button", "data-filter-category": category.id, "aria-pressed": String(category.id === activeCategory) } }));
  });
  container.replaceChildren(fragment);
}

export function createProductCard(product, categoryLabel, isFavorite = false) {
  const article = createElement("article", { className: "product-card", attributes: { "data-product-id": product.id } });
  const media = createElement("div", { className: "product-card__media" });
  media.append(createElement("img", { attributes: { src: product.image, alt: product.imageAlt ?? "", width: "600", height: "500", loading: "lazy", decoding: "async" } }));

  if (product.badge) media.append(createElement("span", { className: "product-card__badge", text: product.badge }));
  if (product.discount !== undefined && product.discount !== null) media.append(createElement("span", { className: "product-card__discount", text: `-${product.discount}%` }));

  const favorite = createElement("button", { className: "favorite-button", attributes: { type: "button", "data-favorite-id": product.id, "aria-pressed": String(isFavorite), "aria-label": `${isFavorite ? "Remover" : "Adicionar"} ${product.name} ${isFavorite ? "dos" : "aos"} favoritos` } });
  favorite.append(icon("heart"));
  media.append(favorite);

  const content = createElement("div", { className: "product-card__content" });
  content.append(createElement("span", { className: "product-card__category", text: categoryLabel }), createElement("h3", { text: product.name }));

  if (product.rating !== undefined && product.rating !== null) {
    const label = product.reviews !== undefined && product.reviews !== null ? `Avaliação ${product.rating} de 5, em ${product.reviews} opiniões` : `Avaliação ${product.rating} de 5`;
    const rating = createElement("div", { className: "product-card__rating", attributes: { "aria-label": label } });
    rating.append(createElement("span", { className: "product-card__star", text: "★", attributes: { "aria-hidden": "true" } }), createElement("strong", { text: product.rating.toLocaleString("pt-BR") }));
    if (product.reviews !== undefined && product.reviews !== null) rating.append(createElement("span", { text: `(${integer.format(product.reviews)})` }));
    content.append(rating);
  }

  if (product.price !== undefined && product.price !== null) {
    const price = createElement("div", { className: "product-card__price" });
    const priceRow = createElement("div", { className: "product-card__price-row" });
    priceRow.append(createElement("strong", { text: currency.format(product.price) }));
    if (product.oldPrice !== undefined && product.oldPrice !== null) priceRow.append(createElement("span", { className: "product-card__old-price", text: currency.format(product.oldPrice) }));
    price.append(priceRow);
    if (product.installments) price.append(createElement("span", { className: "product-card__installments", text: product.installments }));
    content.append(price);
  }

  const link = createElement("a", { className: "product-card__link", text: "Ver oferta", attributes: { href: product.affiliateUrl, target: "_blank", rel: "sponsored nofollow noopener", "aria-label": `Ver oferta de ${product.name} na loja parceira (abre em nova aba)` } });
  link.append(icon("arrow"));
  const hint = createElement("span", { className: "partner-hint", text: "Você será direcionado à loja parceira" });
  hint.prepend(icon("store"));
  content.append(link, hint);
  article.append(media, content);
  return article;
}

export function renderProducts(container, products, categories, favorites = new Set()) {
  const categoryNames = new Map(categories.map(({ id, label }) => [id, label]));
  const fragment = document.createDocumentFragment();
  products.forEach((product) => fragment.append(createProductCard(product, categoryNames.get(product.category) ?? product.category, favorites.has(product.id))));
  container.replaceChildren(fragment);
}

export function renderPopularRanking(container, products, favorites = new Set()) {
  const fragment = document.createDocumentFragment();
  products.slice(0, 5).forEach((product) => {
    const item = createElement("li");
    const image = createElement("img", { attributes: { src: product.image, alt: "", width: "92", height: "92", loading: "lazy" } });
    const copy = createElement("div");
    copy.append(createElement("h3", { text: product.name }));
    if (product.price !== undefined && product.price !== null) copy.append(createElement("span", { text: currency.format(product.price) }));
    const link = createElement("a", { attributes: { href: product.affiliateUrl, target: "_blank", rel: "sponsored nofollow noopener", "aria-label": `Ver ${product.name} na loja parceira` } });
    link.append(icon("arrow"));
    item.append(image, copy, link);
    fragment.append(item);
  });
  container.replaceChildren(fragment);
}

export function renderFavoriteItems(container, productList) {
  if (!productList.length) {
    const empty = createElement("div", { className: "drawer__empty" });
    empty.append(icon("heart"), createElement("p", { text: "Você ainda não salvou nenhum produto." }));
    container.replaceChildren(empty);
    return;
  }
  const fragment = document.createDocumentFragment();
  productList.forEach((product) => {
    const item = createElement("article", { className: "favorite-item" });
    const copy = createElement("div");
    copy.append(createElement("h3", { text: product.name }));
    if (product.price !== undefined && product.price !== null) copy.append(createElement("strong", { text: currency.format(product.price) }));
    const actions = createElement("div", { className: "favorite-item__actions" });
    const link = createElement("a", { attributes: { href: product.affiliateUrl, target: "_blank", rel: "sponsored nofollow noopener", "aria-label": `Ver ${product.name} na loja parceira` } });
    link.append(icon("arrow"));
    const remove = createElement("button", { attributes: { type: "button", "data-favorite-id": product.id, "aria-label": `Remover ${product.name} dos favoritos` } });
    remove.append(icon("close"));
    actions.append(link, remove);
    item.append(createElement("img", { attributes: { src: product.image, alt: "", width: "90", height: "90" } }), copy, actions);
    fragment.append(item);
  });
  container.replaceChildren(fragment);
}

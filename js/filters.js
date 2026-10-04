import { queryProducts } from "./catalog.js";

export function createCatalogFilter(products) {
  const state = {
    query: "",
    category: "all",
    collection: "all",
    sort: "featured"
  };

  function update(patch) {
    Object.assign(state, patch);
    return getResults();
  }

  function reset() {
    state.query = "";
    state.category = "all";
    state.collection = "all";
    state.sort = "featured";
    return getResults();
  }

  function getResults() {
    return queryProducts(products, {
      query: state.query,
      category: state.category,
      collection: state.collection,
      sortBy: state.sort
    });
  }

  return { state, update, reset, getResults };
}

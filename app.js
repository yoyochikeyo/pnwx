const products = [
  {
    name: "Fastest Shipping Lead Apparel",
    category: "Protection",
    description: "Lead-free aprons, sizing, colors, collar options, and quick fulfillment.",
    filter: "protection",
  },
  {
    name: "Resolution Test Tools & Phantoms",
    category: "QA Tools",
    description: "Line-pair phantoms, system tests, MRI phantoms, and calibration accessories.",
    filter: "qa",
  },
  {
    name: "Most Comfortable Aprons",
    category: "Protection",
    description: "Protection products merchandised around comfort, weight, fit, and daily wear.",
    filter: "protection",
  },
  {
    name: "X-Ray Merchant Boards",
    category: "Room",
    description: "Durable support products for imaging rooms and everyday clinical workflows.",
    filter: "room",
  },
  {
    name: "Surgical Radiation Reducing Gloves",
    category: "Protection",
    description: "Glove options organized by protection level, sizes, and intended procedure use.",
    filter: "protection",
  },
  {
    name: "ACR Accredited Medium MRI Phantom",
    category: "QA Tools",
    description: "A high-value product path with specifications, documentation, and support content.",
    filter: "qa",
  },
  {
    name: "Lead Glass & Mobile Lead Barriers",
    category: "Shielding",
    description: "Room buildout, mobile workflows, and replacement components.",
    filter: "room",
  },
  {
    name: "Silver Recovery Systems",
    category: "Recovery",
    description: "Legacy darkroom and processing supplies grouped for specialized buyers.",
    filter: "recovery",
  },
];

const state = {
  filter: "all",
  query: "",
  quoteItems: [],
};

const body = document.body;
const header = document.querySelector("[data-header]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuClose = document.querySelector("[data-menu-close]");
const backdrop = document.querySelector("[data-backdrop]");
const quoteDrawer = document.querySelector("[data-quote-drawer]");
const quoteItems = document.querySelector("[data-quote-items]");
const quoteCountTargets = document.querySelectorAll("[data-quote-count], [data-quote-count-inline]");
const searchOverlay = document.querySelector("[data-search-overlay]");
const globalSearch = document.querySelector("[data-global-search]");
const searchResults = document.querySelector("[data-search-results]");
const inlineSearch = document.querySelector("[data-inline-search]");
const heroSearchInput = document.querySelector("[data-hero-search-input]");
const filterButtons = document.querySelectorAll("[data-filter]");
const productCards = document.querySelectorAll("[data-category]");
const navLinks = document.querySelectorAll(".desktop-nav > a");

function setScrolledHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 10);
}

function openMenu() {
  mobileMenu.classList.add("is-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  backdrop.classList.add("is-open");
  body.classList.add("menu-open");
}

function closeMenu() {
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  if (!quoteDrawer.classList.contains("is-open")) {
    backdrop.classList.remove("is-open");
  }
  body.classList.remove("menu-open");
}

function openQuote() {
  quoteDrawer.classList.add("is-open");
  quoteDrawer.setAttribute("aria-hidden", "false");
  backdrop.classList.add("is-open");
  body.classList.add("quote-open");
}

function closeQuote() {
  quoteDrawer.classList.remove("is-open");
  quoteDrawer.setAttribute("aria-hidden", "true");
  if (!mobileMenu.classList.contains("is-open")) {
    backdrop.classList.remove("is-open");
  }
  body.classList.remove("quote-open");
}

function openSearch(initialValue = "") {
  searchOverlay.classList.add("is-open");
  searchOverlay.setAttribute("aria-hidden", "false");
  body.classList.add("search-opened");
  globalSearch.value = initialValue;
  renderSearch(initialValue);
  requestAnimationFrame(() => globalSearch.focus());
}

function closeSearch() {
  searchOverlay.classList.remove("is-open");
  searchOverlay.setAttribute("aria-hidden", "true");
  body.classList.remove("search-opened");
}

function renderSearch(query = "") {
  const normalized = query.trim().toLowerCase();
  const matches = products.filter((product) => {
    const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    return !normalized || haystack.includes(normalized);
  });

  searchResults.innerHTML = matches
    .map(
      (product) => `
        <button class="search-result" type="button" data-result-filter="${product.filter}">
          <strong>${product.name}</strong>
          <span>${product.category} · ${product.description}</span>
        </button>
      `
    )
    .join("");
}

function setFilter(nextFilter) {
  state.filter = nextFilter;
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === nextFilter);
  });
  filterProducts();
}

function filterProducts() {
  const query = state.query.trim().toLowerCase();

  productCards.forEach((card) => {
    const matchesFilter = state.filter === "all" || card.dataset.category === state.filter;
    const matchesQuery = !query || card.dataset.name.toLowerCase().includes(query) || card.textContent.toLowerCase().includes(query);
    card.classList.toggle("is-hidden", !(matchesFilter && matchesQuery));
  });
}

function addQuoteItem(name) {
  if (!state.quoteItems.includes(name)) {
    state.quoteItems.push(name);
  }
  renderQuote();
  openQuote();
}

function removeQuoteItem(name) {
  state.quoteItems = state.quoteItems.filter((item) => item !== name);
  renderQuote();
}

function renderQuote() {
  quoteCountTargets.forEach((target) => {
    target.textContent = state.quoteItems.length;
  });

  if (!state.quoteItems.length) {
    quoteItems.innerHTML = '<p class="empty-state">No products selected yet. Add items from the catalog to build a quote.</p>';
    return;
  }

  quoteItems.innerHTML = state.quoteItems
    .map(
      (item) => `
        <div class="quote-item">
          <strong>${item}</strong>
          <button type="button" data-remove-quote="${item}">Remove</button>
        </div>
      `
    )
    .join("");
}

function scrollToCatalog() {
  document.querySelector("#catalog").scrollIntoView({ behavior: "smooth", block: "start" });
}

function runHeroSearch(event) {
  event.preventDefault();
  const query = heroSearchInput.value.trim();
  state.query = query;
  if (inlineSearch) inlineSearch.value = query;
  setFilter("all");
  scrollToCatalog();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -52% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const finalValue = Number(target.dataset.countUp);
      const start = performance.now();
      const duration = 850;

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(finalValue * (0.2 + progress * 0.8));
        target.textContent = value.toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      countObserver.unobserve(target);
    });
  },
  { threshold: 0.45 }
);

document.querySelectorAll("[data-count-up]").forEach((element) => countObserver.observe(element));

window.addEventListener("scroll", setScrolledHeader, { passive: true });
setScrolledHeader();
renderQuote();
renderSearch();

menuToggle.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
backdrop.addEventListener("click", () => {
  closeMenu();
  closeQuote();
});

document.querySelectorAll("[data-open-quote]").forEach((button) => {
  button.addEventListener("click", openQuote);
});

document.querySelector("[data-close-quote]").addEventListener("click", closeQuote);

document.querySelectorAll(".search-open").forEach((button) => {
  button.addEventListener("click", () => openSearch());
});

document.querySelector("[data-close-search]").addEventListener("click", closeSearch);
searchOverlay.addEventListener("click", (event) => {
  if (event.target === searchOverlay) closeSearch();
});

globalSearch.addEventListener("input", (event) => {
  renderSearch(event.target.value);
});

searchResults.addEventListener("click", (event) => {
  const result = event.target.closest("[data-result-filter]");
  if (!result) return;
  setFilter(result.dataset.resultFilter);
  state.query = globalSearch.value;
  if (inlineSearch) inlineSearch.value = globalSearch.value;
  closeSearch();
  scrollToCatalog();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

document.querySelectorAll("[data-filter-link]").forEach((link) => {
  link.addEventListener("click", () => {
    setFilter(link.dataset.filterLink);
    closeMenu();
  });
});

if (inlineSearch) {
  inlineSearch.addEventListener("input", (event) => {
    state.query = event.target.value;
    filterProducts();
  });
}

document.querySelector("[data-hero-search]").addEventListener("submit", runHeroSearch);

document.querySelectorAll("[data-search-chip]").forEach((chip) => {
  chip.addEventListener("click", () => {
    heroSearchInput.value = chip.dataset.searchChip;
    state.query = chip.dataset.searchChip;
    if (inlineSearch) inlineSearch.value = chip.dataset.searchChip;
    setFilter("all");
    scrollToCatalog();
  });
});

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-quote]");
  if (addButton) {
    addQuoteItem(addButton.dataset.addQuote);
  }

  const removeButton = event.target.closest("[data-remove-quote]");
  if (removeButton) {
    removeQuoteItem(removeButton.dataset.removeQuote);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeMenu();
  closeQuote();
  closeSearch();
});

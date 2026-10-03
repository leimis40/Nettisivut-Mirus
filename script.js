(() => {
// Keep shared navigation and contact code isolated from the standalone calculators.
// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("[data-nav]");

// Highlight the current page, its navigation section, or a linked home section.
if (nav) {
  const normalizePath = (path) => path.replace(/\/index\.html$/, "/").replace(/\/+$/, "") || "/";
  const links = Array.from(nav.querySelectorAll("a[href]"));
  const updateCurrentNav = () => {
    const currentPath = normalizePath(window.location.pathname);
    let currentLink = null;
    let currentScore = -1;

    for (const link of links) {
      link.removeAttribute("aria-current");
      link.classList.remove("is-active");
      if (link.getAttribute("href") === "#") continue;

      const target = new URL(link.href);
      if (target.origin !== window.location.origin) continue;
      const targetPath = normalizePath(target.pathname);
      let score = -1;

      if (target.hash) {
        if (targetPath === currentPath && target.hash === window.location.hash) score = 10000;
      } else if (targetPath === currentPath) {
        score = 1000 + targetPath.length;
      } else if (targetPath !== "/" && currentPath.startsWith(`${targetPath}/`)) {
        score = targetPath.length;
      }

      if (score > currentScore) {
        currentLink = link;
        currentScore = score;
      }
    }

    if (currentLink) {
      const isExactPage = !currentLink.hash && normalizePath(currentLink.pathname) === currentPath;
      currentLink.setAttribute("aria-current", isExactPage ? "page" : "location");
      currentLink.closest(".dropdown")?.querySelector(":scope > a")?.classList.add("is-active");
    }
  };

  updateCurrentNav();
  window.addEventListener("hashchange", updateCurrentNav);
  window.addEventListener("pageshow", updateCurrentNav);
}

if (toggle && nav) {
  const closeNav = () => {
    nav.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Avaa valikko");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("show");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Sulje valikko" : "Avaa valikko");
  });

  nav.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest("a") : null;

    if (link && link.getAttribute("href") !== "#") {
      closeNav();
    }
  });

  document.addEventListener("click", (event) => {
    const clickTarget = event.target;

    if (!nav.classList.contains("show") || !(clickTarget instanceof Node)) {
      return;
    }

    if (nav.contains(clickTarget) || toggle.contains(clickTarget)) {
      return;
    }

    closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("show")) {
      closeNav();
      toggle.focus();
    }
  });

  window.addEventListener("pagehide", closeNav);
  window.addEventListener("pageshow", closeNav);
  window.matchMedia("(min-width: 1200px)").addEventListener("change", closeNav);
}

// Keep service anchors usable when their complete description is in a details panel.
const revealLinkedSection = () => {
  if (!window.location.hash) return;
  let id;
  try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
  const target = document.getElementById(id);
  const details = target?.closest("details");
  if (details && !details.open) {
    details.open = true;
    target.scrollIntoView();
  }
};
window.addEventListener("hashchange", revealLinkedSection);
revealLinkedSection();

// Simple "no-backend" contact form: opens user's mail app with prefilled email
const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  const to = "riku.leimola@mirus-electrum.fi";
  const subject = encodeURIComponent(`Yhteydenotto: ${name || "Asiakas"}`);
  const body = encodeURIComponent(
    `Nimi: ${name}\nSähköposti: ${email}\n\nViesti:\n${message}\n`
  );

  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});
})();

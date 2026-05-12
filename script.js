// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("[data-nav]");

if (toggle && nav) {
  const closeNav = () => {
    nav.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("show");
    toggle.setAttribute("aria-expanded", String(isOpen));
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
    if (event.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("pagehide", closeNav);
  window.addEventListener("pageshow", closeNav);
}

// Simple "no-backend" contact form: opens user's mail app with prefilled email
const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  const to = "info@miruselectrum.fi";
  const subject = encodeURIComponent(`Yhteydenotto: ${name || "Asiakas"}`);
  const body = encodeURIComponent(
    `Nimi: ${name}\nSähköposti: ${email}\n\nViesti:\n${message}\n`
  );

  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
});

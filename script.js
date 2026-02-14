// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("[data-nav]");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("show");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
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

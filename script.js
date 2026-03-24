"use strict";

const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");
const copyEmailButton = document.getElementById("copy-email");
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.classList.toggle("hidden");
  });
}

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobileMenu && menuToggle && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

if (copyEmailButton) {
  copyEmailButton.addEventListener("click", async () => {
    const email = copyEmailButton.getAttribute("data-email");
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      const originalLabel = copyEmailButton.textContent;
      copyEmailButton.textContent = "Copied";

      window.setTimeout(() => {
        copyEmailButton.textContent = originalLabel;
      }, 1500);
    } catch (_error) {
      copyEmailButton.textContent = "Copy failed";
      window.setTimeout(() => {
        copyEmailButton.textContent = "Copy email";
      }, 1500);
    }
  });
}

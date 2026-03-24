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

const movingCard = document.getElementById("moving-card");
const heroCardAnchor = document.getElementById("hero-card-anchor");
const aboutCardAnchor = document.getElementById("about-card-anchor");
const aboutTextPanel = document.getElementById("about-text-panel");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function smoothStep(value) {
  return value * value * (3 - 2 * value);
}

function updateScrollCardAnimation() {
  if (!movingCard || !heroCardAnchor || !aboutCardAnchor || !aboutTextPanel) return;

  if (window.innerWidth < 1024 || reduceMotion.matches) {
    movingCard.style.transform = "";
    movingCard.style.opacity = "";
    aboutTextPanel.style.opacity = "1";
    aboutTextPanel.style.transform = "translateX(0px)";
    return;
  }

  const heroRect = heroCardAnchor.getBoundingClientRect();
  const aboutRect = aboutCardAnchor.getBoundingClientRect();
  const startY =
    heroRect.top + window.scrollY + Math.max(heroRect.height * 0.04, window.innerHeight * 0.02);
  const endY = aboutRect.top + window.scrollY - window.innerHeight * 0.26;
  const range = Math.max(endY - startY, 1);
  const progress = clamp((window.scrollY - startY) / range, 0, 1);
  const easedProgress = smoothStep(progress);

  const targetLeft = aboutRect.left + (aboutRect.width - heroRect.width) * 0.5;
  const deltaX = targetLeft - heroRect.left;
  const deltaY = aboutRect.top - heroRect.top;
  const floatLift = -18 * Math.sin(easedProgress * Math.PI);
  const moveX = deltaX * easedProgress;
  const moveY = deltaY * easedProgress + floatLift;
  const rotateY = easedProgress * 180;
  const rotateX = -5 * Math.sin(easedProgress * Math.PI);
  const scale = 1 - 0.045 * easedProgress;

  movingCard.style.transform =
    "translate3d(" +
    moveX.toFixed(2) +
    "px, " +
    moveY.toFixed(2) +
    "px, 0) rotateY(" +
    rotateY.toFixed(2) +
    "deg) rotateX(" +
    rotateX.toFixed(2) +
    "deg) scale(" +
    scale.toFixed(4) +
    ")";
  movingCard.style.opacity = String(1 - 0.1 * easedProgress);

  const textProgress = clamp((easedProgress - 0.35) / 0.65, 0, 1);
  const textOffset = 40 * (1 - textProgress);
  aboutTextPanel.style.opacity = String(0.18 + textProgress * 0.82);
  aboutTextPanel.style.transform = "translateX(" + textOffset.toFixed(2) + "px)";
}

let scrollAnimationFrame = null;

function queueScrollCardAnimation() {
  if (scrollAnimationFrame !== null) return;
  scrollAnimationFrame = window.requestAnimationFrame(() => {
    scrollAnimationFrame = null;
    updateScrollCardAnimation();
  });
}

window.addEventListener("scroll", queueScrollCardAnimation, { passive: true });
window.addEventListener("resize", queueScrollCardAnimation);
if (typeof reduceMotion.addEventListener === "function") {
  reduceMotion.addEventListener("change", queueScrollCardAnimation);
}
queueScrollCardAnimation();

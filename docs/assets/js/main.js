const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    if (nav && toggle) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
});

const currentYear = document.querySelector("#current-year");
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const stages = document.querySelectorAll(".pipe-stage");
if (stages.length && "IntersectionObserver" in window) {
  const pipeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animatePipeline();
          pipeObserver.unobserve(entry.target.closest(".visual-section"));
        }
      });
    },
    { threshold: 0.3 }
  );

  pipeObserver.observe(stages[0].closest(".visual-section"));
}

function animatePipeline() {
  let current = 0;
  const tick = () => {
    stages.forEach((s) => s.classList.remove("active"));
    if (current < stages.length) {
      stages[current].classList.add("active");
      current++;
      setTimeout(tick, 700);
    } else {
      setTimeout(() => {
        current = 0;
        stages.forEach((s) => s.classList.remove("active"));
        setTimeout(tick, 1800);
      }, 900);
    }
  };
  tick();
}

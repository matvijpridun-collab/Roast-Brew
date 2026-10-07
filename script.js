/* =========================================================
   ЗЕРНО & ЧАШКА — PREMIUM INTERACTIVE EXPERIENCE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =======================================================
     1. HEADER — змінюється при скролі
     ======================================================= */

  const header = document.querySelector("#header");

  const notification = document.createElement("div");
  notification.className = "notification";
  notification.setAttribute("role", "status");
  notification.setAttribute("aria-live", "polite");
  notification.setAttribute("aria-atomic", "true");
  document.body.appendChild(notification);

  let notificationTimeout;

  function showNotification(message) {
    notification.textContent = message;
    notification.classList.add("is-visible");

    window.clearTimeout(notificationTimeout);
    notificationTimeout = window.setTimeout(() => {
      notification.classList.remove("is-visible");
    }, 3500);
  }

  document.querySelectorAll(".product-card .btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button
        .closest(".product-card")
        ?.querySelector("h3")
        ?.textContent
        .trim();

      if (productName) {
        showNotification(`«${productName}» додано до кошика.`);
      }
    });
  });

  const orderForm = document.querySelector(".order form");

  orderForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    showNotification("Дякуємо! Анкету заповнено. Це демо-повідомлення: заявку ще не надіслано.");
    orderForm.reset();
  });

  function updateHeader() {
    if (!header) return;

    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();


  /* =======================================================
     2. CURSOR GLOW
     ======================================================= */

  const cursorGlow = document.createElement("div");

  cursorGlow.className = "cursor-glow";

  cursorGlow.style.cssText = `
    position: fixed;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    left: 0;
    top: 0;
    opacity: 0;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle,
      rgba(201,155,90,0.11) 0%,
      rgba(201,155,90,0.04) 35%,
      transparent 70%
    );
    filter: blur(8px);
    transition: opacity .4s ease;
  `;

  document.body.appendChild(cursorGlow);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    cursorGlow.style.opacity = "1";
  });

  function animateCursor() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;

    cursorGlow.style.transform =
      `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();


  /* =======================================================
     3. ДОДАТКОВИЙ GRAIN / NOISE OVERLAY
     ======================================================= */

  const noise = document.createElement("div");

  noise.className = "noise-overlay";

  noise.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9997;
    opacity: .035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
  `;

  document.body.appendChild(noise);


  /* =======================================================
     4. SCROLL REVEAL
     ======================================================= */

  const revealElements = document.querySelectorAll(
    ".product-card, .roasting-text, .roasting-container > img, " +
    ".advantages-container, .order-container"
  );

  revealElements.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(60px)";
    element.style.transition =
      `opacity .9s cubic-bezier(.2,.7,.2,1) ${index * 0.05}s,
       transform .9s cubic-bezier(.2,.7,.2,1) ${index * 0.05}s`;
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -70px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });


  /* =======================================================
     5. 3D TILT ДЛЯ КАРТОК КАВИ
     ======================================================= */

  const cards = document.querySelectorAll(".product-card");

  cards.forEach((card) => {
    let rect;

    card.addEventListener("mouseenter", () => {
      rect = card.getBoundingClientRect();

      card.style.transition =
        "transform .15s ease, border-color .3s ease, box-shadow .4s ease";
    });

    card.addEventListener("mousemove", (event) => {
      if (!rect) {
        rect = card.getBoundingClientRect();
      }

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 8;
      const rotateX = ((centerY - y) / centerY) * 8;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-10px)
        scale(1.015)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transition =
        "transform .6s cubic-bezier(.2,.8,.2,1), border-color .3s ease, box-shadow .4s ease";

      card.style.transform = "";
      rect = null;
    });
  });


  /* =======================================================
     6. 3D EFFECT ДЛЯ HERO IMAGE
     ======================================================= */

  /* =======================================================
     7. PARALLAX HERO
     ======================================================= */

  const hero = document.querySelector(".hero");
  const heroText = document.querySelector(".hero-text");

  window.addEventListener(
    "scroll",
    () => {
      if (!hero) return;

      const scrollY = window.scrollY;

      if (scrollY < window.innerHeight) {
        if (heroText) {
          heroText.style.transform =
            `translateY(${scrollY * 0.16}px)`;
        }

      }
    },
    { passive: true }
  );


  /* =======================================================
     8. ПЛАВНИЙ SCROLL ДО СЕКЦІЙ
     ======================================================= */

  const anchors = document.querySelectorAll(
    'a[href^="#"]'
  );

  anchors.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight = header
        ? header.offsetHeight
        : 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });


  /* =======================================================
     9. MAGNETIC BUTTONS
     ======================================================= */

  const magneticButtons = document.querySelectorAll(
    ".btn-order, .product-card .btn, .order button"
  );

  magneticButtons.forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();

      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      button.style.transform =
        `translate(${x * 0.12}px, ${y * 0.12}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "";
    });
  });


  /* =======================================================
     10. RIPPLE EFFECT НА КНОПКАХ
     ======================================================= */

  const buttons = document.querySelectorAll(
    ".btn, .btn-order, .order button"
  );

  buttons.forEach((button) => {
    button.style.position = "relative";
    button.style.overflow = "hidden";

    button.addEventListener("click", (event) => {
      const ripple = document.createElement("span");

      const rect = button.getBoundingClientRect();

      const size = Math.max(
        rect.width,
        rect.height
      );

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${event.clientX - rect.left - size / 2}px;
        top: ${event.clientY - rect.top - size / 2}px;
        border-radius: 50%;
        background: rgba(255,255,255,.22);
        transform: scale(0);
        pointer-events: none;
        animation: coffeeRipple .65s ease-out;
      `;

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 700);
    });
  });


  /* =======================================================
     11. СТИЛЬ ДЛЯ RIPPLE
     ======================================================= */

  const rippleStyle = document.createElement("style");

  rippleStyle.textContent = `
    @keyframes coffeeRipple {
      0% {
        transform: scale(0);
        opacity: .7;
      }

      100% {
        transform: scale(2.5);
        opacity: 0;
      }
    }

    #header.scrolled {
      background: rgba(9, 7, 5, .88);
      box-shadow: 0 10px 40px rgba(0,0,0,.2);
    }

    .product-card {
      will-change: transform;
      transform-style: preserve-3d;
    }
  `;

  document.head.appendChild(rippleStyle);


  /* =======================================================
     12. MOUSE LIGHT НА PRODUCT CARDS
     ======================================================= */

  cards.forEach((card) => {
    const light = document.createElement("div");

    light.style.cssText = `
      position: absolute;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      pointer-events: none;
      opacity: 0;
      background: radial-gradient(
        circle,
        rgba(226,187,122,.13),
        transparent 70%
      );
      transform: translate(-50%, -50%);
      transition: opacity .3s ease;
    `;

    card.appendChild(light);

    card.addEventListener("mouseenter", () => {
      light.style.opacity = "1";
    });

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();

      light.style.left =
        `${event.clientX - rect.left}px`;

      light.style.top =
        `${event.clientY - rect.top}px`;
    });

    card.addEventListener("mouseleave", () => {
      light.style.opacity = "0";
    });
  });


  /* =======================================================
     13. SCROLL PROGRESS BAR
     ======================================================= */

  const progress = document.createElement("div");

  progress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    width: 0%;
    z-index: 10000;

    background: linear-gradient(
      90deg,
      #8f6334,
      #e2bb7a
    );

    box-shadow: 0 0 15px rgba(226,187,122,.5);

    pointer-events: none;
  `;

  document.body.appendChild(progress);

  function updateProgress() {
    const scrollTop = window.scrollY;

    const height =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const percentage =
      height > 0
        ? (scrollTop / height) * 100
        : 0;

    progress.style.width = `${percentage}%`;
  }

  window.addEventListener(
    "scroll",
    updateProgress,
    { passive: true }
  );

  updateProgress();


  /* =======================================================
     14. РУХ ТЕКСТУ ПРИ НАВЕДЕННІ
     ======================================================= */

  const titles = document.querySelectorAll(
    ".product-card h3"
  );

  titles.forEach((title) => {
    title.style.transition = "transform .3s ease";

    title.closest(".product-card")?.addEventListener(
      "mouseenter",
      () => {
        title.style.transform =
          "translateX(5px)";
      }
    );

    title.closest(".product-card")?.addEventListener(
      "mouseleave",
      () => {
        title.style.transform =
          "translateX(0)";
      }
    );
  });


  /* =======================================================
     15. 3D TILT ДЛЯ ROASTING IMAGE
     ======================================================= */

  const roastingImage =
    document.querySelector(".roasting-container > img");

  if (roastingImage) {
    roastingImage.style.transition =
      "transform .3s ease";

    roastingImage.addEventListener(
      "mousemove",
      (event) => {
        const rect =
          roastingImage.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width -
          0.5;

        const y =
          (event.clientY - rect.top) /
          rect.height -
          0.5;

        roastingImage.style.transform = `
          perspective(1000px)
          rotateX(${y * -5}deg)
          rotateY(${x * 5}deg)
          scale(1.015)
        `;
      }
    );

    roastingImage.addEventListener(
      "mouseleave",
      () => {
        roastingImage.style.transform = "";
      }
    );
  }


  /* =======================================================
     16. INPUT FOCUS EFFECT
     ======================================================= */

  const inputs = document.querySelectorAll(
    ".order input, .order textarea"
  );

  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement?.classList.add("input-active");
    });

    input.addEventListener("blur", () => {
      input.parentElement?.classList.remove("input-active");
    });
  });


  /* =======================================================
     17. PREFERS REDUCED MOTION
     ======================================================= */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (reducedMotion) {
    cursorGlow.remove();

    document
      .querySelectorAll(
        ".product-card, .roasting-text, " +
        ".roasting-container > img, " +
        ".advantages-container, .order-container"
      )
      .forEach((element) => {
        element.style.opacity = "1";
        element.style.transform = "none";
        element.style.transition = "none";
      });
  }


  /* =======================================================
     18. CONSOLE
     ======================================================= */

  console.log(
    "%c ЗЕРНО & ЧАШКА ",
    "background:#c99b5a;color:#17100a;font-size:18px;font-weight:bold;padding:8px 14px;border-radius:6px;"
  );

  console.log(
    "%c Premium coffee experience loaded ☕",
    "color:#c99b5a;font-size:13px;"
  );
});

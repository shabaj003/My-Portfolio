gsap.registerPlugin(ScrollTrigger);

function valueSetters() {
  gsap.set("#nav a", { y: "-100%", opacity: 0 });
  gsap.set("#home .parent .child", { y: "100%" });
  gsap.set("#home .row img", { opacity: 0 });
}

function revealToSpan() {
  document.querySelectorAll(".reveal").forEach((elem) => {
    const parent = document.createElement("span");
    const child = document.createElement("span");

    parent.classList.add("parent");
    child.classList.add("child");

    child.innerHTML = elem.innerHTML;
    parent.appendChild(child);

    elem.innerHTML = "";
    elem.appendChild(parent);
  });
}

function loaderanimation() {
  const tl = gsap.timeline();

  tl.from("#loader .child span", {
    yPercent: 100,
    duration: 1,
    stagger: 0.2,
    delay: 0.5,
    ease: "expo.inOut"
  })
    .to("#loader .parent .child", {
      yPercent: -100,
      duration: 0.5,
      ease: "expo.inOut"
    })
    .to("#loader", {
      height: 0,
      duration: 1,
      ease: "expo.inOut"
    })
    .to("#green", {
      height: "100%",
      top: 0,
      delay: -0.8,
      duration: 1,
      ease: "expo.inOut"
    })
    .to("#green", {
      height: "0%",
      duration: 1,
      delay: -0.5,
      ease: "expo.inOut",
      onComplete: () => {
        animateHomepage();
      }
    });
}

function animateHomepage() {
  const tl = gsap.timeline();

  tl.to("#nav a", {
    y: 0,
    opacity: 1,
    stagger: 0.05,
    duration: 2,
    ease: "expo.inOut"
  })
    .to("#home .parent .child", {
      y: 0,
      stagger: 0.1,
      duration: 2,
      ease: "expo.inOut"
    })
    .to("#home .row img", {
      opacity: 1,
      ease: "expo.inOut"
    })
    .from(".reveal-text", {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: "power4.out"
    });
}

function Project() {
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".card").forEach((otherCard) => {
        if (otherCard !== card) otherCard.classList.remove("flip");
      });

      card.classList.toggle("flip");
    });
  });
}

function handleForm() {
  const form = document.getElementById("contactForm") || document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (status) status.textContent = "Sending...";

    const data = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        if (status) status.textContent = "Message sent successfully!";
        form.reset();
      } else if (status) {
        status.textContent = "Oops! Something went wrong.";
      }
    } catch (error) {
      if (status) status.textContent = "Network error. Try again later.";
    }
  });
}

function animeCarousel() {
  const container = document.querySelector(".carousel-container");
  const cards = document.querySelectorAll(".card1");
  if (!container || cards.length === 0) return;

  function getDynamicRadius() {
    const width = window.innerWidth;
    if (width > 1200) return 400;
    if (width > 992) return 350;
    if (width > 768) return 300;
    return 200;
  }

  let radius = getDynamicRadius();
  const total = cards.length;

  function setCardPositions() {
    radius = getDynamicRadius();
    cards.forEach((card, i) => {
      const angle = (i / total) * 360;
      card.style.transform = `
        rotateY(${angle}deg)
        translateZ(${radius}px)
      `;
    });
  }

  setCardPositions();
  window.addEventListener("resize", setCardPositions);

  let angleOffset = 0;
  function animate() {
    angleOffset += 0.2;
    container.style.transform = `rotateY(${angleOffset}deg)`;
    requestAnimationFrame(animate);
  }
  animate();
}

function setupHomeParallax() {
  const home = document.getElementById("home");
  if (!home) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (reducedMotion || !finePointer) return;

  let pointerX = 0;
  let pointerY = 0;
  let rafId = null;

  const paint = () => {
    home.style.setProperty("--pointer-x", pointerX.toFixed(3));
    home.style.setProperty("--pointer-y", pointerY.toFixed(3));
    rafId = null;
  };

  const queuePaint = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(paint);
  };

  home.addEventListener("pointermove", (event) => {
    const rect = home.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    queuePaint();
  });

  home.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
    queuePaint();
  });
}

function setupTiltSurfaces() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const tiltTargets = document.querySelectorAll(
    "#AsideText, #Images img, .Education1, .Education2, .skill-card, .card, .contact-form, .contact-text"
  );

  document
    .querySelectorAll("#home .row h1, .section-title h2, .skills-section h2, #project h1, .eyebrow")
    .forEach((title) => title.classList.add("depth-title"));

  tiltTargets.forEach((target) => {
    target.classList.add("tilt-surface");

    const layers = target.querySelectorAll("h2, h3, p, .tag, button, .btn, i");
    layers.forEach((layer, index) => {
      const depth = Math.min(42, 12 + index * 4);
      layer.classList.add("tilt-layer");
      layer.dataset.depth = String(depth);
      layer.style.transform = `translate3d(0, 0, ${depth}px)`;
    });

    if (reducedMotion || !finePointer) return;

    let rotateX = 0;
    let rotateY = 0;
    let rafId = null;

    const paint = () => {
      target.style.transform =
        `perspective(1200px) rotateX(${-rotateY}deg) rotateY(${rotateX}deg) scale3d(1.02, 1.02, 1.02)`;

      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth || 0);
        layer.style.transform = `translate3d(${rotateX * 1.8}px, ${-rotateY * 1.8}px, ${depth}px)`;
      });
      rafId = null;
    };

    const queuePaint = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(paint);
    };

    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      rotateX = x * 12;
      rotateY = y * 12;
      queuePaint();
    });

    target.addEventListener("pointerleave", () => {
      rotateX = 0;
      rotateY = 0;
      queuePaint();
    });
  });
}

function setupScrollDepth() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  gsap.utils.toArray(".depth-title").forEach((title) => {
    gsap.fromTo(
      title,
      { z: 0, rotationX: 0 },
      {
        z: 70,
        rotationX: 6,
        transformOrigin: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: title,
          start: "top 90%",
          end: "bottom 15%",
          scrub: true
        }
      }
    );
  });
}

function makePortfolio3D() {
  setupHomeParallax();
  setupTiltSurfaces();
  setupScrollDepth();
}

revealToSpan();
valueSetters();
loaderanimation();
animeCarousel();
Project();
handleForm();
makePortfolio3D();

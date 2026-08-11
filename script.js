document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------
     Hero: character-stagger animation
     data-text uses | as a line-break marker
  --------------------------------------------- */
  const nameEl = document.querySelector(".hero__name");
  if (nameEl) {
    const raw = nameEl.dataset.text || "";
    nameEl.textContent = "";

    const startDelay = 200; // ms after eyebrow starts
    const charDelay  = 26;  // ms between each character
    let charIndex = 0;

    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];

      if (ch === "|") {
        // Force a new line
        nameEl.appendChild(document.createElement("br"));
      } else if (ch === " ") {
        const sp = document.createElement("span");
        sp.className = "hero__space";
        sp.setAttribute("aria-hidden", "true");
        nameEl.appendChild(sp);
      } else {
        const span = document.createElement("span");
        span.className = "hero__char";
        span.textContent = ch;
        span.setAttribute("aria-hidden", "true");
        if (!reduceMotion) {
          span.style.animationDelay = `${startDelay + charIndex * charDelay}ms`;
        } else {
          span.style.opacity = "1";
          span.style.transform = "none";
        }
        nameEl.appendChild(span);
        charIndex++;
      }
    }
  }

  /* ---------------------------------------------
     Generic reveal-on-scroll
  --------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------------------------------
     Journey: sticky scroll animation
  --------------------------------------------- */
  const journey = document.querySelector(".journey");
  if (!journey) return;

  const stops       = journey.querySelectorAll(".journey__stop");
  const numEl       = journey.querySelector(".journey__num");
  const ghostNum    = journey.querySelector(".journey__ghost-num");
  const pathFill    = journey.querySelector(".journey__path-fill");
  const waypoints   = journey.querySelectorAll(".journey__wp");
  const scrubFill   = journey.querySelector(".journey__scrubber-fill");

  const NUM_STOPS = stops.length; // 4

  // Set up the animated path
  let pathLength = 0;
  if (pathFill) {
    pathLength = pathFill.getTotalLength();
    pathFill.style.strokeDasharray  = String(pathLength);
    pathFill.style.strokeDashoffset = String(pathLength);
  }

  if (reduceMotion) {
    stops.forEach((s) => { s.classList.add("is-active"); s.style.position = "relative"; });
    waypoints.forEach((w) => w.classList.add("is-active"));
    if (pathFill) pathFill.style.strokeDashoffset = "0";
    return;
  }

  let activeIndex = 0;
  let ticking = false;

  // Initialise first stop as active
  stops[0].classList.add("is-active");
  waypoints[0].classList.add("is-active");

  function setActive(newIndex) {
    if (newIndex === activeIndex) return;
    const prev = activeIndex;
    activeIndex = newIndex;

    stops.forEach((s, i) => {
      s.classList.remove("is-active", "is-past");
      if (i === activeIndex) s.classList.add("is-active");
      else if (i < activeIndex) s.classList.add("is-past");
    });

    waypoints.forEach((w, i) => w.classList.toggle("is-active", i === activeIndex));

    const label = String(activeIndex + 1).padStart(2, "0");
    if (numEl) numEl.textContent = label;
    if (ghostNum) ghostNum.textContent = label;
  }

  function update() {
    ticking = false;

    const rect    = journey.getBoundingClientRect();
    const total   = journey.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, -rect.top);
    const progress = total > 0 ? Math.min(1, scrolled / total) : 0;

    // Which stop is active. Adding 0.22 shifts each threshold earlier so
    // the dot activates before the user has scrolled exactly to its boundary.
    const rawFloat = progress * NUM_STOPS;
    const newIndex = Math.min(Math.floor(rawFloat + 0.22), NUM_STOPS - 1);
    setActive(newIndex);

    // Draw path: fully drawn by the time the last stop is reached (at progress ~0.75)
    if (pathFill) {
      const drawP = Math.min(1, progress / 0.75);
      pathFill.style.strokeDashoffset = String(pathLength * (1 - drawP));
    }

    // Scrubber
    if (scrubFill) scrubFill.style.width = `${progress * 100}%`;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    // Recalculate path length on resize (layout may shift)
    if (pathFill) {
      pathLength = pathFill.getTotalLength();
      pathFill.style.strokeDasharray = String(pathLength);
    }
    update();
  });

  update();
});

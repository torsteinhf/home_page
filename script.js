/* ─────────────────────────────────────────────
   Theme: apply before DOMContentLoaded to avoid flash
───────────────────────────────────────────── */
(function () {
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.dataset.theme = saved;
})();

document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ─── Theme toggle ─── */
  const themeBtn = document.getElementById("theme-toggle");

  const ICON_SUN  = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const ICON_MOON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  const applyTheme = (theme) => {
    document.body.dataset.theme = theme;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    if (themeBtn) themeBtn.innerHTML = theme === "dark" ? ICON_SUN : ICON_MOON;
  };

  applyTheme(localStorage.getItem("theme") || "dark");

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = document.body.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ─── Hero: character-stagger animation ─── */
  const nameEl = document.querySelector(".hero__name");
  if (nameEl) {
    const raw = nameEl.dataset.text || "";
    nameEl.textContent = "";
    const startDelay = 200;
    const charDelay  = 26;
    let charIndex = 0;
    for (let i = 0; i < raw.length; i++) {
      const ch = raw[i];
      if (ch === "|") {
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

  /* ─── Reveal on scroll ─── */
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

  /* ─── Journey: sticky scroll ─── */
  const journey = document.querySelector(".journey");
  if (journey) {
    const stops     = journey.querySelectorAll(".journey__stop");
    const numEl     = journey.querySelector(".journey__num");
    const ghostNum  = journey.querySelector(".journey__ghost-num");
    const scrubFill = journey.querySelector(".journey__scrubber-fill");
    const NUM_STOPS = stops.length;

    if (reduceMotion) {
      stops.forEach((s) => { s.classList.add("is-active"); s.style.position = "relative"; });
    } else {
      /* Globe */
      const GLOBE_STOPS = [
        [8.5,    47.4],
        [-122.3, 37.9],
        [10.4,   63.4],
        [10.7,   59.9],
        [10.8,   59.7],
      ];
      const GLOBE_LABELS = ["ZÜRICH", "BERKELEY", "TRONDHEIM", "OSLO", "ÅS"];

      function initGlobe(canvas) {
        const ctx = canvas.getContext("2d");
        let world = null;
        let landFeature = null;
        let graticuleFeature = null;
        let rotation = [-GLOBE_STOPS[0][0], -GLOBE_STOPS[0][1], 0];
        let scaleFactor = 1;
        let currentStopIdx = 0;
        let animId = null;
        let idleAnimId = null;
        let pulseT = 0;

        const projection = d3.geoOrthographic().clipAngle(90).translate([0, 0]);
        const pathGen = d3.geoPath(projection, ctx);

        function cssSize() { return { w: canvas.offsetWidth, h: canvas.offsetHeight }; }

        function resize() {
          const dpr = devicePixelRatio || 1;
          const { w, h } = cssSize();
          canvas.width  = w * dpr;
          canvas.height = h * dpr;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          render();
        }

        function render() {
          if (!world) return;
          const { w, h } = cssSize();
          const baseR = Math.min(w, h) * 1.35;
          const r = baseR * scaleFactor;
          const light = document.body.dataset.theme === "light";
          projection.scale(r).rotate(rotation).translate([w / 2, h / 2]);
          ctx.clearRect(0, 0, w, h);

          ctx.beginPath(); pathGen({ type: "Sphere" });
          ctx.fillStyle = light ? "#d6d3cc" : "#090909"; ctx.fill();

          ctx.beginPath(); pathGen(graticuleFeature);
          ctx.strokeStyle = light ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.045)";
          ctx.lineWidth = 0.5; ctx.stroke();

          ctx.beginPath(); pathGen(landFeature);
          ctx.fillStyle = light ? "#c2bfb8" : "#1c1c1c"; ctx.fill();
          ctx.strokeStyle = light ? "#b0ada6" : "#2a2a2a";
          ctx.lineWidth = 0.5; ctx.stroke();

          ctx.beginPath(); pathGen({ type: "Sphere" });
          ctx.strokeStyle = light ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.08)";
          ctx.lineWidth = 1; ctx.stroke();

          const [lon, lat] = GLOBE_STOPS[currentStopIdx];
          const pt = projection([lon, lat]);
          if (pt) {
            const [px, py] = pt;
            const pulse = (Math.sin(pulseT) + 1) / 2;
            const dotRgb   = light ? "130,24,40" : "94,143,110";
            const dotSolid = light ? "#821828"   : "#5e8f6e";

            ctx.beginPath(); ctx.arc(px, py, 13 + pulse * 5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${dotRgb},${0.18 + pulse * 0.15})`; ctx.lineWidth = 1; ctx.stroke();

            ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${dotRgb},0.6)`; ctx.lineWidth = 1; ctx.stroke();

            ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = dotSolid; ctx.fill();

            ctx.beginPath(); ctx.moveTo(px + 14, py); ctx.lineTo(px + 26, py);
            ctx.strokeStyle = `rgba(${dotRgb},0.65)`; ctx.lineWidth = 0.75; ctx.stroke();

            ctx.font = "10px 'IBM Plex Mono', monospace";
            if ("letterSpacing" in ctx) ctx.letterSpacing = "0.08em";
            ctx.fillStyle = light ? "rgba(13,13,13,0.7)" : "rgba(237,234,227,0.7)";
            ctx.textBaseline = "middle";
            ctx.fillText(GLOBE_LABELS[currentStopIdx], px + 31, py);
          }
        }

        function startIdleLoop() {
          if (idleAnimId) return;
          let last = null;
          function loop(ts) {
            if (last !== null) pulseT += (ts - last) * 0.0022;
            last = ts;
            render();
            idleAnimId = requestAnimationFrame(loop);
          }
          idleAnimId = requestAnimationFrame(loop);
        }

        function stopIdleLoop() {
          if (idleAnimId) { cancelAnimationFrame(idleAnimId); idleAnimId = null; }
        }

        function rotateTo(index) {
          stopIdleLoop();
          if (animId) cancelAnimationFrame(animId);
          const fromRot = [...rotation];
          const toStop  = GLOBE_STOPS[index];
          const dist       = d3.geoDistance([-fromRot[0], -fromRot[1]], [toStop[0], toStop[1]]);
          const normalized = Math.min(1, dist / (Math.PI * 0.5));
          const duration   = 1600 + normalized * 1400;
          const zoomDepth  = 0.05 + normalized * 0.63;
          const start = performance.now();
          const interp = d3.geoInterpolate([-fromRot[0], -fromRot[1]], [toStop[0], toStop[1]]);
          currentStopIdx = index;

          function step(now) {
            const raw = Math.min(1, (now - start) / duration);
            const t = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw;
            scaleFactor = 1 - Math.sin(raw * Math.PI) * zoomDepth;
            const pt = interp(t);
            rotation = [-pt[0], -pt[1], 0];
            render();
            if (raw < 1) {
              animId = requestAnimationFrame(step);
            } else {
              rotation = [-toStop[0], -toStop[1], 0];
              scaleFactor = 1;
              render();
              animId = null;
              startIdleLoop();
            }
          }
          animId = requestAnimationFrame(step);
        }

        fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
          .then((r) => r.json())
          .then((data) => {
            world = data;
            landFeature      = topojson.feature(data, data.objects.land);
            graticuleFeature = d3.geoGraticule()();
            resize();
            startIdleLoop();
          });

        new ResizeObserver(resize).observe(canvas);
        return { rotateTo };
      }

      const globeCanvas = document.getElementById("globe-canvas");
      let globe = null;
      if (globeCanvas && typeof d3 !== "undefined" && typeof topojson !== "undefined") {
        globe = initGlobe(globeCanvas);
      }

      let activeIndex = 0;
      let ticking = false;
      stops[0].classList.add("is-active");

      function setActive(newIndex) {
        if (newIndex === activeIndex) return;
        activeIndex = newIndex;
        stops.forEach((s, i) => {
          s.classList.remove("is-active", "is-past");
          if (i === activeIndex)    s.classList.add("is-active");
          else if (i < activeIndex) s.classList.add("is-past");
        });
        const label = String(activeIndex + 1).padStart(2, "0");
        if (numEl)    numEl.textContent = label;
        if (ghostNum) ghostNum.textContent = label;
        if (globe) globe.rotateTo(newIndex);
      }

      function update() {
        ticking = false;
        const rect     = journey.getBoundingClientRect();
        const total    = journey.offsetHeight - window.innerHeight;
        const scrolled = Math.max(0, -rect.top);
        const progress = total > 0 ? Math.min(1, scrolled / total) : 0;
        const rawFloat = progress * NUM_STOPS;
        const newIndex = Math.min(Math.floor(rawFloat + 0.22), NUM_STOPS - 1);
        setActive(newIndex);
        if (scrubFill) scrubFill.style.width = `${progress * 100}%`;
      }

      window.addEventListener("scroll", () => {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
      }, { passive: true });
      window.addEventListener("resize", update);
      update();
    }
  }

  /* ─── Projects: full-screen scroll + desk layout + view toggle ─── */
  const projectsScroll = document.querySelector(".projects-scroll");
  if (projectsScroll) {
    const infoPanels        = projectsScroll.querySelectorAll(".project-info");
    const imagePanels       = projectsScroll.querySelectorAll(".project-images");
    const projectsNum       = projectsScroll.querySelector(".projects-num");
    const projectsGhost     = projectsScroll.querySelector(".projects-ghost-num");
    const projectsScrubFill = projectsScroll.querySelector(".projects-scrubber-fill");
    const NUM_PROJECTS      = infoPanels.length;
    let activeProject       = 0;
    let projTicking         = false;

    /* ── Lightbox ── */
    const lightbox    = document.createElement("div");
    lightbox.className = "desk-lightbox";
    const lbImg       = document.createElement("img");
    lbImg.className   = "desk-lightbox__img";
    lbImg.alt         = "";
    lightbox.appendChild(lbImg);
    document.body.appendChild(lightbox);

    const closeLightbox = () => lightbox.classList.remove("is-open");
    lightbox.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

    document.querySelectorAll(".desk-card").forEach((card) => {
      card.addEventListener("click", () => {
        lbImg.src = card.querySelector("img").src;
        lbImg.alt = card.querySelector("img").alt;
        lightbox.classList.add("is-open");
      });
    });

    /* ── Desk entrance animation ── */
    function animateDeskIn(panel) {
      if (!panel || reduceMotion) return;
      panel.querySelectorAll(".desk-card").forEach((card, i) => {
        const rot = card.style.getPropertyValue("--rot").trim() || "0deg";
        card.style.setProperty("transition", "none");
        card.style.setProperty("opacity", "0");
        card.style.setProperty("transform", `translate(-50%, -64%) rotate(${rot}) scale(0.84)`);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.style.removeProperty("transition");
            card.style.setProperty("transition-delay", `${i * 90}ms`);
            card.style.removeProperty("opacity");
            card.style.setProperty("transform", `translate(-50%, -50%) rotate(${rot})`);
            const cleanup = () => {
              card.style.removeProperty("transition-delay");
              card.style.removeProperty("transform");
            };
            card.addEventListener("transitionend", cleanup, { once: true });
          });
        });
      });
    }

    /* ── View toggle ── */
    const viewBtns     = document.querySelectorAll(".view-btn");
    const projectsList = document.querySelector(".projects-list");

    viewBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.view;
        viewBtns.forEach((b) => { b.classList.remove("is-active"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        if (view === "list") {
          projectsScroll.classList.add("is-hidden");
          if (projectsList) projectsList.classList.add("is-active");
        } else {
          projectsScroll.classList.remove("is-hidden");
          if (projectsList) projectsList.classList.remove("is-active");
          updateProjects();
        }
      });
    });

    if (reduceMotion) {
      infoPanels.forEach((p) => { p.classList.add("is-active"); p.style.position = "relative"; });
      imagePanels.forEach((p) => p.classList.add("is-active"));
    } else {
      function setActiveProject(idx) {
        if (idx === activeProject) return;
        activeProject = idx;
        infoPanels.forEach((info, i) => {
          info.classList.remove("is-active", "is-past");
          if (i === activeProject)    info.classList.add("is-active");
          else if (i < activeProject) info.classList.add("is-past");
        });
        imagePanels.forEach((panel, i) => {
          panel.classList.toggle("is-active", i === activeProject);
        });
        const label = String(activeProject + 1).padStart(2, "0");
        if (projectsNum)   projectsNum.textContent   = label;
        if (projectsGhost) projectsGhost.textContent = label;
        animateDeskIn(imagePanels[activeProject]);
      }

      function updateProjects() {
        projTicking = false;
        const rect     = projectsScroll.getBoundingClientRect();
        const total    = projectsScroll.offsetHeight - window.innerHeight;
        const scrolled = Math.max(0, -rect.top);
        const progress = total > 0 ? Math.min(1, scrolled / total) : 0;
        const rawFloat = progress * NUM_PROJECTS;
        const newIdx   = Math.min(Math.floor(rawFloat + 0.18), NUM_PROJECTS - 1);
        setActiveProject(newIdx);
        if (projectsScrubFill) projectsScrubFill.style.width = `${progress * 100}%`;
      }

      window.addEventListener("scroll", () => {
        if (!projTicking) { requestAnimationFrame(updateProjects); projTicking = true; }
      }, { passive: true });
      window.addEventListener("resize", updateProjects);
      updateProjects();

      // Animate first panel on load
      setTimeout(() => animateDeskIn(imagePanels[0]), 350);
    }
  }
});

(function () {
  "use strict";

  const PORTFOLIO = {
    name: "Torstein Hauge Fossnes",
    contact: {
      email: "torsteinhf@gmail.com",
      linkedin: "https://www.linkedin.com/in/torstein-hauge-fossnes",
      github: "https://github.com/torsteinhf",
    },
    availability: "Available from 2027",
    education: [
      {
        school: "ETH Zürich",
        location: "Zürich, Switzerland",
        period: "Expected Sep 2026 – Feb 2027",
        detail: "Exchange program at D-MTEC.",
      },
      {
        school: "UC Berkeley",
        location: "Berkeley, California",
        period: "Aug 2025 – Jan 2026",
        detail: "International Student Program, coursework mapped to NTNU's Master's programme. GPA 4.0/4.0.",
      },
      {
        school: "NTNU",
        location: "Trondheim, Norway",
        period: "Aug 2023 – Expected Jun 2028",
        detail: "MSc (Siv.ing) Industrial Economics / Computer Science, specialization in AI. GPA 4.7/5.",
      },
      {
        school: "BI Norwegian Business School",
        location: "Oslo, Norway",
        period: "Aug 2023 – Jun 2024",
        detail: "Bachelor's unit equivalent to first year of Business Administration. GPA 4.9/5.",
      },
      {
        school: "Ås Upper Secondary School",
        location: "Ås, Norway",
        period: "Aug 2018 – Jun 2021",
        detail: "General studies, focus in STEM. GPA 6.2/6.",
      },
    ],
    experience: [
      {
        role: "Summer Intern",
        org: "KLP Asset Management",
        location: "Oslo",
        period: "Jun 2026 – Aug 2026",
        detail: "Active Management — analyzed Norwegian equity liquidity and developed recommendations to improve trade execution.",
      },
      {
        role: "Student Assistant",
        org: "NTNU Dept. of Computer Science (IDI)",
        location: "Trondheim",
        period: "Jan 2026 – Jun 2026",
        detail: "TDT4145 — Data Modelling, Databases and Database Management Systems.",
      },
      {
        role: "Online Tutor",
        org: "EnkelEksamen",
        location: "Oslo",
        period: "Jun 2025 – Aug 2025",
        detail: "Created an online course in Object-Oriented Programming with Java.",
      },
      {
        role: "Research Assistant",
        org: "NorwAI",
        location: "Trondheim",
        period: "Apr 2024 – May 2024",
        detail: "Annotated instructions and text passages to assist and train generative language models.",
      },
      {
        role: "Private 1st Class",
        org: "Forsvaret, Combat Service Support Battalion",
        location: "Bardufoss",
        period: "Aug 2021 – Jul 2022",
        detail: "Military service. Promoted to Private 1st Class based on initiative and leadership.",
      },
    ],
    extracurricular: [
      {
        role: "Head of External Communications",
        org: "XCOM / Abakus (Computer Science student org at NTNU)",
        period: "Mar 2025 – Mar 2026",
        detail: "Liaised with companies and international universities to plan visits and partnerships.",
      },
      {
        role: "Student Assistant",
        org: "NTNU Science Museum",
        period: "Sep 2024",
        detail: "Helped organize Researchers' Night, an EU initiative engaging youth in research.",
      },
    ],
    projects: [
      {
        name: "MuZero",
        detail: "Reimplemented DeepMind's MuZero algorithm in Python/PyTorch. Trained on classic control and board games.",
      },
      {
        name: "Medical Image Segmentation",
        detail: "Deep learning pipeline for MRI segmentation using MONAI and DenseNet. Includes augmentation strategies for sparse medical data.",
      },
      {
        name: "This website",
        detail: "Personal portfolio built with vanilla HTML, CSS, and JavaScript. Features a sticky-scroll journey section, globe visualization, scattered desk-card image layout, and this chatbot.",
      },
      {
        name: "F1 Data Analysis",
        detail: "Exploratory analysis of Formula 1 race data using Python and pandas.",
      },
      {
        name: "Airport Database",
        detail: "Relational database project modeling an airport system. SQL schema design, normalization, and query optimization.",
      },
      {
        name: "PID Controller",
        detail: "Implementation and tuning of a PID controller for a physical system, done as part of coursework.",
      },
    ],
    skills: {
      programming: ["Python", "R", "Java", "JavaScript / TypeScript", "HTML / CSS", "C", "C++", "Assembly", "SQL"],
      tools: ["Snowflake", "Bloomberg Terminal", "Excel", "Git / GitHub", "PyTorch", "MONAI"],
      languages: ["Norwegian (native)", "English (fluent)"],
    },
  };

  const SUGGESTIONS = [
    "Where has Torstein studied?",
    "What projects has he built?",
    "What are his technical skills?",
    "How can I get in touch?",
  ];

  
  async function generateResponse(message) {    
    // WIP: Response generation
    await sleep(700 + Math.random() * 500);
    return fallbackResponse(message);
  }

  function fallbackResponse(raw) {
    const q = raw.toLowerCase();

    if (/contact|email|mail|reach|get.in.touch|message|linkedin/i.test(q)) {
      return `You can reach Torstein at <a href="mailto:${PORTFOLIO.contact.email}">${PORTFOLIO.contact.email}</a>, or connect on <a href="${PORTFOLIO.contact.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>.`;
    }

    if (/github|code|repo/i.test(q)) {
      return `Torstein's code lives on <a href="${PORTFOLIO.contact.github}" target="_blank" rel="noopener">GitHub ↗</a>.`;
    }

    if (/avail|hire|job|open.to|when/i.test(q)) {
      return `Torstein is ${PORTFOLIO.availability}. Feel free to <a href="mailto:${PORTFOLIO.contact.email}">get in touch</a> now to plan ahead.`;
    }

    if (/skill|language|tool|program|know|tech|stack/i.test(q)) {
      const p = PORTFOLIO.skills.programming.join(", ");
      const t = PORTFOLIO.skills.tools.join(", ");
      return `Programming: ${p}.\n\nTools & platforms: ${t}.\n\nSpeaks Norwegian and English.`;
    }

    if (/project|build|made|work.on|portfolio/i.test(q)) {
      const list = PORTFOLIO.projects
        .map((p) => `<strong>${p.name}</strong> — ${p.detail}`)
        .join("<br><br>");
      return list;
    }

    if (/muzero|deepmind|reinforcement|rl/i.test(q)) {
      const p = PORTFOLIO.projects.find((x) => x.name === "MuZero");
      return p.detail;
    }

    if (/medical|mri|segment|monai|densenet/i.test(q)) {
      const p = PORTFOLIO.projects.find((x) => x.name === "Medical Image Segmentation");
      return p.detail;
    }

    if (/website|portfolio site|this site/i.test(q)) {
      const p = PORTFOLIO.projects.find((x) => x.name === "This website");
      return p.detail;
    }

    if (/f1|formula/i.test(q)) {
      const p = PORTFOLIO.projects.find((x) => x.name === "F1 Data Analysis");
      return p.detail;
    }

    if (/airport|database|sql|db/i.test(q)) {
      const p = PORTFOLIO.projects.find((x) => x.name === "Airport Database");
      return p.detail;
    }

    if (/pid|controller/i.test(q)) {
      const p = PORTFOLIO.projects.find((x) => x.name === "PID Controller");
      return p.detail;
    }

    if (/edu|stud|school|university|degree|ntnu|berkeley|eth|bi|zürich|zurich/i.test(q)) {
      const lines = PORTFOLIO.education
        .map((e) => `<strong>${e.school}</strong> (${e.period}) — ${e.detail}`)
        .join("<br><br>");
      return lines;
    }

    if (/ntnu/i.test(q)) {
      const e = PORTFOLIO.education.find((x) => x.school === "NTNU");
      return `${e.detail} (${e.period})`;
    }

    if (/berkeley|uc /i.test(q)) {
      const e = PORTFOLIO.education.find((x) => x.school === "UC Berkeley");
      return `${e.detail} (${e.period})`;
    }

    if (/eth|zürich|zurich/i.test(q)) {
      const e = PORTFOLIO.education.find((x) => x.school === "ETH Zürich");
      return `${e.detail} (${e.period})`;
    }

    if (/experience|work|job|intern|employ|career/i.test(q)) {
      const lines = PORTFOLIO.experience
        .map((x) => `<strong>${x.role}</strong> at ${x.org} (${x.period}) — ${x.detail}`)
        .join("<br><br>");
      return lines;
    }

    if (/klp|asset management|finance|equity/i.test(q)) {
      const x = PORTFOLIO.experience.find((e) => e.org === "KLP Asset Management");
      return `${x.role} at ${x.org}, ${x.period}. ${x.detail}`;
    }

    if (/military|forsvaret|army|service/i.test(q)) {
      const x = PORTFOLIO.experience.find((e) => e.org.includes("Forsvaret"));
      return x.detail;
    }

    if (/abakus|xcom|extracurricular|club|org/i.test(q)) {
      const x = PORTFOLIO.extracurricular[0];
      return `${x.role} at ${x.org} (${x.period}). ${x.detail}`;
    }

    if (/who|about|torstein|yourself/i.test(q)) {
      return `Torstein Hauge Fossnes is an MSc student in Industrial Economics & Computer Science at NTNU, specializing in AI/ML and Finance. He's studied at UC Berkeley and is heading to ETH Zürich on exchange. ${PORTFOLIO.availability}.`;
    }

    if (/hello|hi |hey|hei|hola/i.test(q)) {
      return "Hey! What would you like to know about Torstein?";
    }

    if (/thank/i.test(q)) {
      return "You're welcome! Let me know if there's anything else.";
    }

    return "I'm not sure about that — try asking about Torstein's education, projects, skills, or how to get in touch.";
  }

  // -- DOM helpers --

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function animateMessageIn(node) {
    node.style.opacity = "0";
    node.style.transform = "translateY(10px)";
    node.style.transition = "none";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        node.style.transition = "opacity 0.28s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1)";
        node.style.opacity = "1";
        node.style.transform = "translateY(0)";
        node.addEventListener("transitionend", () => {
          node.style.removeProperty("transition");
          node.style.removeProperty("opacity");
          node.style.removeProperty("transform");
        }, { once: true });
      });
    });
  }

  // -- Widget -- 

  let chatBody, chatInput, isOpen = false, isTyping = false;

  function buildWidget() {
    const trigger = el("button", "chat-trigger", `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    `);
    trigger.setAttribute("aria-label", "Open chat");

    const win = el("div", "chat-window");
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", "Chat with Torstein's portfolio assistant");

    const header = el("div", "chat-header");
    const headerLeft = el("div", "chat-header__left");
    const dot = el("span", "chat-header__dot");
    const title = el("span", "chat-header__title", "Ask me anything");
    headerLeft.appendChild(dot);
    headerLeft.appendChild(title);
    const closeBtn = el("button", "chat-close", `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `);
    closeBtn.setAttribute("aria-label", "Close chat");
    header.appendChild(headerLeft);
    header.appendChild(closeBtn);

    chatBody = el("div", "chat-body");
    chatBody.setAttribute("aria-live", "polite");

    const welcomeMsg = el("div", "chat-msg chat-msg--bot");
    welcomeMsg.innerHTML = "This is a WIP chatbot, with only dictionary capabilities. Try asking a question!";
    chatBody.appendChild(welcomeMsg);

    const suggestionsWrap = el("div", "chat-suggestions");
    SUGGESTIONS.forEach((s) => {
      const chip = el("button", "chat-suggestion", s);
      chip.addEventListener("click", () => {
        suggestionsWrap.remove();
        sendMessage(s);
      });
      suggestionsWrap.appendChild(chip);
    });
    chatBody.appendChild(suggestionsWrap);

    const footer = el("div", "chat-footer");
    chatInput = el("input", "chat-input");
    chatInput.type = "text";
    chatInput.placeholder = "Ask a question…";
    chatInput.setAttribute("aria-label", "Type your message");
    chatInput.setAttribute("autocomplete", "off");

    const sendBtn = el("button", "chat-send", `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    `);
    sendBtn.setAttribute("aria-label", "Send message");
    footer.appendChild(chatInput);
    footer.appendChild(sendBtn);

    win.appendChild(header);
    win.appendChild(chatBody);
    win.appendChild(footer);

    document.body.appendChild(trigger);
    document.body.appendChild(win);

    trigger.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", closeChat);
    sendBtn.addEventListener("click", handleSend);
    chatInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) closeChat();
    });
  }

  function toggleChat() {
    if (isOpen) closeChat(); else openChat();
  }

  function openChat() {
    isOpen = true;
    document.querySelector(".chat-window").classList.add("is-open");
    document.querySelector(".chat-trigger").setAttribute("aria-expanded", "true");
    setTimeout(() => chatInput.focus(), 120);
  }

  function closeChat() {
    isOpen = false;
    document.querySelector(".chat-window").classList.remove("is-open");
    document.querySelector(".chat-trigger").setAttribute("aria-expanded", "false");
    document.querySelector(".chat-trigger").focus();
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text || isTyping) return;
    chatInput.value = "";
    document.querySelector(".chat-suggestions")?.remove();
    sendMessage(text);
  }

  async function sendMessage(text) {
    isTyping = true;

    const userMsg = el("div", "chat-msg chat-msg--user", text);
    chatBody.appendChild(userMsg);
    animateMessageIn(userMsg);
    scrollBottom();

    const typingEl = el("div", "chat-msg chat-msg--bot chat-msg--typing");
    typingEl.innerHTML = "<span></span><span></span><span></span>";
    chatBody.appendChild(typingEl);
    animateMessageIn(typingEl);
    scrollBottom();

    try {
      const reply = await generateResponse(text);
      typingEl.remove();

      const botMsg = el("div", "chat-msg chat-msg--bot");
      botMsg.innerHTML = reply.replace(/\n/g, "<br>");
      chatBody.appendChild(botMsg);
      animateMessageIn(botMsg);
    } catch {
      typingEl.remove();
      const errMsg = el("div", "chat-msg chat-msg--bot", "Something went wrong. Please try again.");
      chatBody.appendChild(errMsg);
      animateMessageIn(errMsg);
    }

    scrollBottom();
    isTyping = false;
    chatInput.focus();
  }

  function scrollBottom() {
    requestAnimationFrame(() => {
      chatBody.scrollTop = chatBody.scrollHeight;
    });
  }

  // ─── Init ─────────────────────────────────────────────────────────────────

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();

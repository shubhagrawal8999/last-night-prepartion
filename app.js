const app = document.querySelector("#app");
const themeToggle = document.querySelector("#theme-toggle");
const subjectDefaults = {
  maths: { name: "Maths", emoji: "📐", color: "mint", blurb: "Numbers, but make them less scary." },
  physics: { name: "Physics", emoji: "🪐", color: "blue", blurb: "The universe has rules. Rude, but useful." },
  electrical: { name: "Electrical", emoji: "⚡", color: "pink", blurb: "Current mood: understand the circuit." }
};
const sections = [
  { id: "pass-fast", label: "Pass-Fast", file: "notes.md" },
  { id: "revision", label: "Revision Notes", file: "notes.md" },
  { id: "formulas", label: "Formula Sheet", file: "formulas.md" },
  { id: "examples", label: "Solved Examples", file: "examples.md" },
  { id: "exam-tips", label: "Exam Tips", file: "exam-tips.md" },
  { id: "flashcards", label: "Flashcards", file: "flashcards.json" },
  { id: "questions", label: "Likely Questions", file: "questions.md" }
];
let contentIndex;
let memes = [];
let currentRoute = { page: "home" };
let activeSection = "pass-fast";
let flashcards = [];
let flashIndex = 0;
let flashFlipped = false;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function inlineMarkdown(text) {
  let html = escapeHTML(text);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/\$([^$\n]+)\$/g, '<span class="math-inline">$1</span>');
  return html;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const output = [];
  let paragraph = [];
  let listType = "";
  let listItems = [];
  const flushParagraph = () => {
    if (paragraph.length) output.push(`<p>${paragraph.map(inlineMarkdown).join(" ")}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (listItems.length) output.push(`<${listType}>${listItems.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</${listType}>`);
    listItems = [];
    listType = "";
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (!trimmed) { flushParagraph(); flushList(); continue; }
    if (trimmed.startsWith("$$")) {
      flushParagraph(); flushList();
      let expression = trimmed.slice(2).replace(/\$\$$/, "").trim();
      if (!trimmed.endsWith("$$") || trimmed.length === 2) {
        while (++index < lines.length && !lines[index].includes("$$")) expression += `\n${lines[index]}`;
        if (index < lines.length) expression += `\n${lines[index].split("$$")[0]}`;
      }
      output.push(`<div class="math-block">${escapeHTML(expression.trim())}</div>`);
      continue;
    }
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) { flushParagraph(); flushList(); const level = heading[1].length; output.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`); continue; }
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) { flushParagraph(); flushList(); output.push("<hr>"); continue; }
    const listMatch = trimmed.match(/^([-*]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      const nextType = /^\d/.test(listMatch[1]) ? "ol" : "ul";
      if (listType && listType !== nextType) flushList();
      listType = nextType;
      listItems.push(listMatch[2]);
      continue;
    }
    const quote = trimmed.match(/^>\s?(.*)$/);
    if (quote) { flushParagraph(); flushList(); output.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`); continue; }
    flushList();
    paragraph.push(trimmed);
  }
  flushParagraph();
  flushList();
  return output.join("\n");
}

function typesetMath(container = app) {
  if (!window.katex) return;
  container.querySelectorAll(".math-inline, .math-block").forEach((element) => {
    try {
      window.katex.render(element.textContent, element, { displayMode: element.classList.contains("math-block"), throwOnError: false });
    } catch { /* Leave readable source text if a formula is malformed. */ }
  });
}

function getUnits() {
  return contentIndex.subjects.flatMap((subject) => (subject.units || []).map((unit) => ({ subject, unit })));
}

function getSubject(subjectId) {
  return contentIndex.subjects.find((subject) => subject.id === subjectId);
}

function getUnit(subjectId, unitId) {
  const subject = getSubject(subjectId);
  const unit = subject?.units?.find((item) => item.id === unitId);
  return subject && unit ? { subject, unit } : null;
}

function isDone(subjectId, unitId) {
  return localStorage.getItem(`onp-done:${subjectId}:${unitId}`) === "true";
}

function toggleDone(subjectId, unitId) {
  const next = !isDone(subjectId, unitId);
  localStorage.setItem(`onp-done:${subjectId}:${unitId}`, String(next));
  return next;
}

function randomMeme() {
  return memes[Math.floor(Math.random() * memes.length)] || { file: "", caption: "Me opening the notes at 11:58 pm: character development starts now." };
}

function memeMarkup(meme, compact = false) {
  const imagePath = meme.file ? `memes/${escapeHTML(meme.file)}` : "";
  const art = imagePath
    ? `<img src="${imagePath}" alt="Study meme">`
    : `<span aria-hidden="true">${compact ? "🤯" : "🫠"}</span>`;
  return `<div class="${compact ? "meme-emoji" : "meme-emoji"}">${art}</div><div class="meme-copy"><strong>${compact ? "Today's study mood" : "Us, one night before the exam"}</strong>${escapeHTML(meme.caption)}</div>`;
}

function renderHome() {
  const meme = randomMeme();
  const subjectCards = contentIndex.subjects.map((subject) => {
    const defaults = subjectDefaults[subject.id] || { name: subject.name, emoji: "📚", blurb: "One unit at a time." };
    const unitCount = subject.units?.length || 0;
    return `<a class="subject-card" href="#/subject/${encodeURIComponent(subject.id)}" style="background:var(--${defaults.color || "mint"})">
      <span class="subject-icon" aria-hidden="true">${escapeHTML(subject.emoji || defaults.emoji)}</span>
      <span><strong>${escapeHTML(subject.name || defaults.name)}</strong><small>${unitCount ? `${unitCount} unit${unitCount === 1 ? "" : "s"} ready` : "Units coming soon"}</small></span>
    </a>`;
  }).join("");
  const panicTarget = getUnits().find(({ unit }) => unit.panic) || getUnits()[0];
  const panic = panicTarget
    ? `<a class="primary-button" href="#/unit/${encodeURIComponent(panicTarget.subject.id)}/${encodeURIComponent(panicTarget.unit.id)}">🚨 Panic Mode: get me passing</a>`
    : `<span class="empty-note">Panic Mode unlocks when a unit is added. 😅</span>`;

  app.innerHTML = `<section class="home-hero">
      <p class="eyebrow">A tiny study survival kit</p>
      <div class="hero-row"><div><h1>One night.<br>One pass. 🤞</h1><p class="intro">Okay, breathe. Pick a subject and we'll focus on the stuff that can actually help tomorrow.</p>${panic}</div><div class="hero-doodle" aria-hidden="true">📚</div></div>
    </section>
    <div class="section-heading"><h2>What are we cramming?</h2><span class="section-note">No judgment. Only highlighters.</span></div>
    <section class="subject-grid" aria-label="Choose a subject">${subjectCards}</section>
    <div class="section-heading"><h2>Today's mood</h2><span class="section-note">Refresh for a new one ↻</span></div>
    <section class="meme-strip">${memeMarkup(meme, true)}</section>`;
}

function renderSubject(subjectId) {
  const subject = getSubject(subjectId);
  if (!subject) { app.innerHTML = `<div class="empty-state">Hmm, that subject isn't on the list yet. <a href="#">Back home</a></div>`; return; }
  const defaults = subjectDefaults[subject.id] || { emoji: subject.emoji || "📚", blurb: "One unit at a time." };
  const units = subject.units || [];
  const cards = units.map((unit, index) => {
    const done = isDone(subject.id, unit.id);
    const badges = (unit.badges || []).map((badge) => `<span class="badge">${escapeHTML(badge)}</span>`).join("");
    return `<a class="unit-card" href="#/unit/${encodeURIComponent(subject.id)}/${encodeURIComponent(unit.id)}">
      <span class="unit-number">${String(index + 1).padStart(2, "0")}</span>
      <span class="unit-info"><strong>${escapeHTML(unit.title)}</strong><small>${escapeHTML(unit.description || "Your next tiny win.")}</small>${badges ? `<span class="badge-row">${badges}</span>` : ""}</span>
      ${done ? `<span class="done-tick" aria-label="Completed">✓</span>` : `<span class="unit-arrow" aria-hidden="true">→</span>`}
    </a>`;
  }).join("");
  app.innerHTML = `<div class="page-top"><a class="back-button" href="#" aria-label="Back home">←</a><div><p class="eyebrow">Pick your next win</p><h1>${escapeHTML(subject.name || defaults.name || subject.id)} ${escapeHTML(defaults.emoji)}</h1></div></div>
    <section class="subject-banner"><p class="intro">${escapeHTML(subject.description || defaults.blurb)}</p><p><strong>${units.length ? `${units.length} unit${units.length === 1 ? "" : "s"} ready to go.` : "No units here yet."}</strong> Small bites. Big pass energy.</p></section>
    <section class="unit-list" aria-label="Units">${cards || `<div class="empty-state">This subject is getting its notes together. Check back after adding a unit. 📝</div>`}</section>`;
}

function splitNotes(markdown) {
  const match = markdown.match(/^##\s+Revision Notes\s*$/im);
  if (!match) return { passFast: markdown, revision: markdown };
  return { passFast: markdown.slice(0, match.index).trim(), revision: markdown.slice(match.index).trim() };
}

async function loadSection(subjectId, unitId, sectionId) {
  const location = getUnit(subjectId, unitId);
  if (!location) return;
  const section = sections.find((item) => item.id === sectionId) || sections[0];
  const panel = document.querySelector("#unit-content");
  if (!panel) return;
  panel.innerHTML = `<p class="empty-note">Loading the good bits... ✍️</p>`;
  if (section.id === "flashcards") {
    const path = `content/${encodeURIComponent(subjectId)}/${encodeURIComponent(unitId)}/${section.file}`;
    try {
      flashcards = await (await fetch(path)).json();
      flashIndex = 0;
      flashFlipped = false;
      renderFlashcards(panel);
    } catch { panel.innerHTML = `<p class="empty-note">No flashcards yet. Add a flashcards.json file to this unit.</p>`; }
    return;
  }
  const path = `content/${encodeURIComponent(subjectId)}/${encodeURIComponent(unitId)}/${section.file}`;
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error("Missing content");
    const text = await response.text();
    let markdown = text;
    if (section.id === "pass-fast" || section.id === "revision") {
      const split = splitNotes(text);
      markdown = section.id === "pass-fast" ? split.passFast : split.revision;
    }
    panel.innerHTML = markdown.trim() ? `<article class="markdown">${renderMarkdown(markdown)}</article>` : `<p class="empty-note">No notes here yet. Your future self says thanks for adding them. 🙏</p>`;
    typesetMath(panel);
  } catch {
    panel.innerHTML = `<p class="empty-note">Nothing in this section yet. Add <code>${escapeHTML(section.file)}</code> to the unit folder when you're ready.</p>`;
  }
}

function renderFlashcards(panel) {
  if (!Array.isArray(flashcards) || flashcards.length === 0) {
    panel.innerHTML = `<p class="empty-note">No flashcards yet. Add a flashcards.json file to this unit.</p>`;
    return;
  }
  const card = flashcards[flashIndex];
  const text = flashFlipped ? card.a : card.q;
  panel.innerHTML = `<div class="flashcard ${flashFlipped ? "flipped" : ""}" role="button" tabindex="0" aria-label="Flashcard. Tap to ${flashFlipped ? "show question" : "show answer"}">
      <div class="flash-label">${flashFlipped ? "Answer" : "Question"} · tap to flip</div><div class="flash-text">${inlineMarkdown(text)}</div>
    </div><div class="flash-controls"><button class="flash-control" data-action="previous" type="button" aria-label="Previous flashcard">← Prev</button><span class="flash-count">${flashIndex + 1} / ${flashcards.length}</span><button class="flash-control" data-action="shuffle" type="button">🔀 Shuffle</button><button class="flash-control" data-action="next" type="button" aria-label="Next flashcard">Next →</button></div>
    ${flashFlipped && flashIndex === flashcards.length - 1 ? `<p class="completion-note">Flashcards done. Your brain has entered the chat. 🧠</p>` : ""}`;
  typesetMath(panel);
  const cardElement = panel.querySelector(".flashcard");
  cardElement.addEventListener("click", () => { flashFlipped = !flashFlipped; renderFlashcards(panel); });
  cardElement.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); flashFlipped = !flashFlipped; renderFlashcards(panel); } });
  panel.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.action === "shuffle") {
      for (let index = flashcards.length - 1; index > 0; index -= 1) {
        const other = Math.floor(Math.random() * (index + 1));
        [flashcards[index], flashcards[other]] = [flashcards[other], flashcards[index]];
      }
      flashIndex = 0;
    } else if (button.dataset.action === "next") flashIndex = (flashIndex + 1) % flashcards.length;
    else flashIndex = (flashIndex - 1 + flashcards.length) % flashcards.length;
    flashFlipped = false;
    renderFlashcards(panel);
  }));
}

function renderUnit(subjectId, unitId) {
  const location = getUnit(subjectId, unitId);
  if (!location) { app.innerHTML = `<div class="empty-state">Couldn't find that unit. <a href="#">Back home</a></div>`; return; }
  const { subject, unit } = location;
  activeSection = sections.some((section) => section.id === activeSection) ? activeSection : "pass-fast";
  const meme = unit.meme || randomMeme();
  const tabs = sections.map((section) => `<button class="tab-button" type="button" role="tab" id="tab-${section.id}" aria-controls="unit-content" aria-selected="${section.id === activeSection}" data-section="${section.id}">${section.label}</button>`).join("");
  const done = isDone(subjectId, unitId);
  app.innerHTML = `<div class="page-top"><a class="back-button" href="#/subject/${encodeURIComponent(subjectId)}" aria-label="Back to subject">←</a><div><p class="eyebrow">${escapeHTML(subject.name)} · ${escapeHTML(unit.title)}</p><h1>Let's get this unit. ✍️</h1></div></div>
    <div class="unit-heading"><div><h2>${escapeHTML(unit.title)}</h2><p class="intro">${escapeHTML(unit.description || "One idea at a time. You've got this.")}</p></div><button class="mark-done" id="mark-done" type="button">${done ? "✓ Done!" : "☐ Mark done"}</button></div>
    <section class="unit-meme">${memeMarkup(meme)}</section>
    <div class="tabs" role="tablist" aria-label="Unit study sections">${tabs}</div>
    <section class="content-panel" id="unit-content" role="tabpanel" aria-labelledby="tab-${activeSection}"></section>`;
  document.querySelectorAll(".tab-button").forEach((button) => button.addEventListener("click", () => {
    activeSection = button.dataset.section;
    document.querySelectorAll(".tab-button").forEach((tab) => tab.setAttribute("aria-selected", String(tab === button)));
    document.querySelector("#unit-content").setAttribute("aria-labelledby", `tab-${activeSection}`);
    loadSection(subjectId, unitId, activeSection);
  }));
  document.querySelector("#mark-done").addEventListener("click", () => {
    const isComplete = toggleDone(subjectId, unitId);
    const button = document.querySelector("#mark-done");
    button.textContent = isComplete ? "✓ Done!" : "☐ Mark done";
    if (isComplete) button.insertAdjacentHTML("afterend", `<p class="completion-note">Unit done. You're basically an engineer now. 🧑‍🔧</p>`);
    else document.querySelector(".completion-note")?.remove();
  });
  loadSection(subjectId, unitId, activeSection);
}

function readRoute() {
  const parts = decodeURI(location.hash.replace(/^#\/?/, "")).split("/").filter(Boolean);
  if (parts[0] === "subject" && parts[1]) return { page: "subject", subjectId: parts[1] };
  if (parts[0] === "unit" && parts[1] && parts[2]) return { page: "unit", subjectId: parts[1], unitId: parts[2] };
  return { page: "home" };
}

function renderRoute() {
  currentRoute = readRoute();
  if (currentRoute.page === "subject") renderSubject(currentRoute.subjectId);
  else if (currentRoute.page === "unit") renderUnit(currentRoute.subjectId, currentRoute.unitId);
  else renderHome();
  window.scrollTo(0, 0);
}

function setTheme(dark) {
  document.body.classList.toggle("dark", dark);
  localStorage.setItem("onp-theme", dark ? "dark" : "light");
  themeToggle.innerHTML = dark ? '<span aria-hidden="true">☀️</span><span class="theme-label">Day mode</span>' : '<span aria-hidden="true">🌙</span><span class="theme-label">Night mode</span>';
  themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}

async function start() {
  try {
    const [indexResponse, memeResponse] = await Promise.all([fetch("content/index.json"), fetch("memes/index.json")]);
    if (!indexResponse.ok) throw new Error("Couldn't load content/index.json");
    contentIndex = await indexResponse.json();
    memes = memeResponse.ok ? await memeResponse.json() : [];
    setTheme(localStorage.getItem("onp-theme") === "dark");
    renderRoute();
  } catch (error) {
    app.innerHTML = `<div class="error-box">Couldn't load the study files. Start this folder with a local web server (see README), then refresh.<br><small>${escapeHTML(error.message)}</small></div>`;
  }
}

themeToggle.addEventListener("click", () => setTheme(!document.body.classList.contains("dark")));
window.addEventListener("hashchange", renderRoute);
start();

window.addEventListener("load", () => typesetMath());
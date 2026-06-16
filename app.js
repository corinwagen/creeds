const { westminster: westminsterNotes, supplemental: supplementalNotes } = window.CREEDS_NOTES;

const dailyWcfDocument = buildDailyWcfDocument(new Date());

const documents = [
  {
    ...window.WCF_DATA,
    slug: "westminster-confession",
    shortTitle: "Westminster",
    mark: "W",
    unitLabel: "Chapter",
    notes: westminsterNotes
  },
  dailyWcfDocument,
  window.ECUMENICAL_CREEDS_DATA,
  ...window.WESTMINSTER_CATECHISMS_DATA,
  ...window.THREE_FORMS_DATA,
  window.ANGLICAN_ARTICLES_DATA
];

for (const document of documents) {
  if (!document.notes && supplementalNotes[document.slug]) {
    document.notes = supplementalNotes[document.slug];
  }
}

function getInitialDocument() {
  const slug = new URLSearchParams(window.location.search).get("doc");
  return documents.find((document) => document.slug === slug) || documents[0];
}

let currentDocument = getInitialDocument();

const content = document.querySelector("#content");
const documentNav = document.querySelector("#document-nav");
const nav = document.querySelector("#chapter-nav");
const search = document.querySelector("#search");
const proofToggle = document.querySelector("#proof-toggle");
const noteToggle = document.querySelector("#note-toggle");
const progressPercent = document.querySelector("#progress-percent");
const progressWords = document.querySelector("#progress-words");
const mobileMenuToggle = document.querySelector("#mobile-menu-toggle");
const calendarJump = document.querySelector("#calendar-jump");
const sidebar = document.querySelector(".sidebar");
const printerMark = document.querySelector(".printer-mark");
const brandTitle = document.querySelector("#brand-title");
const readerTitle = document.querySelector("#reader-title");
const readerSubtitle = document.querySelector("#reader-subtitle");
const readerDescription = document.querySelector("#reader-description");

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

const calendarRules = {
  "heidelberg-catechism": {
    resolve(date) {
      const sunday = mostRecentSunday(date);
      const firstSunday = firstSundayOfYear(sunday.getFullYear());
      const weekIndex = Math.round((sunday - firstSunday) / MS_PER_WEEK);
      const chapterNumber = Math.min(Math.max(weekIndex + 1, 1), 52);

      return {
        chapterNumber,
        label: `Jump to Lord's Day ${chapterNumber}`,
        title: `Most recent Lord's Day: ${formatDate(sunday)}`
      };
    }
  }
};

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function mostRecentSunday(date) {
  const day = startOfLocalDay(date);
  day.setDate(day.getDate() - day.getDay());
  return day;
}

function firstSundayOfYear(year) {
  const day = new Date(year, 0, 1);
  day.setDate(day.getDate() + ((7 - day.getDay()) % 7));
  return day;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function getCalendarTarget(document, date = new Date()) {
  const rule = calendarRules[document.slug];
  if (!rule) {
    return null;
  }

  const target = rule.resolve(date);
  const chapter = document.chapters.find((item) => item.number === target.chapterNumber);
  if (!chapter) {
    return null;
  }

  return {
    ...target,
    chapter
  };
}

function dayOfYearIndex(date) {
  const day = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const yearStart = Date.UTC(date.getFullYear(), 0, 1);
  return Math.floor((day - yearStart) / (24 * 60 * 60 * 1000));
}

function flattenWcfSections() {
  const sections = [];

  for (const chapter of window.WCF_DATA.chapters) {
    for (const section of chapter.sections) {
      sections.push({
        chapter,
        section
      });
    }
  }

  return sections;
}

function buildDailyWcfDocument(date) {
  const readings = flattenWcfSections();
  const index = dayOfYearIndex(date) % readings.length;
  const reading = readings[index];
  const dayNumber = index + 1;
  const chapter = reading.chapter;
  const section = reading.section;
  const coordinate = `WCF ${chapter.roman}.${section.roman}`;

  return {
    title: "Daily Westminster Confession",
    shortTitle: "Daily WCF",
    slug: "daily-westminster-confession",
    mark: "D",
    edition: `${readings.length}-day cycle through the Westminster Confession`,
    description: `${formatDate(date)}: ${coordinate}, ${chapter.title}.`,
    unitLabel: "Reading",
    source: window.WCF_DATA.source,
    notes: westminsterNotes,
    chapters: [
      {
        number: chapter.number,
        roman: chapter.roman,
        title: chapter.title,
        kicker: `Day ${dayNumber} of ${readings.length} - ${coordinate}`,
        source: window.WCF_DATA.source,
        sections: [
          {
            ...section
          }
        ]
      }
    ]
  };
}

function countWords(text) {
  const words = text
    .replace(/\^\{\s*[a-z]\s*\}/gi, " ")
    .match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)?/g);
  return words ? words.length : 0;
}

let sectionWordIndex = new Map();
let totalWords = 0;

function prepareWordIndex() {
  sectionWordIndex = new Map();
  totalWords = 0;

  for (const chapter of currentDocument.chapters) {
    for (const section of chapter.sections) {
      const key = sectionKey(chapter, section);
      const words = countWords(section.text);
      sectionWordIndex.set(key, {
        start: totalWords,
        end: totalWords + words,
        words
      });
      totalWords += words;
    }
  }
}

function chapterId(chapter) {
  return `${currentDocument.slug}-chapter-${String(chapter.number).padStart(2, "0")}`;
}

function sectionId(chapter, section) {
  return `${currentDocument.slug}-${chapter.number}-${section.number}`;
}

function sectionKey(chapter, section) {
  return `${currentDocument.slug}:${chapter.number}.${section.number}`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderText(text) {
  return text
    .split(/\n\n+/)
    .map((paragraph) => {
      const escaped = escapeHtml(paragraph);
      const withSuperscripts = escaped.replace(/\^\{\s*([a-z])\s*\}/gi, "<sup>$1</sup>");
      return `<p>${withSuperscripts}</p>`;
    })
    .join("");
}

function proofUrl(text) {
  const compact = text.replace(/[.•]/g, " ").replace(/\s+/g, " ").trim();
  return `https://www.biblegateway.com/quicksearch/?quicksearch=${encodeURIComponent(compact)}&version=KJV`;
}

function renderProofMarker(marker) {
  if (!marker || marker.toLowerCase() === "proof") {
    return "";
  }
  return `<span class="proof-marker">${escapeHtml(marker)}</span>`;
}

function renderProofs(section) {
  if (!proofToggle.checked || !section.proofs || section.proofs.length === 0) {
    return "";
  }

  return `
    <div class="proof-block">
      <h4>Proof texts</h4>
      ${section.proofs
        .map(
          (proof) => `
            <p>
              ${renderProofMarker(proof.marker)}
              <span>${escapeHtml(proof.text)}</span>
              <a class="proof-link" href="${proofUrl(proof.text)}">open</a>
            </p>
          `
        )
        .join("")}
    </div>
  `;
}

function renderNote(note) {
  return note.replaceAll("<a href=", '<a target="_blank" rel="noreferrer" href=');
}

function resolveNote(note, chapter, section) {
  if (typeof note === "function") {
    return note(chapter, section);
  }
  return note;
}

function renderNotes(chapter, section) {
  if (!noteToggle.checked) {
    return "";
  }

  const notes = [];
  const chapterNote =
    currentDocument.notes?.chapter?.[chapter.number] || currentDocument.notes?.chapterDefault;
  const sectionNote = currentDocument.notes?.section?.[`${chapter.number}.${section.number}`];

  if (section.number === 1 && chapterNote) {
    notes.push(resolveNote(chapterNote, chapter, section));
  }
  if (sectionNote) {
    notes.push(resolveNote(sectionNote, chapter, section));
  }
  if (section.notes) {
    notes.push(...section.notes);
  }
  const source = chapter.source || (chapter.number === 1 ? currentDocument.source : null);
  if (section.number === 1 && source?.url) {
    notes.push(
      `Source: <a href="${escapeHtml(source.url)}">${escapeHtml(source.name || source.url)}</a>.`
    );
  }

  if (notes.length === 0) {
    return "";
  }

  return `
    <div class="editorial-block">
      <h4>Editorial note</h4>
      ${notes.map((note) => `<p>${renderNote(note)}</p>`).join("")}
    </div>
  `;
}

function sectionMatches(chapter, section, query) {
  if (!query) {
    return true;
  }
  const haystack = [
    chapter.roman,
    chapter.title,
    chapter.kicker || "",
    section.roman,
    section.title || "",
    section.text,
    ...(section.proofs || []).map((proof) => proof.text),
    ...(section.notes || [])
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function chapterMatches(chapter, query) {
  return chapter.sections.some((section) => sectionMatches(chapter, section, query));
}

function getSearchQuery() {
  return search.value.trim().toLowerCase();
}

function getVisibleChapters(query) {
  return currentDocument.chapters.filter((chapter) => chapterMatches(chapter, query));
}

function renderNav(query = "") {
  nav.innerHTML = getVisibleChapters(query)
    .map(
      (chapter) => `
        <a href="#${chapterId(chapter)}" data-chapter="${chapter.number}">
          <span>${chapter.roman}</span>
          <strong>${escapeHtml(chapter.title)}</strong>
        </a>
      `
    )
    .join("");
}

function renderDocumentNav() {
  documentNav.innerHTML = documents
    .map(
      (document) => `
        <button class="${document === currentDocument ? "active" : ""}" type="button" data-document="${document.slug}">
          <span>${escapeHtml(document.mark || document.shortTitle.slice(0, 1))}</span>
          <strong>${escapeHtml(document.shortTitle || document.title)}</strong>
        </button>
      `
    )
    .join("");
}

function documentHasProofs(document) {
  return document.chapters.some((chapter) =>
    chapter.sections.some((section) => section.proofs && section.proofs.length > 0)
  );
}

function renderReaderHeader() {
  printerMark.textContent = currentDocument.mark || currentDocument.shortTitle?.slice(0, 1) || "C";
  brandTitle.textContent = currentDocument.shortTitle || currentDocument.title;
  readerTitle.textContent = currentDocument.title;
  readerSubtitle.textContent = currentDocument.edition || "";
  readerDescription.textContent = currentDocument.description || "";
  readerDescription.hidden = !currentDocument.description;

  const hasProofs = documentHasProofs(currentDocument);
  proofToggle.disabled = !hasProofs;
  proofToggle.closest("label").classList.toggle("is-disabled", !hasProofs);

  const calendarTarget = getCalendarTarget(currentDocument);
  calendarJump.hidden = !calendarTarget;
  if (calendarTarget) {
    calendarJump.textContent = calendarTarget.label;
    calendarJump.title = calendarTarget.title;
    calendarJump.setAttribute("aria-label", `${calendarTarget.label}. ${calendarTarget.title}.`);
  }
}

function renderEmptyState() {
  content.innerHTML = `
    <section class="empty-state">
      <h3>No matches</h3>
      <p>Try a doctrine, chapter title, or a shorter scripture reference.</p>
    </section>
  `;
}

function renderSection(chapter, section) {
  const sectionHref = `#${sectionId(chapter, section)}`;
  const title = section.title ? `<h4 class="section-title">${escapeHtml(section.title)}</h4>` : "";

  return `
    <article id="${sectionId(chapter, section)}" class="confession-section">
      <div class="section-body">
        <a class="section-label" href="${sectionHref}">
          ${chapter.roman}.${section.roman}
        </a>
        ${title}
        ${renderText(section.text)}
      </div>
      <aside class="marginalia">
        ${renderProofs(section)}
        ${renderNotes(chapter, section)}
      </aside>
    </article>
  `;
}

function renderChapter(chapter, query) {
  const sections = chapter.sections.filter((section) => sectionMatches(chapter, section, query));
  const unitLabel = currentDocument.unitLabel || "Chapter";
  const headingLabel = chapter.kicker || `${unitLabel} ${chapter.roman}`;

  return `
    <section id="${chapterId(chapter)}" class="chapter">
      <header class="chapter-heading">
        <p>${escapeHtml(headingLabel)}</p>
        <h3>${escapeHtml(chapter.title)}</h3>
      </header>

      ${sections.map((section) => renderSection(chapter, section)).join("")}
    </section>
  `;
}

function afterContentRender() {
  observeChapters();
  requestProgressUpdate();
}

function renderContent() {
  const query = getSearchQuery();
  renderReaderHeader();
  renderDocumentNav();
  renderNav(query);

  const chapters = getVisibleChapters(query);

  if (chapters.length === 0) {
    renderEmptyState();
    afterContentRender();
    return;
  }

  content.innerHTML = chapters.map((chapter) => renderChapter(chapter, query)).join("");

  addProgressData();
  afterContentRender();
}

let observer;
let activeChapterId = null;

function keepNavLinkVisible(link) {
  if (window.innerWidth <= 900) {
    if (!sidebar.classList.contains("nav-open")) {
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    if (linkRect.left < navRect.left) {
      nav.scrollLeft -= navRect.left - linkRect.left + 12;
    } else if (linkRect.right > navRect.right) {
      nav.scrollLeft += linkRect.right - navRect.right + 12;
    }
    return;
  }

  const margin = 36;
  const linkTop = link.offsetTop;
  const linkBottom = linkTop + link.offsetHeight;
  const visibleTop = sidebar.scrollTop + margin;
  const visibleBottom = sidebar.scrollTop + sidebar.clientHeight - margin;

  if (linkTop < visibleTop) {
    sidebar.scrollTop = Math.max(linkTop - margin, 0);
  } else if (linkBottom > visibleBottom) {
    sidebar.scrollTop = linkBottom - sidebar.clientHeight + margin;
  }
}

function setActiveChapter(id) {
  if (activeChapterId === id) {
    return;
  }
  activeChapterId = id;
  const links = [...nav.querySelectorAll("a")];
  const activeLink = links.find((link) => link.getAttribute("href") === `#${id}`);

  links.forEach((link) => {
    link.classList.toggle("active", link === activeLink);
  });

  if (activeLink) {
    keepNavLinkVisible(activeLink);
  }
}

function observeChapters() {
  if (observer) {
    observer.disconnect();
  }
  activeChapterId = null;
  const links = [...nav.querySelectorAll("a")];
  if (links.length === 0) {
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) {
        return;
      }
      setActiveChapter(visible.target.id);
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: [0.05, 0.2, 0.5] }
  );

  document.querySelectorAll(".chapter").forEach((chapter) => observer.observe(chapter));
}

function addProgressData() {
  for (const chapter of currentDocument.chapters) {
    for (const section of chapter.sections) {
      const element = document.querySelector(`#${sectionId(chapter, section)}`);
      const progress = sectionWordIndex.get(sectionKey(chapter, section));
      if (!element || !progress) {
        continue;
      }
      element.dataset.wordStart = progress.start;
      element.dataset.wordEnd = progress.end;
    }
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

let progressFrame = null;
function requestProgressUpdate() {
  if (progressFrame !== null) {
    return;
  }
  progressFrame = window.requestAnimationFrame(() => {
    progressFrame = null;
    updateProgress();
  });
}

function updateProgress() {
  const sections = [...document.querySelectorAll(".confession-section")];
  if (sections.length === 0) {
    progressPercent.textContent = "0%";
    progressWords.textContent = `0 / ${formatNumber(totalWords)} words`;
    return;
  }

  const readingLine = window.innerHeight * 0.45;
  let completed = 0;

  for (const section of sections) {
    const start = Number(section.dataset.wordStart);
    const end = Number(section.dataset.wordEnd);
    const rect = section.getBoundingClientRect();

    if (rect.top > readingLine) {
      break;
    }

    if (rect.bottom <= readingLine) {
      completed = end;
      continue;
    }

    const sectionHeight = Math.max(rect.height, 1);
    const portion = Math.min(Math.max((readingLine - rect.top) / sectionHeight, 0), 1);
    completed = start + (end - start) * portion;
    break;
  }

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
    completed = totalWords;
  }

  const roundedWords = Math.min(Math.max(Math.round(completed), 0), totalWords);
  const percent = totalWords ? Math.min((roundedWords / totalWords) * 100, 100) : 0;
  progressPercent.textContent = `${percent.toFixed(percent < 10 ? 1 : 0)}%`;
  progressWords.textContent = `${formatNumber(roundedWords)} / ${formatNumber(totalWords)} words`;
}

function findDocument(slug) {
  return documents.find((document) => document.slug === slug);
}

function setDocumentUrl(document) {
  const url = new URL(window.location.href);
  url.searchParams.set("doc", document.slug);
  window.history.replaceState(null, "", url);
}

function selectDocument(nextDocument) {
  currentDocument = nextDocument;
  setDocumentUrl(currentDocument);
  search.value = "";
  prepareWordIndex();
  renderContent();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function handleDocumentNavClick(event) {
  const button = event.target.closest("button[data-document]");
  if (!button) {
    return;
  }

  const nextDocument = findDocument(button.dataset.document);
  if (!nextDocument || nextDocument === currentDocument) {
    return;
  }

  selectDocument(nextDocument);
}

function toggleMobileMenu() {
  const isOpen = sidebar.classList.toggle("nav-open");
  mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenuToggle.textContent = isOpen ? "Close" : "Menu";
  requestProgressUpdate();
}

function setChapterHash(id) {
  const url = new URL(window.location.href);
  url.hash = id;
  window.history.replaceState(null, "", url);
}

function jumpToCalendarTarget() {
  const target = getCalendarTarget(currentDocument);
  if (!target) {
    return;
  }

  if (search.value) {
    search.value = "";
    renderContent();
  }

  window.requestAnimationFrame(() => {
    const id = chapterId(target.chapter);
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    if (window.innerWidth <= 900 && sidebar.classList.contains("nav-open")) {
      toggleMobileMenu();
    }
    setChapterHash(id);
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveChapter(id);
  });
}

function bindEvents() {
  search.addEventListener("input", renderContent);
  proofToggle.addEventListener("change", renderContent);
  noteToggle.addEventListener("change", renderContent);
  documentNav.addEventListener("click", handleDocumentNavClick);
  mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  calendarJump.addEventListener("click", jumpToCalendarTarget);
  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", requestProgressUpdate);
}

function init() {
  bindEvents();
  prepareWordIndex();
  renderContent();
}

init();

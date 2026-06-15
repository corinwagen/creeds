const data = window.WCF_DATA;

const editorialNotes = {
  chapter: {
    1: "Unlike the <a href=\"https://en.wikipedia.org/wiki/Thirty-nine_Articles\">Thirty-nine Articles</a>, Westminster begins with Scripture rather than the doctrine of God; this signals its strongly Reformed account of authority.",
    2: "The confession inherits classical catholic Trinitarian language while framing it in the idiom of post-Reformation <a href=\"https://en.wikipedia.org/wiki/Reformed_theology\">Reformed theology</a>.",
    3: "This chapter reflects the Reformed debate over divine decree and predestination. Westminster distinguishes God's ordaining whatsoever comes to pass from God's being the immediate cause or moral author of every act.",
    4: "Creation is treated briefly and doctrinally: it affirms creation from nothing, the goodness of creation, and a historical Adam and Eve.",
    5: "The providence chapter preserves both divine sovereignty and creaturely action, a common concern in early modern scholastic theology.",
    6: "The fall is explained through federal headship: Adam's sin is treated as involving his posterity, against <a href=\"https://en.wikipedia.org/wiki/Pelagianism\">Pelagian</a> accounts that deny inherited guilt and corruption.",
    7: "The covenant of works and covenant of grace structure much of the confession's later argument; this became a defining feature of <a href=\"https://en.wikipedia.org/wiki/Covenant_theology\">covenant theology</a>.",
    8: "Christ's mediation is presented through his person, offices, humiliation, exaltation, and application of redemption.",
    9: "The chapter's account of free will follows the Augustinian and Reformed distinction between natural liberty and moral ability, against both fatalism and <a href=\"https://en.wikipedia.org/wiki/Pelagianism\">Pelagian</a> moral self-sufficiency.",
    10: "Effectual calling belongs to the confession's order of salvation, often called the <a href=\"https://en.wikipedia.org/wiki/Ordo_salutis\"><i>ordo salutis</i></a>; it contrasts with views that make regeneration finally depend on autonomous human consent.",
    11: "Westminster states the Protestant doctrine of justification against Tridentine Roman Catholic accounts of infused righteousness and meritorious cooperation.",
    12: "Adoption receives its own chapter, a distinctive pastoral emphasis in the confession's account of salvation.",
    13: "Sanctification is distinguished from justification, against confusing renewal with the ground of pardon; it is also inseparable from union with Christ, against <a href=\"https://en.wikipedia.org/wiki/Antinomianism\">antinomian</a> neglect of holiness.",
    14: "Saving faith is treated as receptive and active: it rests on Christ and responds to every part of God's Word.",
    15: "Repentance is evangelical rather than meritorious; it belongs with faith in ordinary gospel preaching.",
    16: "Good works are necessary as fruit and evidence, against <a href=\"https://en.wikipedia.org/wiki/Antinomianism\">antinomianism</a>; they are never the ground of acceptance before God, against legalism and merit theology.",
    17: "The perseverance chapter became a standard statement of the Reformed doctrine often summarized as perseverance of the saints.",
    18: "Assurance is possible in this life, but the confession carefully distinguishes assurance from the essence of faith.",
    19: "The moral, ceremonial, and judicial distinctions are important for reading the later chapters on liberty, worship, and civil order.",
    20: "This chapter is historically important for Protestant arguments about liberty of conscience, against both ecclesiastical tyranny and libertine appeals to conscience as permission to sin.",
    21: "The worship chapter is a classic source for the <a href=\"https://en.wikipedia.org/wiki/Regulative_principle_of_worship\">regulative principle of worship</a>, contrasting Reformed worship with Lutheran and Anglican approaches that permit practices not forbidden by Scripture.",
    22: "Oaths and vows were live issues in seventeenth-century Britain, especially during the conflicts surrounding the <a href=\"https://en.wikipedia.org/wiki/Solemn_League_and_Covenant\">Solemn League and Covenant</a>.",
    23: "This chapter is one of the most revised portions in later American Presbyterian editions because of church-state questions, especially <a href=\"https://en.wikipedia.org/wiki/Erastianism\">Erastian</a> and toleration debates.",
    24: "Later Presbyterian editions often revise this chapter's wording on marriage and divorce.",
    25: "Catholic here means universal, not Roman Catholic; the chapter distinguishes visible and invisible church.",
    26: "Communion of saints here means shared participation in Christ and mutual obligations among believers, not invocation of saints.",
    27: "The sacramental chapters preserve Reformed language of signs and seals while rejecting both bare <a href=\"https://en.wikipedia.org/wiki/Memorialism\">memorialism</a> and Roman Catholic <a href=\"https://en.wikipedia.org/wiki/Ex_opere_operato\">ex opere operato</a> sacramental causality.",
    28: "Baptism is treated as covenantal, which explains the confession's defense of infant baptism against <a href=\"https://en.wikipedia.org/wiki/Anabaptism\">Anabaptist</a> and later credobaptist objections.",
    29: "The chapter rejects Roman <a href=\"https://en.wikipedia.org/wiki/Transubstantiation\">transubstantiation</a> and Lutheran local presence while also refusing a merely <a href=\"https://en.wikipedia.org/wiki/Huldrych_Zwingli\">Zwinglian</a> memorial reading.",
    30: "Church censures assume a Presbyterian model of ordered discipline under Christ's kingship, against both congregational independency and state control of church discipline.",
    31: "This chapter reflects the work of the <a href=\"https://en.wikipedia.org/wiki/Westminster_Assembly\">Westminster Assembly</a> itself: councils have real but subordinate authority, against both Roman infallibility claims and radical anti-confessionalism.",
    32: "The intermediate state and resurrection are stated against <a href=\"https://en.wikipedia.org/wiki/Christian_mortalism\">soul sleep</a>, <a href=\"https://en.wikipedia.org/wiki/Purgatory\">purgatory</a>, and disembodied accounts of final hope.",
    33: "The final chapter places eschatology under pastoral use: judgment should produce sobriety, comfort, and watchfulness."
  },
  section: {
    "1.1": "The opening contrast between natural revelation and saving revelation is foundational for later Reformed discussions of <a href=\"https://en.wikipedia.org/wiki/General_revelation\">general revelation</a>.",
    "1.3": "Westminster follows the Reformed Protestant canon and treats the <a href=\"https://en.wikipedia.org/wiki/Biblical_apocrypha\">Apocrypha</a> as human writings rather than Scripture. Roman Catholic and Eastern Orthodox churches receive many of these books as <a href=\"https://en.wikipedia.org/wiki/Deuterocanonical_books\">deuterocanonical</a>, though their exact canonical lists differ.",
    "1.6": "The phrase 'good and necessary consequence' names the confession's method for drawing doctrine from Scripture, against both unwritten tradition and a biblicism that refuses theological inference.",
    "1.9": "The confession's ordinary rule of interpretation is Scripture interpreting Scripture.",
    "2.1": "The list of divine attributes reflects classical theism as received by Protestant scholastic theologians.",
    "2.3": "This section states the classical Trinitarian formula in compact form, against anti-Trinitarian movements such as <a href=\"https://en.wikipedia.org/wiki/Socinianism\">Socinianism</a>. The phrase that the Holy Spirit proceeds from the Father and the Son reflects the Western <a href=\"https://en.wikipedia.org/wiki/Filioque\">Filioque</a>, a major point of disagreement with Eastern Orthodox theology.",
    "3.1": "“Ordain” here is broader than “directly cause.” Westminster means that all events fall within God's decree, while created agents, choices, and circumstances remain real second causes. That distinction is meant to exclude fatalism, <a href=\"https://en.wikipedia.org/wiki/Occasionalism\">occasionalism</a>, and the claim that God is the author of sin.",
    "3.2": "This rejects conditional election: God does not decree because he foresees faith, works, or perseverance. It also differs from <a href=\"https://en.wikipedia.org/wiki/Molinism\">Molinism</a>, where God's providential ordering is often explained through middle knowledge of what free creatures would do in possible circumstances.",
    "3.5": "Election is grounded in grace alone, not foreseen faith or moral improvement; this is a direct Reformed answer to <a href=\"https://en.wikipedia.org/wiki/Remonstrants\">Remonstrant</a> theology.",
    "3.8": "The chapter closes pastorally: predestination is not treated as a speculative puzzle, but as a doctrine to be taught with prudence, humility, and consolation.",
    "5.2": "The “first cause” is God as the ultimate source and governor of all things; “second causes” are real created causes through which events ordinarily occur. Westminster uses this distinction to say providence is comprehensive without collapsing creaturely action into fatalism or <a href=\"https://en.wikipedia.org/wiki/Occasionalism\">occasionalism</a>.",
    "6.3": "This section is the confession's compact account of original sin and imputation from Adam, against <a href=\"https://en.wikipedia.org/wiki/Pelagianism\">Pelagian</a> claims that Adam's sin harms posterity only by bad example.",
    "7.2": "The covenant of works language became a major marker of later Presbyterian theology; it contrasts with systems that deny Adam stood as a covenant head.",
    "7.5": "The law/gospel administration distinction explains how Westminster reads the Old Testament ceremonies as typological.",
    "8.1": "The three offices of Christ, prophet, priest, and king, are often called the <a href=\"https://en.wikipedia.org/wiki/Threefold_office\">threefold office</a>.",
    "8.2": "The section guards both full deity and full humanity in the one person of Christ, against Nestorian separation and Eutychian confusion of the natures.",
    "8.5": "This section joins active obedience and sacrificial death in Christ's satisfaction for his people, against <a href=\"https://en.wikipedia.org/wiki/Socinianism\">Socinian</a> denials of penal satisfaction.",
    "9.3": "The issue is moral inability, not loss of natural faculties: fallen people still choose, but not savingly apart from grace.",
    "10.1": "Effectual calling contrasts with merely external invitation; the Spirit inwardly brings about the response the gospel summons.",
    "10.3": "The <a href=\"https://en.wikipedia.org/wiki/Salvation_of_infants\">1903 UPCUSA Declaratory Statement</a> said of WCF X.3 that it “is not to be regarded as teaching that any who die in infancy are lost”; the same wording appears in the local <a href=\"wcf.txt\">wcf.txt</a> at [6.193].",
    "11.1": "Justification is forensic: God pardons and accepts believers as righteous by <a href=\"https://en.wikipedia.org/wiki/Imputed_righteousness\">imputing</a> Christ's obedience to them. This contrasts with <a href=\"https://en.wikipedia.org/wiki/Infused_righteousness\">infused righteousness</a>, where justifying righteousness is understood as grace inwardly poured into and transforming the believer; that contrast was sharpened by the <a href=\"https://en.wikipedia.org/wiki/Council_of_Trent\">Council of Trent</a>.",
    "11.2": "Faith is the instrument of justification, not its meritorious ground; even faith does not replace Christ's righteousness.",
    "11.3": "Christ's obedience and death satisfy divine justice in place of the justified, against views that reduce the atonement to moral example.",
    "12.1": "Adoption is treated briefly, but it gathers several pastoral privileges into one doctrine.",
    "14.2": "Faith responds differently to commands, threats, and promises; it is not reduced to mere assent.",
    "15.3": "Repentance is necessary, but it is not a satisfaction for sin.",
    "16.2": "Good works are evidential rather than meritorious in the confession's order of salvation; this contrasts with both <a href=\"https://en.wikipedia.org/wiki/Antinomianism\">antinomian</a> indifference and merit-based accounts of obedience.",
    "16.5": "Even the best works cannot merit pardon or eternal life, a sharp rejection of supererogation and treasury-of-merit logic.",
    "17.3": "Perseverance does not mean believers cannot fall into serious sin; the paragraph names real temporal consequences.",
    "18.3": "The ordinary means of grace, not extraordinary revelation, are the usual path to assurance.",
    "19.4": "The 'general equity' phrase is central to later debates over how Old Testament civil law relates to modern civil order.",
    "19.6": "The law's use for believers is positive and pastoral, not a return to justification by works.",
    "20.2": "Liberty of conscience is bounded by God's Word, not by private preference; the target is both humanly imposed doctrine and conscience used as a lawless absolute.",
    "21.1": "This section is often cited for the Reformed regulative principle of worship, against the normative principle common in Lutheran and Anglican traditions.",
    "21.7": "The confession identifies the first day of the week as the Christian Sabbath, a major Puritan emphasis.",
    "23.3": "The original chapter assumed a stronger civil role in suppressing religious error; American Presbyterian revisions later altered this substantially in response to religious liberty and disestablishment concerns.",
    "24.5": "The confession's divorce language is narrower than many later Protestant pastoral practices.",
    "25.6": "The anti-papal language reflects seventeenth-century Protestant polemic and was softened or revised in some later editions.",
    "27.1": "Sacraments are signs and seals: visible ordinances joined to covenant promises, against both Roman automatic efficacy and a reduced memorial-only account.",
    "27.3": "The efficacy of a sacrament is assigned to the Spirit and the word of institution, not to the minister's intention or the rite considered mechanically.",
    "28.4": "Infant baptism follows from the confession's covenantal account of the visible church, against <a href=\"https://en.wikipedia.org/wiki/Anabaptism\">Anabaptist</a> restriction of baptism to professing believers.",
    "28.5": "The paragraph avoids baptismal absolutism: baptism is commanded and serious, yet grace is not inseparably tied to the moment or act.",
    "29.2": "The Mass is rejected as a propitiatory sacrifice; Westminster insists Christ's once-for-all offering is not repeated.",
    "29.6": "This is the direct anti-<a href=\"https://en.wikipedia.org/wiki/Transubstantiation\">transubstantiation</a> paragraph, appealing not only to Scripture but also to sense and reason.",
    "29.7": "The language is neither Roman <a href=\"https://en.wikipedia.org/wiki/Transubstantiation\">transubstantiation</a>, Lutheran <a href=\"https://en.wikipedia.org/wiki/Sacramental_union\">sacramental union</a>, nor mere <a href=\"https://en.wikipedia.org/wiki/Huldrych_Zwingli\">Zwinglian</a> symbolism: believers feed on Christ spiritually by faith.",
    "30.1": "Church government is distinct from the civil magistrate, a Presbyterian answer to <a href=\"https://en.wikipedia.org/wiki/Erastianism\">Erastian</a> control of church courts.",
    "31.3": "Councils may err; their authority is ministerial and subordinate to Scripture, against Roman claims of indefectible conciliar or papal authority.",
    "33.3": "The unknown timing of judgment is treated as a reason for watchfulness, not speculation."
  }
};

const content = document.querySelector("#content");
const nav = document.querySelector("#chapter-nav");
const search = document.querySelector("#search");
const proofToggle = document.querySelector("#proof-toggle");
const noteToggle = document.querySelector("#note-toggle");
const progressPercent = document.querySelector("#progress-percent");
const progressWords = document.querySelector("#progress-words");
const mobileMenuToggle = document.querySelector("#mobile-menu-toggle");
const sidebar = document.querySelector(".sidebar");

function countWords(text) {
  const words = text
    .replace(/\^\{\s*[a-z]\s*\}/gi, " ")
    .match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)?/g);
  return words ? words.length : 0;
}

const sectionWordIndex = new Map();
let totalWords = 0;

for (const chapter of data.chapters) {
  for (const section of chapter.sections) {
    const key = `${chapter.number}.${section.number}`;
    const words = countWords(section.text);
    sectionWordIndex.set(key, {
      start: totalWords,
      end: totalWords + words,
      words
    });
    totalWords += words;
  }
}

function chapterId(chapter) {
  return `chapter-${String(chapter.number).padStart(2, "0")}`;
}

function sectionId(chapter, section) {
  return `wcf-${chapter.number}-${section.number}`;
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

function renderProofs(section) {
  if (!proofToggle.checked || section.proofs.length === 0) {
    return "";
  }

  return `
    <div class="proof-block">
      <h4>Proof texts</h4>
      ${section.proofs
        .map(
          (proof) => `
            <p>
              <span class="proof-marker">${escapeHtml(proof.marker)}</span>
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

function renderNotes(chapter, section) {
  if (!noteToggle.checked) {
    return "";
  }

  const notes = [];
  const chapterNote = editorialNotes.chapter[chapter.number];
  const sectionNote = editorialNotes.section[`${chapter.number}.${section.number}`];

  if (section.number === 1 && chapterNote) {
    notes.push(chapterNote);
  }
  if (sectionNote) {
    notes.push(sectionNote);
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
    section.roman,
    section.text,
    ...section.proofs.map((proof) => proof.text)
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function chapterMatches(chapter, query) {
  return chapter.sections.some((section) => sectionMatches(chapter, section, query));
}

function renderNav(query = "") {
  nav.innerHTML = data.chapters
    .filter((chapter) => chapterMatches(chapter, query))
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

function renderContent() {
  const query = search.value.trim().toLowerCase();
  renderNav(query);

  const chapters = data.chapters.filter((chapter) => chapterMatches(chapter, query));

  if (chapters.length === 0) {
    content.innerHTML = `
      <section class="empty-state">
        <h3>No matches</h3>
        <p>Try a doctrine, chapter title, or a shorter scripture reference.</p>
      </section>
    `;
    return;
  }

  content.innerHTML = chapters
    .map((chapter) => {
      const sections = chapter.sections.filter((section) => sectionMatches(chapter, section, query));
      return `
        <section id="${chapterId(chapter)}" class="chapter">
          <header class="chapter-heading">
            <p>Chapter ${chapter.roman}</p>
            <h3>${escapeHtml(chapter.title)}</h3>
          </header>

          ${sections
            .map(
              (section) => `
                <article id="${sectionId(chapter, section)}" class="confession-section">
                  <div class="section-body">
                    <a class="section-label" href="#${sectionId(chapter, section)}">
                      ${chapter.roman}.${section.roman}
                    </a>
                    ${renderText(section.text)}
                  </div>
                  <aside class="marginalia">
                    ${renderProofs(section)}
                    ${renderNotes(chapter, section)}
                  </aside>
                </article>
              `
            )
            .join("")}
        </section>
      `;
    })
    .join("");

  addProgressData();
  observeChapters();
  requestProgressUpdate();
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

  const sidebar = document.querySelector(".sidebar");
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
  for (const chapter of data.chapters) {
    for (const section of chapter.sections) {
      const element = document.querySelector(`#${sectionId(chapter, section)}`);
      const progress = sectionWordIndex.get(`${chapter.number}.${section.number}`);
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

search.addEventListener("input", renderContent);
proofToggle.addEventListener("change", renderContent);
noteToggle.addEventListener("change", renderContent);
mobileMenuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("nav-open");
  mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenuToggle.textContent = isOpen ? "Close" : "Menu";
  requestProgressUpdate();
});
window.addEventListener("scroll", requestProgressUpdate, { passive: true });
window.addEventListener("resize", requestProgressUpdate);

renderContent();

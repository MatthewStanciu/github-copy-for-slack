(function () {
  // --- utils ---
  const escapeHTML = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
     .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  function getPRTitle() {
    const selectors = [
      'h1[data-test-selector="pull-request-title"]',
      'span.js-issue-title',
      'h1.gh-header-title .js-issue-title'
    ];
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el?.textContent?.trim()) return el.textContent.trim();
    }
    return (document.title || "").replace(/\s·.*$/, "").trim();
  }

  // Detect state from GitHub header badge (very stable: ".State" text is "Open", "Closed", "Merged", "Draft")
  function getPRState() {
    // Try common badge locations
    const el =
      document.querySelector(".gh-header-meta .State") ||
      document.querySelector(".gh-header-title .State") ||
      document.querySelector('[data-test-selector="state-badge"] .State') ||
      document.querySelector(".State");

    if (el?.textContent) {
      const t = el.textContent.toLowerCase();
      if (t.includes("draft")) return "draft";
      if (t.includes("merged")) return "merged";
      if (t.includes("closed")) return "closed";
      if (t.includes("open")) return "open";
    }

    // Fallback: if title starts with "Draft:"
    const title = getPRTitle();
    if (/^\s*draft\s*:/i.test(title)) return "draft";

    // Default guess
    return "open";
  }

  function stateEmoji(state) {
    switch (state) {
      case "draft": return ":pr-draft:";
      case "merged": return ":merge:";
      case "closed": return ":closed:";
      case "open":
      default: return ":opened:";
    }
  }

  function buildPayload() {
    const title = getPRTitle();
    const url = location.href;
    const emoji = stateEmoji(getPRState());
    const html = `${emoji} <a href="${url}">${escapeHTML(title)}</a>`;
    const plain = `${emoji} ${title} — ${url}`;
    return { html, plain, emoji };
  }

  async function copyRich({ html, plain }) {
    try {
      if (window.ClipboardItem) {
        const item = new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" })
        });
        await navigator.clipboard.write([item]);
        toast("Copied formatted PR link");
        return;
      }
      await navigator.clipboard.writeText(plain);
      toast("Copied plain PR link");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = plain;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      toast("Copied plain PR link");
    }
  }

  // --- toast ---
  function toast(msg) {
    let t = document.createElement("div");
    t.textContent = msg;
    t.className = "arc-opened-toast";
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 200);
    }, 1500);
  }

  // --- button ---
  function ensureContainer() {
    return (
      document.querySelector(".gh-header-actions") ||
      document.querySelector('[data-test-selector="pr-toolbar"]') ||
      document.querySelector(".gh-header-meta")
    );
  }

  function insertOrUpdateButton() {
    const container = ensureContainer();
    if (!container) return;

    const existing = document.querySelector("#arc-copy-opened-btn");
    const label = `Copy for Slack`;

    if (existing) {
      if (existing.textContent !== label) existing.textContent = label;
      return;
    }

    const btn = document.createElement("button");
    btn.id = "arc-copy-opened-btn";
    btn.type = "button";
    btn.textContent = label;
    btn.className = "arc-opened-btn";
    btn.addEventListener("click", () => copyRich(buildPayload()));

    // Prefer to place it at the start of the header actions (not inside BtnGroup if possible)
    if (container.classList.contains("BtnGroup")) {
      container.insertAdjacentElement("afterend", btn);
    } else {
      container.prepend(btn);
    }
  }

  // --- keyboard (Cmd/Ctrl + Shift + Y) ---
  function onKey(e) {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    const meta = isMac ? e.metaKey : e.ctrlKey;
    if (meta && e.shiftKey && (e.key === "Y" || e.key === "y")) {
      e.preventDefault();
      copyRich(buildPayload());
    }
  }

  // --- init ---
  function init() {
    insertOrUpdateButton();
    document.removeEventListener("keydown", onKey);
    document.addEventListener("keydown", onKey, { passive: false });
  }

  init();

  // Re-evaluate after PJAX navigations
  document.addEventListener("pjax:end", init);

  // Watch for header/meta mutations that can flip state or re-render
  const header = document.querySelector(".gh-header, .gh-header-meta") || document.documentElement;
  const obs = new MutationObserver(() => insertOrUpdateButton());
  obs.observe(header, { childList: true, subtree: true, characterData: true });
})();


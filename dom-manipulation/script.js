/* =========================================================
   Quotes Sync Demo: Local + Simulated Server (JSONPlaceholder)
   - Periodic fetch (server updates)
   - Server-wins conflict resolution (automatic)
   - Conflicts surfaced with option to restore local
   - Local Storage persistence (quotes + last filter + auto-sync preference)
   ========================================================= */

// -------------------- Storage Keys --------------------
const LS_QUOTES_KEY = "quotes";
const LS_LAST_CATEGORY = "lastCategory";
const LS_LAST_SYNC_AT = "lastSyncAt";
const LS_AUTO_SYNC = "autoSyncEnabled";

// -------------------- State --------------------
let quotes = loadQuotes();
let lastSelectedCategory = localStorage.getItem(LS_LAST_CATEGORY) || "all";
let autoSyncIntervalId = null;

// Each quote: { id, text, category, updatedAt, source: 'local'|'server' }

// -------------------- DOM --------------------
const categoryFilter = document.getElementById("categoryFilter");
const quoteList = document.getElementById("quoteList");
const conflictsArea = document.getElementById("conflictsArea");
const addBtn = document.getElementById("addBtn");
const syncBtn = document.getElementById("syncBtn");
const autoSyncToggle = document.getElementById("autoSyncToggle");
const syncStatus = document.getElementById("syncStatus");

// -------------------- Init --------------------
init();

function init() {
  // Seed dropdown & list
  populateCategories();
  filterQuotes();

  // Wire events
  categoryFilter.addEventListener("change", handleCategoryChange);
  addBtn.addEventListener("click", addQuote);
  syncBtn.addEventListener("click", syncWithServer);

  // Restore auto-sync preference
  const autoOn = localStorage.getItem(LS_AUTO_SYNC) === "true";
  autoSyncToggle.checked = autoOn;
  autoSyncToggle.addEventListener("change", handleAutoSyncToggle);
  if (autoOn) startAutoSync(); else stopAutoSync();

  renderStatus("Ready.", "ok");
}

// -------------------- UI: Status --------------------
function renderStatus(msg, level = "ok") {
  syncStatus.textContent = msg;
  syncStatus.className = "";
  if (level === "ok") syncStatus.classList.add("ok");
  else if (level === "warn") syncStatus.classList.add("warn");
  else if (level === "err") syncStatus.classList.add("err");
}

// -------------------- Storage --------------------
function loadQuotes() {
  try {
    const raw = localStorage.getItem(LS_QUOTES_KEY);
    if (!raw) return defaultQuotes();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultQuotes();
  } catch {
    return defaultQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem(LS_QUOTES_KEY, JSON.stringify(quotes));
}

function defaultQuotes() {
  // Minimal starter set; marked as local
  const now = Date.now();
  return [
    { id: "local-" + (now - 3000), text: "Believe you can and you're halfway there.", category: "Motivation", updatedAt: now - 3000, source: "local" },
    { id: "local-" + (now - 2000), text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration", updatedAt: now - 2000, source: "local" },
    { id: "local-" + (now - 1000), text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life", updatedAt: now - 1000, source: "local" }
  ];
}

// -------------------- UI: Categories & Listing --------------------
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories
    .map(cat => `<option value="${escapeHtml(cat)}">${escapeHtml(capitalize(cat))}</option>`)
    .join("");

  // Restore saved selection if available
  if (categories.includes(lastSelectedCategory)) {
    categoryFilter.value = lastSelectedCategory;
  } else {
    categoryFilter.value = "all";
    lastSelectedCategory = "all";
  }
}

function displayQuotes(list) {
  if (!Array.isArray(list)) list = [];
  quoteList.innerHTML = list
    .map(q => {
      const date = new Date(q.updatedAt || Date.now()).toLocaleString();
      return `<li class="quote">
        <strong>${escapeHtml(q.text)}</strong>
        <span class="badge">${escapeHtml(q.category)}</span>
        <span class="muted">— ${q.source || "local"} • ${escapeHtml(date)}</span>
      </li>`;
    })
    .join("");
}

function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem(LS_LAST_CATEGORY, selectedCategory);
  lastSelectedCategory = selectedCategory;

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  displayQuotes(filtered);
}

function handleCategoryChange() {
  filterQuotes();
}

// -------------------- Add Quote --------------------
function addQuote() {
  const txtEl = document.getElementById("quoteText");
  const catEl = document.getElementById("quoteCategory");
  const text = (txtEl.value || "").trim();
  const category = (catEl.value || "").trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }

  const now = Date.now();
  const newQuote = {
    id: "local-" + now, // unique local id
    text,
    category,
    updatedAt: now,
    source: "local"
  };
  quotes.push(newQuote);
  saveQuotes();

  // Refresh UI
  populateCategories();
  filterQuotes();

  // Clear inputs
  txtEl.value = "";
  catEl.value = "";
}

// -------------------- Auto Sync --------------------
function handleAutoSyncToggle() {
  const on = autoSyncToggle.checked;
  localStorage.setItem(LS_AUTO_SYNC, on ? "true" : "false");
  if (on) startAutoSync(); else stopAutoSync();
}

function startAutoSync() {
  stopAutoSync();
  autoSyncIntervalId = setInterval(syncWithServer, 30000); // 30 seconds
}

function stopAutoSync() {
  if (autoSyncIntervalId) {
    clearInterval(autoSyncIntervalId);
    autoSyncIntervalId = null;
  }
}

// -------------------- Server Simulation --------------------
/**
 * We use JSONPlaceholder as a generic "server".
 * GET https://jsonplaceholder.typicode.com/posts?_limit=5
 * - Map server "posts" to "quotes"
 * - id: "server-<post.id>"
 * - text: post.title
 * - category: "Server"
 * - updatedAt: fabricate from post.id for deterministic demo
 */
async function fetchServerQuotes() {
  const url = "https://jsonplaceholder.typicode.com/posts?_limit=5";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch server data.");
  const posts = await res.json();
  const baseTime = Date.now() - 1000 * 60 * 60; // 1h ago baseline
  return posts.map(p => ({
    id: "server-" + String(p.id),
    text: String(p.title || "Untitled"),
    category: "Server",
    updatedAt: baseTime + Number(p.id) * 1000, // deterministic "updated" times
    source: "server"
  }));
}

/**
 * Simulated "POST" to server. JSONPlaceholder returns a fake id.
 * In our app, we don't rely on this persisting server-side; it's illustrative.
 */
async function postQuoteToServer(quote) {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({
      title: quote.text,
      body: quote.category,
      userId: 1
    })
  });
  // Even though this won't persist, we can log or use returned id for demonstration
  const json = await res.json();
  return json; // { id: 101, ... }
}

// -------------------- Sync & Conflict Resolution --------------------
/**
 * SERVER-WINS auto resolution:
 * - Merge server quotes into local.
 * - If same ID exists and differs: mark conflict, replace local with server version.
 * - Surface conflicts so user can optionally restore their local copy.
 */
async function syncWithServer() {
  renderStatus("Syncing…", "warn");

  try {
    const serverQuotes = await fetchServerQuotes();
    const localById = new Map(quotes.map(q => [q.id, q]));
    const conflicts = [];

    // Merge server quotes into local, server wins on conflict
    for (const s of serverQuotes) {
      const local = localById.get(s.id);
      if (!local) {
        // New server item, add
        localById.set(s.id, s);
      } else {
        // Same id, compare significant fields
        if (local.text !== s.text || local.category !== s.category || (local.source !== "server")) {
          // Conflict detected; server wins automatically
          conflicts.push({ id: s.id, serverVersion: s, localVersion: local });
          localById.set(s.id, s);
        }
      }
    }

    // Optional: Simulate pushing local-only quotes to server
    // (purely illustrative—JSONPlaceholder does not persist).
    // const localsToPush = [...localById.values()].filter(q => q.source === "local" && q.id.startsWith("local-"));
    // for (const q of localsToPush) {
    //   await postQuoteToServer(q);
    // }

    // Update state and UI
    quotes = [...localById.values()].sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0));
    saveQuotes();
    populateCategories();
    filterQuotes();
    showConflicts(conflicts);

    localStorage.setItem(LS_LAST_SYNC_AT, String(Date.now()));
    renderStatus(conflicts.length ? `Synced with ${conflicts.length} conflict(s) (server version applied).` : "Synced successfully.", conflicts.length ? "warn" : "ok");
  } catch (err) {
    console.error(err);
    renderStatus("Sync failed. Check your connection and try again.", "err");
  }
}

function showConflicts(conflicts) {
  if (!conflicts || conflicts.length === 0) {
    conflictsArea.classList.remove("err");
    conflictsArea.innerHTML = "No conflicts detected.";
    return;
  }

  conflictsArea.innerHTML = conflicts
    .map((c, idx) => `
      <div class="conflict">
        <h4>Conflict #${idx + 1} — <span class="mono">${escapeHtml(c.id)}</span></h4>
        <div class="split">
          <div>
            <strong>Server version (applied)</strong>
            <p>"${escapeHtml(c.serverVersion.text)}"</p>
            <p class="muted">Category: ${escapeHtml(c.serverVersion.category)} • Updated: ${new Date(c.serverVersion.updatedAt).toLocaleString()}</p>
          </div>
          <div>
            <strong>Your local version</strong>
            <p>"${escapeHtml(c.localVersion.text)}"</p>
            <p class="muted">Category: ${escapeHtml(c.localVersion.category)} • Updated: ${new Date(c.localVersion.updatedAt).toLocaleString()}</p>
            <button type="button" data-restore-id="${escapeHtml(c.id)}">Restore Local Version</button>
          </div>
        </div>
      </div>
    `)
    .join("");

  // Wire restore buttons
  conflictsArea.querySelectorAll("[data-restore-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-restore-id");
      // Find conflict again (in case UI changed)
      const conf = conflicts.find(x => x.id === id);
      if (!conf) return;
      // Replace server version with local version
      const idx = quotes.findIndex(q => q.id === id);
      if (idx >= 0) {
        quotes[idx] = { ...conf.localVersion, updatedAt: Date.now() }; // bump timestamp
        saveQuotes();
        populateCategories();
        filterQuotes();
        // Remove this conflict card
        btn.closest(".conflict").remove();
        // If none left, show "No conflicts"
        if (!conflictsArea.querySelector(".conflict")) {
          conflictsArea.textContent = "No conflicts detected.";
        }
        renderStatus("Local version restored for " + id, "ok");
      }
    });
  });
}

// -------------------- Helpers --------------------
function capitalize(str) {
  return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

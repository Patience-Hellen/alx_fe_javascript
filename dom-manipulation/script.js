// ====== Storage Keys ======
const LS_QUOTES_KEY = 'quotes:v1';
const SS_LAST_INDEX_KEY = 'quotes:lastViewedIndex';

// ====== State ======
let quotes = [];

// ====== DOM ======
const quoteTextEl   = document.getElementById('quote-text');
const quoteAuthorEl = document.getElementById('quote-author');
const addForm       = document.getElementById('add-quote-form');
const inputText     = document.getElementById('new-quote-text');
const inputAuthor   = document.getElementById('new-quote-author');
const btnRandom     = document.getElementById('random-quote');
const btnExport     = document.getElementById('export-json');
const fileInput     = document.getElementById('importFile');
const btnClearAll   = document.getElementById('clear-all');

// ====== Utilities ======
function saveQuotes() {
  localStorage.setItem(LS_QUOTES_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(LS_QUOTES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        quotes = parsed.filter(isValidQuoteObject);
        return;
      }
    }
  } catch (_) {}
  // Fallback demo data
  quotes = [
    { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
    { text: 'Programs must be written for people to read.', author: 'Harold Abelson' },
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' }
  ];
  saveQuotes();
}

function isValidQuoteObject(obj) {
  return obj && typeof obj.text === 'string' && obj.text.trim().length > 0 &&
         (typeof obj.author === 'string' || obj.author === undefined);
}

function displayQuoteByIndex(index) {
  if (!quotes.length) {
    quoteTextEl.textContent = 'No quotes yet. Add one!';
    quoteAuthorEl.textContent = '';
    return;
  }
  const safeIndex = Math.max(0, Math.min(index, quotes.length - 1));
  const { text, author } = quotes[safeIndex];
  quoteTextEl.textContent = text;
  quoteAuthorEl.textContent = author ? `— ${author}` : '— Unknown';

  // Save last viewed quote index for the current session
  sessionStorage.setItem(SS_LAST_INDEX_KEY, String(safeIndex));
}

function displayRandomQuote() {
  if (!quotes.length) return displayQuoteByIndex(0);
  const idx = Math.floor(Math.random() * quotes.length);
  displayQuoteByIndex(idx);
}

function addQuote(text, author) {
  const cleanedText = (text || '').trim();
  const cleanedAuthor = (author || '').trim();

  if (!cleanedText) return false;

  // Avoid near-duplicate by text (case-insensitive)
  const exists = quotes.some(q => q.text.trim().toLowerCase() === cleanedText.toLowerCase());
  if (exists) return false;

  quotes.push({ text: cleanedText, author: cleanedAuthor || 'Unknown' });
  saveQuotes();
  return true;
}

// ====== Import / Export ======
function exportToJson() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes-export.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error('Invalid JSON: expected an array');

      // Merge valid items; de-dupe by text
      const validIncoming = imported.filter(isValidQuoteObject);
      const existingTexts = new Set(quotes.map(q => q.text.trim().toLowerCase()));
      const merged = [
        ...quotes,
        ...validIncoming.filter(q => !existingTexts.has(q.text.trim().toLowerCase()))
      ];

      quotes = merged;
      saveQuotes();
      alert('Quotes imported successfully!');
      // Show last or random after import
      displayRandomQuote();
    } catch (err) {
      alert('Failed to import: ' + err.message);
    } finally {
      // Reset input so the same file can be chosen again if needed
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

// ====== Init ======
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();

  // Show last viewed quote in this session if available
  const lastIdxStr = sessionStorage.getItem(SS_LAST_INDEX_KEY);
  if (lastIdxStr !== null && !Number.isNaN(Number(lastIdxStr))) {
    displayQuoteByIndex(Number(lastIdxStr));
  } else {
    displayRandomQuote();
  }

  // Add Quote (from form)
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = addQuote(inputText.value, inputAuthor.value);
    if (!ok) {
      alert('Please enter a unique quote text.');
      return;
    }
    inputText.value = '';
    inputAuthor.value = '';
    displayRandomQuote();
  });

  // Random
  btnRandom.addEventListener('click', displayRandomQuote);

  // Export
  btnExport.addEventListener('click', exportToJson);

  // Import
  fileInput.addEventListener('change', importFromJsonFile);

  // Clear All (for testing)
  btnClearAll.addEventListener('click', () => {
    if (!confirm('Delete all quotes?')) return;
    quotes = [];
    saveQuotes();
    localStorage.removeItem(LS_QUOTES_KEY);
    sessionStorage.removeItem(SS_LAST_INDEX_KEY);
    displayQuoteByIndex(0);
  });
});

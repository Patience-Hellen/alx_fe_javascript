// Sample quotes array (could be empty initially)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "Believe you can and you're halfway there.", category: "Motivation" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" }
];

// Restore last selected category
let lastSelectedCategory = localStorage.getItem("lastCategory") || "all";

// Populate categories in dropdown
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");

    // Get unique categories
    const categories = [...new Set(quotes.map(q => q.category))];

    // Clear old options except "All Categories"
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

    // Add new categories
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        if (category === lastSelectedCategory) {
            option.selected = true;
        }
        categoryFilter.appendChild(option);
    });
}

// Display quotes
function displayQuotes(filteredQuotes) {
    const quoteList = document.getElementById("quoteList");
    quoteList.innerHTML = "";
    filteredQuotes.forEach(q => {
        const li = document.createElement("li");
        li.textContent = `${q.text} (${q.category})`;
        quoteList.appendChild(li);
    });
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("lastCategory", selectedCategory);
    if (selectedCategory === "all") {
        displayQuotes(quotes);
    } else {
        displayQuotes(quotes.filter(q => q.category === selectedCategory));
    }
}

// Add a new quote
function addQuote() {
    const quoteText = document.getElementById("quoteText").value.trim();
    const quoteCategory = document.getElementById("quoteCategory").value.trim();

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });

        // Save quotes to localStorage
        localStorage.setItem("quotes", JSON.stringify(quotes));

        // Repopulate categories in case new one was added
        populateCategories();

        // Refresh filtered list
        filterQuotes();

        // Clear inputs
        document.getElementById("quoteText").value = "";
        document.getElementById("quoteCategory").value = "";
    } else {
        alert("Please enter both quote and category.");
    }
}

// Initial load
populateCategories();
filterQuotes();

/* ====== CHECKS ====== */
(function checkScript() {
    const scriptText = document.currentScript.textContent;
    if (!scriptText.includes("function filterQuotes")) {
        console.warn("⚠️ Missing filterQuotes function!");
    }
    if (scriptText.includes("quoteDisplay") || scriptText.includes("Math.random")) {
        console.warn("⚠️ Script contains forbidden terms: 'quoteDisplay' or 'Math.random'");
    } else {
        console.log("✅ All checks passed: filterQuotes exists, no forbidden terms found.");
    }
})();

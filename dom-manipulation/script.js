// Sample quotes data with categories
const quotes = [
    { text: "The quality of your questions determines the quality of your answers.", category: "Wisdom" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Motivation" },
    { text: "In the middle of difficulty lies opportunity.", category: "Wisdom" },
    { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
    { text: "Faith is taking the first step even when you don't see the whole staircase.", category: "Faith" }
];

// DOM elements
const categorySelect = document.getElementById("categorySelect");
const quoteDisplay = document.getElementById("quoteDisplay");

// Populate unique categories into dropdown
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))]; // Unique categories
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Filter and display a quote based on selected category
function filterQuote(selectedCategory) {
    let filteredQuotes;

    if (selectedCategory === "all") {
        filteredQuotes = quotes;
    } else {
        filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }

    if (filteredQuotes.length > 0) {
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
    } else {
        quoteDisplay.textContent = "No quotes available for this category.";
    }
}

// Save selected category to local storage
function saveCategory(category) {
    localStorage.setItem("selectedCategory", category);
}

// Restore last selected category from local storage
function restoreCategory() {
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categorySelect.value = savedCategory;
        filterQuote(savedCategory);
    } else {
        filterQuote("all");
    }
}

// Event listener for category change
categorySelect.addEventListener("change", function () {
    const selected = categorySelect.value;
    saveCategory(selected);
    filterQuote(selected);
});

// Init
populateCategories();
restoreCategory();

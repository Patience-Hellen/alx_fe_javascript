// script.js

// Sample quotes array with categories
let quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" },
    { text: "You must be the change you wish to see in the world.", category: "Inspiration" }
];

// DOM elements
const categoryFilter = document.getElementById("categoryFilter");
const quoteList = document.getElementById("quoteList");

// Load saved data
if (localStorage.getItem("quotes")) {
    quotes = JSON.parse(localStorage.getItem("quotes"));
}

// Populate categories dynamically
function populateCategories() {
    const categories = ["all", ...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = categories.map(cat => 
        `<option value="${cat}">${cat}</option>`
    ).join("");

    // Restore last selected category
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory && categories.includes(savedCategory)) {
        categoryFilter.value = savedCategory;
    }
}

// Filter quotes based on category
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);

    const filteredQuotes = selectedCategory === "all" 
        ? quotes 
        : quotes.filter(q => q.category === selectedCategory);

    displayQuotes(filteredQuotes);
}

// Display quotes
function displayQuotes(quoteArray) {
    quoteList.innerHTML = quoteArray.map(q => 
        `<li><strong>${q.category}:</strong> ${q.text}</li>`
    ).join("");
}

// Add a new quote
function addQuote(text, category) {
    if (!text || !category) return;

    quotes.push({ text, category });
    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    filterQuotes();
}

// Initial load
populateCategories();
filterQuotes();

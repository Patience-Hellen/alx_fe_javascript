// Mock API fetch function
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();

        // Map API data to quotes format
        quotes = data.slice(0, 20).map((item, index) => ({
            text: item.title,
            category: index % 2 === 0 ? "Motivation" : "Inspiration"
        }));

        populateCategories();
        restoreSelectedCategory();
    } catch (error) {
        console.error("Error fetching quotes:", error);
    }
}

let quotes = [];
let categorySelect = document.getElementById("categorySelect");
let quoteDisplay = document.getElementById("quoteDisplay");

// Populate categories dropdown
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];

    categorySelect.innerHTML = `<option value="all">All</option>`;
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Filter quotes by selected category
function filterQuote(selectedCategory) {
    let filteredQuotes = selectedCategory === "all" 
        ? quotes 
        : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes available for this category.";
        return;
    }

    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.textContent = randomQuote.text;
}

// Save selected category to localStorage
function saveSelectedCategory(category) {
    localStorage.setItem("selectedCategory", category);
}

// Restore category from localStorage
function restoreSelectedCategory() {
    const savedCategory = localStorage.getItem("selectedCategory") || "all";
    categorySelect.value = savedCategory;
    filterQuote(savedCategory);
}

// Event listener for category change
categorySelect.addEventListener("change", function() {
    const selectedCategory = this.value;
    saveSelectedCategory(selectedCategory);
    filterQuote(selectedCategory);
});

// Initialize
fetchQuotesFromServer();

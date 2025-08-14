// Sample quotes array
const quotes = [
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "Believe you can and you're halfway there.", category: "Motivation" },
    { text: "Your limitation—it’s only your imagination.", category: "Motivation" },
    { text: "Do what you can with all you have, wherever you are.", category: "Success" },
    { text: "Happiness depends upon ourselves.", category: "Happiness" },
    { text: "Be the change that you wish to see in the world.", category: "Inspiration" }
];

const categorySelect = document.getElementById("categorySelect");
const quoteDisplay = document.getElementById("quoteDisplay");

// Populate categories dynamically
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categorySelect.innerHTML = `<option value="">--Select Category--</option>`;
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

// Filter and display quote based on selected category
function filterQuote() {
    const selectedCategory = categorySelect.value;
    localStorage.setItem("selectedCategory", selectedCategory); // Save choice

    if (!selectedCategory) {
        quoteDisplay.textContent = "Select a category to see a quote.";
        return;
    }

    const filtered = quotes.filter(q => q.category === selectedCategory);
    const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
    quoteDisplay.textContent = randomQuote.text;
}

// Restore saved category on page load
function restoreSelection() {
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categorySelect.value = savedCategory;
        filterQuote();
    }
}

// Event listeners
categorySelect.addEventListener("change", filterQuote);

// Initialize
populateCategories();
restoreSelection();

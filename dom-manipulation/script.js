// Array to store quotes
let quotes = [];

// Fetch quotes from a mock server API
function fetchQuotesFromServer() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            // Mock: Convert posts to quote objects with categories
            quotes = data.slice(0, 10).map((item, index) => ({
                text: item.title,
                category: `Category ${index % 3 + 1}`
            }));
            populateCategories();
            restoreLastSelectedCategory();
        })
        .catch(error => console.error("Error fetching quotes:", error));
}

// Populate categories in the dropdown
function populateCategories() {
    const categorySelect = document.getElementById('categorySelect');
    categorySelect.innerHTML = '';

    const uniqueCategories = [...new Set(quotes.map(q => q.category))];
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Filter and display quotes based on selected category
function filterQuote() {
    const selectedCategory = document.getElementById('categorySelect').value;
    localStorage.setItem('lastCategory', selectedCategory);

    const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    filteredQuotes.forEach(q => {
        const p = document.createElement('p');
        p.textContent = q.text;
        quoteDisplay.appendChild(p);
    });
}

// Restore last selected category when page reloads
function restoreLastSelectedCategory() {
    const lastCategory = localStorage.getItem('lastCategory');
    if (lastCategory) {
        document.getElementById('categorySelect').value = lastCategory;
        filterQuote();
    }
}

// Post new quote to server
function postQuoteToServer(quoteText, category) {
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: quoteText,
            category: category
        })
    })
    .then(response => response.json())
    .then(data => console.log("Quote posted:", data))
    .catch(error => console.error("Error posting quote:", error));
}

// Sync quotes between local data and server
function syncQuotes() {
    console.log("Syncing quotes with server...");
    quotes.forEach(q => {
        postQuoteToServer(q.text, q.category);
    });
}

// Initial fetch when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchQuotesFromServer();

    document.getElementById('categorySelect').addEventListener('change', filterQuote);
    document.getElementById('syncButton').addEventListener('click', syncQuotes);
});

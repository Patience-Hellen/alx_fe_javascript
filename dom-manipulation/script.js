// script.js

// Function to fetch quotes from the server (mocked for now)
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return {
            text: data.content,
            author: data.author
        };
    } catch (error) {
        console.error('Error fetching quote:', error);
        return {
            text: "Keep going, you're doing great!",
            author: "Unknown"
        };
    }
}

// Example usage: load a quote into the page
document.addEventListener("DOMContentLoaded", async () => {
    const quoteEl = document.getElementById("quote");
    const authorEl = document.getElementById("author");

    const quoteData = await fetchQuotesFromServer();
    if (quoteEl && authorEl) {
        quoteEl.textContent = quoteData.text;
        authorEl.textContent = `— ${quoteData.author}`;
    }
});

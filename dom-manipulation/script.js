// Function to fetch quotes from a mock API 
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();
        console.log("Fetched Quotes:", data);
        return data;
    } catch (error) {
        console.error("Error fetching quotes:", error);
        return [];
    }
}

// Function to post a new quote to the mock API
async function postQuoteToServer(quoteText, category) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                title: category,
                body: quoteText,
                userId: 1
            })
        });

        const data = await response.json();
        console.log("Posted Quote:", data);
        return data;
    } catch (error) {
        console.error("Error posting quote:", error);
    }
}

// Function to periodically check for new quotes
function startQuotePolling(intervalMs = 30000) {
    console.log(`Starting quote polling every ${intervalMs / 1000} seconds...`);
    setInterval(async () => {
        console.log("Checking for new quotes...");
        await fetchQuotesFromServer();
    }, intervalMs);
}

// Example usage
(async function () {
    const quotes = await fetchQuotesFromServer();

    // Post a sample quote
    await postQuoteToServer("This is a sample inspirational quote.", "Inspiration");

    // Start periodic checking for new quotes
    startQuotePolling(30000); // every 30 seconds
})();

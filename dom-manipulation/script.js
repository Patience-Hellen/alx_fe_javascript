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

// Function to sync local quotes with server quotes
async function syncQuotes() {
    console.log("Syncing quotes with server...");
    const serverQuotes = await fetchQuotesFromServer();

    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // Simple merge: server data takes precedence if IDs match
    const mergedQuotes = [...serverQuotes, ...localQuotes.filter(lq => 
        !serverQuotes.some(sq => sq.id === lq.id)
    )];

    localStorage.setItem("quotes", JSON.stringify(mergedQuotes));
    console.log("Quotes synced successfully.");

    // UI Notification for sync
    alert("Quotes synced with server!");
}

// Function to periodically check for new quotes
function startQuotePolling(intervalMs = 30000) {
    console.log(`Starting quote polling every ${intervalMs / 1000} seconds...`);
    setInterval(async () => {
        console.log("Checking for new quotes...");
        await syncQuotes();
    }, intervalMs);
}

// Example usage
(async function () {
    await syncQuotes(); // Initial sync
    await postQuoteToServer("This is a sample inspirational quote.", "Inspiration");
    startQuotePolling(30000); // Check every 30 seconds
})();

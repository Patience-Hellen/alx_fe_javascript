// script.js

const localStorageKey = "quotes";
const serverUrl = "https://jsonplaceholder.typicode.com/posts"; // Mock server endpoint

// Fetch quotes from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        const data = await response.json();

        // Simulate server data structure
        const serverQuotes = data.slice(0, 5).map(post => ({
            id: post.id,
            text: post.title,
            source: "Server"
        }));

        console.log("Fetched from server:", serverQuotes);
        syncQuotes(serverQuotes);

    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

// Sync quotes between local and server, server takes precedence
function syncQuotes(serverQuotes) {
    let localQuotes = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    // Conflict resolution: server overwrites matching IDs
    serverQuotes.forEach(serverQuote => {
        const index = localQuotes.findIndex(q => q.id === serverQuote.id);
        if (index !== -1) {
            localQuotes[index] = serverQuote; // overwrite
        } else {
            localQuotes.push(serverQuote); // add new
        }
    });

    localStorage.setItem(localStorageKey, JSON.stringify(localQuotes));
    console.log("Synced local quotes:", localQuotes);
}

// Add new quote locally
function addQuote(text) {
    let localQuotes = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    const newQuote = {
        id: Date.now(),
        text,
        source: "Local"
    };
    localQuotes.push(newQuote);
    localStorage.setItem(localStorageKey, JSON.stringify(localQuotes));
    console.log("Added new local quote:", newQuote);
}

// Periodically fetch and sync every 10 seconds
setInterval(fetchQuotesFromServer, 10000);

// Initial fetch
fetchQuotesFromServer();

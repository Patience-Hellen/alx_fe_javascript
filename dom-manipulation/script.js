// Initial quotes array
let quotes = [
  { text: "Faith is taking the first step even when you don’t see the whole staircase.", category: "Faith" },
  { text: "Do not wait for opportunity. Create it.", category: "Motivation" },
  { text: "The best way to predict the future is to invent it.", category: "Innovation" }
];

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available.";
    return;
  }
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `
    "${quote.text}"<br><small><em>Category: ${quote.category}</em></small>
  `;
}

// Function to dynamically create the add quote form
function createAddQuoteForm() {
  let formContainer = document.createElement("div");
  formContainer.style.marginTop = "20px";

  // Quote text input
  let textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";
  textInput.style.margin = "5px";

  // Category input
  let categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.

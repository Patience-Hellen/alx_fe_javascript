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

  // Clear the display area first
  let display = document.getElementById("quoteDisplay");
  display.innerHTML = "";

  // Create text node for the quote
  let quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  // Create category label
  let categoryLabel = document.createElement("small");
  categoryLabel.innerHTML = `<em>Category: ${quote.category}</em>`;

  // Append elements using appendChild
  display.appendChild(quoteText);
  display.appendChild(categoryLabel);
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
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.style.margin = "5px";

  // Add Quote button
  let addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  // Append inputs and button to container
  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addBtn);

  // Append the container to the body
  document.body.appendChild(formContainer);
}

// Function to add a new quote and update DOM
function addQuote() {
  let newText = document.getElementById("newQuoteText").value.trim();
  let newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please fill out both the quote and category fields.");
    return;
  }

  // Add new quote to the array
  quotes.push({ text: newText, category: newCategory });

  // Clear the input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Show the newly added quote immediately
  let display = document.getElementById("quoteDisplay");
  display.innerHTML = "";

  let quoteText = document.createElement("p");
  quoteText.textContent = `"${newText}"`;

  let categoryLabel = document.createElement("small");
  categoryLabel.innerHTML = `<em>Category: ${newCategory}</em>`;

  display.appendChild(quoteText);
  display.appendChild(categoryLabel);

  alert("Quote added successfully!");
}

// Event listener for Show New Quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Create the form dynamically on page load
createAddQuoteForm();

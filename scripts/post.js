const currentUser = getCurrentUser();

if (!currentUser) {
  window.location.href = "signup.html";
}

const isProvider = currentUser.role === "provider";


document.getElementById("page-title").textContent = isProvider
  ? "Post Waste You Have"
  : "Post What You Need";

document.getElementById("waste-type-label").textContent = isProvider
  ? "What kind of waste do you have?"
  : "What kind of waste do you need?";

document.getElementById("price-label").textContent = isProvider
  ? "Price (leave blank if free)"
  : "Budget (leave blank if none)";


const quarterSelect = document.getElementById("quarter");
QUARTERS.forEach(function (quarter) {
  const option = document.createElement("option");
  option.value = quarter;
  option.textContent = quarter;
  if (quarter === currentUser.quarter) {
    option.selected = true;
  }
  quarterSelect.appendChild(option);
});


const form = document.getElementById("post-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const wasteType = document.getElementById("waste-type").value;
  const quantityInput = document.querySelector('input[name="quantity"]:checked');
  const quarter = document.getElementById("quarter").value;
  const priceValue = document.getElementById("price").value;
  const price = priceValue ? Number(priceValue) : 0;

  if (!quantityInput) {
    alert("Please select a quantity.");
    return;
  }

  const listingType = isProvider ? "waste" : "need";

  createListing(currentUser.id, listingType, wasteType, quantityInput.value, quarter, price);

  window.location.href = "dashboard.html";
});
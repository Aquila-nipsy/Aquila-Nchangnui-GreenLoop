const quarterSelect = document.getElementById("quarter");
QUARTERS.forEach(function (quarter) {
  const option = document.createElement("option");
  option.value = quarter;
  option.textContent = quarter;
  quarterSelect.appendChild(option);
});

const params = new URLSearchParams(window.location.search);
const roleFromUrl = params.get("role");

if (roleFromUrl === "provider") {
  document.getElementById("role-provider").checked = true;
} else if (roleFromUrl === "farmer") {
  document.getElementById("role-farmer").checked = true;
}

const form = document.getElementById("signup-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const roleInput = document.querySelector('input[name="role"]:checked');
  const quarter = document.getElementById("quarter").value;
  const contact = document.getElementById("contact").value.trim();

  if (!roleInput) {
    alert("Please choose whether you are a waste provider or a farmer.");
    return;
  }

  createUser(name, roleInput.value, quarter, contact);
  window.location.href = "dashboard.html";
});
const currentUser = getCurrentUser();

if (!currentUser) {
  window.location.href = "signup.html";
}

const isProvider = currentUser.role === "provider";


document.getElementById("greeting").textContent = "Welcome, " + currentUser.name;

document.getElementById("my-listings-title").textContent = isProvider
  ? "My Waste Listings"
  : "My Requests";

const postBtn = document.getElementById("post-btn");
postBtn.textContent = isProvider ? "Post New Waste" : "Post New Request";
postBtn.addEventListener("click", function () {
  window.location.href = "post.html";
});

document.getElementById("logout-link").addEventListener("click", function (event) {
  event.preventDefault();
  localStorage.removeItem("greenloop_currentUser");
  window.location.href = "../index.html";
});


function buildCard(listing, showMatchInfo) {
  const card = document.createElement("div");
  card.className = "card status-" + listing.status;

  const info = document.createElement("div");
  info.className = "card-info";

  const title = document.createElement("p");
  title.className = "card-title";
  title.textContent = listing.wasteType + " — " + listing.quantity;
  info.appendChild(title);

  const details = document.createElement("p");
  details.textContent = listing.quarter + " · " + listing.status;
  info.appendChild(details);

  if (showMatchInfo && listing.matchedWith) {
    const matchedUser = getUserById(listing.matchedWith);
    if (matchedUser) {
      const matchLine = document.createElement("p");
      matchLine.textContent = "Matched with " + matchedUser.name + " (" + matchedUser.contact + ")";
      info.appendChild(matchLine);
    }
  }

  card.appendChild(info);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  if (listing.status === "matched") {
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Mark as Completed";
    completeBtn.addEventListener("click", function () {
      markListingStatus(listing.id, "completed");
      renderDashboard();
    });
    actions.appendChild(completeBtn);
  }

  if (listing.status === "available") {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      const remaining = getListings().filter(function (l) {
        return l.id !== listing.id;
      });
      saveListings(remaining);
      renderDashboard();
    });
    actions.appendChild(deleteBtn);
  }

  card.appendChild(actions);
  return card;
}

// ---- Render everything ----

function renderDashboard() {
  const myListings = getListingsByUser(currentUser.id);

  const myListingsContainer = document.getElementById("my-listings");
  myListingsContainer.innerHTML = "";
  if (myListings.length === 0) {
    myListingsContainer.innerHTML = '<p class="empty-state">You haven\'t posted anything yet.</p>';
  } else {
    myListings.forEach(function (listing) {
      myListingsContainer.appendChild(buildCard(listing, true));
    });
  }

  const matched = myListings.filter(function (listing) {
    return listing.status === "matched";
  });

  const matchedContainer = document.getElementById("matched-listings");
  matchedContainer.innerHTML = "";
  if (matched.length === 0) {
    matchedContainer.innerHTML = '<p class="empty-state">No matches yet.</p>';
  } else {
    matched.forEach(function (listing) {
      matchedContainer.appendChild(buildCard(listing, true));
    });
  }

  const stats = getImpactStats(currentUser.id);
  document.getElementById("completed-stat").textContent = stats.completedCount;
  document.getElementById("total-stat").textContent = stats.totalListings;
}

renderDashboard();
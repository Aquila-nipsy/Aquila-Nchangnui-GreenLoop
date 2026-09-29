const currentUser = getCurrentUser();
const allListings = getListings();
const allUsers = getUsers();


const completedListings = allListings.filter(function (listing) {
  return listing.status === "completed";
});

const activeListings = allListings.filter(function (listing) {
  return listing.status === "available";
});

document.getElementById("total-completed").textContent = completedListings.length;
document.getElementById("total-active").textContent = activeListings.length;
document.getElementById("total-users").textContent = allUsers.length;


const quarterCounts = {};
allListings.forEach(function (listing) {
  quarterCounts[listing.quarter] = (quarterCounts[listing.quarter] || 0) + 1;
});

const quarterEntries = Object.entries(quarterCounts).sort(function (a, b) {
  return b[1] - a[1];
});

const quarterContainer = document.getElementById("quarter-breakdown");

if (quarterEntries.length === 0) {
  quarterContainer.innerHTML = '<p class="empty-state">No listings yet.</p>';
} else {
  quarterContainer.innerHTML = "";
  quarterEntries.forEach(function (entry) {
    const row = document.createElement("div");
    row.className = "quarter-row";
    row.innerHTML = "<span>" + entry[0] + "</span><span>" + entry[1] + " listing(s)</span>";
    quarterContainer.appendChild(row);
  });
}


if (currentUser) {
  const stats = getImpactStats(currentUser.id);
  const summary = document.getElementById("personal-summary");

  if (stats.totalListings === 0) {
    summary.textContent = "You haven't posted anything yet.";
  } else {
    summary.textContent = "You've posted " + stats.totalListings +
      " listing(s), and completed " + stats.completedCount + " of them.";
  }
}
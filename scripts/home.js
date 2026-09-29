const listings = getListings();

const completedCount = listings.filter(function (listing) {
  return listing.status === "completed";
}).length;

const activeCount = listings.filter(function (listing) {
  return listing.status === "available";
}).length;

document.getElementById("completed-count").textContent = completedCount;
document.getElementById("active-count").textContent = activeCount;
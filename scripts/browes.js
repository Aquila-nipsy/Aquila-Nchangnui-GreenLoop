const currentUser = getCurrentUser();

if (!currentUser) {
  window.location.href = "signup.html";
}

const isProvider = currentUser.role === "provider";

document.getElementById("page-title").textContent = isProvider
  ? "Nearby Requests"
  : "Nearby Waste";


function getProximityLabel(listingQuarter) {
  if (listingQuarter === currentUser.quarter) {
    return { text: "Same quarter", className: "same" };
  }
  const nearby = NEARBY_QUARTERS[currentUser.quarter] || [];
  if (nearby.includes(listingQuarter)) {
    return { text: "Nearby", className: "nearby" };
  }
  return { text: "Other area", className: "" };
}


function buildBrowseCard(listing) {
  const card = document.createElement("div");
  card.className = "card";

  const top = document.createElement("div");
  top.className = "card-top";

  const info = document.createElement("div");
  info.className = "card-info";

  const title = document.createElement("p");
  title.className = "card-title";
  title.textContent = listing.wasteType + " — " + listing.quantity;
  info.appendChild(title);

  const priceLine = document.createElement("p");
  priceLine.textContent = listing.price > 0 ? listing.price + " FCFA" : "Free";
  info.appendChild(priceLine);

  top.appendChild(info);

  const proximity = getProximityLabel(listing.quarter);
  const tag = document.createElement("span");
  tag.className = "proximity-tag " + proximity.className;
  tag.textContent = proximity.text + " · " + listing.quarter;
  top.appendChild(tag);

  card.appendChild(top);

  const contactBtn = document.createElement("button");
  contactBtn.className = "contact-btn";
  contactBtn.textContent = "Contact";

  contactBtn.addEventListener("click", function () {
    const owner = getUserById(listing.userId);

    const contactInfo = document.createElement("div");
    contactInfo.className = "contact-info";
    contactInfo.textContent = "Reach out to " + owner.name + ": " + owner.contact;
    card.appendChild(contactInfo);

    markListingStatus(listing.id, "matched", currentUser.id);
    contactBtn.disabled = true;
    contactBtn.textContent = "Matched";
  });

  card.appendChild(contactBtn);
  return card;
}


function renderBrowse() {
  const listings = getBrowseListings(currentUser.role, currentUser.quarter);

  const container = document.getElementById("listings-container");
  container.innerHTML = "";

  if (listings.length === 0) {
    container.innerHTML = '<p class="empty-state">Nothing available right now, check back soon.</p>';
    return;
  }

  listings.forEach(function (listing) {
    container.appendChild(buildBrowseCard(listing));
  });
}

renderBrowse();
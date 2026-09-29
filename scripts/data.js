const QUARTERS = [
  "Nkwen",
  "Mankon",
  "Old Town",
  "Ntarikon",
  "Mile 4",
  "Bali",
  "Up Station",
  "Foncha Street"
];

const NEARBY_QUARTERS = {
  "Nkwen": ["Ntarikon", "Mile 4", "Up Station"],
  "Mankon": ["Old Town", "Foncha Street"],
  "Old Town": ["Mankon", "Foncha Street", "Bali"],
  "Ntarikon": ["Nkwen", "Up Station"],
  "Mile 4": ["Nkwen", "Up Station"],
  "Bali": ["Old Town", "Foncha Street"],
  "Up Station": ["Nkwen", "Ntarikon", "Mile 4"],
  "Foncha Street": ["Mankon", "Old Town", "Bali"]
};


function getUsers() {
  const stored = localStorage.getItem("greenloop_users");
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
  localStorage.setItem("greenloop_users", JSON.stringify(users));
}

function createUser(name, role, quarter, contact) {
  const users = getUsers();
  const newUser = {
    id: Date.now().toString(),
    name: name,
    role: role,
    quarter: quarter,
    contact: contact
  };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  return newUser;
}

function getCurrentUser() {
  const stored = localStorage.getItem("greenloop_currentUser");
  return stored ? JSON.parse(stored) : null;
}

function setCurrentUser(user) {
  localStorage.setItem("greenloop_currentUser", JSON.stringify(user));
}
function getUserById(userId) {
  return getUsers().find(function (user) {
    return user.id === userId;
  });
}


function getListings() {
  const stored = localStorage.getItem("greenloop_listings");
  return stored ? JSON.parse(stored) : [];
}

function saveListings(listings) {
  localStorage.setItem("greenloop_listings", JSON.stringify(listings));
}

function createListing(userId, type, wasteType, quantity, quarter, price) {
  const listings = getListings();
  const newListing = {
    id: Date.now().toString(),
    userId: userId,
    type: type,          
    wasteType: wasteType,
    quantity: quantity,   
    quarter: quarter,
    price: price,        
    status: "available", 
    matchedWith: null,
    datePosted: new Date().toISOString()
  };
  listings.push(newListing);
  saveListings(listings);
  return newListing;
}

function getListingsByUser(userId) {
  return getListings().filter(function (listing) {
    return listing.userId === userId;
  });
}


function getBrowseListings(currentUserRole, currentUserQuarter) {
  const wantedType = currentUserRole === "farmer" ? "waste" : "need";
  const listings = getListings().filter(function (listing) {
    return listing.type === wantedType && listing.status === "available";
  });

  function proximityRank(listingQuarter) {
    if (listingQuarter === currentUserQuarter) return 0;
    const nearby = NEARBY_QUARTERS[currentUserQuarter] || [];
    if (nearby.includes(listingQuarter)) return 1;
    return 2;
  }

  listings.sort(function (a, b) {
    return proximityRank(a.quarter) - proximityRank(b.quarter);
  });

  return listings;
}

function markListingStatus(listingId, status, matchedWithUserId) {
  const listings = getListings();
  const listing = listings.find(function (l) {
    return l.id === listingId;
  });
  if (listing) {
    listing.status = status;
    if (matchedWithUserId !== undefined) {
      listing.matchedWith = matchedWithUserId;
    }
    saveListings(listings);
  }
}


function getImpactStats(userId) {
  const myListings = getListingsByUser(userId);
  const completed = myListings.filter(function (l) {
    return l.status === "completed";
  });
  return {
    totalListings: myListings.length,
    completedCount: completed.length
  };
}
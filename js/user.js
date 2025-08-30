// user.js
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { collection, getDocs, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

let map;
let userLocation = { lat: 17.385044, lng: 78.486671 }; // fallback: Hyderabad

// ✅ Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// ✅ Initialize Google Map
window.initMap = async function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: userLocation,
    zoom: 12,
  });

  // Try to get real user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        map.setCenter(userLocation);

        // Show user marker
        new google.maps.Marker({
          position: userLocation,
          map,
          title: "You are here",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        loadBunks();
      },
      () => {
        loadBunks(); // fallback if denied
      }
    );
  } else {
    loadBunks();
  }
};

// ✅ Load bunks from Firestore
async function loadBunks() {
  const bunkList = document.getElementById("bunkList");
  bunkList.innerHTML = "";
  const snapshot = await getDocs(collection(db, "bunks"));

  snapshot.forEach((docSnap) => {
    const bunk = docSnap.data();
    const bunkId = docSnap.id;

    let distanceText = "";
    if (bunk.lat && bunk.lng) {
      const distance = getDistance(userLocation.lat, userLocation.lng, bunk.lat, bunk.lng);
      distanceText = `<br>📍 Distance: ${distance.toFixed(2)} km`;
      
      // Place marker
      new google.maps.Marker({
        position: { lat: bunk.lat, lng: bunk.lng },
        map,
        title: bunk.name,
      });
    }

    // Show in list
    const div = document.createElement("div");
    div.innerHTML = `
      <p><b>${bunk.name}</b> - ${bunk.address}<br>
      Slots: ${bunk.availableSlots}/${bunk.totalSlots}
      ${distanceText}<br>
      <button onclick="bookSlot('${bunkId}')">Book Slot</button></p>
    `;
    bunkList.appendChild(div);
  });
}

// ✅ Haversine formula (to calculate km distance between 2 coords)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ✅ Book a slot (atomic update)
window.bookSlot = async function (bunkId) {
  const bunkRef = doc(db, "bunks", bunkId);
  const bunkDoc = await getDoc(bunkRef);

  if (bunkDoc.exists()) {
    const bunk = bunkDoc.data();
    if (bunk.availableSlots > 0) {
      await updateDoc(bunkRef, {
        availableSlots: increment(-1),
      });
      alert("✅ Slot booked!");
      loadBunks();
    } else {
      alert("❌ No slots available!");
    }
  }
};

// ✅ Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

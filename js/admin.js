// js/admin.js
import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// ✅ Check if admin is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// ✅ Add new bunk
document.getElementById("addBunkForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("bunkName").value;
  const address = document.getElementById("bunkAddress").value;
  const phone = document.getElementById("bunkPhone").value;
  const totalSlots = parseInt(document.getElementById("totalSlots").value);

  try {
    // 🔹 Default coordinates for testing (Hyderabad)
    const lat = 17.385044;
    const lng = 78.486671;

    // 🔹 Save bunk to Firestore
    await addDoc(collection(db, "bunks"), {
      name,
      address,
      phone,
      totalSlots,
      availableSlots: totalSlots,
      lat,
      lng
    });

    document.getElementById("adminMessage").innerText = "✅ Bunk added with default location!";
    document.getElementById("addBunkForm").reset();

  } catch (err) {
    document.getElementById("adminMessage").innerText = "❌ " + err.message;
  }
});

// ✅ Logout
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

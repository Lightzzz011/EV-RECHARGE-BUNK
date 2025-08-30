// js/logger.js

/**
 * Logs an action performed in the system
 * @param {string} userId - Firebase UID of the user performing the action
 * @param {string} action - Action performed (e.g., "LOGIN", "BOOK_SLOT")
 * @param {string} details - Extra info about the action
 */
async function logAction(userId, action, details = "") {
  const timestamp = new Date().toISOString();

  // Console log (for developers)
  console.log(`[${timestamp}] USER: ${userId} | ACTION: ${action} | DETAILS: ${details}`);

  try {
    // Store in Firestore "logs" collection
    await db.collection("logs").add({
      userId,
      action,
      details,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (err) {
    console.error("❌ Logging failed:", err);
  }
}

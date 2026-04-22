const admin = require("../firebase");
const { getDistance } = require("../utils/distance");

const db = admin.firestore();

// Get guardians
const getGuardiansByUserId = async (userId) => {
  const snap = await db.collection("guardians")
    .where("userId", "==", userId)
    .get();

  return snap.docs.map(doc => doc.data());
};

// Get all users then filter by distance
const getNearbyUsers = async (lat, lng, radiusKm) => {
  const snap = await db.collection("users").get();

  const users = snap.docs.map(doc => ({
    userId: doc.id,
    ...doc.data(),
  }));

  return users.filter(u => {
    if (!u.location) return false;

    const dist = getDistance(
      lat,
      lng,
      u.location.lat,
      u.location.lng
    );

    return dist <= radiusKm;
  });
};

module.exports = {
  getGuardiansByUserId,
  getNearbyUsers,
};
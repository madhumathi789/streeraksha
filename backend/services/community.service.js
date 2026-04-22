const admin = require("../firebase");
const Guardian = require("../models/Guardian");

const sendCommunityAlerts = async (lat, lng, userId) => {
  const users = await Guardian.find({ fcmToken: { $exists: true } });

  const tokens = users
    .filter(u => u.userId !== userId)
    .map(u => u.fcmToken);

  if (!tokens.length) return { count: 0 };

  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: {
      title: "🚨 Community SOS Alert",
      body: "Someone nearby needs help",
    },
    data: {
      type: "SOS",
      lat: String(lat),
      lng: String(lng),
    },
  });

  return { count: response.successCount };
};

module.exports = { sendCommunityAlerts };
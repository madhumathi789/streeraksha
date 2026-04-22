const admin = require("../firebase");

const sendFCMToUsers = async (users) => {
  const tokens = users
    .map(u => u.fcmToken)
    .filter(Boolean);

  if (tokens.length === 0) {
    return { count: 0 };
  }

  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: {
      title: "🚨 Community SOS Alert",
      body: "Someone nearby needs help",
    },
  });

  return {
    count: response.successCount,
  };
};

module.exports = { sendFCMToUsers };
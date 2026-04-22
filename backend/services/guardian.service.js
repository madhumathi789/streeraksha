const { getGuardiansByUserId } = require("./firebase.service");
const { sendSMS } = require("./twilio.service");

const sendGuardianAlerts = async (userId, locationLink) => {
  const guardians = await getGuardiansByUserId(userId);

  if (!guardians.length) return { count: 0 };

  const messages = guardians.map(g =>
    sendSMS(
      g.phone,
      `🚨 SOS Alert!\nYour family member needs help.\nLocation: ${locationLink}`
    )
  );

  await Promise.all(messages);

  return { count: guardians.length };
};

module.exports = { sendGuardianAlerts };
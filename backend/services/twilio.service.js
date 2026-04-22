const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const Guardian = require("../models/Guardian");

const sendGuardianAlerts = async (userId, locationLink) => {
  const guardians = await Guardian.find({ userId });

  const results = await Promise.all(
    guardians.map(async (g) => {
      try {
        await client.messages.create({
          body: `🚨 SOS ALERT 🚨\nLocation: ${locationLink}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: g.phone,
        });

        return { phone: g.phone, status: "sent" };
      } catch (err) {
        return { phone: g.phone, status: "failed" };
      }
    })
  );

  return { count: guardians.length, results };
};

module.exports = { sendGuardianAlerts };
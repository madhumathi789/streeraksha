const { sendGuardianAlerts } = require("../services/guardian.service");
const { sendCommunityAlerts } = require("../services/community.service");

const triggerSOS = async (req, res) => {
  const { lat, lng, userId } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Location required" });
  }

  const locationLink = `https://maps.google.com/?q=${lat},${lng}`;

  try {
    const guardianResult = await sendGuardianAlerts(userId, locationLink);
    const communityResult = await sendCommunityAlerts(lat, lng, userId);

    res.json({
      success: true,
      guardiansNotified: guardianResult.count,
      communityNotified: communityResult.count,
    });

  } catch (err) {
    res.status(500).json({ message: "SOS failed" });
  }
};

module.exports = { triggerSOS };
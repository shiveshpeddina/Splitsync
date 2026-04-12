const express = require("express");
const router = express.Router();
const inviteService = require("../services/invite.service");

// POST /api/invite/send
router.post("/send", async (req, res, next) => {
  try {
    const { phone, groupId, inviterId, groupName } = req.body;
    if (!phone || !inviterId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await inviteService.inviteMember(phone, groupId, inviterId, groupName);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/invite/:token
router.get("/:token", (req, res) => {
  // Real app logic would verify token and add current user to group
  res.send("Join via link endpoint (stub)");
});

module.exports = router;

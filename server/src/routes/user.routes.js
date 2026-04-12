const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authMiddleware } = require("../middleware/auth.middleware");

// PUT /api/users/profile
router.put("/profile", authMiddleware, async (req, res, next) => {
  try {
    const { name, phone, homeCurrency, autoSMSReminders } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (homeCurrency !== undefined) updateData.homeCurrency = homeCurrency;
    if (autoSMSReminders !== undefined) updateData.autoSMSReminders = autoSMSReminders;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// GET /api/users/search?q=
router.get("/search", async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { isGhost: false },
          {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } }
            ]
          }
        ]
      },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

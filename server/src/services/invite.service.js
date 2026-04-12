const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const admin = require("firebase-admin");
const crypto = require("crypto");

// Dummy twilio setup (only if you have keys)
// const twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

async function sendFCMNotification(token, payload) {
  if (!token) return;
  try {
    // Only works if admin.initializeApp() is called elsewhere in your server
    if (admin.apps.length > 0) {
      await admin.messaging().send({
        token,
        notification: payload
      });
    }
  } catch (err) {
    console.error("FCM Send Error:", err);
  }
}

function generateInviteLink(groupId) {
  // Real app logic might involve signed tokens. Here we just return a frontend route.
  // E.g., https://splitwave.app/join/{token}
  const token = crypto.randomUUID();
  // Here we'd store the token mapping to the group if needed, but for simplicity:
  return `http://localhost:5173/join/${groupId}?t=${token}`;
}

function buildWhatsAppUrl(phone, link, groupName, inviterName) {
  const message = `Hey! ${inviterName} added you to '${groupName}' on SplitWave. Join here to see your expenses: ${link}`;
  return `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(message)}`;
}

async function addToGroup(userId, groupId) {
  try {
    const existing = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId, groupId } }
    });
    if (!existing) {
      await prisma.groupMember.create({
        data: { userId, groupId, role: "member" }
      });
    }
  } catch(err) {
    console.warn("User already in group or error:", err);
  }
}

async function inviteMember(phone, groupId, inviterId, groupName) {
  const inviter = await prisma.user.findUnique({ where: { id: inviterId } });
  
  // Step 1: Check if user exists
  const existing = await prisma.user.findFirst({
    where: { phone }
  });

  if (existing) {
    if (groupId) {
      await addToGroup(existing.id, groupId);
      if (existing.fcmToken) {
        await sendFCMNotification(existing.fcmToken, {
          title: "You've been added to a group!",
          body: `${inviter?.name || "Someone"} added you to '${groupName}' on SplitWave`
        });
      }
    }
    return { method: "direct", success: true, user: existing };
  }

  // Step 2 & 3: create ghost member + invite link
  // Use phone as a placeholder name and a fake email since email is @unique and required
  const fakeEmail = `ghost_${Date.now()}_${Math.random().toString(36).substring(7)}@ghost.com`;
  
  const ghost = await prisma.user.create({
    data: {
      name: `User ${phone}`,
      email: fakeEmail,
      phone,
      isGhost: true
    }
  });

  if (groupId) {
    await addToGroup(ghost.id, groupId);
    const inviteLink = generateInviteLink(groupId);
    const whatsappUrl = buildWhatsAppUrl(phone, inviteLink, groupName, inviter?.name || "Someone");
    
    if (inviter && inviter.autoSMSReminders) console.log(`[SMS] Paid invite sent to ${phone}`);
    return { method: "whatsapp_deeplink", whatsappUrl, inviteLink, success: true, user: ghost };
  } else {
    // Just a friend connection
    const inviteLink = "https://splitwave.app/join";
    const message = `Hey! ${inviter?.name || "I"} added you on SplitWave to split expenses. Download the app here: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(message)}`;
    
    if (inviter && inviter.autoSMSReminders) console.log(`[SMS] Paid invite sent to ${phone}`);
    return { method: "whatsapp_deeplink", whatsappUrl, inviteLink, success: true, user: ghost };
  }
}

module.exports = {
  inviteMember,
  buildWhatsAppUrl,
  generateInviteLink,
  sendFCMNotification
};

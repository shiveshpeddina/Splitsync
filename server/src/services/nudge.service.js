const prisma = require('../prisma');
const { CustomError } = require('../middleware/errorHandler');

exports.sendNudge = async (reqUserId, toUserId, groupId, tone) => {
  // Verify both users are in the same group (if a groupId is provided)
  if (groupId) {
    const groupUser = await prisma.groupMember.findFirst({
      where: { groupId, userId: reqUserId }
    });
    
    if (!groupUser) {
      throw new CustomError('Not authorized for this group', 403);
    }
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: toUserId }
  });

  if (!targetUser) {
    throw new CustomError('Target user not found', 404);
  }

  // MOCK: Generate the payload that would be sent to FCM
  console.log(`[FCM Nudge Mock] Sending pushing notification to User: ${targetUser.name} (${targetUser.id}). Tone: ${tone}`);

  // In a real world scenario using firebase-admin:
  // if (targetUser.fcmToken) {
  //   await admin.messaging().send({
  //     token: targetUser.fcmToken,
  //     notification: {
  //       title: "SplitWave Reminder",
  //       body: `You received a ${tone} nudge.`
  //     }
  //   });
  // }
  
  return { success: true, tone, target: targetUser.name };
};

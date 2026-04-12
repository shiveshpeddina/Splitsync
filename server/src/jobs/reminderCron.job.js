const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const { sendFCMNotification } = require("../services/invite.service");

const prisma = new PrismaClient();

// Run daily at 9:00 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Running Daily Reminder Cron Job...");

  // Find users who have splits not yet settled
  const pendingSplits = await prisma.split.findMany({
    where: { 
      settled: false,
      amount: { gt: 0 } 
    },
    include: {
      user: true, // Person who owes
      expense: {
        include: { payer: true, group: true } // Need payer to know who they owe
      }
    }
  });

  const remindersSent = new Set();

  for (const split of pendingSplits) {
    const debtor = split.user;
    const creditor = split.expense.payer;
    const group = split.expense.group;

    // Prevent sending too many to same user
    const reminderKey = `${debtor.id}-${creditor.id}-${group.id}`;
    if (remindersSent.has(reminderKey)) continue;

    // 1. FREE: In-App User with Push notification
    if (!debtor.isGhost && debtor.fcmToken) {
      await sendFCMNotification(debtor.fcmToken, {
        title: `You owe ${creditor.name} ${split.expense.currency} ${split.amount}`,
        body: `Settle up in '${group.name}' on SplitWave`
      });
      remindersSent.add(reminderKey);

      // Log last reminder
      await prisma.split.update({
        where: { id: split.id },
        data: { lastReminderAt: new Date() }
      });
    } 
    // 2. PAID: Opt-in SMS via Twilio/MSG91 (for Ghost users or users without app installed)
    else if (creditor.autoSMSReminders && debtor.phone) {
      // Stub for actual SMS Integration (Twilio/MSG91)
      console.log(`[SMS COST] Sending Paid Reminder SMS to Ghost ${debtor.phone} on behalf of ${creditor.name}`);
      
      remindersSent.add(reminderKey);
      
      await prisma.split.update({
        where: { id: split.id },
        data: { lastReminderAt: new Date() }
      });
    }
  }
});

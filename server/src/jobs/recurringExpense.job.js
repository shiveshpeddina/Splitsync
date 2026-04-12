const cron = require('node-cron');
const prisma = require('../prisma');

// Run every day at Midnight
cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Running Daily Recurring Expenses Job...');
    try {
        const today = new Date().getDate(); // 1-31
        
        // Find all expenses marked as recurring where recurringDay is today
        const dueExpenses = await prisma.expense.findMany({
            where: {
                isRecurring: true,
                recurringDay: today
            },
            include: {
                splits: true
            }
        });

        if (dueExpenses.length === 0) {
            console.log('[CRON] No recurring expenses due today.');
            return;
        }

        console.log(`[CRON] Found ${dueExpenses.length} recurring expenses to log.`);

        for (const exp of dueExpenses) {
            // Log the new occurrence
            const newExpense = await prisma.expense.create({
                data: {
                    groupId: exp.groupId,
                    description: `${exp.description} (Auto-log)`,
                    amount: exp.amount,
                    currency: exp.currency,
                    amountInBase: exp.amountInBase,
                    vibeTag: exp.vibeTag,
                    payerId: exp.payerId,
                    splitType: exp.splitType,
                    isRecurring: false, // The clone is NOT the master recurring record
                    splits: {
                        create: exp.splits.map(s => ({
                            userId: s.userId,
                            amount: s.amount,
                            percentage: s.percentage,
                            settled: false
                        }))
                    }
                }
            });
            console.log(`[CRON] Success auto-logged expense: ${newExpense.id} from master ${exp.id}`);
        }

    } catch (err) {
        console.error('[CRON] Error running recurring expenses job:', err);
    }
});

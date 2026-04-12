const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');
  
  const user1 = await prisma.user.upsert({
    where: { email: 'you@example.com' },
    update: {},
    create: {
      email: 'you@example.com',
      name: 'Demo User',
      homeCurrency: 'INR'
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'lina@example.com' },
    update: {},
    create: {
      email: 'lina@example.com',
      name: 'Lina Punk',
      homeCurrency: 'INR'
    }
  });

  const group = await prisma.group.create({
    data: {
      name: 'Goa Trip 2026',
      emoji: '🏖️',
      baseCurrency: 'INR',
      members: {
        create: [
          { userId: user1.id, role: 'admin' },
          { userId: user2.id, role: 'member' }
        ]
      }
    }
  });

  const expense = await prisma.expense.create({
    data: {
      groupId: group.id,
      description: 'Coffee',
      amount: 1453,
      currency: 'INR',
      amountInBase: 1453,
      vibeTag: 'food',
      payerId: user1.id,
      splitType: 'equal',
      splits: {
        create: [
          { userId: user1.id, amount: 726.5 },
          { userId: user2.id, amount: 726.5 }
        ]
      }
    }
  });

  console.log('Seeding complete!', { user1Id: user1.id, groupId: group.id });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

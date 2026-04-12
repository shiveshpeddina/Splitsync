const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const loginOrCreateUser = async ({ email, name, phone, fcmToken, homeCurrency }) => {
  const user = await prisma.user.upsert({
    where: { email },
    update: fcmToken ? { fcmToken } : {},
    create: { email, name, phone, fcmToken, homeCurrency: homeCurrency || 'INR' }
  });
  return user;
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id } });
}

module.exports = { loginOrCreateUser, getUserById };

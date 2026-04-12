const { PrismaClient } = require('@prisma/client');

// Use a singleton pattern for PrismaClient
const prisma = new PrismaClient();

module.exports = prisma;

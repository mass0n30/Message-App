// initiates Prisma client
// conditional for testing or production database usage from scripts in package.json

const { PrismaClient } = require("../generated/prisma/client");


const databaseUrl = process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

module.exports = prisma;

import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';
import { validateEnv } from '../../config/env.validation.js';
import { createPrismaAdapter } from '../prisma.service.js';
import { profileData } from './profile.data.js';
import { syncProfile } from './sync-profile.js';

const logger = new Logger('Seed');

async function main(): Promise<void> {
  const { DATABASE_URL } = validateEnv(process.env);
  const prisma = new PrismaClient({ adapter: createPrismaAdapter(DATABASE_URL) });

  try {
    const counts = await syncProfile(prisma, profileData);
    logger.log(`Profile "${profileData.name}" is in sync: ${JSON.stringify(counts)}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  logger.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

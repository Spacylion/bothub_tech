import { PrismaClient } from '@prisma/client';
import * as process from 'node:process';

const prisma = new PrismaClient();

async function main() {
  const aiModels = [
    { name: 'GPT-3.5', tokenCost: 10 },
    { name: 'Mistral', tokenCost: 20 },
    { name: 'GPT-4', tokenCost: 30 },
  ];

  for (const model of aiModels) {
    await prisma.aiModel.upsert({
      where: { name: model.name },
      update: {},
      create: model,
    });
  }

  console.log('AI Models seeded:', aiModels);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
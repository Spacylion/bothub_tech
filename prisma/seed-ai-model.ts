import { PrismaClient } from '@prisma/client';
import * as process from 'node:process';
import { Model } from '../src/shared/enums';

const prisma = new PrismaClient();

async function main() {
  const aiModels = [
    { name: Model.GPT_3_5_TURBO, tokenCost: 10 },
    { name: Model.GPT_4O_MINI, tokenCost: 15 },
    { name: Model.O1_PREVIEW, tokenCost: 20 },
    { name: Model.O1_MINI, tokenCost: 25 },
    { name: Model.GPT_4_TURBO, tokenCost: 30 },
    { name: Model.GPT_4, tokenCost: 35 },
    { name: Model.GPT_3_5_TURBO, tokenCost: 40 },
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
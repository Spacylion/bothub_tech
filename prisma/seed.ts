import { PrismaClient } from '@prisma/client';
import { Plan } from '../src/shared/enums';
import * as process from 'node:process';

const prisma = new PrismaClient();

async function main() {
  const freePlan = await prisma.plan.upsert({
    where: { name: Plan.FREE },
    update: {},
    create: {
      name: Plan.FREE,
      tokenCost: 0,
      creditCost: 0,
    },
  });

  const gptV3Plan = await prisma.plan.upsert({
    where: { name: Plan.GPT_3_5 },
    update: {},
    create: {
      name: Plan.GPT_3_5,
      tokenCost: 100,
      creditCost: 10.0,
    },
  });

  const mistralPlan = await prisma.plan.upsert({
    where: { name: Plan.MISTRAL },
    update: {},
    create: {
      name: Plan.MISTRAL,
      tokenCost: 100,
      creditCost: 10.0,
    },
  });

  console.log({ freePlan, gptV3Plan, mistralPlan });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
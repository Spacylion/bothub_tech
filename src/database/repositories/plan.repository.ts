import { PrismaService } from '../prisma.service';
import { Plan } from '../../shared/enums';

export class PlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPlan(name: string, tokenCost: number, creditCost: number) {
    return this.prisma.plan.create({
      data: { name, tokenCost, creditCost },
    });
  }

  async findPlanById(id: number) {
    return this.prisma.plan.findUnique({
      where: { id },
    });
  }

  async updatePlan(id: number, data: Partial<Plan>) {
    return this.prisma.plan.update({
      where: { id },
      data,
    });
  }

  async deletePlan(id: number) {
    return this.prisma.plan.delete({
      where: { id },
    });
  }

  async getAllPlans() {
    return this.prisma.plan.findMany();
  }
}
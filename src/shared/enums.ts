export enum Plan {
  FREE = 'free',
  GPT_3_5 = 'gpt-3.5',
  GPT_4 = 'gpt-4',
  MISTRAL = 'mistral',
}

export const PlanCosts = {
  [Plan.FREE]: 0,
  [Plan.GPT_3_5]: 20,
  [Plan.MISTRAL]: 30,
  [Plan.GPT_4]: 40,
};

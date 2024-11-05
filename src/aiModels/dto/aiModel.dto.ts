export class AiModelDTO {
  name: string;
  tokenCost: number;

  constructor(name: string, tokenCost: number) {
    this.name = name;
    this.tokenCost = tokenCost;
  }
}

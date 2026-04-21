import { IAIProvider, IPromptBuilder } from './interfaces';
import { ProviderConfig } from '../types';

export abstract class BaseAIProvider implements IAIProvider {
  protected readonly apiKey: string;
  protected readonly apiBase: string;
  protected readonly model: string;
  protected readonly promptBuilder: IPromptBuilder;

  constructor(config: ProviderConfig, promptBuilder: IPromptBuilder) {
    this.apiKey = config.apiKey || '';
    this.apiBase = config.apiBase || '';
    this.model = config.model || '';
    this.promptBuilder = promptBuilder;
  }

  async generateCode(prompt: string): Promise<string> {
    if (!this.isConfigValid()) {
      throw new Error(`API Key for ${this.getName()} is not configured`);
    }
    const raw = await this.doGenerate(prompt);
    return this.cleanMarkdownCodeBlocks(raw);
  }

  isConfigValid(): boolean {
    return Boolean(this.apiKey);
  }

  abstract getName(): string;

  protected abstract doGenerate(prompt: string): Promise<string>;

  protected cleanMarkdownCodeBlocks(text: string): string {
    const codeBlockMatch = text.match(/```(?:bash|sh|powershell|ps1)?\s*\n([\s\S]*?)\n\s*```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }
    return text
      .replace(/```(?:bash|sh|powershell|ps1)?\s*/g, '')
      .replace(/```/g, '')
      .trim();
  }
}

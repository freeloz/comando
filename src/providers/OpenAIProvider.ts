import { OpenAI } from 'openai';
import { BaseAIProvider } from '../core/BaseAIProvider';
import { IPromptBuilder } from '../core/interfaces';
import { ProviderConfig } from '../types';

export class OpenAIProvider extends BaseAIProvider {
  private readonly client: OpenAI;

  constructor(config: ProviderConfig, promptBuilder: IPromptBuilder) {
    super(
      { ...config, apiBase: config.apiBase || 'https://api.openai.com/v1', model: config.model || 'gpt-4o-mini' },
      promptBuilder,
    );
    this.client = new OpenAI({ apiKey: this.apiKey, baseURL: this.apiBase });
  }

  getName(): string {
    return 'OpenAI';
  }

  protected async doGenerate(prompt: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: this.promptBuilder.buildSystemPrompt() },
        { role: 'user', content: this.promptBuilder.buildPrompt(prompt) },
      ],
      max_tokens: 1000,
      temperature: 0,
    });
    return completion.choices[0]?.message?.content?.trim() || '';
  }
}

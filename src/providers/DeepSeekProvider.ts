import { OpenAI } from 'openai';
import { BaseAIProvider } from '../core/BaseAIProvider';
import { IPromptBuilder } from '../core/interfaces';
import { ProviderConfig } from '../types';

export class DeepSeekProvider extends BaseAIProvider {
  private readonly client: OpenAI;

  constructor(config: ProviderConfig, promptBuilder: IPromptBuilder) {
    super(
      { ...config, apiBase: config.apiBase || 'https://api.deepseek.com', model: config.model || 'deepseek-chat' },
      promptBuilder,
    );
    this.client = new OpenAI({ apiKey: this.apiKey, baseURL: this.apiBase });
  }

  getName(): string {
    return 'DeepSeek';
  }

  protected async doGenerate(prompt: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: this.promptBuilder.buildSystemPrompt() },
        { role: 'user', content: this.promptBuilder.buildPrompt(prompt) },
      ],
    });
    return completion.choices[0]?.message?.content?.trim() || '';
  }
}

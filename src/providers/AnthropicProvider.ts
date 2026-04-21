import axios from 'axios';
import { BaseAIProvider } from '../core/BaseAIProvider';
import { IPromptBuilder } from '../core/interfaces';
import { ProviderConfig } from '../types';

export class AnthropicProvider extends BaseAIProvider {
  constructor(config: ProviderConfig, promptBuilder: IPromptBuilder) {
    super(
      { ...config, apiBase: config.apiBase || 'https://api.anthropic.com', model: config.model || 'claude-sonnet-4-6' },
      promptBuilder,
    );
  }

  getName(): string {
    return 'Anthropic Claude';
  }

  protected async doGenerate(prompt: string): Promise<string> {
    const response = await axios.post(
      `${this.apiBase}/v1/messages`,
      {
        model: this.model,
        max_tokens: 1024,
        system: this.promptBuilder.buildSystemPrompt(),
        messages: [
          { role: 'user', content: this.promptBuilder.buildPrompt(prompt) },
        ],
      },
      {
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
      },
    );

    const content = response.data.content;
    if (Array.isArray(content) && content.length > 0) {
      return content[0].text?.trim() || '';
    }
    return '';
  }
}

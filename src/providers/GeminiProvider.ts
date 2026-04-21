import axios from 'axios';
import { BaseAIProvider } from '../core/BaseAIProvider';
import { IPromptBuilder } from '../core/interfaces';
import { ProviderConfig } from '../types';

export class GeminiProvider extends BaseAIProvider {
  constructor(config: ProviderConfig, promptBuilder: IPromptBuilder) {
    super(
      { ...config, apiBase: config.apiBase || 'https://generativelanguage.googleapis.com', model: config.model || 'gemini-2.5-flash' },
      promptBuilder,
    );
  }

  getName(): string {
    return 'Google Gemini';
  }

  protected async doGenerate(prompt: string): Promise<string> {
    const response = await axios.post(
      `${this.apiBase}/v1beta/models/${this.model}:generateContent`,
      {
        contents: [{ parts: [{ text: this.promptBuilder.buildPrompt(prompt) }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey,
        },
      },
    );

    return response.data.candidates[0]?.content?.parts[0]?.text?.trim() || '';
  }
}

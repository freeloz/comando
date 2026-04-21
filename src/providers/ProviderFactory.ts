import { IAIProvider, IPromptBuilder } from '../core/interfaces';
import { ProviderConfig, ProviderType } from '../types';
import { OpenAIProvider } from './OpenAIProvider';
import { AnthropicProvider } from './AnthropicProvider';
import { DeepSeekProvider } from './DeepSeekProvider';
import { GeminiProvider } from './GeminiProvider';

type ProviderConstructor = new (config: ProviderConfig, promptBuilder: IPromptBuilder) => IAIProvider;

export class ProviderFactory {
  private readonly registry = new Map<ProviderType, ProviderConstructor>();
  private readonly promptBuilder: IPromptBuilder;

  constructor(promptBuilder: IPromptBuilder) {
    this.promptBuilder = promptBuilder;
    this.register('openai', OpenAIProvider);
    this.register('anthropic', AnthropicProvider);
    this.register('deepseek', DeepSeekProvider);
    this.register('gemini', GeminiProvider);
  }

  register(type: ProviderType, ctor: ProviderConstructor): void {
    this.registry.set(type, ctor);
  }

  create(type: ProviderType, config: ProviderConfig): IAIProvider {
    const Ctor = this.registry.get(type);
    if (!Ctor) {
      throw new Error(`AI provider not supported: ${type}`);
    }
    return new Ctor(config, this.promptBuilder);
  }

  getSupportedProviders(): ProviderType[] {
    return Array.from(this.registry.keys());
  }
}

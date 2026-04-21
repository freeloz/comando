import { describe, it, expect } from 'vitest';
import { ProviderFactory } from '../../src/providers/ProviderFactory';
import { PromptBuilder } from '../../src/core/PromptBuilder';

describe('ProviderFactory', () => {
  const promptBuilder = new PromptBuilder();

  it('creates all built-in providers', () => {
    const factory = new ProviderFactory(promptBuilder);
    const config = { apiKey: 'test-key' };

    const openai = factory.create('openai', config);
    expect(openai.getName()).toBe('OpenAI');

    const anthropic = factory.create('anthropic', config);
    expect(anthropic.getName()).toBe('Anthropic Claude');

    const deepseek = factory.create('deepseek', config);
    expect(deepseek.getName()).toBe('DeepSeek');

    const gemini = factory.create('gemini', config);
    expect(gemini.getName()).toBe('Google Gemini');
  });

  it('throws for unsupported provider', () => {
    const factory = new ProviderFactory(promptBuilder);
    expect(() => factory.create('nonexistent' as any, {})).toThrow('AI provider not supported');
  });

  it('returns supported providers list', () => {
    const factory = new ProviderFactory(promptBuilder);
    const providers = factory.getSupportedProviders();
    expect(providers).toContain('openai');
    expect(providers).toContain('anthropic');
    expect(providers).toContain('deepseek');
    expect(providers).toContain('gemini');
  });

  it('isConfigValid returns false without API key', () => {
    const factory = new ProviderFactory(promptBuilder);
    const provider = factory.create('openai', {});
    expect(provider.isConfigValid()).toBe(false);
  });

  it('isConfigValid returns true with API key', () => {
    const factory = new ProviderFactory(promptBuilder);
    const provider = factory.create('openai', { apiKey: 'sk-test' });
    expect(provider.isConfigValid()).toBe(true);
  });
});

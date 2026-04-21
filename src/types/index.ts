export type ProviderType = 'openai' | 'anthropic' | 'deepseek' | 'gemini';

export interface ProviderConfig {
  apiKey?: string;
  apiBase?: string;
  model?: string;
}

export interface AppConfig {
  defaultProvider: ProviderType;
  language?: string;
  providers: Record<ProviderType, ProviderConfig>;
}

export type OSType = 'macos' | 'linux' | 'windows';

export type ShellType = 'bash' | 'powershell' | 'sh';

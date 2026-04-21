import { AppConfig } from '../types';

export interface IAIProvider {
  generateCode(prompt: string): Promise<string>;
  isConfigValid(): boolean;
  getName(): string;
}

export interface IConfigManager {
  loadConfig(): AppConfig;
  saveConfig(config: AppConfig): boolean;
  writeToHistory(code: string): void;
}

export interface IPromptBuilder {
  buildPrompt(userPrompt: string): string;
  buildSystemPrompt(): string;
}

export interface ICodeExecutor {
  execute(code: string): Promise<void>;
}

export interface IFormatter {
  highlightCode(code: string): void;
  showError(message: string): void;
  showWarning(message: string): void;
  showSuccess(message: string): void;
}

export interface II18n {
  t(key: string, ...args: unknown[]): string;
}

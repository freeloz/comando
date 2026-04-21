import fs from 'fs';
import path from 'path';
import os from 'os';
import { IConfigManager } from '../core/interfaces';
import { AppConfig, ProviderType } from '../types';

const DEFAULT_CONFIG: AppConfig = {
  defaultProvider: 'gemini',
  providers: {
    openai: {
      apiBase: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
    },
    anthropic: {
      apiBase: 'https://api.anthropic.com',
      model: 'claude-sonnet-4-20250514',
    },
    deepseek: {
      apiBase: 'https://api.deepseek.com',
      model: 'deepseek-chat',
    },
    gemini: {
      apiBase: 'https://generativelanguage.googleapis.com',
      model: 'gemini-2.5-flash',
    },
  },
};

const ENV_MAP: Record<ProviderType, { key: string; base: string; model: string }> = {
  openai: {
    key: 'OPENAI_API_KEY',
    base: 'OPENAI_API_BASE',
    model: 'OPENAI_MODEL',
  },
  anthropic: {
    key: 'ANTHROPIC_API_KEY',
    base: 'ANTHROPIC_API_BASE',
    model: 'ANTHROPIC_MODEL',
  },
  deepseek: {
    key: 'DEEPSEEK_API_KEY',
    base: 'DEEPSEEK_API_BASE',
    model: 'DEEPSEEK_MODEL',
  },
  gemini: {
    key: 'GEMINI_API_KEY',
    base: 'GEMINI_API_BASE',
    model: 'GEMINI_MODEL',
  },
};

export class ConfigManager implements IConfigManager {
  private readonly configPath: string;
  private readonly historyPath: string;

  constructor(configDir?: string) {
    const dir = configDir || path.join(os.homedir(), '.comando');
    this.configPath = path.join(dir, 'config.json');
    this.historyPath = path.join(dir, 'history');
    this.ensureDirectoryExists(dir);
  }

  loadConfig(): AppConfig {
    const fileConfig = this.readConfigFile();
    const config = this.deepCopy(DEFAULT_CONFIG);

    // File config overrides defaults
    if (fileConfig.defaultProvider) {
      config.defaultProvider = fileConfig.defaultProvider;
    }
    if (fileConfig.language) {
      config.language = fileConfig.language;
    }

    // Merge provider configs from file
    if (fileConfig.providers) {
      for (const key of Object.keys(fileConfig.providers) as ProviderType[]) {
        if (config.providers[key] && fileConfig.providers[key]) {
          config.providers[key] = { ...config.providers[key], ...fileConfig.providers[key] };
        }
      }
    }

    // Env vars override everything (highest precedence)
    if (process.env.AI_PROVIDER) {
      config.defaultProvider = process.env.AI_PROVIDER as ProviderType;
    }

    for (const [provider, envKeys] of Object.entries(ENV_MAP)) {
      const p = provider as ProviderType;
      if (process.env[envKeys.key]) {
        config.providers[p].apiKey = process.env[envKeys.key];
      }
      if (process.env[envKeys.base]) {
        config.providers[p].apiBase = process.env[envKeys.base];
      }
      if (process.env[envKeys.model]) {
        config.providers[p].model = process.env[envKeys.model];
      }
    }

    return config;
  }

  saveConfig(config: AppConfig): boolean {
    try {
      const toSave = {
        defaultProvider: config.defaultProvider,
        language: config.language,
        providers: config.providers,
      };
      fs.writeFileSync(this.configPath, JSON.stringify(toSave, null, 2));
      return true;
    } catch {
      return false;
    }
  }

  writeToHistory(code: string): void {
    try {
      this.ensureDirectoryExists(path.dirname(this.historyPath));
      fs.appendFileSync(this.historyPath, `${new Date().toISOString()}: ${code}\n\n`);
    } catch {
      // Silently ignore history write failures
    }
  }

  private readConfigFile(): Partial<AppConfig> {
    try {
      if (fs.existsSync(this.configPath)) {
        return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      }
    } catch {
      // Ignore corrupt config files
    }
    return {};
  }

  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}

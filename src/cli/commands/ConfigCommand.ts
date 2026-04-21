import inquirer from 'inquirer';
import { IConfigManager, IFormatter, II18n } from '../../core/interfaces';
import { ProviderType, AppConfig } from '../../types';
import { ProviderFactory } from '../../providers/ProviderFactory';

export class ConfigCommand {
  constructor(
    private readonly configManager: IConfigManager,
    private readonly formatter: IFormatter,
    private readonly i18n: II18n,
    private readonly providerFactory: ProviderFactory,
  ) {}

  async execute(): Promise<void> {
    const currentConfig = this.configManager.loadConfig();
    const providers = this.providerFactory.getSupportedProviders();

    const answers = await inquirer.prompt<{ language: string; defaultProvider: ProviderType; apiKey: string }>([
      {
        type: 'list',
        name: 'language',
        message: this.i18n.t('config.selectLanguage'),
        choices: ['en', 'es'],
        default: currentConfig.language || 'en',
      },
      {
        type: 'list',
        name: 'defaultProvider',
        message: this.i18n.t('config.selectProvider'),
        choices: providers,
        default: currentConfig.defaultProvider,
      },
      {
        type: 'input',
        name: 'apiKey',
        message: (answers: { defaultProvider: ProviderType }) =>
          this.i18n.t('config.apiKeyPrompt', this.getProviderLabel(answers.defaultProvider)),
        default: (answers: { defaultProvider: ProviderType }) =>
          currentConfig.providers[answers.defaultProvider]?.apiKey || '',
      },
    ]);

    const newConfig: AppConfig = {
      ...currentConfig,
      defaultProvider: answers.defaultProvider,
      language: answers.language,
    };

    newConfig.providers[answers.defaultProvider as ProviderType] = {
      ...newConfig.providers[answers.defaultProvider as ProviderType],
      apiKey: answers.apiKey,
    };

    if (this.configManager.saveConfig(newConfig)) {
      this.formatter.showSuccess(this.i18n.t('config.saved'));
    } else {
      this.formatter.showError(this.i18n.t('config.saveError'));
    }
  }

  private getProviderLabel(type: ProviderType): string {
    const labels: Record<ProviderType, string> = {
      openai: 'OpenAI',
      anthropic: 'Anthropic',
      deepseek: 'DeepSeek',
      gemini: 'Google Gemini',
    };
    return labels[type] || type;
  }
}

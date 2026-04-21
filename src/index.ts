process.env.NODE_ENV = 'production';

import { ConfigManager } from './config/ConfigManager';
import { Formatter } from './utils/Formatter';
import { I18nManager } from './i18n';
import { PromptBuilder } from './core/PromptBuilder';
import { CodeExecutor } from './core/CodeExecutor';
import { ProviderFactory } from './providers/ProviderFactory';
import { CLI } from './cli/CLI';

process.on('uncaughtException', (error: Error) => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});

async function main(): Promise<void> {
  const configManager = new ConfigManager();
  const config = configManager.loadConfig();
  const i18n = new I18nManager(config.language);
  const formatter = new Formatter();
  const promptBuilder = new PromptBuilder();
  const executor = new CodeExecutor();
  const providerFactory = new ProviderFactory(promptBuilder);

  const cli = new CLI(configManager, formatter, i18n, executor, providerFactory);
  await cli.run(process.argv);
}

main().catch((error: Error) => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});

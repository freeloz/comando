import { program } from 'commander';
import chalk from 'chalk';
import { IConfigManager, ICodeExecutor, IFormatter, II18n } from '../core/interfaces';
import { ProviderFactory } from '../providers/ProviderFactory';
import { ProviderType } from '../types';
import { ConfigCommand } from './commands/ConfigCommand';
import { GenerateCommand } from './commands/GenerateCommand';

declare const PKG_VERSION: string;

export class CLI {
  private readonly configCommand: ConfigCommand;
  private readonly generateCommand: GenerateCommand;

  constructor(
    private readonly configManager: IConfigManager,
    private readonly formatter: IFormatter,
    private readonly i18n: II18n,
    private readonly executor: ICodeExecutor,
    private readonly providerFactory: ProviderFactory,
  ) {
    this.configCommand = new ConfigCommand(configManager, formatter, i18n, providerFactory);
    this.generateCommand = new GenerateCommand(executor, configManager, formatter, i18n);
  }

  async run(argv: string[]): Promise<void> {
    let promptArgs: string[] = [];

    program
      .version(PKG_VERSION)
      .description(this.i18n.t('cli.description'))
      .argument('[prompt...]', this.i18n.t('cli.promptArgument'))
      .option('-y, --force', this.i18n.t('cli.forceOption'))
      .option('-p, --provider <provider>', this.i18n.t('cli.providerOption'))
      .option('-c, --config', this.i18n.t('cli.configOption'))
      .action((args: string[]) => {
        promptArgs = args;
      })
      .parse(argv);

    const options = program.opts<{ force?: boolean; provider?: string; config?: boolean }>();

    if (options.config) {
      await this.configCommand.execute();
      return;
    }

    if (promptArgs.length === 0) {
      this.showUsage();
      return;
    }

    const prompt = promptArgs.join(' ');
    const config = this.configManager.loadConfig();
    const providerType = (options.provider || config.defaultProvider) as ProviderType;

    const providerConfig = config.providers[providerType];
    if (!providerConfig) {
      this.formatter.showError(this.i18n.t('error.providerNotSupported', providerType));
      process.exit(1);
    }

    const provider = this.providerFactory.create(providerType, providerConfig);

    if (!provider.isConfigValid()) {
      this.formatter.showError(this.i18n.t('error.apiKeyMissing', provider.getName()));
      process.exit(1);
    }

    await this.generateCommand.execute(provider, prompt, options.force || false);
  }

  private showUsage(): void {
    console.log(chalk.yellow(this.i18n.t('cli.noPrompt')));
    console.log(this.i18n.t('cli.basicUsage'));
    console.log(chalk.green(this.i18n.t('cli.usageExample')));
    console.log(this.i18n.t('cli.availableOptions'));
    console.log(chalk.cyan(this.i18n.t('cli.optForce')));
    console.log(chalk.cyan(this.i18n.t('cli.optProvider')));
    console.log(chalk.cyan(this.i18n.t('cli.optConfig')));
    console.log(chalk.cyan(this.i18n.t('cli.optHelp')));
    console.log(chalk.cyan(this.i18n.t('cli.optVersion')));
    console.log(this.i18n.t('cli.examples'));
    console.log(chalk.green(this.i18n.t('cli.example1')));
    console.log(chalk.green(this.i18n.t('cli.example2')));
    console.log(chalk.green(this.i18n.t('cli.example3')));
  }
}

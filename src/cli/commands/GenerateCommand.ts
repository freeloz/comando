import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { IAIProvider, ICodeExecutor, IConfigManager, IFormatter, II18n } from '../../core/interfaces';

export class GenerateCommand {
  constructor(
    private readonly executor: ICodeExecutor,
    private readonly configManager: IConfigManager,
    private readonly formatter: IFormatter,
    private readonly i18n: II18n,
  ) {}

  async execute(provider: IAIProvider, prompt: string, force: boolean): Promise<void> {
    const spinner = ora(this.i18n.t('generate.spinning', provider.getName())).start();

    try {
      const code = await provider.generateCode(prompt);
      spinner.succeed(chalk.green(this.i18n.t('generate.success', provider.getName())));

      this.formatter.highlightCode(code);

      let shouldRun = force;
      if (!shouldRun) {
        const answer = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'execute',
            message: chalk.gray(this.i18n.t('generate.confirm')),
            default: true,
            prefix: '',
          },
        ]);
        shouldRun = answer.execute;
      }

      if (shouldRun) {
        this.configManager.writeToHistory(code);
        const execSpinner = ora(this.i18n.t('generate.executing')).start();
        try {
          await this.executor.execute(code);
          execSpinner.succeed(chalk.green(this.i18n.t('generate.executed')));
        } catch (error) {
          execSpinner.fail(chalk.red(this.i18n.t('generate.error')));
          throw error;
        }
      }
    } catch (error) {
      spinner.fail(chalk.red(`Error: ${(error as Error).message}`));
      process.exit(1);
    }
  }
}

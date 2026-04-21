import chalk from 'chalk';
import { IFormatter } from '../core/interfaces';

export class Formatter implements IFormatter {
  highlightCode(code: string): void {
    const lines = code.split('\n');
    for (const line of lines) {
      if (line.trim() === '#!/bin/bash' || line.trim() === '#!/usr/bin/env bash') {
        continue;
      }
      const formatted = line
        .replace(/^([\w\-.]+)(\s|$)/g, chalk.green('$1$2'))
        .replace(/"([^"]*)"/g, chalk.yellow('"$1"'))
        .replace(/'([^']*)'/g, chalk.yellow("'$1'"));
      console.log(formatted);
    }
  }

  showError(message: string): void {
    console.error(chalk.red(`Error: ${message}`));
  }

  showWarning(message: string): void {
    console.warn(chalk.yellow(`Warning: ${message}`));
  }

  showSuccess(message: string): void {
    console.log(chalk.green(message));
  }
}

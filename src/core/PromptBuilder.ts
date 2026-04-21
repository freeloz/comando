import { IPromptBuilder } from './interfaces';
import { getOSHint, getShellType } from '../utils/platform';

export class PromptBuilder implements IPromptBuilder {
  buildPrompt(userPrompt: string): string {
    const osHint = getOSHint();
    const shell = getShellType();

    if (shell === 'powershell') {
      return `${userPrompt}${osHint}. Generate ONLY PowerShell code that is SAFE and does NOT cause irreparable damage to the system. Do not include additional explanations. Only show the PowerShell code to execute. Keep it minimal, one or two lines if possible. Do not include comments.`;
    }

    return `${userPrompt}${osHint}. Generate ONLY bash code that is SAFE and does NOT cause irreparable damage to the system. Do not include additional explanations. Only show the bash code to execute. Keep it minimal, one or two lines if possible. Do not include comments.`;
  }

  buildSystemPrompt(): string {
    const shell = getShellType();
    if (shell === 'powershell') {
      return 'You are an assistant that generates precise and functional PowerShell scripts.';
    }
    return 'You are an assistant that generates precise and functional shell scripts.';
  }
}

import { spawn } from 'child_process';
import { ICodeExecutor } from './interfaces';
import { getShellType } from '../utils/platform';

export class CodeExecutor implements ICodeExecutor {
  execute(code: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const shell = getShellType();
      let child;

      if (shell === 'powershell') {
        child = spawn('powershell', ['-NoProfile', '-Command', code], {
          stdio: ['inherit', 'pipe', 'pipe'],
        });
      } else {
        child = spawn('bash', ['-c', code], {
          stdio: ['inherit', 'pipe', 'pipe'],
        });
      }

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      child.on('close', (exitCode: number | null) => {
        if (exitCode === 0) {
          if (stdout) {
            console.log(stdout);
          }
          resolve();
        } else {
          if (stderr) {
            console.error(stderr);
          }
          reject(new Error(`Exit code: ${exitCode}`));
        }
      });
    });
  }
}

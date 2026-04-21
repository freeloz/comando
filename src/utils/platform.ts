import { OSType, ShellType } from '../types';

export function getOSType(): OSType {
  switch (process.platform) {
    case 'darwin':
      return 'macos';
    case 'win32':
      return 'windows';
    default:
      return 'linux';
  }
}

export function getShellType(): ShellType {
  if (getOSType() === 'windows') {
    return 'powershell';
  }
  return 'bash';
}

export function getOSHint(): string {
  switch (getOSType()) {
    case 'macos':
      return ' (on macOS)';
    case 'windows':
      return ' (on Windows, using PowerShell)';
    case 'linux':
      return ' (on Linux)';
  }
}

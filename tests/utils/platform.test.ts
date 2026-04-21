import { describe, it, expect } from 'vitest';
import { getOSType, getShellType, getOSHint } from '../../src/utils/platform';

describe('platform utilities', () => {
  it('getOSType returns a valid OS type', () => {
    const os = getOSType();
    expect(['macos', 'linux', 'windows']).toContain(os);
  });

  it('getShellType returns bash or powershell', () => {
    const shell = getShellType();
    expect(['bash', 'powershell', 'sh']).toContain(shell);
  });

  it('getOSHint returns a non-empty string', () => {
    const hint = getOSHint();
    expect(hint.length).toBeGreaterThan(0);
    expect(hint).toContain('on ');
  });
});

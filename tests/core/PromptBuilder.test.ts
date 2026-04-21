import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PromptBuilder } from '../../src/core/PromptBuilder';
import * as platform from '../../src/utils/platform';

describe('PromptBuilder', () => {
  let builder: PromptBuilder;

  beforeEach(() => {
    builder = new PromptBuilder();
  });

  it('should include OS hint for macOS', () => {
    vi.spyOn(platform, 'getOSHint').mockReturnValue(' (on macOS)');
    vi.spyOn(platform, 'getShellType').mockReturnValue('bash');
    const result = builder.buildPrompt('list files');
    expect(result).toContain('list files');
    expect(result).toContain('(on macOS)');
    expect(result).toContain('bash');
  });

  it('should include OS hint for Linux', () => {
    vi.spyOn(platform, 'getOSHint').mockReturnValue(' (on Linux)');
    vi.spyOn(platform, 'getShellType').mockReturnValue('bash');
    const result = builder.buildPrompt('find processes');
    expect(result).toContain('(on Linux)');
    expect(result).toContain('bash');
  });

  it('should generate PowerShell prompt for Windows', () => {
    vi.spyOn(platform, 'getOSHint').mockReturnValue(' (on Windows, using PowerShell)');
    vi.spyOn(platform, 'getShellType').mockReturnValue('powershell');
    const result = builder.buildPrompt('list files');
    expect(result).toContain('PowerShell');
    expect(result).not.toContain('bash');
  });

  it('should generate correct system prompt for bash', () => {
    vi.spyOn(platform, 'getShellType').mockReturnValue('bash');
    const result = builder.buildSystemPrompt();
    expect(result).toContain('shell scripts');
  });

  it('should generate correct system prompt for PowerShell', () => {
    vi.spyOn(platform, 'getShellType').mockReturnValue('powershell');
    const result = builder.buildSystemPrompt();
    expect(result).toContain('PowerShell');
  });
});

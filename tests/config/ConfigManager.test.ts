import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { ConfigManager } from '../../src/config/ConfigManager';

describe('ConfigManager', () => {
  let tmpDir: string;
  let manager: ConfigManager;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'comando-test-'));
    manager = new ConfigManager(tmpDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('loadConfig returns defaults when no config file exists', () => {
    const config = manager.loadConfig();
    expect(config.defaultProvider).toBe('gemini');
    expect(config.providers.openai.model).toBe('gpt-4o-mini');
    expect(config.providers.anthropic.model).toBe('claude-sonnet-4-20250514');
    expect(config.providers.gemini.model).toBe('gemini-2.5-flash');
  });

  it('saveConfig and loadConfig round-trip', () => {
    const config = manager.loadConfig();
    config.defaultProvider = 'openai';
    config.providers.openai.apiKey = 'sk-test-123';
    expect(manager.saveConfig(config)).toBe(true);

    const loaded = manager.loadConfig();
    expect(loaded.defaultProvider).toBe('openai');
    expect(loaded.providers.openai.apiKey).toBe('sk-test-123');
  });

  it('env vars take highest precedence', () => {
    process.env.OPENAI_API_KEY = 'env-key-test';
    process.env.AI_PROVIDER = 'openai';

    const config = manager.loadConfig();
    expect(config.defaultProvider).toBe('openai');
    expect(config.providers.openai.apiKey).toBe('env-key-test');

    delete process.env.OPENAI_API_KEY;
    delete process.env.AI_PROVIDER;
  });

  it('file config overrides defaults but not env vars', () => {
    const config = manager.loadConfig();
    config.providers.gemini.apiKey = 'file-key';
    manager.saveConfig(config);

    process.env.GEMINI_API_KEY = 'env-key';
    const loaded = manager.loadConfig();
    expect(loaded.providers.gemini.apiKey).toBe('env-key');
    delete process.env.GEMINI_API_KEY;

    const loaded2 = manager.loadConfig();
    expect(loaded2.providers.gemini.apiKey).toBe('file-key');
  });

  it('writeToHistory appends to history file', () => {
    manager.writeToHistory('echo hello');
    manager.writeToHistory('ls -la');

    const historyPath = path.join(tmpDir, 'history');
    const content = fs.readFileSync(historyPath, 'utf8');
    expect(content).toContain('echo hello');
    expect(content).toContain('ls -la');
  });

  it('saveConfig saves language preference', () => {
    const config = manager.loadConfig();
    config.language = 'es';
    manager.saveConfig(config);

    const loaded = manager.loadConfig();
    expect(loaded.language).toBe('es');
  });
});

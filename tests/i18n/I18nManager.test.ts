import { describe, it, expect } from 'vitest';
import { I18nManager } from '../../src/i18n';

describe('I18nManager', () => {
  it('returns English translations by default', () => {
    const i18n = new I18nManager('en');
    expect(i18n.t('config.saved')).toBe('Configuration saved successfully.');
  });

  it('returns Spanish translations', () => {
    const i18n = new I18nManager('es');
    expect(i18n.t('config.saved')).toBe('Configuración guardada correctamente.');
  });

  it('interpolates arguments', () => {
    const i18n = new I18nManager('en');
    const result = i18n.t('generate.spinning', 'OpenAI');
    expect(result).toBe('Generating command with OpenAI...');
  });

  it('falls back to English for unknown locale', () => {
    const i18n = new I18nManager('fr');
    expect(i18n.t('config.saved')).toBe('Configuration saved successfully.');
  });

  it('returns key when translation is missing', () => {
    const i18n = new I18nManager('en');
    expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('setLocale changes active locale', () => {
    const i18n = new I18nManager('en');
    expect(i18n.t('config.saved')).toBe('Configuration saved successfully.');
    i18n.setLocale('es');
    expect(i18n.t('config.saved')).toBe('Configuración guardada correctamente.');
  });

  it('getLocale returns current locale', () => {
    const i18n = new I18nManager('es');
    expect(i18n.getLocale()).toBe('es');
  });
});

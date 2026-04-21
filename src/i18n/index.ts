import { II18n } from '../core/interfaces';

type TranslationMap = Record<string, string>;

const locales: Record<string, TranslationMap> = {
  en: {
    'cli.description': 'Generate shell scripts from the command line',
    'cli.promptArgument': 'Description of the command to execute',
    'cli.forceOption': 'Execute the generated program without confirmation',
    'cli.providerOption': 'Specify AI provider to use (openai, anthropic, deepseek, gemini)',
    'cli.configOption': 'Configure CLI settings',
    'cli.langOption': 'Set language (en, es)',
    'cli.noPrompt': '⚠️  You must provide a prompt to generate a command.',
    'cli.basicUsage': '\nBasic usage:',
    'cli.usageExample': '  comando "find all files containing text"',
    'cli.availableOptions': '\nAvailable options:',
    'cli.optForce': '  -y, --force      Execute the generated command without confirmation',
    'cli.optProvider': '  -p, --provider   Specify AI provider (openai, anthropic, deepseek, gemini)',
    'cli.optConfig': '  -c, --config     Configure application settings',
    'cli.optHelp': '  -h, --help       Show this help',
    'cli.optVersion': '  -V, --version    Show version',
    'cli.examples': '\nExamples:',
    'cli.example1': '  comando "list files sorted by size"',
    'cli.example2': '  comando --provider gemini "find processes using most memory"',
    'cli.example3': '  comando --force "create a backup of this directory"',
    'generate.spinning': 'Generating command with {0}...',
    'generate.success': 'Code generated with {0}!',
    'generate.confirm': '>> Execute the generated program?',
    'generate.executing': 'Executing...',
    'generate.executed': 'Command executed successfully',
    'generate.error': 'The program generated an error.',
    'error.apiKeyMissing': 'Provider {0} requires an API key. Please configure with \'comando --config\'.',
    'error.providerNotSupported': 'AI provider not supported: {0}',
    'config.selectProvider': 'Select the default AI provider:',
    'config.apiKeyPrompt': '{0} API Key:',
    'config.saved': 'Configuration saved successfully.',
    'config.saveError': 'Error saving configuration.',
    'config.selectLanguage': 'Select language:',
  },
  es: {
    'cli.description': 'Genera scripts de shell desde la línea de comandos',
    'cli.promptArgument': 'Descripción del comando a ejecutar',
    'cli.forceOption': 'Ejecutar el programa generado sin pedir confirmación',
    'cli.providerOption': 'Especificar proveedor de IA a utilizar (openai, anthropic, deepseek, gemini)',
    'cli.configOption': 'Configurar los ajustes del CLI',
    'cli.langOption': 'Establecer idioma (en, es)',
    'cli.noPrompt': '⚠️  Debe proporcionar un prompt para generar un comando.',
    'cli.basicUsage': '\nUso básico:',
    'cli.usageExample': '  comando "buscar todos los archivos que contienen texto"',
    'cli.availableOptions': '\nOpciones disponibles:',
    'cli.optForce': '  -y, --force      Ejecutar el comando generado sin pedir confirmación',
    'cli.optProvider': '  -p, --provider   Especificar el proveedor de IA (openai, anthropic, deepseek, gemini)',
    'cli.optConfig': '  -c, --config     Configurar los ajustes de la aplicación',
    'cli.optHelp': '  -h, --help       Mostrar esta ayuda',
    'cli.optVersion': '  -V, --version    Mostrar la versión',
    'cli.examples': '\nEjemplos:',
    'cli.example1': '  comando "listar archivos ordenados por tamaño"',
    'cli.example2': '  comando --provider gemini "encontrar procesos que consumen más memoria"',
    'cli.example3': '  comando --force "crear un backup de este directorio"',
    'generate.spinning': 'Generando comando con {0}...',
    'generate.success': '¡Código generado con {0}!',
    'generate.confirm': '>> ¿Ejecutar el programa generado?',
    'generate.executing': 'Ejecutando...',
    'generate.executed': 'Comando ejecutado correctamente',
    'generate.error': 'El programa ha generado un error.',
    'error.apiKeyMissing': 'El proveedor {0} requiere una API key. Por favor, configura la CLI con \'comando --config\'.',
    'error.providerNotSupported': 'Proveedor de IA no soportado: {0}',
    'config.selectProvider': 'Selecciona el proveedor de IA predeterminado:',
    'config.apiKeyPrompt': 'API Key de {0}:',
    'config.saved': 'Configuración guardada correctamente.',
    'config.saveError': 'Error al guardar la configuración.',
    'config.selectLanguage': 'Selecciona el idioma:',
  },
};

export class I18nManager implements II18n {
  private locale: string;

  constructor(locale?: string) {
    this.locale = locale || this.detectLocale();
  }

  t(key: string, ...args: unknown[]): string {
    const translations = locales[this.locale] || locales['en'];
    let text = translations[key] || locales['en'][key] || key;
    for (let i = 0; i < args.length; i++) {
      text = text.replace(`{${i}}`, String(args[i]));
    }
    return text;
  }

  getLocale(): string {
    return this.locale;
  }

  setLocale(locale: string): void {
    if (locales[locale]) {
      this.locale = locale;
    }
  }

  private detectLocale(): string {
    const lang =
      process.env.LANG ||
      process.env.LC_ALL ||
      process.env.LANGUAGE ||
      '';
    if (lang.startsWith('es')) {
      return 'es';
    }
    return 'en';
  }
}

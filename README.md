# Comando

A CLI tool that generates shell scripts from natural language descriptions using AI.

Supports **macOS**, **Linux** (Ubuntu, Alpine, AWS Linux, etc.) and **Windows** (PowerShell).

## Installation

```bash
npm install -g @freeloz/comando
```

Or install directly from GitHub:

```bash
npm install -g github:freeloz/comando
```

## Usage

`comando` can use different AI models to generate commands. By default, it uses [Gemini 2.5 Flash](https://gemini.google.com/).

### Configuration

Configure the tool interactively:

```bash
comando --config
```

This lets you select your preferred AI provider, language (English/Spanish), and configure API keys.

You can also configure API keys via environment variables:

```bash
export GEMINI_API_KEY='your-key-here'    # Google Gemini (default)
export OPENAI_API_KEY='sk-...'           # OpenAI
export ANTHROPIC_API_KEY='sk-ant-...'    # Anthropic Claude
export DEEPSEEK_API_KEY='sk-...'         # DeepSeek
```

### Basic Commands

```bash
# Generate and execute a shell command
comando "show me how to create a file called hello.txt with the text Hello world"

# Use a specific AI provider
comando --provider anthropic "list all files in this directory"

# Execute without confirmation
comando --force "show current date"
```

### Help

```
$ comando --help
Usage: comando [options] [prompt...]

Generate shell scripts from the command line

Arguments:
  prompt                     Description of the command to execute

Options:
  -V, --version              output the version number
  -y, --force                Execute the generated command without confirmation
  -p, --provider <provider>  Specify AI provider (openai, anthropic, deepseek, gemini)
  -c, --config               Configure CLI settings
  -h, --help                 display help for command
```

## Supported Providers

| Provider | Default Model | Environment Variable |
|----------|--------------|---------------------|
| Google Gemini | gemini-2.5-flash | `GEMINI_API_KEY` |
| OpenAI | gpt-5.4-mini | `OPENAI_API_KEY` |
| Anthropic | claude-sonnet-4-6 | `ANTHROPIC_API_KEY` |
| DeepSeek | deepseek-chat | `DEEPSEEK_API_KEY` |

## Cross-Platform

- **macOS / Linux**: Generates `bash` scripts
- **Windows**: Generates `PowerShell` scripts
- OS is auto-detected and included in the AI prompt for better results

## Development

Requires Node.js >= 18.

```bash
npm install          # Install dependencies
npm run build        # Build with tsup
npm run dev          # Build in watch mode
npm test             # Run tests with Vitest
npm run typecheck    # Type check without emitting
```

## Project Structure

```
src/
├── index.ts                 # Composition Root (DI)
├── types/index.ts           # Shared types
├── core/
│   ├── interfaces.ts        # Contracts (ISP)
│   ├── BaseAIProvider.ts    # Abstract base (OCP, LSP)
│   ├── PromptBuilder.ts     # Prompt construction (SRP)
│   └── CodeExecutor.ts      # Code execution (SRP)
├── cli/
│   ├── CLI.ts               # Main orchestrator (SRP, DIP)
│   └── commands/
│       ├── ConfigCommand.ts
│       └── GenerateCommand.ts
├── config/ConfigManager.ts  # Configuration (SRP)
├── providers/
│   ├── ProviderFactory.ts   # Dynamic registry (OCP)
│   ├── OpenAIProvider.ts
│   ├── AnthropicProvider.ts
│   ├── DeepSeekProvider.ts
│   └── GeminiProvider.ts
├── i18n/index.ts            # i18n (en/es)
└── utils/
    ├── Formatter.ts
    └── platform.ts
```

## License

MIT — see [LICENSE](LICENSE).

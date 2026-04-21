# Changelog

All notable changes to this project will be documented in this file.

## [1.0.4] - 2026-04-20

### Fixed
- OpenAI provider: use `max_completion_tokens` instead of deprecated `max_tokens` for GPT-5.4 compatibility
- Gemini provider: add `generationConfig` and system prompt for reliable responses
- CLI version now reads dynamically from `package.json` via build-time injection

## [1.0.3] - 2026-04-19

### Changed
- Upgrade default models to latest versions:
  - OpenAI: `gpt-5.4-mini`
  - Anthropic: `claude-sonnet-4-6`
  - Gemini: `gemini-3-flash-preview`
  - DeepSeek: `deepseek-chat` (V3.2)

### Fixed
- CI: use classic automation token for npm publish (OTP bypass)
- CI: opt into Node.js 24 for GitHub Actions runners

## [1.0.2] - 2026-04-19

### Added
- GitHub Actions CI workflow (3 OS × 3 Node versions)
- Automated release workflow (tag-triggered publish to npm + GitHub Packages + GitHub Release)

### Fixed
- Add repository field to `package.json`
- Update repo references to freeloz org

## [1.0.0] - 2026-04-19

### Added
- Full TypeScript migration with strict mode
- SOLID architecture (interfaces, dependency injection, factory pattern)
- Internationalization (i18n) support (English + Spanish)
- 4 AI providers: OpenAI, Anthropic, Gemini, DeepSeek
- Interactive code execution with confirmation prompt
- Provider configuration via `comando -c`
- Cross-platform support (macOS, Linux, Windows)
- 26 unit tests with Vitest
- tsup build system with CJS output

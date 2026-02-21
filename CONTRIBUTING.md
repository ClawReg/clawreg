# Contributing to ClawReg

First off, thank you for considering contributing to ClawReg! It's people like you that make ClawReg such a great tool for the AI agent community.

## 🌈 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We expect all contributors to be respectful and collaborative.

## 🚀 How Can I Contribute?

### Reporting Bugs
- Use the **GitHub Issue Tracker**.
- Describe the bug in detail and provide a minimal reproduction if possible.
- Include your environment details (Node.js version, OS).

### Suggesting Enhancements
- Open a **Feature Request** on GitHub.
- Explain *why* this feature would be useful and how it should work.

### Pull Requests
1. **Fork the repo** and create your branch from `main`.
2. **Install dependencies**: `npm install`.
3. **Make your changes**. If you've added code that should be tested, add tests.
4. **Ensure the test suite passes**: `npm test`.
5. **Lint your code**: `npm run lint`.
6. **Submit a Pull Request** with a clear description of what you've done.

## 🛠️ Development Setup

ClawReg is built with **TypeScript** and uses **tsup** for building.

```bash
# Clone the repository
git clone https://github.com/ClawReg/clawreg.git
cd clawreg

# Install dependencies
npm install

# Start development mode (watch)
npm run dev

# Build the project
npm run build
```

## 📐 Project Structure

- `src/`: Core source code.
  - `providers/`: Platform adapters (WhatsApp, Discord, etc.).
  - `agents/`: AI logic and orchestrators.
  - `router/`: Message steering engine.
  - `tools/`: Atomic capabilities.
- `skills/`: Standardized plugin system.
- `assets/`: Branding and static files.

## 📜 Coding Style

- Use **TypeScript** for everything.
- Follow the existing formatting (we use Prettier).
- Provide descriptive variable and function names.
- Document complex logic with JSDoc comments.

## 🦞 Becoming a Maintainer

Active contributors who consistently provide high-quality PRs and helpful feedback on issues may be invited to join the core maintenance team.

Thank you for being part of the **ClawReg** ecosystem! 🎮👾🚀

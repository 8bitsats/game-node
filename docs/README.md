# Game Node SDK Documentation

Welcome to the Game Node SDK documentation. This SDK provides powerful tools for building AI agents with advanced capabilities.

## Table of Contents

- [Getting Started](getting-started.md)
- [Core Concepts](core-concepts.md)
- [Integrations](integrations/README.md)
  - [DeepSeek](integrations/deepseek.md)
  - [BirdEye](integrations/birdeye.md)
  - [Voice Commands](integrations/voice.md)
- [Examples](examples/README.md)
  - [Telegram Bot](examples/telegram.md)
  - [Twitter Bot](examples/twitter.md)
- [API Reference](api-reference/README.md)
  - [GameClient](api-reference/game-client.md)
  - [DeepSeekClient](api-reference/deepseek-client.md)
  - [BirdEyeClient](api-reference/birdeye-client.md)

## Overview

The Game Node SDK is designed to help developers create sophisticated AI agents that can:

- Generate, explain, and improve code using DeepSeek
- Analyze and track tokens using BirdEye
- Process voice commands using OpenAI Whisper
- Handle complex task execution
- Manage state and environment variables

### Key Features

#### Core Functionality
- Agent Creation and Management
- Worker Function Definition
- Task Execution Pipeline
- Environment and State Management

#### Advanced Integrations
- DeepSeek for code-related tasks
- BirdEye for token analysis
- Voice command processing

### Architecture

The SDK follows a modular architecture:

```
Game Node SDK
├── Core
│   ├── GameClient
│   ├── Workers
│   └── Functions
├── Integrations
│   ├── DeepSeekClient
│   ├── BirdEyeClient
│   └── Voice Commands
└── Examples
    ├── Telegram Bot
    └── Twitter Bot
```

### Getting Started

See our [Getting Started](getting-started.md) guide to begin building with the SDK.

### Examples

We provide several example implementations to help you understand how to use the SDK:

- [Telegram Bot](examples/telegram.md): Demonstrates image generation and messaging
- [Twitter Bot](examples/twitter.md): Shows tweet search and reply functionality

### Contributing

We welcome contributions! Please see our [Contributing Guide](contributing.md) for details.

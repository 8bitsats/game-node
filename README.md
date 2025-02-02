# Game Node SDK

A powerful SDK for building AI agents with advanced capabilities including code generation, token analysis, and voice commands.

## Features

### Core Functionality
- Create and manage AI agents
- Define custom worker functions
- Handle complex task execution
- Environment and state management

### New Integrations

#### DeepSeek Integration
- Code generation with context awareness
- Code explanation and documentation
- Code improvement suggestions
- Configurable parameters for different use cases

#### BirdEye Integration
- Real-time token trending data
- Token price information
- Detailed token metadata
- Customizable sorting and filtering

#### Voice Command Support
- Voice transcription using OpenAI Whisper
- Natural language command processing
- Support for agent creation and management
- Token-related voice queries

## Installation

```bash
npm install @virtuals-protocol/game
```

## Configuration

Create a `.env` file in your project root:

```env
GAME_API_KEY=your_game_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key
OPENAI_API_KEY=your_openai_api_key
BIRDEYE_API_KEY=your_birdeye_api_key
VIRTUALS_API_KEY=your_virtuals_api_key
```

## Quick Start

```typescript
import GameClient from '@virtuals-protocol/game';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const VIRTUALS_API_KEY = process.env.VIRTUALS_API_KEY;
if (!VIRTUALS_API_KEY) {
  throw new Error('VIRTUALS_API_KEY is required');
}

const gameClient = new GameClient(VIRTUALS_API_KEY);

// Create an agent
const agent = await gameClient.createAgent(
  "AI Assistant",
  "Help with coding tasks",
  "An AI assistant that can help with coding and token analysis"
);

// Create a map with workers
const mapData = await gameClient.createMap([worker]);

// Set a task
const task = "Generate and explain a React component";
const submissionId = await gameClient.setTask(agent.id, task);

// Process actions
let gameActionResult = null;
while (true) {
  const action = await gameClient.getTaskAction(
    agent.id,
    submissionId,
    worker,
    gameActionResult,
    {}
  );

  if (action.action_type === "wait") break;

  // Handle different action types
  switch (action.action_type) {
    case "DeepSeek":
      // Handle code-related actions
      break;
    case "BirdEye":
      // Handle token-related actions
      break;
    default:
      // Handle other actions
  }
}
```

## Examples

Check out our example implementations:

- [Telegram Bot Example](src/examples/tg.ts) - Image generation and messaging
- [Twitter Bot Example](src/examples/twitter.ts) - Tweet search and reply

## Documentation

For detailed documentation, see our [GitBook](docs/README.md).

## License

MIT

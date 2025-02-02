# Voice Commands Integration

The Voice Commands integration enables your AI agents to process and respond to voice input using OpenAI's Whisper API for transcription.

## Setup

1. Get your OpenAI API key from the [OpenAI Platform](https://platform.openai.com)
2. Add the API key to your `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key
```

## Features

### Voice Transcription

Convert voice input to text using OpenAI's Whisper model:

```typescript
await gameClient.listenForVoiceCommands();
```

### Command Processing

Process natural language commands for various actions:

```typescript
// Example command processing
if (command.includes('create agent')) {
  const name = command.match(/name:\s*([^\s,]+)/)?.[1] || 'Default Agent';
  const goal = command.match(/goal:\s*([^,]+)/)?.[1] || 'Default Goal';
  const description = command.match(/description:\s*(.+)/)?.[1] || 'Default Description';
  
  await gameClient.createAgent(name, goal, description);
}
```

### Integration with Other Features

Voice commands can trigger various actions:

- Token analysis with BirdEye
- Code generation with DeepSeek
- Agent creation and management
- Task execution

## Command Types

### Agent Management

```typescript
// Create a new agent
"Create an agent with name: CodeAssistant, goal: Help with coding tasks, description: AI assistant for programming"

// Set a task for an agent
"Set task for agent to create a React component"
```

### Token Analysis

```typescript
// Get trending tokens
"Show me trending tokens"

// Get specific token information
"Get price for token address 0x123..."
```

### Code Operations

```typescript
// Generate code
"Generate a TypeScript interface for user data"

// Explain code
"Explain this code snippet: [code]"

// Improve code
"Improve the following code: [code]"
```

## Best Practices

1. **Voice Input Quality**
   - Use clear audio input
   - Minimize background noise
   - Speak commands clearly

2. **Command Structure**
   - Use consistent command patterns
   - Include necessary parameters
   - Follow naming conventions

3. **Error Handling**
   - Handle transcription errors
   - Provide feedback for unclear commands
   - Implement fallback behaviors

## Examples

### Basic Voice Command Handler

```typescript
class VoiceCommandHandler {
  private gameClient: GameClient;

  constructor(gameClient: GameClient) {
    this.gameClient = gameClient;
  }

  async start() {
    while (true) {
      await this.gameClient.listenForVoiceCommands();
    }
  }

  private async processCommand(command: string) {
    if (command.includes('trending tokens')) {
      const action = await this.gameClient.getAction(
        agentId,
        mapId,
        worker,
        null,
        {
          action_type: ActionType.BirdEye,
          action_args: {
            birdeye: {
              action: 'trending_tokens'
            }
          }
        }
      );
      
      console.log('Trending Tokens:', action.action_args.args.birdeye_result);
    }
  }
}
```

### Custom Command Parser

```typescript
interface CommandParams {
  action: string;
  params: Record<string, string>;
}

function parseVoiceCommand(command: string): CommandParams {
  // Basic command parsing
  const actionMatch = command.match(/^(\w+)/);
  const action = actionMatch ? actionMatch[1] : '';
  
  // Parameter parsing
  const params: Record<string, string> = {};
  const paramMatches = command.matchAll(/(\w+):\s*([^,]+)/g);
  
  for (const match of paramMatches) {
    params[match[1]] = match[2].trim();
  }

  return { action, params };
}

// Usage
const command = "create agent name: Assistant, goal: Help users, description: AI helper";
const { action, params } = parseVoiceCommand(command);
// action: "create"
// params: { name: "Assistant", goal: "Help users", description: "AI helper" }
```

### Integration with Multiple Features

```typescript
async function handleVoiceCommand(command: string) {
  if (command.includes('generate code')) {
    // Use DeepSeek for code generation
    const prompt = command.replace('generate code', '').trim();
    const action = await gameClient.getAction(
      agentId,
      mapId,
      worker,
      null,
      {
        action_type: ActionType.DeepSeek,
        action_args: {
          deepseek: {
            action: 'generate_code',
            prompt
          }
        }
      }
    );
    
    console.log('Generated Code:', action.action_args.args.deepseek_result);
  } else if (command.includes('token price')) {
    // Use BirdEye for token price
    const address = command.match(/address:\s*(\w+)/)?.[1];
    if (address) {
      const action = await gameClient.getAction(
        agentId,
        mapId,
        worker,
        null,
        {
          action_type: ActionType.BirdEye,
          action_args: {
            birdeye: {
              action: 'token_price',
              tokenAddress: address
            }
          }
        }
      );
      
      console.log('Token Price:', action.action_args.args.birdeye_result);
    }
  }
}
```

## API Reference

See the [Voice Commands API Reference](../api-reference/voice-commands.md) for detailed information about all available methods and options.

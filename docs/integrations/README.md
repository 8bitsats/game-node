# Game Node SDK Integrations

The Game Node SDK provides several powerful integrations that extend its capabilities. Each integration is designed to work seamlessly with the core SDK while providing specialized functionality.

## Available Integrations

### [DeepSeek](deepseek.md)
AI-powered code generation and analysis:
- Generate code from natural language descriptions
- Get detailed code explanations
- Receive code improvement suggestions
- Configurable parameters for different use cases

### [BirdEye](birdeye.md)
Real-time token data and analytics:
- Track trending tokens
- Get token price information
- Access detailed token metadata
- Customizable data queries

### [Voice Commands](voice.md)
Natural language voice interaction:
- Voice input transcription
- Command parsing and processing
- Integration with other features
- Extensible command system

## Integration Architecture

The integrations follow a modular design:

```
Game Node SDK
├── Core SDK
│   └── GameClient
├── Integrations
│   ├── DeepSeekClient
│   │   ├── Code Generation
│   │   ├── Code Explanation
│   │   └── Code Improvement
│   ├── BirdEyeClient
│   │   ├── Trending Tokens
│   │   ├── Price Information
│   │   └── Token Metadata
│   └── Voice Commands
│       ├── Transcription
│       ├── Command Processing
│       └── Feature Integration
```

## Environment Configuration

Each integration requires its own API key. Add these to your `.env` file:

```env
# Core SDK
GAME_API_KEY=your_game_api_key
VIRTUALS_API_KEY=your_virtuals_api_key

# Integrations
DEEPSEEK_API_KEY=your_deepseek_api_key
OPENAI_API_KEY=your_openai_api_key
BIRDEYE_API_KEY=your_birdeye_api_key
```

## Using Multiple Integrations

The integrations are designed to work together. Here's an example combining all three:

```typescript
// Initialize the client
const gameClient = new GameClient(VIRTUALS_API_KEY);

// Start voice command processing
gameClient.listenForVoiceCommands().then(async (command) => {
  if (command.includes('generate code')) {
    // Use DeepSeek for code generation
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
            prompt: command.replace('generate code', '').trim()
          }
        }
      }
    );
    
    console.log('Generated Code:', action.action_args.args.deepseek_result);
  } else if (command.includes('trending tokens')) {
    // Use BirdEye for token data
    const action = await gameClient.getAction(
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
});
```

## Best Practices

1. **API Key Management**
   - Keep API keys secure
   - Use environment variables
   - Never commit keys to version control

2. **Error Handling**
   - Handle errors from each integration
   - Provide fallback behavior
   - Log issues appropriately

3. **Resource Management**
   - Implement rate limiting
   - Cache responses when possible
   - Clean up resources properly

4. **Integration Coordination**
   - Use consistent data formats
   - Handle state transitions
   - Maintain error boundaries

## Getting Started

1. Install the SDK:
   ```bash
   npm install @virtuals-protocol/game
   ```

2. Configure environment variables in `.env`

3. Import and initialize the client:
   ```typescript
   import GameClient from '@virtuals-protocol/game';
   import dotenv from 'dotenv';

   dotenv.config();
   const gameClient = new GameClient(process.env.VIRTUALS_API_KEY);
   ```

4. Start using the integrations:
   ```typescript
   // Use DeepSeek
   await gameClient.getAction(/* ... */);

   // Use BirdEye
   await gameClient.getAction(/* ... */);

   // Use Voice Commands
   await gameClient.listenForVoiceCommands();
   ```

## Further Reading

- [DeepSeek Documentation](deepseek.md)
- [BirdEye Documentation](birdeye.md)
- [Voice Commands Documentation](voice.md)
- [API Reference](../api-reference/README.md)

# DeepSeek Integration

The DeepSeek integration provides powerful code-related capabilities to your AI agents, including code generation, explanation, and improvement.

## Setup

1. Get your DeepSeek API key from the [DeepSeek Platform](https://deepseek.com)
2. Add the API key to your `.env` file:
```env
DEEPSEEK_API_KEY=your_deepseek_api_key
```

## Features

### Code Generation

Generate code based on natural language descriptions:

```typescript
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
        prompt: 'Create a React component that displays a loading spinner'
      }
    }
  }
);

// Result will be in action.action_args.args.deepseek_result
console.log(action.action_args.args.deepseek_result);
```

### Code Explanation

Get detailed explanations of existing code:

```typescript
const action = await gameClient.getAction(
  agentId,
  mapId,
  worker,
  null,
  {
    action_type: ActionType.DeepSeek,
    action_args: {
      deepseek: {
        action: 'explain_code',
        code: `
          const sum = (a: number, b: number): number => a + b;
          const result = [1, 2, 3].reduce(sum, 0);
        `
      }
    }
  }
);

// Get the explanation
console.log(action.action_args.args.deepseek_result);
```

### Code Improvement

Get suggestions for improving code quality:

```typescript
const action = await gameClient.getAction(
  agentId,
  mapId,
  worker,
  null,
  {
    action_type: ActionType.DeepSeek,
    action_args: {
      deepseek: {
        action: 'improve_code',
        code: `
          function f(x) {
            var res = 0;
            for(var i = 0; i < x.length; i++) {
              res = res + x[i];
            }
            return res;
          }
        `
      }
    }
  }
);

// Get the improved code
console.log(action.action_args.args.deepseek_result);
```

## Configuration

The DeepSeekClient can be configured with various parameters:

```typescript
interface DeepSeekRequest {
  prompt: string;
  max_tokens?: number;    // Default: 1000
  temperature?: number;   // Default: 0.7
  top_p?: number;        // Default: 1
  stream?: boolean;      // Default: false
}
```

### Parameters

- `max_tokens`: Maximum number of tokens to generate
- `temperature`: Controls randomness (0.0 - 1.0)
- `top_p`: Controls diversity via nucleus sampling
- `stream`: Enable streaming responses

## Best Practices

1. **Prompt Engineering**
   - Be specific in your prompts
   - Include context and requirements
   - Specify the desired programming language

2. **Error Handling**
   - Always handle potential API errors
   - Validate code before execution
   - Provide fallback behavior

3. **Rate Limiting**
   - Implement appropriate rate limiting
   - Cache responses when possible
   - Use streaming for long generations

## Examples

### Generate a TypeScript Interface

```typescript
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
        prompt: 'Create a TypeScript interface for a user profile with basic fields'
      }
    }
  }
);

// Example result:
// interface UserProfile {
//   id: string;
//   username: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
```

### Improve Error Handling

```typescript
const action = await gameClient.getAction(
  agentId,
  mapId,
  worker,
  null,
  {
    action_type: ActionType.DeepSeek,
    action_args: {
      deepseek: {
        action: 'improve_code',
        code: `
          async function fetchUser(id) {
            const response = await fetch('/api/users/' + id);
            const data = await response.json();
            return data;
          }
        `
      }
    }
  }
);

// Example result will include proper error handling, type checking, etc.
```

## API Reference

See the [DeepSeekClient API Reference](../api-reference/deepseek-client.md) for detailed information about all available methods and options.

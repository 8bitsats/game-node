# BirdEye Integration

The BirdEye integration provides real-time token data and analytics capabilities to your AI agents, including trending tokens, price information, and metadata.

## Setup

1. Get your BirdEye API key from the [BirdEye Platform](https://birdeye.so)
2. Add the API key to your `.env` file:
```env
BIRDEYE_API_KEY=your_birdeye_api_key
```

## Features

### Trending Tokens

Get real-time information about trending tokens:

```typescript
const action = await gameClient.getAction(
  agentId,
  mapId,
  worker,
  null,
  {
    action_type: ActionType.BirdEye,
    action_args: {
      birdeye: {
        action: 'trending_tokens',
        limit: 20,
        offset: 0
      }
    }
  }
);

// Access trending tokens data
const tokens = action.action_args.args.birdeye_result;
```

### Token Price Information

Fetch current price data for specific tokens:

```typescript
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
        tokenAddress: '0x123...'
      }
    }
  }
);

// Get the token price
const price = action.action_args.args.birdeye_result;
```

### Token Metadata

Retrieve detailed token metadata:

```typescript
const action = await gameClient.getAction(
  agentId,
  mapId,
  worker,
  null,
  {
    action_type: ActionType.BirdEye,
    action_args: {
      birdeye: {
        action: 'token_metadata',
        tokenAddress: '0x123...'
      }
    }
  }
);

// Access token metadata
const metadata = action.action_args.args.birdeye_result;
```

## Response Types

### TokenInfo Interface

```typescript
interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  rank: number;
  price: number;
  volume24h: number;
  marketCap: number;
  priceChange24h: number;
}
```

### Token Metadata Response

```typescript
interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
}
```

## Best Practices

1. **Rate Limiting**
   - Implement appropriate rate limiting
   - Cache responses when possible
   - Use pagination for large datasets

2. **Error Handling**
   - Handle API errors gracefully
   - Provide fallback data when needed
   - Validate token addresses

3. **Data Freshness**
   - Consider data age for price information
   - Implement refresh strategies
   - Use websockets for real-time updates

## Examples

### Track Top Trending Tokens

```typescript
const action = await gameClient.getAction(
  agentId,
  mapId,
  worker,
  null,
  {
    action_type: ActionType.BirdEye,
    action_args: {
      birdeye: {
        action: 'trending_tokens',
        limit: 5,
        offset: 0
      }
    }
  }
);

// Example usage of trending tokens data
const tokens = action.action_args.args.birdeye_result;
tokens.forEach(token => {
  console.log(`${token.name} (${token.symbol})`);
  console.log(`Price: $${token.price}`);
  console.log(`24h Change: ${token.priceChange24h}%`);
  console.log('---');
});
```

### Monitor Token Price Changes

```typescript
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
        tokenAddress: '0x123...'
      }
    }
  }
);

const price = action.action_args.args.birdeye_result;
console.log(`Current Price: $${price}`);
```

### Get Token Details

```typescript
const action = await gameClient.getAction(
  agentId,
  mapId,
  worker,
  null,
  {
    action_type: ActionType.BirdEye,
    action_args: {
      birdeye: {
        action: 'token_metadata',
        tokenAddress: '0x123...'
      }
    }
  }
);

const metadata = action.action_args.args.birdeye_result;
console.log(`Token: ${metadata.name} (${metadata.symbol})`);
console.log(`Decimals: ${metadata.decimals}`);
```

## Voice Command Integration

The BirdEye integration works seamlessly with voice commands:

```typescript
// Example voice command processing
if (command.includes('trending tokens')) {
  const tokens = await birdeyeClient.getTrendingTokens();
  console.log('Top Trending Tokens:', tokens);
}
```

## API Reference

See the [BirdEyeClient API Reference](../api-reference/birdeye-client.md) for detailed information about all available methods and options.

import type { CreateAxiosDefaults } from 'axios';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BIRDEYE_API_KEY = process.env.BIRDEYE_API_KEY;
const BIRDEYE_API_URL = 'https://public-api.birdeye.so';

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  rank: number;
  price: number;
  volume24h: number;
  marketCap: number;
  priceChange24h: number;
}

export interface TrendingTokensResponse {
  success: boolean;
  data: {
    tokens: TokenInfo[];
  };
}

export class BirdEyeClient {
  private client: ReturnType<typeof axios.create>;

  constructor() {
    if (!BIRDEYE_API_KEY) {
      throw new Error('BIRDEYE_API_KEY is required in environment variables');
    }

    const config: CreateAxiosDefaults = {
      baseURL: BIRDEYE_API_URL,
      headers: {
        'X-API-KEY': BIRDEYE_API_KEY,
        'accept': 'application/json',
        'x-chain': 'base',
      },
    };

    this.client = axios.create(config);
  }

  async getTrendingTokens(
    limit: number = 20,
    offset: number = 0,
    sortBy: string = 'rank',
    sortType: 'asc' | 'desc' = 'asc'
  ): Promise<TokenInfo[]> {
    try {
      const response = await this.client.get<TrendingTokensResponse>(
        '/defi/token_trending',
        {
          params: {
            sort_by: sortBy,
            sort_type: sortType,
            offset,
            limit,
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Failed to fetch trending tokens');
      }

      return response.data.data.tokens;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`BirdEye API error: ${error.message}`);
      }
      throw error;
    }
  }

  async getTokenPrice(tokenAddress: string): Promise<number> {
    try {
      const response = await this.client.get<{ success: boolean; data: { value: number } }>(
        '/defi/token_price',
        {
          params: {
            address: tokenAddress,
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Failed to fetch token price');
      }

      return response.data.data.value;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`BirdEye API error: ${error.message}`);
      }
      throw error;
    }
  }

  async getTokenMetadata(tokenAddress: string): Promise<{
    name: string;
    symbol: string;
    decimals: number;
  }> {
    try {
      const response = await this.client.get<{
        success: boolean;
        data: { name: string; symbol: string; decimals: number };
      }>('/defi/token_metadata', {
        params: {
          address: tokenAddress,
        },
      });

      if (!response.data.success) {
        throw new Error('Failed to fetch token metadata');
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`BirdEye API error: ${error.message}`);
      }
      throw error;
    }
  }
}

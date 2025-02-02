import type { CreateAxiosDefaults } from 'axios';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1';

export interface DeepSeekResponse {
  id: string;
  choices: {
    text: string;
    index: number;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface DeepSeekRequest {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
}

export class DeepSeekClient {
  private client: ReturnType<typeof axios.create>;

  constructor() {
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY is required in environment variables');
    }

    const config: CreateAxiosDefaults = {
      baseURL: DEEPSEEK_API_URL,
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    this.client = axios.create(config);
  }

  async generateText(request: DeepSeekRequest): Promise<DeepSeekResponse> {
    try {
      const response = await this.client.post<DeepSeekResponse>('/completions', {
        model: 'deepseek-coder',
        ...request,
        max_tokens: request.max_tokens || 1000,
        temperature: request.temperature || 0.7,
        top_p: request.top_p || 1,
        stream: request.stream || false,
      });

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`DeepSeek API error: ${error.message}`);
      }
      throw error;
    }
  }

  async generateCode(prompt: string): Promise<string> {
    const response = await this.generateText({
      prompt,
      temperature: 0.3, // Lower temperature for more focused code generation
      max_tokens: 2000, // Increased token limit for code
    });

    return response.choices[0].text;
  }

  async explainCode(code: string): Promise<string> {
    const prompt = `Please explain the following code:\n\n${code}`;
    const response = await this.generateText({
      prompt,
      temperature: 0.5,
      max_tokens: 1000,
    });

    return response.choices[0].text;
  }

  async improveCode(code: string): Promise<string> {
    const prompt = `Please improve the following code by making it more efficient, readable, and following best practices:\n\n${code}`;
    const response = await this.generateText({
      prompt,
      temperature: 0.3,
      max_tokens: 2000,
    });

    return response.choices[0].text;
  }
}

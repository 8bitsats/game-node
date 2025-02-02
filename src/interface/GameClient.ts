import type { CreateAxiosDefaults } from 'axios';
import axios from 'axios';
import dotenv from 'dotenv';

import { ExecutableGameFunctionResponseJSON } from '../function';
import GameWorker from '../worker';
import { BirdEyeClient } from './BirdEyeClient';
import { DeepSeekClient } from './DeepSeekClient';

dotenv.config();

const API_KEY = process.env.GAME_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const BASE_URL = 'https://api.artterminal.com/v1';

export interface Map {
  id: string;
}

export interface GameAgent {
  id: string;
  name: string;
  goal: string;
  description: string;
}

export enum ActionType {
  CallFunction = 'call_function',
  ContinueFunction = 'continue_function',
  Wait = 'wait',
  TryToTalk = 'try_to_talk',
  Conversation = 'conversation',
  GoTo = 'go_to',
  DeepSeek = 'deep_seek',
  BirdEye = 'bird_eye',
  Unknown = 'unknown',
}

export interface DeepSeekActionArgs {
  prompt: string;
  action: 'generate_code' | 'explain_code' | 'improve_code';
  code?: string;
}

export interface BirdEyeActionArgs {
  action: 'trending_tokens' | 'token_price' | 'token_metadata';
  tokenAddress?: string;
  limit?: number;
  offset?: number;
}

export interface ActionArgs {
  location_id: string;
  task_id: string;
  fn_id: string;
  args: Record<string, any>;
  fn_name: string;
  thought: string;
  deepseek?: DeepSeekActionArgs;
  birdeye?: BirdEyeActionArgs;
}

export interface GameAction {
  action_type: ActionType;
  action_args: ActionArgs;
  agent_state?: Record<string, any>;
}

export interface IGameClient {
  client: ReturnType<typeof axios.create> | null;
  createMap(workers: GameWorker[]): Promise<Map>;
  createAgent(
    name: string,
    goal: string,
    description: string
  ): Promise<GameAgent>;
  getAction(
    agentId: string,
    mapId: string,
    worker: GameWorker,
    gameActionResult: ExecutableGameFunctionResponseJSON | null,
    environment: Record<string, any>,
    agentState: Record<string, any>
  ): Promise<GameAction>;
  setTask(agentId: string, task: string): Promise<string>;
  getTaskAction(
    agentId: string,
    submissionId: string,
    worker: GameWorker,
    gameActionResult: ExecutableGameFunctionResponseJSON | null,
    environment: Record<string, any>
  ): Promise<GameAction>;
  listenForVoiceCommands(): Promise<void>;
}

export class GameClient implements IGameClient {
  client: ReturnType<typeof axios.create> | null = null;
  private deepseekClient: DeepSeekClient;
  private birdeyeClient: BirdEyeClient;

  constructor() {
    if (!API_KEY) {
      throw new Error('GAME_API_KEY is required in environment variables');
    }

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required in environment variables');
    }

    const config: CreateAxiosDefaults = {
      baseURL: BASE_URL,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    this.client = axios.create(config);
    this.deepseekClient = new DeepSeekClient();
    this.birdeyeClient = new BirdEyeClient();
  }

  async createMap(workers: GameWorker[]): Promise<Map> {
    if (!this.client) throw new Error('Client not initialized');

    const response = await this.client.post('/maps', {
      workers: workers.map(w => ({
        id: w.id,
        functions: w.functions
      }))
    });

    return response.data;
  }

  async createAgent(
    name: string,
    goal: string,
    description: string
  ): Promise<GameAgent> {
    if (!this.client) throw new Error('Client not initialized');

    const response = await this.client.post('/agents', {
      name,
      goal,
      description,
    });

    return response.data;
  }

  async getAction(
    agentId: string,
    mapId: string,
    worker: GameWorker,
    gameActionResult: ExecutableGameFunctionResponseJSON | null,
    environment: Record<string, any>,
    agentState: Record<string, any>
  ): Promise<GameAction> {
    if (!this.client) throw new Error('Client not initialized');

    const response = await this.client.post(`/agents/${agentId}/actions`, {
      map_id: mapId,
      worker: {
        id: worker.id,
        functions: worker.functions,
      },
      game_action_result: gameActionResult,
      environment,
      agent_state: agentState,
    });

    const action = response.data;

    // Handle DeepSeek actions
    if (action.action_type === ActionType.DeepSeek && action.action_args.deepseek) {
      const { prompt, action: deepseekAction, code } = action.action_args.deepseek;
      
      let result: string;
      switch (deepseekAction) {
        case 'generate_code':
          result = await this.deepseekClient.generateCode(prompt);
          break;
        case 'explain_code':
          if (!code) throw new Error('Code is required for explain_code action');
          result = await this.deepseekClient.explainCode(code);
          break;
        case 'improve_code':
          if (!code) throw new Error('Code is required for improve_code action');
          result = await this.deepseekClient.improveCode(code);
          break;
        default:
          throw new Error(`Unknown DeepSeek action: ${deepseekAction}`);
      }

      action.action_args.args = { ...action.action_args.args, deepseek_result: result };
    }

    // Handle BirdEye actions
    if (action.action_type === ActionType.BirdEye && action.action_args.birdeye) {
      const { action: birdeyeAction, tokenAddress, limit, offset } = action.action_args.birdeye;
      
      let result: any;
      switch (birdeyeAction) {
        case 'trending_tokens':
          result = await this.birdeyeClient.getTrendingTokens(limit, offset);
          break;
        case 'token_price':
          if (!tokenAddress) throw new Error('Token address is required for token_price action');
          result = await this.birdeyeClient.getTokenPrice(tokenAddress);
          break;
        case 'token_metadata':
          if (!tokenAddress) throw new Error('Token address is required for token_metadata action');
          result = await this.birdeyeClient.getTokenMetadata(tokenAddress);
          break;
        default:
          throw new Error(`Unknown BirdEye action: ${birdeyeAction}`);
      }

      action.action_args.args = { ...action.action_args.args, birdeye_result: result };
    }

    return action;
  }

  async setTask(agentId: string, task: string): Promise<string> {
    if (!this.client) throw new Error('Client not initialized');

    const response = await this.client.post(`/agents/${agentId}/tasks`, {
      task,
    });

    return response.data.submission_id;
  }

  async getTaskAction(
    agentId: string,
    submissionId: string,
    worker: GameWorker,
    gameActionResult: ExecutableGameFunctionResponseJSON | null,
    environment: Record<string, any>
  ): Promise<GameAction> {
    if (!this.client) throw new Error('Client not initialized');

    const response = await this.client.post(
      `/agents/${agentId}/tasks/${submissionId}/actions`,
      {
        worker: {
          id: worker.id,
          functions: worker.functions,
        },
        game_action_result: gameActionResult,
        environment,
      }
    );

    return response.data;
  }

  async listenForVoiceCommands(): Promise<void> {
    const audio = await this.captureAudio();
    const transcription = await this.transcribeAudio(audio);
    await this.processVoiceCommand(transcription);
  }

  private async captureAudio(): Promise<Blob> {
    // This is a placeholder - actual implementation would use Web Audio API
    return new Blob();
  }

  private async transcribeAudio(audio: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', audio, 'audio.wav');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    return data.text;
  }

  private async processVoiceCommand(command: string): Promise<void> {
    if (command.includes('trending tokens')) {
      const tokens = await this.birdeyeClient.getTrendingTokens();
      console.log('Trending Tokens:', tokens);
    } else if (command.includes('create agent')) {
      // Extract agent details from command and create agent
      const name = command.match(/name:\s*([^\s,]+)/)?.[1] || 'Default Agent';
      const goal = command.match(/goal:\s*([^,]+)/)?.[1] || 'Default Goal';
      const description = command.match(/description:\s*(.+)/)?.[1] || 'Default Description';
      
      await this.createAgent(name, goal, description);
    }
  }
}

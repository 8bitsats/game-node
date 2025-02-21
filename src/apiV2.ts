import type { CreateAxiosDefaults } from 'axios';
import axios from 'axios';

import { ExecutableGameFunctionResponseJSON } from './function';
import {
  GameAction,
  GameAgent,
  IGameClient,
  Map,
} from './interface/GameClient';
import GameWorker from './worker';

class GameClientV2 implements IGameClient {
  client: ReturnType<typeof axios.create> | null;
  private baseUrl = "https://sdk.game.virtuals.io/v2";

  constructor(private apiKey: string) {
    const config: CreateAxiosDefaults = {
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
    };

    this.client = axios.create(config);
  }

  async createMap(workers: GameWorker[]): Promise<Map> {
    if (!this.client) throw new Error("Client not initialized");

    const result = await this.client.post<{ data: Map }>("/maps", {
      data: {
        locations: workers.map((worker) => ({
          id: worker.id,
          name: worker.name,
          description: worker.description,
        })),
      },
    });

    return result.data.data;
  }

  async createAgent(
    name: string,
    goal: string,
    description: string
  ): Promise<GameAgent> {
    if (!this.client) throw new Error("Client not initialized");

    const result = await this.client.post<{ data: GameAgent }>("/agents", {
      data: {
        name,
        goal,
        description,
      },
    });

    return result.data.data;
  }

  async getAction(
    agentId: string,
    mapId: string,
    worker: GameWorker,
    gameActionResult: ExecutableGameFunctionResponseJSON | null,
    environment: Record<string, any>,
    agentState: Record<string, any>
  ): Promise<GameAction> {
    if (!this.client) throw new Error("Client not initialized");

    const payload: { [key in string]: any } = {
      location: worker.id,
      map_id: mapId,
      environment: environment,
      functions: worker.functions.map((fn) => fn.toJSON()),
      agent_state: agentState,
      version: "v2",
    };

    if (gameActionResult) {
      payload.current_action = gameActionResult;
    }

    const result = await this.client.post<{ data: GameAction }>(
      `/agents/${agentId}/actions`,
      {
        data: payload,
      }
    );

    return result.data.data;
  }

  async setTask(agentId: string, task: string): Promise<string> {
    if (!this.client) throw new Error("Client not initialized");

    const result = await this.client.post<{ data: { submission_id: string } }>(
      `/agents/${agentId}/tasks`,
      {
        data: { task },
      }
    );

    return result.data.data.submission_id;
  }

  async getTaskAction(
    agentId: string,
    submissionId: string,
    worker: GameWorker,
    gameActionResult: ExecutableGameFunctionResponseJSON | null,
    environment: Record<string, any>
  ): Promise<GameAction> {
    if (!this.client) throw new Error("Client not initialized");

    const payload: Record<string, any> = {
      environment: environment,
      functions: worker.functions.map((fn) => fn.toJSON()),
    };

    if (gameActionResult) {
      payload.action_result = gameActionResult;
    }

    const result = await this.client.post<{ data: GameAction }>(
      `/agents/${agentId}/tasks/${submissionId}/next`,
      {
        data: payload,
      }
    );

    return result.data.data;
  }

  async listenForVoiceCommands(): Promise<void> {
    // This base implementation does nothing
    // Voice commands are implemented in the enhanced version
    return Promise.resolve();
  }
}

export default GameClientV2;

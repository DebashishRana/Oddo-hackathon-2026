import { getAppBaseUrl } from "./site-url";

// OpenRouter API client for AI chat completions

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenRouterError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

class OpenRouterClient {
  private apiKey: string;
  private baseURL: string;
  private siteName: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.siteName = process.env.NEXT_PUBLIC_SITE_NAME || '';

    if (!this.apiKey) {
      throw new Error('OpenRouter API key is required');
    }
  }

  async createChatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    try {
      const siteUrl = getAppBaseUrl()
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': siteUrl,
          'X-Title': this.siteName,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData: OpenRouterError = await response.json();
        throw new Error(
          `OpenRouter API error: ${errorData.error.message} (${response.status})`
        );
      }

      const data: ChatCompletionResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while calling OpenRouter API');
    }
  }

  async createStreamingChatCompletion(
    request: ChatCompletionRequest
  ): Promise<ReadableStream<Uint8Array>> {
    try {
      const siteUrl = getAppBaseUrl()
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': siteUrl,
          'X-Title': this.siteName,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorData: OpenRouterError = await response.json();
        throw new Error(
          `OpenRouter API error: ${errorData.error.message} (${response.status})`
        );
      }

      if (!response.body) {
        throw new Error('No response body received from OpenRouter API');
      }

      return response.body;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while calling OpenRouter API');
    }
  }

  // Helper method to get available models
  async getModels(): Promise<unknown> {
    try {
      const response = await fetch(`${this.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while fetching models');
    }
  }
}

// Export a singleton instance
export const openRouterClient = new OpenRouterClient();

// Helper function to create a simple chat completion
export async function createChatCompletion(
  messages: ChatMessage[],
  options: Partial<ChatCompletionRequest> = {}
): Promise<ChatCompletionResponse> {
  const defaultModel = process.env.OPENROUTER_MODEL || 'qwen/qwen3-235b-a22b-2507';
  
  return openRouterClient.createChatCompletion({
    model: defaultModel,
    messages,
    temperature: 0.7,
    max_tokens: 1000,
    ...options,
  });
}

// Helper function for streaming chat completion
export async function createStreamingChatCompletion(
  messages: ChatMessage[],
  options: Partial<ChatCompletionRequest> = {}
): Promise<ReadableStream<Uint8Array>> {
  const defaultModel = process.env.OPENROUTER_MODEL || 'qwen/qwen3-235b-a22b-2507';
  
  return openRouterClient.createStreamingChatCompletion({
    model: defaultModel,
    messages,
    temperature: 0.7,
    max_tokens: 1000,
    ...options,
  });
}

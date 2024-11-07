import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class BothubService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly logger = new Logger(BothubService.name);

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = this.configService.get<string>('bothub.base_uri') || '';
    this.apiKey =
      this.configService.get<string>('bothub.open_ai_api_key') || '';

    this.logger.log(`API URL: ${this.apiUrl ? this.apiUrl : 'Not Set'}`);
    this.logger.log(`API Key: ${this.apiKey ? 'Provided' : 'Not Set'}`);
  }

  async sendMessageToBothub(model: string, message: string): Promise<any> {
    try {
      const endpoint = `${this.apiUrl}/chat/completions`; // Ensure this is the correct endpoint
      const response = await axios.post(
        endpoint,
        {
          model: model,
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to communicate with Bothub API: ${error.message}`,
        );
        throw new Error(
          `Failed to communicate with Bothub API: ${error.message}`,
        );
      }
      this.logger.error(
        'An unknown error occurred while communicating with Bothub API.',
      );
      throw new Error(
        'An unknown error occurred while communicating with Bothub API.',
      );
    }
  }
}

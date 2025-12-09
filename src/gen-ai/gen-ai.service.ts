import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GEN_AI_CONFIGURATION_ERROR } from '@src/common/error-messages';
import { AllConfigType } from '@src/config/config.type';

@Injectable()
export class GenAiService {
  private model: GenerativeModel; // Adjust the type as needed

  constructor(private configService: ConfigService<AllConfigType>) {
    const apiKey = this.configService.getOrThrow('genAi.genAiApiKey', {
      infer: true,
    });
    const modelName = this.configService.getOrThrow('genAi.genAiModel', {
      infer: true,
    });

    const genAI = new GoogleGenerativeAI(apiKey);
    if (modelName) {
      this.model = genAI.getGenerativeModel({ model: modelName });
    }
  }

  async generateArticleTitle(prompt: string): Promise<string> {
    if (!this.model) {
      throw new BadRequestException(GEN_AI_CONFIGURATION_ERROR);
    }
    const result = await this.model.generateContent(prompt);
    return result.response.text().trim();
  }
}

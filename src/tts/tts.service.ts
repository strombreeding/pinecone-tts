import { protos, TextToSpeechClient } from '@google-cloud/text-to-speech';
import { google } from '@google-cloud/text-to-speech/build/protos/protos';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as util from 'util';

export type VoiceTypes =
  | 'male-adult'
  | 'male-child'
  | 'female-adult'
  | 'female-child';

@Injectable()
export class TtsService {
  private client: TextToSpeechClient;

  constructor() {
    this.client = new TextToSpeechClient();
  }

  async synthesizeSpeech(
    text: string,
    voiceType: string,
    fileName: string,
  ): Promise<void> {
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
      {
        input: { text },
        voice: this.getVoiceConfig(voiceType),
        audioConfig: { audioEncoding: 'MP3' },
      };

    const [response] = await this.client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(fileName, response.audioContent, 'binary');
  }

  private getVoiceConfig(
    voiceType: string,
  ): google.cloud.texttospeech.v1.IVoiceSelectionParams | null {
    switch (voiceType) {
      case 'male':
        return {
          languageCode: 'en-US',
          name: 'en-US-Studio-Q',
          ssmlGender: 'MALE',
        };
      case 'female':
        return {
          languageCode: 'en-US',
          name: 'en-US-Studio-O',
          ssmlGender: 'FEMALE',
        };

      default:
        throw new Error('Invalid voice type');
    }
  }
}

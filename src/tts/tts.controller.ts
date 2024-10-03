import { Body, Controller, Post } from '@nestjs/common';
import { TtsService } from './tts.service';

@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post()
  async tts(@Body() body: { word: string }) {
    await this.ttsService.synthesizeSpeech(
      body.word,
      'female',
      `sounds/${body.word[0]}/${body.word}-female.mp3`,
    );

    await this.ttsService.synthesizeSpeech(
      body.word,
      'male',
      `sounds/${body.word[0]}/${body.word}-male.mp3`,
    );
  }
}

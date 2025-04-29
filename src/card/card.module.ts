import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    UploadModule.forFeature('cards'),
  ],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}

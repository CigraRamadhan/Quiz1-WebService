import { Module } from '@nestjs/common';
import { LapanganController } from './lapangan.controller';
import { LapanganService } from './lapangan.service';

@Module({
  controllers: [LapanganController],
  providers: [LapanganService],
  exports: [LapanganService]
})

export class LapanganModule {}

import { Module } from '@nestjs/common';
import { ReservasiController } from './reservasi.controller';
import { ReservasiService } from './reservasi.service';
import { LapanganModule } from '../lapangan/lapangan.module';

@Module({
  imports: [LapanganModule],
  controllers: [ReservasiController],
  providers: [ReservasiService],
})
export class ReservasiModule {}
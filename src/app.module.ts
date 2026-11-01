import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LapanganModule } from './lapangan/lapangan.module';
import { ReservasiModule } from './reservasi/reservasi.module';

@Module({
  imports: [LapanganModule, ReservasiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

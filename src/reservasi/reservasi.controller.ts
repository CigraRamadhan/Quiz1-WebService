import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Query,
} from '@nestjs/common';

import { ReservasiService } from './reservasi.service';

@Controller('reservasi')
export class ReservasiController {

    constructor(
        private readonly reservasiService: ReservasiService,
    ) { }

    // GET: Menampilkan semua reservasi
    @Get()
    findAll() {
        return this.reservasiService.findAll();
    }

    // GET: Menampilkan detail reservasi
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.reservasiService.findOne(Number(id));
    }

    // POST: Membuat reservasi baru
    @Post()
    create(
        @Body() body: {
            lapanganId: number;
            namaPengguna: string;
            tanggal: string;
            jamMulai: string;
            jamSelesai: string;
        },
    ) {
        return this.reservasiService.create(body);
    }

    // PATCH: Membatalkan reservasi
    @Patch(':id/batal')
    cancel(@Param('id') id: string) {
        return this.reservasiService.cancel(Number(id));
    }

    // GET: Mengecek ketersediaan lapangan
    @Get('ketersediaan/:lapanganId')
    checkAvailability(
        @Param('lapanganId') lapanganId: string,
        @Query('tanggal') tanggal: string,
        @Query('jamMulai') jamMulai?: string,
        @Query('jamSelesai') jamSelesai?: string,
    ) {
        return this.reservasiService.checkAvailability(
            Number(lapanganId),
            tanggal,
            jamMulai,
            jamSelesai,
        );
    }
}
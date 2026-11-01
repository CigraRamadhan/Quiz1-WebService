import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';

import { LapanganService } from '../lapangan/lapangan.service';

type StatusBooking = 'BERHASIL' | 'DIBATALKAN';

type Reservasi = {
    id: number;
    lapanganId: number;
    namaPengguna: string;
    tanggal: string;
    jamMulai: string;
    jamSelesai: string;
    status: StatusBooking;
};

@Injectable()
export class ReservasiService {

    // Array untuk menyimpan data reservasi
    private reservasi: Reservasi[] = [];

    constructor(
        private readonly lapanganService: LapanganService,
    ) { }

    // Menampilkan seluruh reservasi
    findAll() {
        return this.reservasi;
    }

    // Menampilkan detail reservasi berdasarkan ID
    findOne(id: number) {
        const data = this.reservasi.find(
            (item) => item.id === id,
        );

        if (!data) {
            throw new NotFoundException(
                'Reservasi tidak ditemukan',
            );
        }

        return data;
    }

    // Membuat reservasi baru
    create(data: {
        lapanganId: number;
        namaPengguna: string;
        tanggal: string;
        jamMulai: string;
        jamSelesai: string;
    }) {

        // 1. Validasi input
        const lapanganId = Number(data.lapanganId);

        if (
            !Number.isInteger(lapanganId) ||
            typeof data.namaPengguna !== 'string' ||
            !data.namaPengguna.trim() ||
            !this.isValidDate(data.tanggal) ||
            this.toMinutes(data.jamMulai) === null ||
            this.toMinutes(data.jamSelesai) === null
        ) {
            throw new BadRequestException(
                'Data reservasi tidak valid',
            );
        }

        const mulai = this.toMinutes(data.jamMulai)!;
        const selesai = this.toMinutes(data.jamSelesai)!;

        if (mulai >= selesai) {
            throw new BadRequestException(
                'Jam selesai harus lebih besar dari jam mulai',
            );
        }

        // 2. Memeriksa keberadaan lapangan
        const lapangan = this.lapanganService.findOne(
            lapanganId,
        );

        if (!lapangan.aktif) {
            throw new BadRequestException(
                'Lapangan sedang tidak aktif',
            );
        }

        // 3. Memeriksa bentrok jadwal
        const bentrok = this.reservasi.some((item) => {

            return (
                item.lapanganId === lapanganId &&
                item.tanggal === data.tanggal &&
                item.status === 'BERHASIL' &&
                this.toMinutes(item.jamMulai)! < selesai &&
                this.toMinutes(item.jamSelesai)! > mulai
            );

        });

        if (bentrok) {
            throw new BadRequestException(
                'Jadwal lapangan sudah dipesan',
            );
        }

        // 4. Membuat data reservasi
        const reservasiBaru: Reservasi = {
            id: this.reservasi.length + 1,
            lapanganId: lapanganId,
            namaPengguna: data.namaPengguna.trim(),
            tanggal: data.tanggal,
            jamMulai: data.jamMulai,
            jamSelesai: data.jamSelesai,
            status: 'BERHASIL',
        };

        // 5. Menyimpan ke array
        this.reservasi.push(reservasiBaru);

        return {
            message: 'Reservasi berhasil dibuat',
            data: reservasiBaru,
        };
    }

    // Mengubah jam menjadi menit
    private toMinutes(jam: string): number | null {

        if (
            typeof jam !== 'string' ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(jam)
        ) {
            return null;
        }

        const [hour, minute] = jam.split(':').map(Number);

        return hour * 60 + minute;
    }

    // Memvalidasi format dan tanggal kalender
    private isValidDate(tanggal: string): boolean {

        if (
            typeof tanggal !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)
        ) {
            return false;
        }

        const date = new Date(`${tanggal}T00:00:00Z`);

        return (
            !Number.isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === tanggal
        );
    }

    // Membatalkan reservasi
    cancel(id: number) {

        // 1. Mencari reservasi berdasarkan ID
        const data = this.reservasi.find(
            (item) => item.id === id,
        );

        // 2. Memeriksa apakah reservasi ditemukan
        if (!data) {
            throw new NotFoundException(
                'Reservasi tidak ditemukan',
            );
        }

        // 3. Memeriksa status reservasi
        if (data.status === 'DIBATALKAN') {
            throw new BadRequestException(
                'Reservasi sudah dibatalkan',
            );
        }

        // 4. Mengubah status booking
        data.status = 'DIBATALKAN';

        // 5. Mengembalikan response
        return {
            message: 'Reservasi berhasil dibatalkan',
            data: data,
        };
    }

    // Mengecek ketersediaan lapangan
    checkAvailability(
        lapanganId: number,
        tanggal: string,
        jamMulai?: string,
        jamSelesai?: string,
    ) {

        // 1. Memeriksa keberadaan lapangan
        const lapangan = this.lapanganService.findOne(lapanganId);

        if (!lapangan.aktif) {
            throw new BadRequestException(
                'Lapangan sedang tidak aktif',
            );
        }

        // 2. Memvalidasi tanggal
        if (!this.isValidDate(tanggal)) {
            throw new BadRequestException(
                'Format tanggal tidak valid',
            );
        }

        // 3. Mengambil reservasi aktif pada tanggal tersebut
        const jadwalTerisi = this.reservasi.filter(
            (item) =>
                item.lapanganId === lapanganId &&
                item.tanggal === tanggal &&
                item.status === 'BERHASIL',
        );

        // 4. Jika tidak meminta pengecekan jam tertentu,
        // tampilkan seluruh jadwal yang sudah terisi
        if (jamMulai === undefined && jamSelesai === undefined) {
            return {
                lapangan: lapangan.nama,
                tanggal: tanggal,
                jadwalTerisi: jadwalTerisi,
            };
        }

        // 5. Pastikan kedua parameter jam tersedia
        if (
            jamMulai === undefined ||
            jamSelesai === undefined ||
            this.toMinutes(jamMulai) === null ||
            this.toMinutes(jamSelesai) === null
        ) {
            throw new BadRequestException(
                'Jam mulai dan jam selesai harus valid',
            );
        }

        const mulai = this.toMinutes(jamMulai)!;
        const selesai = this.toMinutes(jamSelesai)!;

        if (mulai >= selesai) {
            throw new BadRequestException(
                'Jam selesai harus lebih besar dari jam mulai',
            );
        }

        // 6. Mengecek apakah jadwal bentrok
        const bentrok = jadwalTerisi.some(
            (item) =>
                this.toMinutes(item.jamMulai)! < selesai &&
                this.toMinutes(item.jamSelesai)! > mulai,
        );

        // 7. Mengembalikan hasil pengecekan
        return {
            lapangan: lapangan.nama,
            tanggal: tanggal,
            jamMulai: jamMulai,
            jamSelesai: jamSelesai,
            tersedia: !bentrok,
            message: bentrok
                ? 'Jadwal sudah dipesan'
                : 'Jadwal tersedia',
        };
    }
}
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class LapanganService {

    private lapangan = [
        {
            id: 1,
            nama: 'Lapangan Futsal A',
            jenisOlahraga: 'Futsal',
            hargaPerJam: 100000,
            aktif: true,
        },
        {
            id: 2,
            nama: 'Lapangan Futsal B',
            jenisOlahraga: 'Futsal',
            hargaPerJam: 120000,
            aktif: true,
        },
        {
            id: 3,
            nama: 'Lapangan Badminton A',
            jenisOlahraga: 'Badminton',
            hargaPerJam: 50000,
            aktif: true,
        },
        {
            id: 4,
            nama: 'Lapangan Basket A',
            jenisOlahraga: 'Basket',
            hargaPerJam: 150000,
            aktif: false,
        },
    ];

    findAll() {
        return this.lapangan;
    }

    findOne(id: number) {
        const data = this.lapangan.find(
            (item) => item.id === id,
        );

        if (!data) {
            throw new NotFoundException('Lapangan tidak ditemukan');
        }

        return data;
    }
}
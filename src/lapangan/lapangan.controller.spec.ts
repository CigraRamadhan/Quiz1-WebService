import {Controller, Get, Param} from '@nestjs/common';
import {LapanganService} from './lapangan.service';

@Controller('lapangan')
export class LapanganController{

  constructor(
    private readonly lapanganService: LapanganService,
  ) {}

  @Get()
  findAll(){
    return this.lapanganService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string){
    return this.lapanganService.findOne(Number(id));
  }
}

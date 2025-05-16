import { Controller, Get, Post, Body, Put, Param, Delete, BadRequestException } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { Servicio } from './entities/servicios.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';

@Controller('servicios')
  export class ServiciosController {
    constructor(private readonly serviciosService: ServiciosService) {}

    @Get()
    async findAll(): Promise<Servicio[]> {
        return this.serviciosService.findAll();
    }

    @Post()
    async create(@Body() servicio: CreateServicioDto): Promise<Servicio> {
        try { 
            return this.serviciosService.create(servicio);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() servicio: Servicio): Promise<Servicio> {
        return this.serviciosService.update(parseInt(id), servicio);
    }
    

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        await this.serviciosService.delete(parseInt(id));
    }
  
}

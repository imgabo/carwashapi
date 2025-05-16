import { Injectable, NotFoundException       } from '@nestjs/common';
import { Servicio } from './entities/servicios.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateServicioDto } from './dto/create-servicio.dto';
@Injectable()
export class ServiciosService {

    constructor(
        @InjectRepository(Servicio)
        private servicioRepository: Repository<Servicio>
    ) {}

    async findAll(): Promise<Servicio[]> {
        return this.servicioRepository.find();
    }

    async create(servicio: CreateServicioDto): Promise<Servicio> {
        return this.servicioRepository.save(servicio);
    } 

    async update(id: number, servicio: Servicio): Promise<Servicio> {
        const servicioExistente = await this.servicioRepository.findOne({ where: { id } });
        if (!servicioExistente) {
            throw new NotFoundException('Servicio no encontrado');
        }
        return this.servicioRepository.save({ ...servicioExistente, ...servicio });
    }       

    async delete(id: number): Promise<void> {
        await this.servicioRepository.delete(id);
    }
    
}

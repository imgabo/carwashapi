import { Injectable, NotFoundException       } from '@nestjs/common';
import { Servicio } from './entities/servicios.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

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

    async update(id: number, updateServicioDto: UpdateServicioDto): Promise<Servicio> {
        const servicio = await this.servicioRepository.findOne({ where: { id } });
        if (!servicio) {
            throw new NotFoundException('Servicio no encontrado');
        }

        // Actualizar solo los campos proporcionados
        Object.assign(servicio, updateServicioDto);
        
        return this.servicioRepository.save(servicio);
    }       

    async delete(id: number): Promise<void> {
        const result = await this.servicioRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Servicio no encontrado');
        }
    }
    
}

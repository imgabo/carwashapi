import { Injectable, NotFoundException       } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sucursal } from './entities/sucursales.entity';
import { CreateSucursalDto } from './dto/create-sucursal-dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Injectable()
export class SucursalesService {


    constructor(
        @InjectRepository(Sucursal)
        private readonly sucursalesRepository: Repository<Sucursal>,
    ) {}

    async findAll(): Promise<Sucursal[]> {
        return this.sucursalesRepository.find();
    }

    async create(sucursal: CreateSucursalDto): Promise<Sucursal> {
        return this.sucursalesRepository.save(sucursal);
    }

    async update(id: number, sucursal: UpdateSucursalDto): Promise<Sucursal> {
        const sucursalExistente = await this.sucursalesRepository.findOne({ where: { id } });
        if (!sucursalExistente) {
            throw new NotFoundException('Sucursal no encontrada');
        }
        
        await this.sucursalesRepository.update(id, sucursal);
        const sucursalActualizada = await this.sucursalesRepository.findOne({ where: { id } });
        if (!sucursalActualizada) {
            throw new NotFoundException('Error al actualizar la sucursal');
        }
        return sucursalActualizada;
    }

    async delete(id: number): Promise<void> {
        await this.sucursalesRepository.delete(id);
    }
}

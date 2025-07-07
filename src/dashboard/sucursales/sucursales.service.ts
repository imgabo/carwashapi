import { Injectable, NotFoundException } from '@nestjs/common';
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

    async update(id: number, updateSucursalDto: UpdateSucursalDto): Promise<Sucursal> {
        const sucursal = await this.sucursalesRepository.findOne({ where: { id } });
        if (!sucursal) {
            throw new NotFoundException('Sucursal no encontrada');
        }

        // Actualizar solo los campos proporcionados
        Object.assign(sucursal, updateSucursalDto);
        
        return this.sucursalesRepository.save(sucursal);
    }

    async delete(id: number): Promise<void> {
        const result = await this.sucursalesRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Sucursal no encontrada');
        }
    }
}

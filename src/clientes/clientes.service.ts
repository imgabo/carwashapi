import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RegisterClienteDto } from './dto/register-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from '../dashboard/empresas/entities/empresa.entity';

@Injectable()
export class ClientesService {
    constructor(
        @InjectRepository(Cliente)
        private clientesRepository: Repository<Cliente>,
        @InjectRepository(Empresa)
        private empresasRepository: Repository<Empresa>,
    ) {}

    async register(registerClienteDto: RegisterClienteDto): Promise<Cliente> {
        try {
            let empresa: Empresa | null = null;

            // Si se proporciona un ID de empresa, buscarla
            if (registerClienteDto.empresaId) {
                empresa = await this.empresasRepository.findOne({ 
                    where: { id: registerClienteDto.empresaId } 
                });
                if (!empresa) {
                    throw new NotFoundException('Empresa no encontrada');
                }
            }
            // Si se proporciona un nombre de empresa, crearla
            else if (registerClienteDto.empresaNombre) {
                empresa = this.empresasRepository.create({
                    name: registerClienteDto.empresaNombre
                });
                empresa = await this.empresasRepository.save(empresa);
            }

            const { empresaId, empresaNombre, ...clienteData } = registerClienteDto;
            const cliente = this.clientesRepository.create({
                ...clienteData,
                empresa: empresa || undefined
            });

            return this.clientesRepository.save(cliente);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al registrar el cliente', error);
        }
    }

    async findAll(): Promise<Cliente[]> {
        return this.clientesRepository.find({
            relations: ['empresa']
        });
    }

    async findOne(id: number): Promise<Cliente> {
        const cliente = await this.clientesRepository.findOne({ 
            where: { id },
            relations: ['empresa']
        });
        if (!cliente) {
            throw new NotFoundException('Cliente no encontrado');
        }
        return cliente;     
    }

    async remove(id: number): Promise<{ message: string }> {
        try{
            await this.clientesRepository.delete(id);
            return { message: 'Cliente eliminado correctamente' };
        } catch (error) {
            throw new BadRequestException('Error al eliminar el cliente', error);
        }

    }   
    
}

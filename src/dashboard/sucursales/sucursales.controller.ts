import { Controller, Get, Post, Body, Put, Param, Delete, BadRequestException } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { Sucursal } from './entities/sucursales.entity';
import { CreateSucursalDto } from './dto/create-sucursal-dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Controller('sucursales')
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  @Get()
  async findAll(): Promise<Sucursal[]> {
    return this.sucursalesService.findAll();
            }

  @Post()
  async create(@Body() sucursal: CreateSucursalDto): Promise<Sucursal> {
    try {
      return this.sucursalesService.create(sucursal);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() sucursal: UpdateSucursalDto): Promise<Sucursal> {
    return this.sucursalesService.update(parseInt(id), sucursal);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.sucursalesService.delete(parseInt(id));
  }
  

  
}

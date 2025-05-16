import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventaService.create(createVentaDto);
  }

  @Get('/export')
  async exportExcel(@Query('fechaInicio') fechaInicio: string, @Query('fechaFin') fechaFin: string) {
    const buffer = await this.ventaService.exportarExcel(fechaInicio, fechaFin);
    const base64 = buffer.toString('base64');
    return { file: base64 };
  }

  @Get()
  findAll() {
    return this.ventaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const ventaId = Number(id);
    if (isNaN(ventaId)) throw new BadRequestException('ID inválido');
    return this.ventaService.findOne(ventaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto) {
    const ventaId = Number(id);
    if (isNaN(ventaId)) throw new BadRequestException('ID inválido');
    return this.ventaService.update(ventaId, updateVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const ventaId = Number(id);
    if (isNaN(ventaId)) throw new BadRequestException('ID inválido');
    return this.ventaService.remove(ventaId);
  }
}

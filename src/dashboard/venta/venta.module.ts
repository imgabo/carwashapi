import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { Venta } from './entities/venta.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Sucursal } from 'src/dashboard/sucursales/entities/sucursales.entity';
import { Servicio } from 'src/dashboard/servicios/entities/servicios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, Cliente, Sucursal, Servicio])],
  controllers: [VentaController],
  providers: [VentaService],
})
export class VentaModule {}

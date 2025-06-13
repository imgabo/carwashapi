import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Venta } from './venta/entities/venta.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Sucursal } from './sucursales/entities/sucursales.entity';
import { Servicio } from './servicios/entities/servicios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venta, Cliente, Sucursal, Servicio])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {} 
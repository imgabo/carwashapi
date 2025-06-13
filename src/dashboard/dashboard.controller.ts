import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('ventas-totales')
  getVentasTotales() {
    return this.dashboardService.getVentasTotales();
  }

  @Get('clientes-registrados')
  getClientesRegistrados() {
    return this.dashboardService.getClientesRegistrados();
  }

  @Get('sucursales')
  getSucursales() {
    return this.dashboardService.getSucursales();
  }

  @Get('servicios')
  getServicios() {
    return this.dashboardService.getServicios();
  }

  @Get('ventas-recientes')
  getVentasRecientes(@Query('limit') limit: number = 3) {
    return this.dashboardService.getVentasRecientes(limit);
  }

  @Get('servicios-populares')
  getServiciosPopulares(@Query('limit') limit: number = 3) {
    return this.dashboardService.getServiciosPopulares(limit);
  }

  @Get('rendimiento-sucursal')
  getRendimientoSucursal() {
    return this.dashboardService.getRendimientoSucursal();
  }
} 
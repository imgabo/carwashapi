import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { TimePeriod } from './enums/time-period.enum';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('ventas-totales')
  getVentasTotales(@Query('period') period: TimePeriod = TimePeriod.CURRENT_MONTH) {
    return this.dashboardService.getVentasTotales(period);
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
  getVentasRecientes(
    @Query('limit') limit: number = 3,
    @Query('period') period: TimePeriod = TimePeriod.CURRENT_MONTH
  ) {
    return this.dashboardService.getVentasRecientes(limit, period);
  }

  @Get('servicios-populares')
  getServiciosPopulares(
    @Query('limit') limit: number = 3,
    @Query('period') period: TimePeriod = TimePeriod.CURRENT_MONTH
  ) {
    return this.dashboardService.getServiciosPopulares(limit, period);
  }

  @Get('rendimiento-sucursal')
  getRendimientoSucursal(
    @Query('period') period: TimePeriod = TimePeriod.CURRENT_MONTH
  ) {
    return this.dashboardService.getRendimientoSucursal(period);
  }
}
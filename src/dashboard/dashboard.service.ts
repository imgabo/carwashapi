import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Venta } from './venta/entities/venta.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Sucursal } from './sucursales/entities/sucursales.entity';
import { Servicio } from './servicios/entities/servicios.entity';
import { TimePeriod } from './enums/time-period.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  private getDateRange(period: TimePeriod): { startDate: Date; endDate: Date } {
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    let startDate: Date;

    switch (period) {
      case TimePeriod.CURRENT_MONTH:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case TimePeriod.LAST_THREE_MONTHS:
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        break;
      case TimePeriod.LAST_SIX_MONTHS:
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        break;
      case TimePeriod.CURRENT_YEAR:
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return { startDate, endDate };
  }

  async getVentasTotales(period: TimePeriod) {
    const { startDate, endDate } = this.getDateRange(period);
    const total = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('SUM(venta.total)', 'total')
      .where('venta.pagado = :pagado', { pagado: true })
      .andWhere('venta.createdAt BETWEEN :start AND :end', { 
        start: startDate, 
        end: endDate 
      })
      .getRawOne();
    return { total: Number(total.total) || 0 };
  }

  async getClientesRegistrados() {
    const total = await this.clienteRepository.count();
    return { total };
  }

  async getSucursales() {
    const total = await this.sucursalRepository.count();
    return { total };
  }

  async getServicios() {
    const total = await this.servicioRepository.count();
    return { total };
  }

  async getVentasRecientes(limit: number, period: TimePeriod) {
    const { startDate, endDate } = this.getDateRange(period);
    const ventas = await this.ventaRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
        pagado: true
      },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['cliente', 'servicios'],
    });

    return ventas.map(v => ({
      cliente: v.cliente ? `${v.cliente.name} ${v.cliente.apellido}` : '',
      servicio: v.servicios && v.servicios.length > 0 ? v.servicios.map(s => s.nombre).join(', ') : '',
      monto: v.total,
      fecha: v.createdAt.toISOString().split('T')[0],
    }));
  }

  async getServiciosPopulares(limit: number, period: TimePeriod) {
    const { startDate, endDate } = this.getDateRange(period);
    
    const result = await this.ventaRepository
      .createQueryBuilder('venta')
      .innerJoinAndSelect('venta.servicios', 'servicio')
      .select('servicio.nombre', 'nombre')
      .addSelect('COUNT(DISTINCT venta.id)', 'cantidad')
      .addSelect('SUM(venta.total)', 'total')
      .where('venta.createdAt BETWEEN :start AND :end', { 
        start: startDate, 
        end: endDate 
      })
      .andWhere('venta.pagado = :pagado', { pagado: true })
      .groupBy('servicio.id')
      .addGroupBy('servicio.nombre')
      .orderBy('cantidad', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(r => ({
      nombre: r.nombre,
      cantidad: Number(r.cantidad),
      total: Number(r.total) || 0
    }));
  }

  async getRendimientoSucursal(period: TimePeriod) {
    const { startDate, endDate } = this.getDateRange(period);
    
    const result = await this.ventaRepository
      .createQueryBuilder('venta')
      .innerJoinAndSelect('venta.sucursal', 'sucursal')
      .select('sucursal.nombre', 'nombre')
      .addSelect('COUNT(DISTINCT venta.id)', 'cantidadVentas')
      .addSelect('SUM(venta.total)', 'total')
      .where('venta.createdAt BETWEEN :start AND :end', { 
        start: startDate, 
        end: endDate 
      })
      .andWhere('venta.pagado = :pagado', { pagado: true })
      .groupBy('sucursal.id')
      .addGroupBy('sucursal.nombre')
      .orderBy('total', 'DESC')
      .getRawMany();

    return result.map(r => ({
      nombre: r.nombre,
      cantidadVentas: Number(r.cantidadVentas),
      total: Number(r.total) || 0
    }));
  }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta/entities/venta.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Sucursal } from './sucursales/entities/sucursales.entity';
import { Servicio } from './servicios/entities/servicios.entity';

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

  async getVentasTotales() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const total = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('SUM(venta.total)', 'total')
      .where('venta.pagado = :pagado', { pagado: true })
      .andWhere('venta.createdAt BETWEEN :start AND :end', { start: firstDay, end: lastDay })
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

  async getVentasRecientes(limit: number) {
    const ventas = await this.ventaRepository.find({
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

  async getServiciosPopulares(limit: number) {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const result = await this.ventaRepository
      .createQueryBuilder('venta')
      .leftJoin('venta.servicios', 'servicio')
      .select('servicio.nombre', 'nombre')
      .addSelect('COUNT(servicio.id)', 'cantidad')
      .where('venta.createdAt BETWEEN :start AND :end', { start: firstDay, end: lastDay })
      .groupBy('servicio.nombre')
      .orderBy('cantidad', 'DESC')
      .limit(limit)
      .getRawMany();
    return result.map(r => ({ nombre: r.nombre, cantidad: Number(r.cantidad) }));
  }

  async getRendimientoSucursal() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const result = await this.ventaRepository
      .createQueryBuilder('venta')
      .leftJoin('venta.sucursal', 'sucursal')
      .select('sucursal.nombre', 'nombre')
      .addSelect('SUM(venta.total)', 'total')
      .where('venta.createdAt BETWEEN :start AND :end', { start: firstDay, end: lastDay })
      .groupBy('sucursal.nombre')
      .orderBy('total', 'DESC')
      .getRawMany();
    return result.map(r => ({ nombre: r.nombre, total: Number(r.total) }));
  }
} 
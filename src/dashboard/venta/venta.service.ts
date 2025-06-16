import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Sucursal } from 'src/dashboard/sucursales/entities/sucursales.entity';
import { Servicio } from 'src/dashboard/servicios/entities/servicios.entity';
import * as ExcelJS from 'exceljs';
import { Between } from 'typeorm';

@Injectable()
export class VentaService {
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

  async create(createVentaDto: CreateVentaDto) {
    const cliente = await this.clienteRepository.findOne({ where: { id: createVentaDto.clienteId } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    const sucursal = await this.sucursalRepository.findOne({ where: { id: createVentaDto.sucursalId } });
    if (!sucursal) throw new NotFoundException('Sucursal no encontrada');

    const servicios = await this.servicioRepository.findByIds(createVentaDto.serviciosIds);
    if (servicios.length !== createVentaDto.serviciosIds.length) throw new NotFoundException('Uno o más servicios no encontrados');

    const serviciosPersonalizados = createVentaDto.serviciosPersonalizados || [];

    // Calcular total
    const totalServicios = servicios.reduce((sum, s) => sum + s.precio, 0);
    const totalPersonalizados = serviciosPersonalizados.reduce((sum, s) => sum + s.precio, 0);
    const total = totalServicios + totalPersonalizados;

    const venta = this.ventaRepository.create({
      cliente,
      sucursal,
      servicios,
      serviciosPersonalizados,
      patente: createVentaDto.patente,
      pagado: createVentaDto.pagado,
      total,
    });
    return this.ventaRepository.save(venta);
  }

  async findAll() {
    // Primero los no pagados, luego los pagados, ambos ordenados por fecha ascendente
    const ventasNoPagadas = await this.ventaRepository.find({ where: { pagado: false }, order: { createdAt: 'ASC' } });
    const ventasPagadas = await this.ventaRepository.find({ where: { pagado: true }, order: { createdAt: 'ASC' } });
    return [...ventasNoPagadas, ...ventasPagadas];
  }

  findOne(id: number) {
    return this.ventaRepository.findOne({ where: { id } });
  }

  async update(id: number, updateVentaDto: UpdateVentaDto) {
    const venta = await this.ventaRepository.findOne({ where: { id }, relations: ['cliente', 'sucursal', 'servicios'] });
    if (!venta) throw new NotFoundException('Venta no encontrada');

    if (updateVentaDto.clienteId) {
      const cliente = await this.clienteRepository.findOne({ where: { id: updateVentaDto.clienteId } });
      if (!cliente) throw new NotFoundException('Cliente no encontrado');
      venta.cliente = cliente;
    }

    if (updateVentaDto.sucursalId) {
      const sucursal = await this.sucursalRepository.findOne({ where: { id: updateVentaDto.sucursalId } });
      if (!sucursal) throw new NotFoundException('Sucursal no encontrada');
      venta.sucursal = sucursal;
    }

    if (updateVentaDto.serviciosIds) {
      const servicios = await this.servicioRepository.findByIds(updateVentaDto.serviciosIds);
      if (servicios.length !== updateVentaDto.serviciosIds.length) throw new NotFoundException('Uno o más servicios no encontrados');
      venta.servicios = servicios;
    }

    if (updateVentaDto.serviciosPersonalizados) {
      venta.serviciosPersonalizados = updateVentaDto.serviciosPersonalizados;
    }

    if (updateVentaDto.patente !== undefined) {
      venta.patente = updateVentaDto.patente;
    }

    if (typeof updateVentaDto.pagado === 'boolean') {
      venta.pagado = updateVentaDto.pagado;
    }

    // Recalcular total
    const totalServicios = venta.servicios ? venta.servicios.reduce((sum, s) => sum + s.precio, 0) : 0;
    const totalPersonalizados = venta.serviciosPersonalizados ? venta.serviciosPersonalizados.reduce((sum, s) => sum + s.precio, 0) : 0;
    venta.total = totalServicios + totalPersonalizados;

    return this.ventaRepository.save(venta);
  }

  async remove(id: number) {
    const venta = await this.ventaRepository.findOne({ where: { id } });
    if (!venta) throw new NotFoundException('Venta no encontrada');
    await this.ventaRepository.remove(venta);
    return { message: 'Venta eliminada correctamente' };
  }

  async exportarExcel(fechaInicio: string, fechaFin: string): Promise<Buffer> {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);
    const ventas = await this.ventaRepository.find({
      where: {
        createdAt: Between(inicio, fin),
      },
      relations: ['cliente', 'cliente.empresa', 'sucursal', 'servicios'],
      order: { createdAt: 'ASC' },
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');
    worksheet.columns = [
      { header: 'Cliente', key: 'cliente', width: 20 },
      { header: 'Empresa', key: 'empresa', width: 25 },
      { header: 'Sucursal', key: 'sucursal', width: 20 },
      { header: 'Patente', key: 'patente', width: 10 },
      { header: 'Servicios', key: 'servicios', width: 30 },
      { header: 'Servicios Personalizados', key: 'serviciosPersonalizados', width: 40 },
      { header: 'Total', key: 'total', width: 12 },
      { header: 'Pagado', key: 'pagado', width: 10 },
      { header: 'Fecha de Creación', key: 'createdAt', width: 22 },
    ];

    // Estilo de encabezado
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1976D2' }, // Azul
      };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    ventas.forEach((venta, idx) => {
      const row = worksheet.addRow({
        cliente: venta.cliente ? `${venta.cliente.name} ${venta.cliente.apellido}` : '',
        empresa: venta.cliente?.empresa ? venta.cliente.empresa.name : '',
        sucursal: venta.sucursal ? venta.sucursal.nombre : '',
        patente: venta.patente || '',
        servicios: venta.servicios ? venta.servicios.map((s) => s.nombre).join(', ') : '',
        serviciosPersonalizados: venta.serviciosPersonalizados && venta.serviciosPersonalizados.length > 0
          ? venta.serviciosPersonalizados
              .map((sp) => `${sp.nombre} ($${sp.precio}): ${sp.descripcion}`)
              .join(' | ')
          : '',
        total: venta.total,
        pagado: venta.pagado ? 'Sí' : 'No',
        createdAt: venta.createdAt ? venta.createdAt.toLocaleString() : '',
      });
      // Bordes y color alterno
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        if (idx % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE3F2FD' }, // Azul muy claro
          };
        }
      });
    });

    // Calcular totales
    const totalPagado = ventas.filter(v => v.pagado).reduce((sum, v) => sum + Number(v.total), 0);
    const totalNoPagado = ventas.filter(v => !v.pagado).reduce((sum, v) => sum + Number(v.total), 0);
    const granTotal = totalPagado + totalNoPagado;
    const formatMonto = (monto: number) => monto.toLocaleString('es-ES');

    // Fila vacía
    worksheet.addRow([]);
    // Fila de totales pagado
    const rowPagado = worksheet.addRow({
      cliente: '',
      empresa: '',
      sucursal: '',
      patente: '',
      servicios: '',
      serviciosPersonalizados: '',
      total: 'Total Pagado:',
      pagado: '',
      createdAt: formatMonto(totalPagado),
    });
    // Fila de totales no pagado
    const rowNoPagado = worksheet.addRow({
      cliente: '',
      empresa: '',
      sucursal: '',
      patente: '',
      servicios: '',
      serviciosPersonalizados: '',
      total: 'Total No Pagado:',
      pagado: '',
      createdAt: formatMonto(totalNoPagado),
    });
    // Fila de gran total
    const rowGranTotal = worksheet.addRow({
      cliente: '',
      empresa: '',
      sucursal: '',
      patente: '',
      servicios: '',
      serviciosPersonalizados: '',
      total: 'Gran Total:',
      pagado: '',
      createdAt: formatMonto(granTotal),
    });

    // Estilos para las filas de totales
    const styleRow = (row, color) => {
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: color },
        };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
      });
    };
    styleRow(rowPagado, 'FF388E3C');      // Verde
    styleRow(rowNoPagado, 'FFD32F2F');    // Rojo
    styleRow(rowGranTotal, 'FF1976D2');   // Azul oscuro

    // Ajuste automático de ancho de columnas
    if (Array.isArray(worksheet.columns)) {
      worksheet.columns.forEach((column) => {
        let maxLength = 10;
        if (typeof column.eachCell === 'function') {
          column.eachCell({ includeEmpty: true }, (cell) => {
            const cellValue = cell.value ? cell.value.toString() : '';
            if (cellValue.length > maxLength) {
              maxLength = cellValue.length;
            }
          });
        }
        column.width = maxLength < 20 ? 20 : maxLength + 2;
      });
    }

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  }
}

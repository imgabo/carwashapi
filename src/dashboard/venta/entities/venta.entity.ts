import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Sucursal } from 'src/dashboard/sucursales/entities/sucursales.entity';
import { Servicio } from 'src/dashboard/servicios/entities/servicios.entity';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, { eager: true })
  cliente: Cliente;

  @ManyToOne(() => Sucursal, { eager: true })
  sucursal: Sucursal;

  @ManyToMany(() => Servicio, { eager: true })
  @JoinTable({ name: 'venta_servicios' })
  servicios: Servicio[];

  @Column('json', { nullable: true })
  serviciosPersonalizados: {
    nombre: string;
    precio: number;
    descripcion: string;
  }[];

  @Column({ length: 10, nullable: true })
  patente: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ default: false })
  pagado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

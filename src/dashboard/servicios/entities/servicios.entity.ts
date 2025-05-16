import { PrimaryGeneratedColumn, Entity, Column, ManyToMany } from "typeorm";
import { Venta } from 'src/dashboard/venta/entities/venta.entity';

@Entity('servicios')
export class Servicio {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    precio: number;

    @ManyToMany(() => Venta, (venta) => venta.servicios)
    ventas: Venta[];
}           

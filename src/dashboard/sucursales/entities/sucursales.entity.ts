import {  Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Venta } from 'src/dashboard/venta/entities/venta.entity';

@Entity('sucursales')   
export class Sucursal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()           
    nombre: string;

    @Column()
    direccion: string;

    @OneToMany(() => Venta, (venta) => venta.sucursal)
    ventas: Venta[];
}

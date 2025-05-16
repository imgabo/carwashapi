import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Empresa } from "../../dashboard/empresas/entities/empresa.entity";
import { Venta } from 'src/dashboard/venta/entities/venta.entity';

@Entity('clientes')
export class Cliente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    apellido: string;

    @Column()
    telefono: string;

    @ManyToOne(() => Empresa)
    @JoinColumn({ name: 'empresa_id' })
    empresa: Empresa;

    @OneToMany(() => Venta, (venta) => venta.cliente)
    ventas: Venta[];
}

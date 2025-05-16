import { Cliente } from "src/clientes/entities/cliente.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('empresas') 
export class Empresa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Cliente, (cliente) => cliente.empresa)
    clientes: Cliente[];
    
}

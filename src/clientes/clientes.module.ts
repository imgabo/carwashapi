import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Empresa } from 'src/dashboard/empresas/entities/empresa.entity';
import { EmpresasModule } from 'src/dashboard/empresas/empresas.module';
import { ServiciosModule } from 'src/dashboard/servicios/servicios.module';   

@Module({
  imports: [ 
    TypeOrmModule.forFeature([Cliente, Empresa]), 
    EmpresasModule, 
    ServiciosModule 
  ],  
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}

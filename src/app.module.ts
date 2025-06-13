import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginModule } from './login/login.module';
import { User } from './login/entities/user.entity';
import { join } from 'path';
import { ClientesModule } from './clientes/clientes.module';
import { EmpresasModule } from './dashboard/empresas/empresas.module';
import { ServiciosModule } from './dashboard/servicios/servicios.module';
import { EmpresasService } from './dashboard/empresas/empresas.service';
import { SucursalesModule } from './dashboard/sucursales/sucursales.module';
import { VentaModule } from './dashboard/venta/venta.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: false
    }),
    LoginModule,
    ClientesModule,
    EmpresasModule,
    ServiciosModule,
    SucursalesModule,
    VentaModule,
    DashboardModule
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}

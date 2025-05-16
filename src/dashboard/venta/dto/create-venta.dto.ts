import { IsBoolean, IsNumber, IsArray, IsOptional, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class ServicioPersonalizadoDto {
  @IsString()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsString()
  descripcion: string;
}

export class CreateVentaDto {
  @IsNumber()
  clienteId: number;

  @IsNumber()
  sucursalId: number;

  @IsArray()
  serviciosIds: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicioPersonalizadoDto)
  @IsOptional()
  serviciosPersonalizados?: ServicioPersonalizadoDto[];

  @IsBoolean()
  pagado: boolean;

  @IsOptional()
  @IsNumber()
  total?: number;
}

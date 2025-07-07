import { IsOptional, IsString } from 'class-validator';

export class UpdateSucursalDto {
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsString()
    direccion?: string;
}




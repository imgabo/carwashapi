import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateClienteDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    apellido?: string;

    @IsString()
    @IsOptional()
    telefono?: string;

    @IsNumber()
    @IsOptional()
    empresaId?: number;

    @IsString()
    @IsOptional()
    empresaNombre?: string;
} 
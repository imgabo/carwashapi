import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateServicioDto {
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsNumber()
    precio?: number;

 
}
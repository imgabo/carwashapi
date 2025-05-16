import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class RegisterClienteDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'El apellido es requerido' })
    apellido: string;

    @IsString()
    @IsNotEmpty({ message: 'El telefono es requerido' })
    telefono: string;

    @IsNumber()
    @IsOptional()
    empresaId?: number;

    @IsString()
    @IsOptional()
    empresaNombre?: string;
}

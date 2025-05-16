
import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class CreateServicioDto {    

    @IsNotEmpty( { message: 'El nombre del servicio es requerido' } )
    @IsString()
    nombre: string;

    @IsNotEmpty( { message: 'El precio del servicio es requerido' } )
    @IsNumber()
    precio: number;

}
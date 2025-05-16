import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";

export class CreateSucursalDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    direccion: string;
}
        



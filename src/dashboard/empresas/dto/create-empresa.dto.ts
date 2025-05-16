import { IsNotEmpty, IsString } from "class-validator";

export class CreateEmpresaDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    name: string;
    

}

import { Body, Controller, Param, Get, Post, Delete } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { RegisterClienteDto } from './dto/register-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  register(@Body() registerClienteDto: RegisterClienteDto) {
    return this.clientesService.register(registerClienteDto);
  }

  @Get()
  findAll() {   
    return this.clientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }
}
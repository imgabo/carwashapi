import { Body, Controller, Param, Get, Post, Delete, Patch } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { RegisterClienteDto } from './dto/register-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }
}
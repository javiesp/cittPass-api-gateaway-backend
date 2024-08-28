import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CheckInService } from './check-in.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { UpdateCheckInDto } from './dto/update-check-in.dto';
import { CheckIn } from './entities/check-in.entity';
import { MessagePattern } from '@nestjs/microservices';
import { AuthGuard } from 'src/users/jwt.guard';

@Controller('check-in')
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post('/create-check-in')
  async createCheckIn(@Body() createCheckInDto: CreateCheckInDto) {
    createCheckInDto.entry_date = new Date();
    return this.checkInService.createCheckIn(createCheckInDto);
  }

  @Get('/find-all-check-in')
  @UseGuards(AuthGuard) 
  findAllByDate() {
    return this.checkInService.findAllByDate();
  }

  @Get('/find-all-by-uid-user')
  async findAllByUIDUser(
    @Query('uid_user') uid_user: string,
  ): Promise<boolean> {
    return this.checkInService.findAllByUidUser(uid_user);
  }

  @Get('/find-by-date-range')
  async findAllByDateRange(
    @Query('startDate') startDateStr: string,
    @Query('endDate') endDateStr: string
  ): Promise<CheckIn[]> { 
  
    // Convertir la cadena de fecha de inicio a objeto Date
    const [startDay, startMonth, startYear] = startDateStr.split('/').map(Number);
    const startDateObj = new Date(startYear, startMonth - 1, startDay);
  
    // Convertir la cadena de fecha de fin a objeto Date
    const [endDay, endMonth, endYear] = endDateStr.split('/').map(Number);
    const endDateObj = new Date(endYear, endMonth - 1, endDay);
  
    // Obtener la fecha actual
    const currentDate = new Date();
  
    // Convertir Date objects a ISO strings después de convertir a UTC
    const isoStartDate = startDateObj.toISOString();
    const isoEndDate = endDateObj.toISOString();
    
    // Llamar al servicio para encontrar check-ins dentro del rango de fechas
    return this.checkInService.findAllByDateRange(isoStartDate, isoEndDate);
  }

  @Get('/find-by-day')
  async findAllByDay(
    @Query('date') dateStr: string
  ): Promise<CheckIn[]> {
    // Convertir la cadena de fecha a objeto Date
    const [day, month, year] = dateStr.split('/').map(Number);
    const startDate = new Date(year, month - 1, day);
    
    // Establecer la hora de inicio y fin del día
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    // Convertir a ISO strings para consulta
    const isoStartDate = startDate.toISOString();
    const isoEndDate = endDate.toISOString();

    // Llamar al servicio para encontrar check-ins del día especificado
    return this.checkInService.findAllByDay(isoStartDate, isoEndDate);
  }

  @Get('/find-by-day-and-user')
  async findAllByDayAndUser(
    @Query('date') dateStr: string,
    @Query('uid_user') uidUser: string
  ): Promise<CheckIn[]> {
    // Convertir la cadena de fecha a objeto Date
    const [day, month, year] = dateStr.split('/').map(Number);
    const startDate = new Date(year, month - 1, day);
    
    // Establecer la hora de inicio y fin del día
    const endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);

    // Convertir a ISO strings para consulta
    const isoStartDate = startDate.toISOString();
    const isoEndDate = endDate.toISOString();

    // Llamar al servicio para encontrar check-ins del día especificado y del usuario
    return this.checkInService.findAllByDayAndUser(isoStartDate, isoEndDate, uidUser);
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCheckInDto: UpdateCheckInDto) {
    return this.checkInService.update(+id, updateCheckInDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkInService.remove(+id);
  }
}

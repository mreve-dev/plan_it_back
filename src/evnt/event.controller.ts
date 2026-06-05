import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Evnt } from 'prisma/generated/prisma/client';
import { Roles } from 'src/auth/guard/decorators/roles.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  async create(@Body() createEventDto: CreateEventDto) : Promise<Evnt> {
    return this.eventService.create(createEventDto);
  }

  @Get()
  async findAll() : Promise<Evnt[] | null> {
    return this.eventService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<Evnt | null> {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEvent: UpdateEventDto) : Promise<Evnt> {
    return this.eventService.update(+id, updateEvent)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<Evnt> {
    return this.eventService.remove(+id);
  }
}

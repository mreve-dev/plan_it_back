import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Evnt } from 'prisma/generated/prisma/client';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) : Promise<Evnt> {
    console.log("🚀 ~ EventController ~ create ~ createEventDto:", createEventDto)
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
  async remove(@Param('id') id: string) : Promise<void> {
    return this.eventService.remove(+id);
  }
}

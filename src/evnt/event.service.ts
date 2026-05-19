import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Evnt } from 'prisma/generated/prisma/client';


@Injectable()
export class EventService {

  constructor(private readonly prisma : PrismaService){}

  async create(createEvent: CreateEventDto) {

    createEvent.date = new Date(createEvent.date)
    const newEvent : Evnt = await this.prisma.evnt.create({
      data : {
        ...createEvent,
        start_hour: new Date(`1970-01-01T${createEvent.start_hour}:00`),
        end_hour: new Date(`1970-01-01T${createEvent.end_hour}:00`)
      } 
    })

    return newEvent
  }

  async findAll(): Promise<Evnt[]> {
    return this.prisma.evnt.findMany();
  }

  async findOne(id: number): Promise<Evnt | null> {
    return this.prisma.evnt.findUnique({where: {id}});
  }

  async update(id: number, updateEventDto: UpdateEventDto) : Promise<Evnt> {
    return this.prisma.evnt.update({
      where : {id},
      data: updateEventDto
    });
  }


  async remove(id: number) : Promise<Evnt> {
    return this.prisma.evnt.delete({where : {id}});
  }
}

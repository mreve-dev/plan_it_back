import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Evnt } from 'prisma/generated/prisma/client';


@Injectable()
export class EventService {

  constructor(private readonly prisma : PrismaService){}

  async create(createEvent: any) {

    createEvent.date = new Date(createEvent.date)
    const newEvent : Evnt = await this.prisma.evnt.create({
      data : createEvent
    })

    return newEvent
  }

  findAll() {
    return this.prisma.evnt.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}

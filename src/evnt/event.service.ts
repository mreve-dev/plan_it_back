import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Evnt } from 'prisma/generated/prisma/client';



@Injectable()
export class EventService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createEvent: CreateEventDto) {

    const newEvent: Evnt = await this.prisma.evnt.create({
      data: {
        ...createEvent,
        start_date: new Date(createEvent.start_date),
        end_date: new Date(createEvent.end_date),
        start_hour: new Date(`1970-01-01T${createEvent.start_hour}:00`),
        end_hour: new Date(`1970-01-01T${createEvent.end_hour}:00`)
      }
    })

    return newEvent
  }

  async findAll(): Promise<Evnt[]> {
    return this.prisma.evnt.findMany({
      include: {
        category: true,
        missions: {
          include: {
            missionSlots: {
              include: {
                userHasMissions: {
                  include: { 
                    user: {
                      omit: {
                        email: true,
                        password: true
                      }
                    }
                      
                   }
                }
              }
            }
          }
        }
      }
    });
  }

  async findOne(id: number): Promise<Evnt | null> {
    const evnt = await this.prisma.evnt.findUnique(
      {
        where: { id },
        include: {
          category: true,
          missions: {
            include: {
              missionSlots: {
                include: {
                  userHasMissions: {
                    include: { 
                      user: {
                        omit: {
                          email: true,
                          password: true
                        }
                      } }
                  }
                }
              }
            }
          },
          eventHasDocument: {
            include: { document: true }
          }
        }
      });

      if(!evnt) {
        throw new NotFoundException(`Event ${id} not found`)
      }

      return evnt
  }

  async update(id: number, updateEventDto: UpdateEventDto, userId: number): Promise<Evnt> {


    const { start_hour, end_hour, start_date, end_date, ...rest } = updateEventDto

    const updated = await this.prisma.evnt.update({

      where: { id },
      data: {
        ...rest,
        updatedById: userId,
        ...(start_date && { start_date: new Date(start_date) }),
        ...(end_date && { end_date: new Date(end_date) }),
        ...(start_hour && { start_hour: new Date(`1970-01-01T${start_hour}:00`) }),
        ...(end_hour && { end_hour: new Date(`1970-01-01T${end_hour}:00`) })
      }
    });

    return updated
  }


  async remove(id: number): Promise<Evnt> {
    return this.prisma.evnt.delete({ where: { id } });
  }
}

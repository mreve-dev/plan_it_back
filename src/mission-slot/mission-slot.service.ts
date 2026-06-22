import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMissionSlotDto } from './dto/create-mission-slot.dto';
import { UpdateMissionSlotDto } from './dto/update-mission-slot.dto';
import { PrismaService } from 'prisma/prisma.service';
import { MissionSlot } from 'prisma/generated/prisma/client';
import { CreateManyMissionSlotDto } from './dto/create-many-mission-slot.dto';


@Injectable()
export class MissionSlotService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createMissionSlot: CreateMissionSlotDto) {

    const newSlot = await this.prisma.missionSlot.create({
      data: {
        ...createMissionSlot,
        date: new Date(createMissionSlot.date),
        start_hour: new Date(`1970-01-01T${createMissionSlot.start_hour}:00`),
        end_hour: new Date(`1970-01-01T${createMissionSlot.end_hour}:00`)
      }
    })
    return newSlot;
  }

  async createMany(createManySlots: CreateManyMissionSlotDto): Promise<MissionSlot[]> {
    const dataToInsert = createManySlots.slots.map(slot => ({
      missionId: createManySlots.missionId,
      date: new Date(slot.date),
      start_hour: new Date(`1970-01-01T${slot.start_hour}:00`),
      end_hour: new Date(`1970-01-01T${slot.end_hour}:00`),
      max_volunteers: slot.max_volunteers
    }))
    
    // createMany ne renvoie qu'un compteur, donc on insère puis on relit
    // les slots qui viennent d'être créés via un timestamp de référence
    const beforeInsert = new Date()

    await this.prisma.missionSlot.createMany({
        data: dataToInsert
    })

    return this.prisma.missionSlot.findMany({
      where: {
        missionId:createManySlots.missionId,
        createdAt: {gte: beforeInsert}
      },
      include: {
        userHasMissions: {
          include: {
            user: {
              omit: { email: true, password: true }
            }
          }
        }
      }
    })
  }

  async findAll(): Promise<MissionSlot[] | null> {

    return this.prisma.missionSlot.findMany({
      include: {
        mission: true,
        userHasMissions: {
          include: { 
            user: {
              omit: { email: true, password: true }
            } }
        },
        updater: true
      }
    });
  }

  async findOne(id: number): Promise<MissionSlot | null> {
    const slot = await this.prisma.missionSlot.findUnique({
      where: { id },
      include: {
        mission: true,
        userHasMissions: {
          include: { 
            user: {
              omit: { email: true, password: true }
            }
           }
        },
        updater: true
      }
    });

    if (!slot) {
      throw new NotFoundException(`MissionSlot ${id} not found`)
    }

    return slot
  }

  async update(id: number, updateMissionSlotDto: UpdateMissionSlotDto, userId: number) {

    await this.findOne(id)

    const { date, start_hour, end_hour, ...rest } = updateMissionSlotDto

    return this.prisma.missionSlot.update({
      where: { id },
      data: {
        ...rest,
        updatedById: userId,
        ...(date && { date: new Date(date) }),
        ...(start_hour && { start_hour: new Date(`1970-01-01T${start_hour}:00`) }),
        ...(end_hour && { end_hour: new Date(`1970-01-01T${end_hour}:00`) }),
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.missionSlot.delete({
      where: { id }
    });
  }
}

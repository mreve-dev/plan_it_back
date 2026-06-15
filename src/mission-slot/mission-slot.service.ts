import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMissionSlotDto } from './dto/create-mission-slot.dto';
import { UpdateMissionSlotDto } from './dto/update-mission-slot.dto';
import { PrismaService } from 'prisma/prisma.service';
import { MissionSlot } from 'prisma/generated/prisma/client';


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

  async findAll(): Promise<MissionSlot[] | null> {

    return this.prisma.missionSlot.findMany({
      include: {
        mission: true,
        userHasMissions: {
          include: { user: true }
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
          include: { user: true }
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

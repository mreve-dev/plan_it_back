import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Mission } from 'prisma/generated/prisma/client';

@Injectable()
export class MissionService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createMission: CreateMissionDto) {

    const newMission: Mission = await this.prisma.mission.create({
      data: {
        name: createMission.name,
        description: createMission.description,
        max_volunteers: createMission.max_volunteers,
        date: new Date(createMission.date),
        start_hour: new Date(`1970-01-01T${createMission.start_hour}:00`),
        end_hour: new Date(`1970-01-01T${createMission.end_hour}:00`),
        eventId: createMission.eventId,
        creatorId: createMission.creatorId
      }
    })
    return newMission;
  }

  async findAll() {
    const mission: Mission[] = await this.prisma.mission.findMany()
    return mission;
  }

  async findOne(id: number) {

    const mission: Mission | null = await this.prisma.mission.findUnique({ where: { id } })

    if (!mission) {
      throw new NotFoundException(`Mission ${id} not found`)
    }
    return mission;
  }

  async update(id: number, updateMission: UpdateMissionDto) {

    await this.findOne(id)

    return this.prisma.mission.update({
      where: { id },
      data: updateMission
    });
  }

  async remove(id: number) {
    await this.findOne(id)

    return this.prisma.mission.delete({ where: { id } });
  }
}

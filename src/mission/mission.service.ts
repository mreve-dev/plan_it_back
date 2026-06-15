import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MissionService {

  constructor(private readonly prisma: PrismaService) { }

  async create(createMission: CreateMissionDto) {

    const newMission = await this.prisma.mission.create({
      data: {
        name: createMission.name,
        description: createMission.description,
        eventId: createMission.eventId,
        creatorId: createMission.creatorId,
        // Création des slots en même temps que la mission
        missionSlots: {
          create: createMission.slots.map(slot => ({
            date: new Date(slot.date),
            start_hour: new Date(`1970-01-01T${slot.start_hour}:00`),
            end_hour: new Date(`1970-01-01T${slot.end_hour}:00`),
            max_volunteers: slot.max_volunteers
          }))
        }
      },
      include: {
        missionSlots: true
      }
    })
    return newMission;
  }



  async findAll() {
    const mission = await this.prisma.mission.findMany({
      include: {
        missionSlots: true,
        missionHasSkills: {
          include: {skill: true}
        }
      }
    })

    return mission;
  }

  async findOne(id: number) {

    const mission = await this.prisma.mission.findUnique({ 
      where: { id },
      include: {
        missionSlots: {
          include: {
            userHasMissions: {
              include: {user: true}
            }
          }
        },
        missionHasSkills: {
          include: {skill: true}
        }
      }
    })

    if (!mission) {
      throw new NotFoundException(`Mission ${id} not found`)
    }
    return mission;
  }

  async update(id: number, updateMission: UpdateMissionDto, userId: number) {

    await this.findOne(id)

    return this.prisma.mission.update({
      where: { id },
      data: {
        ...updateMission,
        updatedById: userId
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id)
    return this.prisma.mission.delete({ where: { id } });
  }
}

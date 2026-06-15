import { Module } from '@nestjs/common';
import { MissionSlotService } from './mission-slot.service';
import { MissionSlotController } from './mission-slot.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [MissionSlotController],
  providers: [MissionSlotService, PrismaService],
})
export class MissionSlotModule {}

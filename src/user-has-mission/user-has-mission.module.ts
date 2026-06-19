import { Module } from '@nestjs/common';
import { UserHasMissionService } from './user-has-mission.service';
import { UserHasMissionController } from './user-has-mission.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [UserHasMissionController],
  providers: [UserHasMissionService, PrismaService],
})
export class UserHasMissionModule {}

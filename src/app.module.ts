import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './evnt/event.module';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MissionModule } from './mission/mission.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { SkillModule } from './skill/skill.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), EventModule, PrismaModule, UserModule, MissionModule, AuthModule, CategoryModule, SkillModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
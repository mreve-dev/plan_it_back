import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
    exports: [PrismaService],
    providers: [PrismaService],
})
@Global()
export class PrismaModule{}
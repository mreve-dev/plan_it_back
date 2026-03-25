
import { Injectable } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { PrismaMariaDb } from "@prisma/adapter-mariadb";


@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        console.log("🚀 ~ prisma.service.ts:10 ~ PrismaService ~ constructor ~ process.env.DATABASE_URL:", process.env.DATABASE_URL)
        const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);
        super({ adapter });
    }
}

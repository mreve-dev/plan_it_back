import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from 'utils/filter/prisma.exception';
import { HttpExceptionFilter } from 'utils/filter/http.exception';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform:true}));
  app.useGlobalFilters(new PrismaExceptionFilter(), /*new HttpExceptionFilter()*/)
  app.use(cookieParser.default())
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true // important pour que les cookies soient envoyés avec les requêtes
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
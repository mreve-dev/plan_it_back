import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from 'utils/filter/prisma.exception';
import { HttpExceptionFilter } from 'utils/filter/http.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform:true}));
  app.useGlobalFilters(new PrismaExceptionFilter(), /*new HttpExceptionFilter()*/)
  app.enableCors({
    origin: 'http://localhost:5173'
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
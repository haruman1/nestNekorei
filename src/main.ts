import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const logger = new Logger('Bootstrap');

  const allowed = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : ['*']; // default allow all

  // Aktifkan CORS di NestJS (tanpa @fastify/cors register manual)
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowed.includes(origin) || allowed.includes('*')) {
        callback(null, true); // allow
      } else {
        callback(new Error(`❌ Origin ${origin} not allowed by CORS`), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ✅ Swagger
  const config = new DocumentBuilder()
    .setTitle('Nekorei API')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // ✅ Start server
  await app.listen(3001, '0.0.0.0');
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();

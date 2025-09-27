import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import express, { Application } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import * as path from 'path';
let server: any;

async function bootstrap(): Promise<Application> {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nekorei API')
    .setDescription('The cats API description')
    .addServer(
      process.env.CHECK_DASAR === 'production'
        ? 'https://demo-1.haruman.me'
        : 'http://localhost:3001',
    )
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  const isVercel = !!process.env.VERCEL;

  if (!isVercel) {
    // Local → Swagger UI normal
    SwaggerModule.setup('docs', app, document);
  } else {
    // Vercel → Swagger UI pointing ke file statis
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { url: '/swagger-json' },
      customfavIcon: 'https://placecats.com/300/200',
      customCssUrl: ['https://unpkg.com/swagger-ui-dist/swagger-ui.css'],
      customJs: [
        'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
      ],
    });

    app.enableCors();
  }

  const swaggerDocument = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '/swagger-static/swagger.json'),
      'utf8',
    ),
  );
  app.getHttpAdapter().get('/swagger-json', (req, res) => {
    res.json(swaggerDocument);
  });

  // ❌ di Vercel jangan pakai listen()
  await app.init();
  return app.getHttpAdapter().getInstance() as Application;
}

export default async function handler(req, res) {
  if (!server) {
    const expressApp = await bootstrap();
    // langsung jalankan Express tanpa serverless-express
    server = (req, res) => expressApp(req, res);
  }
  return server(req, res);
}

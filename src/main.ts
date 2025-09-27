import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import express, { Application } from 'express';
import { join } from 'path';

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
    // Local → SwaggerUI langsung
    SwaggerModule.setup('docs', app, document);
  } else {
    // Vercel → serve swagger-static dari dist
    app.use(
      '/swagger-static',
      express.static(join(__dirname, 'swagger-static')),
    );

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        url: '/swagger-json', // ini ambil langsung dari app
      },
      customCssUrl: ['https://unpkg.com/swagger-ui-dist/swagger-ui.css'],
      customJs: [
        'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js',
      ],
    });

    app.enableCors();
  }

  app.getHttpAdapter().get('/swagger-json', (req, res) => {
    res.json(document);
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

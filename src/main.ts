import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);

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
  if (process.env.CHECK_DASAR === 'development') {
    app.enableCors();
    const pathToSwaggerStaticFolder = resolve(process.cwd(), 'swagger-static');

    // write swagger json file
    const pathToSwaggerJson = resolve(
      pathToSwaggerStaticFolder,
      'swagger.json',
    );
    const swaggerJson = JSON.stringify(document, null, 2);
    writeFileSync(pathToSwaggerJson, swaggerJson);
    console.log(`Swagger JSON file written to: '/swagger-static/swagger.json'`);
  } else {
    SwaggerModule.setup('docs', app, document, {
      jsonDocumentUrl: 'swagger/json',
      customfavIcon: 'https://placecats.com/300/200',
    });
    app.enableCors({
      origin: ['https://demo-1.haruman.me', 'https://demo-1.haruman.me'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    });
  }
  app.getHttpAdapter().get('/swagger-json', (req, res) => {
    res.json(document);
  });

  await app.listen(process.env.PORT_SERVER);
}
bootstrap();
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const config = new DocumentBuilder()
//     .setTitle('Nekorei API')
//     .setDescription('The cats API description')
//     .addServer(
//       process.env.CHECK_DASAR === 'production'
//         ? 'https://demo-1.haruman.me'
//         : 'http://localhost:3001',
//     )
//     .setVersion('1.0')
//     .build();

//   const document = SwaggerModule.createDocument(app, config);

//   // Endpoint JSON Swagger
//   app.getHttpAdapter().get('/swagger-json', (req, res) => {
//     res.json(document);
//   });

//   await app.listen(process.env.PORT_SERVER);
// }
// bootstrap();

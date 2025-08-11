// import { NestFactory } from '@nestjs/core';
// import {
//   SwaggerModule,
//   DocumentBuilder,
//   SwaggerDocumentOptions,
// } from '@nestjs/swagger';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   // const app = await NestFactory.create(AppModule);

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
//   const options: SwaggerDocumentOptions = {
//     operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
//   };
//   const document = SwaggerModule.createDocument(app, config, options);
//   if (process.env.CHECK_DASAR === 'development') {
//     app.enableCors();
//     SwaggerModule.setup('swagger', app, document, {
//       jsonDocumentUrl: 'swagger/json',
//     });
//   }
//   SwaggerModule.setup('docs', app, document, {
//     jsonDocumentUrl: 'swagger/json',
//     customfavIcon: 'https://placecats.com/300/200',
//   });
//   app.enableCors({
//     origin: ['https://demo-1.haruman.me', 'https://demo-1.haruman.me'],
//     methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
//   });
//   app.getHttpAdapter().get('/swagger-json', (req, res) => {
//     res.json(document);
//   });a
//   // app.enableCors({
//   //   origin: ['https://cosparade.xyz', 'http://cosparade.xyz'],
//   //   methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
//   // });

//   await app.listen(process.env.PORT_SERVER);
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
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

  const document = SwaggerModule.createDocument(app, config);

  // Endpoint JSON Swagger
  app.getHttpAdapter().get('/swagger-json', (req, res) => {
    res.json(document);
  });

  await app.listen(process.env.PORT_SERVER);
}
bootstrap();

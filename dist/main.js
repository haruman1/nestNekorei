"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Nekorei API')
        .setDescription('The cats API description')
        .addServer(process.env.CHECK_DASAR === 'production'
        ? 'https://demo-1.haruman.me'
        : 'http://localhost:3001')
        .setVersion('1.0')
        .build();
    const options = {
        operationIdFactory: (controllerKey, methodKey) => methodKey,
    };
    const document = swagger_1.SwaggerModule.createDocument(app, config, options);
    if (process.env.CHECK_DASAR === 'development') {
        app.enableCors();
        swagger_1.SwaggerModule.setup('swagger', app, document, {
            jsonDocumentUrl: 'swagger/json',
        });
    }
    swagger_1.SwaggerModule.setup('api', app, document, {
        jsonDocumentUrl: 'swagger/json',
    });
    app.enableCors({
        origin: ['https://demo-1.haruman.me', 'https://demo-1.haruman.me'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    });
    await app.listen(process.env.PORT_SERVER);
}
bootstrap();
//# sourceMappingURL=main.js.map
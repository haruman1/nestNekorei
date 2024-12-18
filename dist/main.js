"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['https://cosparade.xyz', 'http://cosparade.xyz'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Nekorei API')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .build();
    const options = {
        operationIdFactory: (controllerKey, methodKey) => methodKey,
    };
    const document = swagger_1.SwaggerModule.createDocument(app, config, options);
    swagger_1.SwaggerModule.setup('swagger', app, document, {
        jsonDocumentUrl: 'swagger/json',
    });
    await app.listen(process.env.PORT_SERVER);
}
bootstrap();
//# sourceMappingURL=main.js.map
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	const swagger = new DocumentBuilder().
		setTitle('Transcendouille').
		setDescription('Our api for a school [project](https://github.com/ceritrus/ft-transcendence)').
		setVersion('v0.1').
		addBearerAuth().
		build();
	const document = SwaggerModule.createDocument(app, swagger);
	SwaggerModule.setup('api', app, document, {
		swaggerOptions: { defaultModelsExpandDepth: -1 },
	});
	console.log(process.env.BACKEND_PORT);
	await app.listen(process.env.BACKEND_PORT);
}
bootstrap();

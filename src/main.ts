//entrypoint of the application
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';

import { config } from 'dotenv';
config(); // Charge les variables d'environnement depuis le fichier .env


//creating the application
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

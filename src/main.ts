import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

 const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform : true,
    transformOptions: {
      enableImplicitConversion : true
    }
  }));
  const config = new DocumentBuilder()
  .setTitle('Practice API')
  .setDescription('The API description')
  .setVersion('1.0')
  .addBearerAuth(
    {
      description: 'Default JWT Authorization',
      type: 'http',
      in: 'header',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'defaultBearerAuth',
  )
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.enableCors();
  await app.listen(3006);
}
bootstrap();

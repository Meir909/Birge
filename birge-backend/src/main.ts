import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import * as compression from 'compression';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Winston Logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  
  // Security middleware
  app.use(helmet());
  app.use(compression());
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // CORS configuration
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Birge API')
    .setDescription('Birge School Carpooling Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://localhost:${port}`, 'Local development server')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Birge API Documentation',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });
  
  // Global prefix
  app.setGlobalPrefix('api/v1');
  
  // Health check endpoint for Render
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  });
  
  await app.listen(port);
  console.log(`Birge Backend Server running on: http://localhost:${port}`);
  console.log(`API Documentation: http://localhost:${port}/api`);
}
bootstrap();
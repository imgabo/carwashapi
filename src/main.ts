import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    console.log('🚀 Starting CarWash API...');
    console.log('📊 Environment:', process.env.NODE_ENV || 'development');
    console.log('🗄️ Database Host:', process.env.DB_HOST || 'not configured');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });
    
    app.setGlobalPrefix('api');
    app.enableCors({
      origin: true,
      credentials: true,
    });
    
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    
    const port = process.env.PORT || 3000;
    
    await app.listen(port, '0.0.0.0');
    
    console.log(`✅ Application is running on: http://0.0.0.0:${port}`);
    console.log(`🏥 Health check available at: http://0.0.0.0:${port}/api/health`);
    console.log(`🗄️ Database synchronization: ENABLED (tables will be created automatically)`);
    
  } catch (error) {
    console.error('❌ Error starting application:', error);
    process.exit(1);
  }
}

bootstrap();

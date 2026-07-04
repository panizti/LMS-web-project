
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UsersService } from './users/users.service';
import { WorkflowsService } from './workflows/workflows.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()

  
    .setTitle('Backend API')
    .setDescription('API documentation for the university portal project')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  
  const userService = app.get(UsersService);
  await userService.ensureAdminExists();

  // ساخت گردش‌کارهای پیش‌فرض
  const workflowsService = app.get(WorkflowsService);
  await workflowsService.seedDefaults();
  
 
  app.enableCors({
  origin: ['http://localhost:3000', 'http://192.168.40.1:3000'],
  credentials: true,
});

  await app.listen(4000);
}
bootstrap();
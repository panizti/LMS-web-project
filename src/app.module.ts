import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CoursesModule } from './courses/courses.module';
import { RequestsModule } from './requests/requests.module';
import { PaymentsModule } from './payments/payments.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { GradesModule } from './grades/grades.module';
import { ProfileModule } from './profile/profile.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/lms_db',
    ),
    AuthModule,
    UsersModule,
    DashboardModule,
    CoursesModule,
    RequestsModule,
    EnrollmentsModule,
    GradesModule,
    PaymentsModule,
    ProfileModule,
    WorkflowsModule,
    SeedModule,
  ],
})
export class AppModule {}

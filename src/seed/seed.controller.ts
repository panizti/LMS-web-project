import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('seed')
@Controller('api/seed')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SeedController {
  constructor(private readonly seed: SeedService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'بارگذاری داده‌های تست (فقط مدیر گروه)' })
  seedData() {
    return this.seed.seed();
  }
}

import { Controller, Post, Get, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('requests')
@ApiBearerAuth()
@Controller('api/requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RequestsController {
  constructor(private service: RequestsService) {}

  @Get()
  @ApiOperation({ summary: 'لیست درخواست‌ها' })
  findAll(@Request() req) {
    return this.service.findAll(req.user);
  }

  @Post()
  @Roles('student')
  @ApiOperation({ summary: 'ثبت درخواست جدید' })
  create(@Request() req, @Body() dto: CreateRequestDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Post(':id/process')
  @Roles('teacher', 'admin')
  @ApiOperation({ summary: 'تأیید یا رد درخواست' })
  processStep(
    @Request() req,
    @Param('id') id: string,
    @Body() actionDto: { action: 'approve' | 'reject' }
  ) {
    return this.service.processRequest(id, req.user.role, actionDto.action);
  }
}

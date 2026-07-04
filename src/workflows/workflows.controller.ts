import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { WorkflowsService } from './workflows.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('workflows')
@Controller('api/workflows')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WorkflowsController {
  constructor(private readonly workflows: WorkflowsService) {}

  @Get()
  @ApiOperation({ summary: 'لیست همه گردش‌کارها' })
  findAll() {
    return this.workflows.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'جزئیات یک گردش‌کار' })
  findOne(@Param('id') id: string) {
    return this.workflows.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'ساخت گردش‌کار جدید (فقط مدیر گروه)' })
  create(@Body() dto: any) {
    return this.workflows.create(dto);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'ویرایش گردش‌کار (فقط مدیر گروه)' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.workflows.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'حذف گردش‌کار (فقط مدیر گروه)' })
  remove(@Param('id') id: string) {
    return this.workflows.remove(id);
  }
}

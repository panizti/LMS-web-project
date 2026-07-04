import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkflowEntity } from './workflows.schema';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectModel(WorkflowEntity.name) private workflowModel: Model<WorkflowEntity>,
  ) {}

  /** ساخت workflow جدید (فقط ادمین) */
  async create(dto: any) {
    const exists = await this.workflowModel.findOne({ type: dto.type }).exec();
    if (exists) {
      throw new BadRequestException(`گردش کار با نوع «${dto.type}» از قبل وجود دارد`);
    }

    const created = new this.workflowModel(dto);
    await created.save();
    return { id: created._id.toString(), ...created.toJSON() };
  }

  /** لیست همه workflowها */
  async findAll() {
    const list = await this.workflowModel.find().lean().exec();
    return list.map(w => ({ id: w._id.toString(), ...w }));
  }

  /** جزئیات یک workflow */
  async findOne(id: string) {
    const w = await this.workflowModel.findById(id).lean().exec();
    if (!w) throw new NotFoundException('گردش کار یافت نشد');
    return { id: w._id.toString(), ...w };
  }

  /** ویرایش workflow */
  async update(id: string, dto: any) {
    const w = await this.workflowModel.findByIdAndUpdate(id, dto, { new: true }).lean().exec();
    if (!w) throw new NotFoundException('گردش کار یافت نشد');
    return { id: w._id.toString(), ...w };
  }

  /** حذف workflow */
  async remove(id: string) {
    const w = await this.workflowModel.findByIdAndDelete(id).exec();
    if (!w) throw new NotFoundException('گردش کار یافت نشد');
    return { success: true };
  }

  /** ساخت چند workflow پیش‌فرض (برای seed) */
  async seedDefaults() {
    const defaults = [
      {
        type: 'drop_course',
        initialStep: 'teacher_review',
        steps: [
          {
            stepName: 'teacher_review',
            requiredRole: 'teacher',
            onApprove: 'admin_approval',
            onReject: 'rejected',
          },
          {
            stepName: 'admin_approval',
            requiredRole: 'admin',
            onApprove: 'completed',
            onReject: 'rejected',
          },
        ],
      },
      {
        type: 'course_complaint',
        initialStep: 'teacher_review',
        steps: [
          {
            stepName: 'teacher_review',
            requiredRole: 'teacher',
            onApprove: 'completed',
            onReject: 'admin_review',
          },
          {
            stepName: 'admin_review',
            requiredRole: 'admin',
            onApprove: 'completed',
            onReject: 'rejected',
          },
        ],
      },
    ];

    for (const d of defaults) {
      const exists = await this.workflowModel.findOne({ type: d.type }).exec();
      if (!exists) {
        await this.workflowModel.create(d);
      }
    }
  }
}

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateUserDto) {
    const exist = await this.userModel
      .findOne({ username: dto.username })
      .exec();
    if (exist) {
      throw new BadRequestException('نام کاربری از قبل وجود دارد');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const created = new this.userModel({
      username: dto.username,
      password: hashed,
      role: dto.role || 'student',
    });
    await created.save();

    return {
      id: created._id.toString(),
      username: created.username,
      role: created.role,
    };
  }

  async ensureAdminExists() {
    const admin = await this.userModel.findOne({ role: 'admin' }).exec();
    if (!admin) {
      const hashed = await bcrypt.hash('admin123', 10);
      const created = new this.userModel({
        username: 'admin',
        password: hashed,
        role: 'admin',
      });
      await created.save();
      console.log(
        '✅ Admin user created with username: admin / password: admin123',
      );
    }
  }

  async findAll(filter?: { search?: string; role?: string }) {
    const query: any = {};

    if (filter?.search) {
      const regex = new RegExp(filter.search.trim(), 'i');
      query.username = regex;
    }

    if (filter?.role && filter.role !== 'all') {
      query.role = filter.role;
    }

    const users = await this.userModel
      .find(query)
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return users.map((u) => ({
      id: u._id.toString(),
      username: u.username,
      role: u.role,
    }));
  }

  async findById(id: string) {
    const user = await this.userModel
      .findById(id)
      .select('-password -__v')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    return {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    };
  }

  async findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }

  /**
   * ایجاد کاربر جدید با نقش دلخواه (متد عمومی برای استفاده در AuthService)
   */
  async createWithRole(username: string, hashedPassword: string, role: string) {
    const created = new this.userModel({
      username,
      password: hashedPassword,
      role,
    });
    await created.save();
    return created;
  }

  async updateRole(id: string, role: string) {
    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(role)) {
      throw new BadRequestException(`نقش نامعتبر. مقادیر مجاز: ${validRoles.join('، ')}`);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .select('-password -__v')
      .exec();

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    return {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    };
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }
    return { message: 'کاربر با موفقیت حذف شد', id: user._id.toString() };
  }
}

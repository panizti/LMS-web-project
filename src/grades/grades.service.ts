import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Grade, GradeDocument } from './schemas/grade.schema';
import { Course, CourseDocument } from '../courses/schemas/course.schema';

@Injectable()
export class GradesService {
  constructor(
    @InjectModel(Grade.name) private gradeModel: Model<GradeDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async create(dto: any) {
    const exists = await this.gradeModel.findOne({ studentId: dto.studentId, courseId: dto.courseId });
    if (exists) {
      throw new BadRequestException('نمره این دانشجو در این درس قبلاً ثبت شده است. از ویرایش استفاده کنید.');
    }

    const created = new this.gradeModel(dto);
    await created.save();
    return { id: created._id.toString(), ...created.toJSON() };
  }

  async findAll(courseId?: string) {
    const query = courseId ? { courseId } : {};
    const list = await this.gradeModel.find(query).lean().exec();
    return list.map((g) => ({
      id: g._id.toString(),
      studentId: g.studentId,
      courseId: g.courseId,
      grade: g.grade,
      term: g.term,
    }));
  }

  async findByStudent(studentId: string) {
    const list = await this.gradeModel.find({ studentId }).lean().exec();
    return list.map(g => ({
      id: g._id.toString(),
      courseId: g.courseId,
      grade: g.grade,
      term: g.term,
    }));
  }

  async update(id: string, dto: any) {
    const grade = await this.gradeModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!grade) throw new NotFoundException('نمره یافت نشد');
    return { id: grade._id.toString(), ...grade.toJSON() };
  }

  async remove(id: string) {
    const result = await this.gradeModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('نمره یافت نشد');
    return { success: true };
  }

  /**
   * کارنامه کامل دانشجو با محاسبه معدل
   */
  async getTranscript(studentId: string) {
    const grades = await this.gradeModel.find({ studentId }).lean().exec();
    if (grades.length === 0) {
      return {
        terms: [],
        totalGPA: 0,
        totalUnits: 0,
        totalCourses: 0,
      };
    }

    // دریافت اطلاعات دروس
    const courseIds = grades.map(g => g.courseId);
    const courses = await this.courseModel
      .find({ _id: { $in: courseIds.map(id => new Types.ObjectId(id)) } })
      .lean()
      .exec();

    const courseMap = new Map(courses.map(c => [c._id.toString(), c]));

    // گروه‌بندی بر اساس ترم
    const termGroups: Record<string, any> = {};
    for (const g of grades) {
      const term = g.term || 'current';
      if (!termGroups[term]) {
        termGroups[term] = {
          term,
          courses: [],
          gpa: 0,
          units: 0,
        };
      }

      const course = courseMap.get(g.courseId);
      const units = course?.units || 0;

      termGroups[term].courses.push({
        courseId: g.courseId,
        courseTitle: course?.title || 'نامشخص',
        courseCode: course?.code || '-',
        units,
        grade: g.grade,
        status: g.grade >= 10 ? 'قبول' : 'مردود',
      });
    }

    // محاسبه معدل هر ترم و معدل کل
    let totalWeightedSum = 0;
    let totalUnits = 0;

    const terms = Object.values(termGroups).map((term: any) => {
      let termWeightedSum = 0;
      let termUnits = 0;

      for (const c of term.courses) {
        termWeightedSum += c.grade * c.units;
        termUnits += c.units;
        totalWeightedSum += c.grade * c.units;
        totalUnits += c.units;
      }

      term.gpa = termUnits > 0 ? +(termWeightedSum / termUnits).toFixed(2) : 0;
      term.units = termUnits;
      return term;
    });

    // مرتب‌سازی ترم‌ها
    terms.sort((a: any, b: any) => a.term.localeCompare(b.term));

    return {
      terms,
      totalGPA: totalUnits > 0 ? +(totalWeightedSum / totalUnits).toFixed(2) : 0,
      totalUnits,
      totalCourses: grades.length,
    };
  }
}

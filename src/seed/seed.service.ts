import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/schemas/user.schema';
import { Course } from '../courses/schemas/course.schema';
import { Enrollment } from '../enrollments/enrollments.schema';
import { Grade } from '../grades/schemas/grade.schema';
import { Profile } from '../profile/schemas/profile.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>,
    @InjectModel(Grade.name) private gradeModel: Model<Grade>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async seed() {
    console.log('شروع بارگذاری داده‌های تست...\n');

    await this.userModel.deleteMany({});
    await this.courseModel.deleteMany({});
    await this.enrollmentModel.deleteMany({});
    await this.gradeModel.deleteMany({});
    await this.profileModel.deleteMany({});
    console.log('داده‌های قبلی پاک شدند\n');

    const password = await bcrypt.hash('123456', 10);

    const admin = await this.userModel.create({
      username: 'admin',
      password,
      role: 'admin',
    });

    const teachers = await this.userModel.insertMany([
      { username: 'dr_ahmadi', password, role: 'teacher' },
      { username: 'prof_mohammadi', password, role: 'teacher' },
      { username: 'dr_karimi', password, role: 'teacher' },
    ]);

    const students = await this.userModel.insertMany([
      { username: 'ali_rezai', password, role: 'student' },
      { username: 'sara_hosseini', password, role: 'student' },
      { username: 'mohammad_erfani', password, role: 'student' },
      { username: 'fateme_nazari', password, role: 'student' },
      { username: 'hasan_moradi', password, role: 'student' },
      { username: 'zahra_heidari', password, role: 'student' },
      { username: 'amir_taheri', password, role: 'student' },
      { username: 'niloofar_azizi', password, role: 'student' },
    ]);

    console.log(`کاربران ساخته شدند:`);
    console.log(`   - ۱ مدیر گروه (admin / 123456)`);
    console.log(`   - ${teachers.length} استاد (username / 123456)`);
    console.log(`   - ${students.length} دانشجو (username / 123456)\n`);

    await this.profileModel.insertMany([
      { userId: admin._id, firstName: 'محمد', lastName: 'احمدی', email: 'admin@tabrizu.ac.ir', phone: '041-33330001' },
      { userId: teachers[0]._id, firstName: 'رضا', lastName: 'احمدی', email: 'ahmadi@tabrizu.ac.ir', phone: '041-33331001' },
      { userId: teachers[1]._id, firstName: 'مریم', lastName: 'محمدی', email: 'mohammadi@tabrizu.ac.ir', phone: '041-33331002' },
      { userId: teachers[2]._id, firstName: 'علی', lastName: 'کریمی', email: 'karimi@tabrizu.ac.ir', phone: '041-33331003' },
      { userId: students[0]._id, firstName: 'علی', lastName: 'رضایی', email: 'ali.rezai@tabrizu.ac.ir', phone: '09141110001' },
      { userId: students[1]._id, firstName: 'سارا', lastName: 'حسینی', email: 'sara.hosseini@tabrizu.ac.ir', phone: '09141110002' },
      { userId: students[2]._id, firstName: 'محمد', lastName: 'عرفانی', email: 'm.erfani@tabrizu.ac.ir', phone: '09141110003' },
      { userId: students[3]._id, firstName: 'فاطمه', lastName: 'نظاری', email: 'f.nazari@tabrizu.ac.ir', phone: '09141110004' },
      { userId: students[4]._id, firstName: 'حسن', lastName: 'مرادی', email: 'hasan.moradi@tabrizu.ac.ir', phone: '09141110005' },
      { userId: students[5]._id, firstName: 'زهرا', lastName: 'حیدری', email: 'z.heidari@tabrizu.ac.ir', phone: '09141110006' },
      { userId: students[6]._id, firstName: 'امیر', lastName: 'طاهری', email: 'amir.taheri@tabrizu.ac.ir', phone: '09141110007' },
      { userId: students[7]._id, firstName: 'نیلوفر', lastName: 'عزیزی', email: 'n.azizi@tabrizu.ac.ir', phone: '09141110008' },
    ]);
    console.log('پروفایل‌ها ساخته شدند\n');

    const courses = await this.courseModel.insertMany([
      { title: 'برنامه‌نویسی وب', code: 'WEB101', teacherId: teachers[0]._id.toString(), units: 3 },
      { title: 'پایگاه داده', code: 'DB201', teacherId: teachers[0]._id.toString(), units: 3 },
      { title: 'ساختمان داده', code: 'DS301', teacherId: teachers[1]._id.toString(), units: 3 },
      { title: 'هوش مصنوعی', code: 'AI401', teacherId: teachers[1]._id.toString(), units: 3 },
      { title: 'شبکه‌های کامپیوتری', code: 'NET301', teacherId: teachers[2]._id.toString(), units: 3 },
      { title: 'امنیت شبکه', code: 'SEC401', teacherId: teachers[2]._id.toString(), units: 3 },
    ]);
    console.log(`${courses.length} درس ساخته شد\n`);

    const enrollmentsData = [
      // ali_rezai: 4 درس
      { studentId: students[0]._id.toString(), courseId: courses[0]._id.toString() },
      { studentId: students[0]._id.toString(), courseId: courses[1]._id.toString() },
      { studentId: students[0]._id.toString(), courseId: courses[2]._id.toString() },
      { studentId: students[0]._id.toString(), courseId: courses[4]._id.toString() },
      // sara_hosseini: 3 درس
      { studentId: students[1]._id.toString(), courseId: courses[0]._id.toString() },
      { studentId: students[1]._id.toString(), courseId: courses[3]._id.toString() },
      { studentId: students[1]._id.toString(), courseId: courses[4]._id.toString() },
      // mohammad_erfani: 3 درس
      { studentId: students[2]._id.toString(), courseId: courses[1]._id.toString() },
      { studentId: students[2]._id.toString(), courseId: courses[2]._id.toString() },
      { studentId: students[2]._id.toString(), courseId: courses[5]._id.toString() },
      // fateme_nazari: 2 درس
      { studentId: students[3]._id.toString(), courseId: courses[0]._id.toString() },
      { studentId: students[3]._id.toString(), courseId: courses[2]._id.toString() },
      // hasan_moradi: 3 درس
      { studentId: students[4]._id.toString(), courseId: courses[3]._id.toString() },
      { studentId: students[4]._id.toString(), courseId: courses[4]._id.toString() },
      { studentId: students[4]._id.toString(), courseId: courses[5]._id.toString() },
      // zahra_heidari: 2 درس
      { studentId: students[5]._id.toString(), courseId: courses[1]._id.toString() },
      { studentId: students[5]._id.toString(), courseId: courses[3]._id.toString() },
      // amir_taheri: 3 درس
      { studentId: students[6]._id.toString(), courseId: courses[0]._id.toString() },
      { studentId: students[6]._id.toString(), courseId: courses[2]._id.toString() },
      { studentId: students[6]._id.toString(), courseId: courses[5]._id.toString() },
      // niloofar_azizi: 2 درس
      { studentId: students[7]._id.toString(), courseId: courses[3]._id.toString() },
      { studentId: students[7]._id.toString(), courseId: courses[4]._id.toString() },
    ];
    await this.enrollmentModel.insertMany(enrollmentsData);
    console.log(`${enrollmentsData.length} ثبت‌نام انجام شد\n`);

    const gradesData = [
      // ali_rezai
      { studentId: students[0]._id.toString(), courseId: courses[0]._id.toString(), grade: 17.5 },
      { studentId: students[0]._id.toString(), courseId: courses[1]._id.toString(), grade: 15 },
      { studentId: students[0]._id.toString(), courseId: courses[2]._id.toString(), grade: 18 },
      // sara_hosseini
      { studentId: students[1]._id.toString(), courseId: courses[0]._id.toString(), grade: 19 },
      { studentId: students[1]._id.toString(), courseId: courses[3]._id.toString(), grade: 16.5 },
      // mohammad_erfani
      { studentId: students[2]._id.toString(), courseId: courses[1]._id.toString(), grade: 14 },
      { studentId: students[2]._id.toString(), courseId: courses[2]._id.toString(), grade: 17 },
      // fateme_nazari
      { studentId: students[3]._id.toString(), courseId: courses[0]._id.toString(), grade: 20 },
      { studentId: students[3]._id.toString(), courseId: courses[2]._id.toString(), grade: 18.5 },
      // hasan_moradi
      { studentId: students[4]._id.toString(), courseId: courses[3]._id.toString(), grade: 12.5 },
      { studentId: students[4]._id.toString(), courseId: courses[4]._id.toString(), grade: 15 },
      // zahra_heidari
      { studentId: students[5]._id.toString(), courseId: courses[1]._id.toString(), grade: 16 },
      // amir_taheri
      { studentId: students[6]._id.toString(), courseId: courses[0]._id.toString(), grade: 14.5 },
      { studentId: students[6]._id.toString(), courseId: courses[2]._id.toString(), grade: 13 },
      // niloofar_azizi
      { studentId: students[7]._id.toString(), courseId: courses[3]._id.toString(), grade: 17 },
    ];
    await this.gradeModel.insertMany(gradesData);
    console.log(`${gradesData.length} نمره ثبت شد\n`);

    console.log('═══════════════════════════════════════════');
    console.log('بارگذاری داده‌های تست با موفقیت انجام شد!');
    console.log('═══════════════════════════════════════════');
    console.log('\nاطلاعات ورود:\n');
    console.log('مدیر گروه:');
    console.log('username: admin');
    console.log('password: 123456\n');
    console.log('اساتید:');
    teachers.forEach((t, i) => {
      console.log(`${i + 1}. username: ${t.username} / password: 123456`);
    });
    console.log('\nدانشجویان:');
    students.forEach((s, i) => {
      console.log(`      ${i + 1}. username: ${s.username} / password: 123456`);
    });
    console.log('\n═══════════════════════════════════════════\n');
  }
}

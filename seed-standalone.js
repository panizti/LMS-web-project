import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

// ─── اتصال به MongoDB ───────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms_db';

// ─── Schema ها ──────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({ username: String, password: String, role: String }, { timestamps: true });
const CourseSchema = new mongoose.Schema({ title: String, code: String, teacherId: String, units: Number }, { timestamps: true });
const EnrollmentSchema = new mongoose.Schema({ studentId: String, courseId: String }, { timestamps: true });
const GradeSchema = new mongoose.Schema({ studentId: String, courseId: String, grade: Number }, { timestamps: true });
const ProfileSchema = new mongoose.Schema({ firstName: String, lastName: String, email: String, phone: String, userId: mongoose.Schema.Types.ObjectId }, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);
const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);
const Grade = mongoose.model('Grade', GradeSchema);
const Profile = mongoose.model('Profile', ProfileSchema);

// ─── داده‌های دروس مهندسی کامپیوتر ────────────────────────────
const coursesData = [
  { title: 'برنامه‌نویسی پیشرفته', code: 'CS101', units: 3 },
  { title: 'ساختمان داده', code: 'CS102', units: 3 },
  { title: 'طراحی الگوریتم', code: 'CS103', units: 3 },
  { title: 'پایگاه داده', code: 'CS104', units: 3 },
  { title: 'شبکه‌های کامپیوتری', code: 'CS105', units: 3 },
  { title: 'مهندسی نرم‌افزار', code: 'CS106', units: 3 },
  { title: 'برنامه‌نویسی وب', code: 'CS107', units: 3 },
  { title: 'هوش مصنوعی', code: 'CS108', units: 3 },
  { title: 'سیستم‌عامل', code: 'CS109', units: 3 },
  { title: 'معماری کامپیوتر', code: 'CS110', units: 2 },
];

// ─── داده‌های کاربران ───────────────────────────────────────────
const teachersData = [
  { username: 'dr_ahmadi',   firstName: 'علی',      lastName: 'احمدی',    email: 'ahmadi@tabrizu.ac.ir',   phone: '09141111111' },
  { username: 'dr_hosseini', firstName: 'محمد',     lastName: 'حسینی',    email: 'hosseini@tabrizu.ac.ir', phone: '09142222222' },
  { username: 'dr_karimi',   firstName: 'فاطمه',    lastName: 'کریمی',    email: 'karimi@tabrizu.ac.ir',   phone: '09143333333' },
  { username: 'dr_rezaei',   firstName: 'حسن',      lastName: 'رضایی',    email: 'rezaei@tabrizu.ac.ir',   phone: '09144444444' },
];

const studentsData = [
  { username: 'student1',  firstName: 'آرش',     lastName: 'محمدی',   email: 's1@student.tabrizu.ac.ir',  phone: '09151111111', sid: '4011234001' },
  { username: 'student2',  firstName: 'سارا',    lastName: 'رضایی',   email: 's2@student.tabrizu.ac.ir',  phone: '09151111112', sid: '4011234002' },
  { username: 'student3',  firstName: 'امیر',    lastName: 'کریمی',   email: 's3@student.tabrizu.ac.ir',  phone: '09151111113', sid: '4011234003' },
  { username: 'student4',  firstName: 'نیلوفر',  lastName: 'احمدی',   email: 's4@student.tabrizu.ac.ir',  phone: '09151111114', sid: '4011234004' },
  { username: 'student5',  firstName: 'علیرضا',  lastName: 'موسوی',   email: 's5@student.tabrizu.ac.ir',  phone: '09151111115', sid: '4011234005' },
  { username: 'student6',  firstName: 'مریم',    lastName: 'صادقی',   email: 's6@student.tabrizu.ac.ir',  phone: '09151111116', sid: '4011234006' },
  { username: 'student7',  firstName: 'کیان',    lastName: 'تهرانی',  email: 's7@student.tabrizu.ac.ir',  phone: '09151111117', sid: '4011234007' },
  { username: 'student8',  firstName: 'زهرا',    lastName: 'نجفی',    email: 's8@student.tabrizu.ac.ir',  phone: '09151111118', sid: '4011234008' },
  { username: 'student9',  firstName: 'دانیال',  lastName: 'قاسمی',   email: 's9@student.tabrizu.ac.ir',  phone: '09151111119', sid: '4011234009' },
  { username: 'student10', firstName: 'پانیذ',   lastName: 'اکبری',   email: 's10@student.tabrizu.ac.ir', phone: '09151111120', sid: '4011234010' },
];

// ─── تابع اصلی Seed ────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ اتصال به MongoDB برقرار شد');

  // پاک کردن داده‌های قبلی (به جز ادمین)
  await User.deleteMany({ role: { $in: ['teacher', 'student'] } });
  await Course.deleteMany({});
  await Enrollment.deleteMany({});
  await Grade.deleteMany({});
  await Profile.deleteMany({});
  console.log('🗑️  داده‌های قبلی پاک شد');

  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('123456', salt);

  // ─── ساخت اساتید ─────────────────────────────────────────────
  const teachers: any[] = [];
  for (const t of teachersData) {
    const user = await User.create({ username: t.username, password: defaultPassword, role: 'teacher' });
    await Profile.create({ firstName: t.firstName, lastName: t.lastName, email: t.email, phone: t.phone, userId: user._id });
    teachers.push(user);
    console.log(`👨‍🏫 استاد ساخته شد: ${t.username} | رمز: 123456`);
  }

  // ─── ساخت دروس و تخصیص به اساتید ────────────────────────────
  const courses: any[] = [];
  for (let i = 0; i < coursesData.length; i++) {
    const teacher = teachers[i % teachers.length];
    const course = await Course.create({ ...coursesData[i], teacherId: teacher._id.toString() });
    courses.push(course);
    console.log(`📚 درس ساخته شد: ${coursesData[i].title} (${coursesData[i].code})`);
  }

  // ─── ساخت دانشجویان ──────────────────────────────────────────
  const students: any[] = [];
  for (const s of studentsData) {
    const user = await User.create({ username: s.username, password: defaultPassword, role: 'student' });
    await Profile.create({ firstName: s.firstName, lastName: s.lastName, email: s.email, phone: s.phone, userId: user._id });
    students.push(user);
    console.log(`🎓 دانشجو ساخته شد: ${s.username} | رمز: 123456`);
  }

  // ─── انتخاب واحد (هر دانشجو ۴ درس) ─────────────────────────
  const enrollments: any[] = [];
  for (let si = 0; si < students.length; si++) {
    const student = students[si];
    // هر دانشجو از index خودش شروع می‌کنه تا تنوع داشته باشه
    const myCourses = [
      courses[si % courses.length],
      courses[(si + 1) % courses.length],
      courses[(si + 2) % courses.length],
      courses[(si + 3) % courses.length],
    ];
    for (const course of myCourses) {
      const enrollment = await Enrollment.create({ studentId: student._id.toString(), courseId: course._id.toString() });
      enrollments.push({ enrollment, student, course });
    }
  }
  console.log(`📋 ${enrollments.length} انتخاب واحد ثبت شد`);

  // ─── ثبت نمرات ───────────────────────────────────────────────
  const grades = [18.5, 17, 15.5, 19, 14, 16.5, 20, 13, 17.5, 12, 18, 15, 11.5, 16, 19.5, 14.5, 13.5, 17, 20, 16];
  let gradeIndex = 0;
  for (const { student, course } of enrollments) {
    await Grade.create({
      studentId: student._id.toString(),
      courseId: course._id.toString(),
      grade: grades[gradeIndex % grades.length],
    });
    gradeIndex++;
  }
  console.log(`🎯 ${enrollments.length} نمره ثبت شد`);

  // ─── خلاصه نهایی ─────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Seed با موفقیت انجام شد!\n');
  console.log('👤 اطلاعات ورود:');
  console.log('   ادمین    → username: admin      | password: admin123');
  console.log('   اساتید   → username: dr_ahmadi  | password: 123456');
  console.log('              username: dr_hosseini | password: 123456');
  console.log('              username: dr_karimi   | password: 123456');
  console.log('              username: dr_rezaei   | password: 123456');
  console.log('   دانشجویان → username: student1 تا student10 | password: 123456');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ خطا در Seed:', err);
  process.exit(1);
});

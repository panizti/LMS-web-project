# بک‌اند سامانه LMS


 راه‌اندازی سریع
```bash
# ۱. نصب وابستگی‌ها
npm install

# ۲. ساخت فایل .env
cp .env.example .env
# ۳. ویرایش .env و تنظیم مقادیر
# MONGO_URI=mongodb://localhost:27017/lms_db
# JWT_SECRET=your_secret_key_here
# ۴. بارگذاری داده‌های تست
npm run seed
# ۵. اجرا
npm run start:dev
```

سرور روی `http://localhost:4000` اجرا می‌شود.


 ساختار
```
src/
├── auth/              # احراز هویت (JWT + Guards)
├── users/             # مدیریت کاربران
├── courses/           # دروس
├── enrollments/       # ثبت‌نام
├── grades/            # نمرات + کارنامه
├── profile/           # پروفایل
├── payments/          # پرداخت‌ها
├── requests/          # درخواست‌ها
├── workflows/         # گردش کار
├── dashboard/         # داشبورد
├── seed/              # داده‌های تست
├── app.module.ts      # ماژول اصلی
└── main.ts            # نقطه شروع
```

 اسکریپت‌ها
- `npm run start:dev` — اجرا در حالت توسعه
- `npm run start:prod` — اجرا در حالت production
- `npm run build` — بیلد پروژه
- `npm run seed` — بارگذاری داده‌های تست
- `npm run lint` — بررسی کد


 مستندات API
بعد از اجرا، به آدرس زیر بروید:
```
http://localhost:4000/api/docs
```

 اطلاعات ورود پیش‌فرض
بعد از seed:

- **مدیر**: `admin` / `123456`
- **اساتید**: `dr_ahmadi` و سایر / `123456`
- **دانشجویان**: `student1` تا `student10` / `123456`

##نیازمندی‌ها

- Node.js 18+
- MongoDB 6+
- npm یا yarn

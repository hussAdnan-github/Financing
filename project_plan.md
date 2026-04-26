# لوحة التحكم التشغيلية - نظام إدارة العملاء

## 1. وصف المشروع
نظام تشغيل داخلي متكامل لإدارة دورة حياة العميل كاملاً، من لحظة الدخول عبر صفحة الهبوط إلى الأرشفة، مع ربط واتساب في كل مرحلة. يستهدف الشركات المالية التي تقدم خدمات تمويل وقروض.

## 2. هيكل الصفحات
- `/` - صفحة الهبوط (Landing Page) — للعملاء
- `/website` - الموقع الإلكتروني — للعملاء
- `/login` - تسجيل الدخول — للموظفين
- `/dashboard` - لوحة التحكم الرئيسية — للموظفين
- `/dashboard/clients` - قائمة العملاء
- `/dashboard/clients/:id` - ملف العميل التفصيلي
- `/dashboard/advanced-search` - البحث المتقدم
- `/dashboard/archive` - الأرشيف
- `/dashboard/reports` - التقارير
- `/dashboard/settings` - الإعدادات
- `/dashboard/settings/permissions` - الأدوار والصلاحيات
- `/dashboard/assignments` - توزيع العملاء
- `/dashboard/auditor-review` - مراجعة المدقق
- `/dashboard/manager` - لوحة المدير
- `/dashboard/special-status` - الحالات الخاصة
- `/dashboard/notifications` - سجل التنبيهات
- `/dashboard/activity-log` - سجل الأنشطة
- `/dashboard/landing-preview` - معاينة صفحة الهبوط

## 3. الميزات الأساسية
- [x] صفحة الهبوط مع نموذج تسجيل
- [x] لوحة التحكم الرئيسية مع إحصائيات
- [x] قائمة العملاء مع فلترة وبحث
- [x] ملف العميل التفصيلي (بيانات + مرفقات + مالية + سجل)
- [x] مسار العمل المتسلسل (8 مراحل)
- [x] زر واتساب المباشر في كل ملف
- [x] إدارة الأدوار (موظف / مشرف / مدقق / مدير)
- [x] الإدارة المالية (اتفاق / مصروفات / مدفوعات / ربح)
- [x] التنبيهات الداخلية
- [x] التقارير التشغيلية والمالية
- [x] إدارة محتوى صفحة الهبوط
- [x] Dark Mode كامل
- [x] الإشعارات الفورية (صوت + toast)
- [x] البحث العام (Ctrl+K)
- [x] ربط Supabase (قاعدة بيانات + Auth + Realtime)
- [x] **حماية الصفحات حسب الدور (Route Guards)**
- [x] **إخفاء الأزرار الحساسة في ملف العميل حسب الدور**
- [x] **إنشاء المستخدمين التجريبيين عبر Edge Function**

## 4. نموذج البيانات (Supabase)

### جدول: profiles
| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | uuid | المفتاح الأساسي (يرتبط بـ auth.users) |
| name | text | الاسم |
| email | text | البريد الإلكتروني |
| phone | text | رقم الجوال |
| role | text | الدور (employee/supervisor/auditor/manager) |
| status | text | الحالة (active/inactive/suspended) |
| initials | text | الحروف الأولى |
| assigned_count | integer | عدد الملفات المسندة |
| joined_at | timestamptz | تاريخ الانضمام |
| last_active | timestamptz | آخر نشاط |

### جدول: clients
| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | text | رقم الملف (CLT-xxx) |
| full_name | text | الاسم الكامل |
| phone | text | رقم الجوال |
| city | text | المدينة |
| employer_type | text | نوع جهة العمل |
| employer_name | text | اسم جهة العمل |
| service_type | text | نوع الخدمة |
| salary_transfer | boolean | تحويل الراتب |
| salary_bank | text | اسم البنك |
| stage | text | المرحلة الحالية |
| assigned_to | text | الموظف المسؤول |
| special_status | text | الحالة الخاصة |
| review_status | text | حالة المراجعة |
| credit_report | jsonb | التقرير الائتماني |
| financial | jsonb | البيانات المالية |
| attachments | jsonb | المرفقات |
| action_logs | jsonb | سجل الأنشطة |
| created_at | timestamptz | تاريخ الإنشاء |

### جدول: notifications
| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | text | المفتاح الأساسي |
| type | text | نوع الإشعار |
| message | text | الرسالة |
| target_role | text | الدور المستهدف |
| read | boolean | مقروء أم لا |
| priority | text | الأولوية |
| created_at | timestamptz | تاريخ الإنشاء |

### جدول: static_data
| الحقل | النوع | الوصف |
|-------|-------|-------|
| id | text | المفتاح الأساسي |
| category_key | text | مفتاح الفئة |
| category_title | text | عنوان الفئة |
| items | jsonb | العناصر |

## 5. التكاملات الخارجية
- **Supabase**: ✅ متصل — قاعدة البيانات، المصادقة، التخزين، Realtime
- **WhatsApp**: رابط wa.me مباشر في كل ملف عميل
- **Shopify**: غير مطلوب
- **Stripe**: غير مطلوب

## 6. خطة التطوير

### المرحلة 1: صفحة الهبوط + الواجهة الأساسية ✅
- الهدف: بناء صفحة الهبوط الكاملة مع كل الأقسام
- المخرجات: صفحة هبوط جاهزة للعرض

### المرحلة 2: لوحة التحكم الرئيسية ✅
- الهدف: لوحة تحكم مع إحصائيات وقائمة عملاء
- المخرجات: واجهة لوحة التحكم مع بيانات تجريبية

### المرحلة 3: ملف العميل التفصيلي ✅
- الهدف: صفحة ملف العميل مع كل التبويبات
- المخرجات: عرض كامل لبيانات العميل ومراحله

### المرحلة 4: ربط Supabase ✅
- الهدف: تخزين حقيقي للبيانات
- المخرجات: نظام حي بقاعدة بيانات حقيقية
- الجداول: profiles, clients, notifications, static_data, client_counter
- RLS policies: مفعلة على جميع الجداول
- Realtime subscriptions: مفعلة على جدول clients

### المرحلة 5: حماية الصلاحيات ✅
- الهدف: تأمين الصفحات والإجراءات حسب دور المستخدم
- المخرجات:
  - `ProtectedRoute` مكوّن مركزي يتحقق من الدور قبل عرض الصفحة
  - حماية على مستوى الـ Router لكل صفحة لوحة التحكم
  - إخفاء الأزرار الحساسة في ملف العميل (رفع المرحلة، الرفض، طلب اعتماد المدير)
  - فلترة القائمة الجانبية حسب الدور
  - Edge Function `seed-users` لإنشاء المستخدمين التجريبيين
- المستخدمين التجريبيين:
  - `faisal@company.sa` — مدير (manager)
  - `ahmed@company.sa` — مشرف (supervisor)
  - `mona@company.sa` — مدقق (auditor)
  - `sara@company.sa` — موظف (employee)
  - `khalid@company.sa` — موظف (employee)
  - `noura@company.sa` — موظف (employee)
  - كلمة المرور: `123456`

### المرحلة 6: التحسينات المستقبلية
- [x] إضافة صفحة "من نحن" منفصلة (/about)
- [ ] إضافة صفحة "الشروط والأحكام"
- [ ] تحسين الأداء (code splitting)
- [ ] إضافة تكامل WhatsApp API
- [ ] إضافة تكامل SMS

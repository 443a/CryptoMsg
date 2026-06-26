# 🤝 راهنمای مشارکت در CryptoMsg

感谢您对 CryptoMsg 的兴趣！我们欢迎各种形式的贡献。

## 📋 فهرست مطالب

- [انواع مشارکت](#انواع-مشارکت)
- [قبل از شروع](#قبل-از-شروع)
- [راه‌اندازی محیط توسعه](#راه‌اندازی-محیط-توسعه)
- [فرآیند توسعه](#فرآیند-توسعه)
- [استانداردهای کدنویسی](#استانداردهای-کدنویسی)
- [گزارش باگ](#گزارش-باگ)
- [درخواست ویژگی](#درخواست-ویژگی)
- [Pull Request](#pull-request)

---

## انواع مشارکت

ما از انواع مشارکت استقبال می‌کنیم:

| نوع | توضیح | اولویت |
|-----|-------|--------|
| 🐛 گزارش باگ | گزارش مشکلات | بالا |
| 💡 پیشنهاد ویژگی | ایده‌های جدید | متوسط |
| 📝 مستندات | بهبود راهنماها | متوسط |
| 🔧 کدنویسی | اصلاح و توسعه | بالا |
| 🌍 ترجمه | ترجمه به زبان‌های دیگر | پایین |
| 🎨 UI/UX | بهبود طراحی | متوسط |

---

## قبل از شروع

### ۱. بررسی Issues

قبل از شروع هر کاری، لطفاً:
- [Issues موجود](https://github.com/443a/CryptoMsg/issues) را بررسی کنید
- مطمئن شوید مشکل یا پیشنهاد شما قبلاً ثبت نشده
- اگر Issue وجود ندارد، یکی جدید ایجاد کنید

### ۲. Fork کردن پروژه

```bash
# روی دکمه Fork در GitHub کلیک کنید
# سپس کلون کنید:
git clone https://github.com/YOUR-USERNAME/CryptoMsg.git
cd CryptoMsg
```

### ۳. تنظیم Upstream

```bash
# اضافه کردن upstream
git remote add upstream https://github.com/443a/CryptoMsg.git

# بررسی
git remote -v
# باید ببینید:
# origin    https://github.com/YOUR-USERNAME/CryptoMsg.git (fetch)
# origin    https://github.com/YOUR-USERNAME/CryptoMsg.git (push)
# upstream  https://github.com/443a/CryptoMsg.git (fetch)
# upstream  https://github.com/443a/CryptoMsg.git (push)
```

---

## راه‌اندازی محیط توسعه

### پیش‌نیازها

- یک ویرایشگر کد (VS Code توصیه می‌شود)
- Git
- یک مرورگر مدرن (Chrome, Firefox, Edge)

### نصب و اجرا

```bash
# کلون پروژه
git clone https://github.com/443a/CryptoMsg.git
cd CryptoMsg

# بدون نیاز به نصب - فایل index.html را در مرورگر باز کنید
# یا از یک سرور محلی استفاده کنید:

# با Python
python -m http.server 8080

# با Node.js
npx serve .

# با PHP
php -S localhost:8080
```

### نصب VS Code Extensions (توصیه)

```json
// settings.json در VS Code
{
  "editor.formatOnSave": true,
  "editor.tabSize": 4,
  "files.eol": "\n"
}
```

---

## فرآیند توسعه

### ۱. ایجاد Branch

```bash
# مطمئن شوید از آخرین نسخه main شروع می‌کنید
git checkout main
git pull upstream main

# ایجاد branch جدید
# برای باگ:
git checkout -b fix/description-of-bug

# برای ویژگی:
git checkout -b feature/description-of-feature

# برای مستندات:
git checkout -b docs/description-of-docs
```

### ۲. انجام تغییرات

```bash
# تغییرات خود را انجام دهید
# سپس:
git add .
git commit -m "توضیح مختصر تغییرات"
```

### ۳. قواعد Commit

از Conventional Commits استفاده کنید:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: ویژگی جدید
- `fix`: رفع باگ
- `docs`: مستندات
- `style`: فرمت‌بندی (بدون تغییر کد)
- `refactor`: بازنویسی کد
- `test`: تست
- `chore`: کارهای نگهداری

**Examples:**
```bash
git commit -m "feat(security): add CSP headers"
git commit -m "fix(encoding): correct Farsi character mapping"
git commit -m "docs(readme): update installation guide"
```

### ۴. تست محلی

```bash
# باز کردن در مرورگر
# و بررسی:
# ✓ رمزنگاری و رمزگشایی کار می‌کند
# ✓ رابط کاربری درست نمایش داده می‌شود
# ✓ هیچ خطایی در Console نیست
# ✓ در موبایل هم تست کنید
```

### ۵. Push و ایجاد Pull Request

```bash
# Push به GitHub
git push origin YOUR-BRANCH-NAME

# حالا در GitHub یک Pull Request ایجاد کنید
```

---

## استانداردهای کدنویسی

### JavaScript

```javascript
// ✅ خوب
const encryptMessage = async function(text, password) {
    try {
        const result = await crypto.encrypt(text, password);
        return result;
    } catch (error) {
        console.error('Encryption failed:', error);
        throw error;
    }
};

// ❌ بد
function encryptMessage(text, password) {
    crypto.encrypt(text, password).then(result => { return result; });
}
```

### Naming Conventions

```javascript
// متغیرها: camelCase
const userPassword = 'secret';
let messageContent = '';

// توابع: camelCase با افعال
function validateInput() {}
function generatePassword() {}

// کلاس‌ها: PascalCase
class CryptoModule {}
class UIModule {}

// ثابت‌ها: UPPER_SNAKE_CASE
const MAX_PASSWORD_LENGTH = 128;
const CRYPTO_ALGORITHM = 'AES-GCM';

// فایل‌ها: kebab-case
// app.js, crypto-module.js, ui-handler.js
```

### کامنت‌گذاری

```javascript
/**
 * رمزنگاری پیام با استفاده از AES-GCM
 * @param {string} text - متن ساده برای رمزنگاری
 * @param {string} password - رمز عبور
 * @returns {Promise<string>} - متن رمز شده (Base64)
 * @throws {Error} - اگر رمزنگاری ناموفق باشد
 */
async function encryptMessage(text, password) {
    // تولید Salt تصادفی
    const salt = window.crypto.getRandomValues(new Uint8Array(16));

    // ...
}
```

---

## گزارش باگ

لطفاً قبل از گزارش باگ، موارد زیر را بررسی کنید:

1. آیا از آخرین نسخه استفاده می‌کنید؟
2. آیا مشکل در Issue دیگری گزارش نشده؟
3. آیا می‌توانید مراحل بازتولید را شرح دهید؟

### فرمت گزارش باگ

```markdown
## 🐛 گزارش باگ

### نسخه
نسخه: 5.0.0

### مرورگر
- نام: Chrome
- نسخه: 120.0

### سیستم‌عامل
- ویندوز 11 / مک / لینوکس / اندروید / iOS

### شرح مشکل
توضیح واضح مشکل

### مراحل بازتولید
1. به صفحه اصلی بروم
2. پیام بنویسم
3. رمز وارد کنم
4. روی دکمه رمزنگاری کلیک کنم
5. ❌ خطا رخ می‌دهد

### رفتار مورد انتظار
توضیح رفتار صحیح

### رفتار واقعی
توضیح رفتار اشتباه

### اسکرین‌شات (در صورت امکان)
[اسکرین‌شات]

### Console Errors
```
خطاهای Console اینجا
```

### اطلاعات اضافی
هر اطلاعات دیگری که مفید است
```

---

## درخواست ویژگی

### فرمت درخواست ویژگی

```markdown
## 💡 درخواست ویژگی

### شرح ویژگی
توضیح واضح ویژگی مورد نظر

### مشکل/نیاز
چه مشکلی را حل می‌کند؟ چه نیازی را برآورده می‌کند؟

### راه‌حل پیشنهادی (در صورت وجود)
ایده‌های شما برای پیاده‌سازی

### جایگزین‌ها (در صورت وجود)
راه‌حل‌های دیگری که در نظر دارید

### موارد استفاده
- مورد استفاده ۱
- مورد استفاده ۲
```

---

## Pull Request

### چک‌لیست قبل از ارسال PR

- [ ] کد من تست شده و کار می‌کند
- [ ] تغییرات با استانداردهای کدنویسی مطابقت دارد
- [ ] Commit ها معنادار هستند
- [ ] مستندات به‌روز شده (در صورت نیاز)
- [ ] هیچ خطای Console وجود ندارد

### Template Pull Request

```markdown
## 🔄 Pull Request

### شرح
توضیح مختصر تغییرات

### نوع تغییر
- [ ] رفع باگ
- [ ] ویژگی جدید
- [ ] مستندات
- [ ] refactor
- [ ] تست

### Issues مرتبط
Fixes #123

### تست انجام شده
- [ ] رمزنگاری تست شد
- [ ] رمزگشایی تست شد
- [ ] UI تست شد
- [ ] موبایل تست شد

### اسکرین‌شات (در صورت تغییر UI)
[اسکرین‌شات]
```

---

## 📞 تماس

- **GitHub Issues**: [لینک](https://github.com/443a/CryptoMsg/issues)
- **Email**: در پروفایل GitHub

---

## 📜 قوانین

با مشارکت در این پروژه، شما با قوانین زیر موافقت می‌کنید:

1. کد شما باید تحت لیسنس MIT منتشر شود
2. کد شما نباید شامل恶意 کد باشد
3. کد شما باید از استانداردهای امنیتی پیروی کند
4. باید محترمانه و سازنده باشید

---

**ممنون از مشارکت شما! 🙏**

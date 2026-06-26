# 🔐 CryptoMsg Ultimate

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-5.0-green.svg)
![Security](https://img.shields.io/badge/Security-AES--GCM--256--red.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)
![Accessibility](https://img.shields.io/badge/Accessibility-WCAG--2.1--green.svg)

**[🌐 اجرای آنلاین (Cloudflare Pages)](https://cryptomsg.pages.dev/)**
&ensp;|&ensp;
**[🌐 اجرای آنلاین (GitHub Pages)](https://443a.github.io/CryptoMsg/)**

</div>

---

## 📖 فهرست مطالب

- [درباره پروژه](#درباره-پروژه)
- [ویژگی‌ها](#ویژگی‌ها)
- [امنیت](#امنیت)
- [نحوه استفاده](#نحوه-استفاده)
- [نصب و توسعه](#نصب-و-توسعه)
- [معماری](#معماری)
- [مشارکت](#مشارکت)
- [لایسنس](#لایسنس)

---

## 🎯 درباره پروژه

**CryptoMsg Ultimate** یک ابزار متن‌باز و رایگان برای رمزنگاری پیام‌های متنی با بالاترین سطح امنیت است. این ابزار از **Web Crypto API** داخلی مرورگر استفاده می‌کند و تمام عملیات به صورت کاملاً **کلاینت‌ساید** و **بدون سرور** انجام می‌شود.

### ✨ چرا CryptoMsg؟

| ویژگی | توضیح |
|--------|-------|
| 🔒 **امنیت فوق‌العاده** | AES-GCM 256-bit با PBKDF2 |
| 🌐 **کاملاً آفلاین** | بدون نیاز به اینترنت |
| 📱 **PWA** | قابل نصب روی موبایل و دسکتاپ |
| 👻 **Zero-Knowledge** | هیچ داده‌ای ارسال نمی‌شود |
| 🎨 **چند زبانه** | فارسی و انگلیسی |
| 🌓 **تم تاریک/روشن** | دو حالت نمایش |
| ♿ **دسترس‌پذیر** | پشتیبانی از ARIA و صفحه‌کلید |

---

## ✨ ویژگی‌ها

### 🔐 رمزنگاری

- **AES-GCM 256-bit**: رمزنگاری با تایید اصالت (Authenticated Encryption)
- **PBKDF2**: کلیدسازی با 600,000 تکرار برای جلوگیری از Brute-force
- **Salt تصادفی**: هر پیام با کلید متفاوت رمز می‌شود
- **IV تصادفی**: بردار مقداردهی اولیه یکتا برای هر پیام

### 🎭 پنهان‌نگاری (Steganography)

| روش | توضیح | مناسب برای |
|-----|-------|-----------|
| **Base64** | استاندارد | واتساپ، ذخیره‌سازی |
| **حروف فارسی** | تبدیل به حروف فارسی | SMS، پیامک |
| **جملات فارسی** | کلمات معنی‌دار | فیلترینگ |
| **متن نامرئی** | داخل متن عادی | اینستاگرام، توییتر |
| **حروف روسی** | الفبای سیریلیک | AIهای نظارتی |
| **ایموجی** | فقط شکلک | فان |
| **چینی** | کاراکترهای چینی | فیلترهای کلمات |
| **انگلیسی جعلی** | شبیه Seed Phrase | استتار |

### 🛡️ امنیت

- **Content Security Policy**: حفاظت از XSS
- **Subresource Integrity**: بررسی完整性 CDNها
- **Sanitize ورودی**: جلوگیری از XSS
- **پاکسازی خودکار کلیپ‌بورد**: امنیت بیشتر
- **کیبوردهای امن**: توصیه استفاده از Incognito

### 📱 PWA

- قابل نصب روی Android, iOS, Windows, macOS, Linux
- کار آفلاین بدون نیاز به اینترنت
- Push Notifications (آماده)
- Dark/Light Theme

---

## 🔒 امنیت

### استانداردهای استفاده شده

| پارامتر | مقدار | توضیح |
|---------|-------|-------|
| **الگوریتم** | AES-GCM | Authenticated Encryption |
| **اندازه کلید** | 256-bit | استاندارد NIST |
| **Key Derivation** | PBKDF2 | Password-Based Key Derivation |
| **Hash Function** | SHA-256 | NIST Standard |
| **Iterations** | 600,000 | مقاومت در برابر Brute-force |
| **Salt** | 128-bit | تصادفی از CSPRNG |
| **IV** | 96-bit | تصادفی از CSPRNG |

### نحوه کار

```
┌─────────────────────────────────────────────────────────────┐
│                    فرآیند رمزنگاری                          │
├─────────────────────────────────────────────────────────────┤
│  1. کاربر پیام و رمز عبور را وارد می‌کند                   │
│  2. Salt تصادفی (16 بایت) تولید می‌شود                     │
│  3. IV تصادفی (12 بایت) تولید می‌شود                        │
│  4. رمز عبور با PBKDF2 (600K تکرار) به کلید تبدیل می‌شود  │
│  5. پیام با AES-GCM رمز می‌شود                              │
│  6. خروجی: Salt + IV + Ciphertext (همه Base64)             │
└─────────────────────────────────────────────────────────────┘
```

### ⚠️ هشدارهای امنیتی

1. **رمز عبور را جداگانه بفرستید**: هرگز رمز و پیام را در یک پیام ارسال نکنید
2. **از رمز قوی استفاده کنید**: حداقل ۱۲ کاراکتر با حروف بزرگ، کوچک، اعداد و نمادها
3. **حافظه کلیپ‌بورد را پاک کنید**: بعد از کپی، یک متن الکی کپی کنید
4. **در حالت Incognito استفاده کنید**: برای امنیت بیشتر

---

## 📖 نحوه استفاده

### ۱. ارسال پیام امن

```markdown
1. وارد سایت شوید
2. پیام خود را بنویسید
3. یک رمز عبور قوی انتخاب کنید
4. روش مخفی‌سازی را انتخاب کنید:
   - SMS → حروف فارسی
   - اینستاگرام → متن نامرئی
   - واتساپ → جملات فارسی
5. دکمه "رمزنگاری" را بزنید
6. متن تولید شده را کپی و ارسال کنید
```

### ۲. دریافت پیام

```markdown
1. به تب "دریافت" بروید
2. متن رمز شده را پیست کنید
3. رمز عبور را وارد کنید
4. پیام اصلی نمایش داده می‌شود
```

### ⌨️ میانبرهای صفحه‌کلید

| میانبر | عملکرد |
|--------|--------|
| `Ctrl + Enter` | اجرای عملیات |
| `Ctrl + Shift + T` | تغییر تم |
| `Ctrl + Shift + L` | تغییر زبان |

---

## 🛠️ نصب و توسعه

### پیش‌نیازها

- هیچ! این پروژه هیچ وابستگی (Dependency) ندارد

### نصب سریع

```bash
# کلون کردن پروژه
git clone https://github.com/443a/CryptoMsg.git

# رفتن به پوشه پروژه
cd CryptoMsg

# باز کردن در مرورگر
# در ویندوز:
start index.html

# در لینوکس:
xdg-open index.html

# در مک:
open index.html
```

### توسعه با Server محلی

```bash
# با Python 3
python -m http.server 8080

# با Node.js
npx serve .

# با PHP
php -S localhost:8080
```

### ساختار پروژه

```
CryptoMsg/
├── index.html              # صفحه اصلی
├── manifest.json           # تنظیمات PWA
├── sw.js                   # Service Worker
├── assets/
│   ├── js/
│   │   └── app.js         # کد اصلی جاوااسکریپت
│   ├── css/
│   │   └── style.css      # استایل‌ها
│   └── icons/
│       ├── icon.svg
│       ├── icon-192.png
│       └── icon-512.png
├── docs/                   # مستندات (در حال توسعه)
│   ├── README.md
│   ├── CONTRIBUTING.md
│   ├── SECURITY.md
│   └── CHANGELOG.md
├── .github/
│   └── workflows/
│       └── ci.yml          # CI/CD Pipeline
├── LICENSE                 # MIT License
├── README.md               # این فایل
└── REVIEW.md               # گزارش بازبینی
```

---

## 🏗️ معماری

### نمودار ماژول‌ها

```
┌─────────────────────────────────────────────────────────────┐
│                      CryptoMsg Architecture                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │    State    │    │   Crypto    │    │  Encoding   │    │
│  │  Manager    │◄──►│   Module    │◄──►│   Module    │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│         │                  │                  │            │
│         └──────────────────┼──────────────────┘            │
│                            │                                │
│                    ┌───────▼───────┐                       │
│                    │      UI       │                       │
│                    │    Module     │                       │
│                    └───────────────┘                       │
│                            │                                │
│         ┌──────────────────┼──────────────────┐             │
│         ▼                  ▼                  ▼             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │    PWA      │    │  Clipboard   │    │    i18n     │  │
│  │  Service    │    │   Manager    │    │   Support    │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### کلاس‌های اصلی

| کلاس | توضیح |
|------|-------|
| `StateManager` | مدیریت وضعیت اپلیکیشن |
| `CryptoModule` | عملیات رمزنگاری/رمزگشایی |
| `EncodingModule` | تبدیل فرمت‌ها و تشخیص خودکار |
| `UIModule` | مدیریت رابط کاربری |

---

## 🤝 مشارکت

ما از مشارکت شما استقبال می‌کنیم! لطفاً قبل از شروع، [راهنمای مشارکت](CONTRIBUTING.md) را مطالعه کنید.

### راه‌های مشارکت

- 🐛 گزارش باگ
- 💡 پیشنهاد ویژگی جدید
- 📝 بهبود مستندات
- 🔧 کدنویسی
- 🌐 ترجمه به زبان‌های دیگر
- 📖 نوشتن تست

---

## 📄 لایسنس

این پروژه تحت لیسنس **MIT** منتشر شده است.

```
MIT License

Copyright (c) 2024 443a (CryptoMsg)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 قدردانی

- **Web Crypto API**: برای موتور رمزنگاری قدرتمند
- **Font Awesome**: آیکون‌های زیبا
- **Vazirmatn**: فونت فارسی
- **Cloudflare Pages**: هاست رایگان
- **GitHub**: میزبانی کد

---

<div align="center">

ساخته شده با ❤️ برای امنیت و حریم خصوصی

**[⬆ بازگشت به بالا](#-cryptomsg-ultimate)**

</div>

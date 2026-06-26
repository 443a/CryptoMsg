# 🔐 CryptoMsg Ultimate

<div align="center">

![Version](https://img.shields.io/badge/version-5.0.0-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-AES--GCM%20256--bit-ef4444?style=for-the-badge)
![PWA](https://img.shields.io/badge/PWA-Ready-10b981?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=for-the-badge)

**ابزار فوق امن رمزنگاری متن و پنهان‌نگاری با Web Crypto API**

🌐 **[نسخه آنلاین (Cloudflare Pages)](https://cryptomsg.pages.dev/)** | 📖 **[مستندات](#-راهنمای-استفاده)**

</div>

---

## ✨ ویژگی‌های کلیدی

### 🔒 امنیت سطح بالا

| ویژگی | مشخصات |
|--------|--------|
| **الگوریتم** | AES-GCM (256-bit) با Authentication |
| **Key Derivation** | PBKDF2 با 600,000 تکرار |
| **Salt** | 128-bit تصادفی (CSPRNG) |
| **IV** | 96-bit تصادفی |
| **Client-Side** | تمام عملیات در دستگاه شما |

### 🎭 روش‌های مخفی‌سازی (Encoding)

| روش | توضیح | کاربرد |
|-----|--------|--------|
| **Base64** | استاندارد جهانی | واتساپ، ذخیره فایل |
| **فارسی** | حروف تصادفی فارسی | SMS، پیامک |
| **جملات فارسی** | کلمات معنی‌دار | فیلترینگ |
| **نامرئی** | Zero-Width Characters | اینستاگرام، توییتر |
| **روسی** | الفبای سیریلیک | عبور از فیلتر |
| **ایموجی** | تبدیل به شکلک | فان، گیج کردن AI |
| **چینی** | کاراکترهای چینی | فشرده‌ترین حالت |
| **انگلیسی جعلی** | Seed Phrase استایل | استتار |

### ⚡ امکانات

- 📱 **PWA** - قابل نصب روی گوشی
- 🌙 **تم تاریک/روشن** - با ذخیره در localStorage
- 🌐 **چندزبانگی** - فارسی و انگلیسی
- 📋 **کلیپ‌بورد هوشمند** - کپی با نوتیفیکیشن
- 🔄 **بروزرسانی خودکار** - Service Worker
- ⌨️ **میانبرهای کیبورد** - Ctrl+Enter, Ctrl+Shift+T

---

## 🚀 شروع سریع

### استفاده آنلاین

```bash
# Cloudflare Pages
https://cryptomsg.pages.dev/

# GitHub Pages
https://443a.github.io/CryptoMsg/
```

### نصب محلی

```bash
# کلون پروژه
git clone https://github.com/443a/CryptoMsg.git
cd CryptoMsg

# نصب وابستگی‌ها
npm install

# اجرا در حالت توسعه
npm run dev

# بیلد برای پروداکشن
npm run build
```

---

## 📖 راهنمای استفاده

### ارسال پیام امن

1. **نوشتن پیام** در کادر متن
2. **انتخاب رمز عبور** قوی (حداقل 12 کاراکتر)
3. **انتخاب روش مخفی‌سازی**:
   - SMS → `حروف فارسی`
   - شبکه اجتماعی → `نامرئی`
   - واتساپ → `استاندارد`
4. کلیک روی **"رمزنگاری پیام"**
5. کپی نتیجه و ارسال به گیرنده

### دریافت پیام

1. رفتن به تب **"دریافت"**
2. **پیست** متن رمز شده
3. وارد کردن **رمز عبور**
4. کلیک روی **"رمزگشایی"**

### نکات امنیتی

⚠️ **رمز عبور را جداگانه بفرستید!** (متن را در تلگرام، رمز را تلفنی)

---

## 🏗️ معماری پروژه

```
CryptoMsg/
├── src/
│   ├── core/           # Core modules
│   │   ├── crypto.ts   # رمزنگاری AES-GCM
│   │   ├── encoding.ts # تبدیل و پنهان‌نگاری
│   │   └── state.ts   # مدیریت state
│   ├── services/       # سرویس‌ها
│   │   └── index.ts    # Clipboard, Storage, QR
│   ├── ui/             # رابط کاربری
│   │   └── index.ts    # UIModule
│   ├── i18n/           # بین‌المللی‌سازی
│   │   └── index.ts    # ترجمه‌ها
│   ├── workers/        # Web Workers
│   │   └── crypto.worker.ts
│   └── types/          # TypeScript types
│       └── index.ts
├── tests/              # تست‌ها
│   ├── crypto.test.ts
│   ├── encoding.test.ts
│   └── e2e.spec.ts
├── .github/
│   └── workflows/      # CI/CD
│       └── ci.yml
├── index.html
├── manifest.json       # PWA manifest
└── package.json
```

---

## 🧪 تست

```bash
# تست‌های یونیت
npm test

# تست با UI
npm run test:ui

# پوشش تست
npm run test:coverage

# تست‌های E2E
npm run test:e2e
```

---

## 🔧 تنظیمات توسعه

### متغیرهای محیطی

```env
# .env.local
VITE_APP_VERSION=5.0.0
VITE_APP_TITLE=CryptoMsg
```

### میانبرهای کیبورد

| میانبر | عملکرد |
|--------|--------|
| `Ctrl+Enter` | اجرای رمزنگاری/رمزگشایی |
| `Ctrl+Shift+T` | تغییر تم |
| `Ctrl+Shift+L` | تغییر زبان |

---

## 🤝 مشارکت

1. Fork کنید
2. Branch جدید بسازید (`git checkout -b feature/amazing`)
3. تغییرات را commit کنید (`git commit -m 'Add amazing feature'`)
4. Push کنید (`git push origin feature/amazing`)
5. Pull Request باز کنید

---

## 📄 لایسنس

MIT License - See [LICENSE](LICENSE) for details.

---

## 🙏 قدردانی

- [Vazirmatn](https://github.com/rastikerdar/vazirmatn) - فونت فارسی
- [Font Awesome](https://fontawesome.com) - آیکون‌ها
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) - رمزنگاری

---

<div align="center">

**ساخته شده با ❤️ برای حریم خصوصی شما**

</div>

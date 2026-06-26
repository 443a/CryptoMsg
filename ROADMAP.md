# 🗺️ نقشه راه توسعه CryptoMsg
## Roadmap 2024-2025

<div align="center">

![Version](https://img.shields.io/badge/version-5.0-blue)
![Status](https://img.shields.io/badge/status-Active-green)
![Security](https://img.shields.io/badge/security-AES--GCM--256-red)

</div>

---

## 📋 فهرست مطالب

- [وضعیت فعلی](#وضعیت-فعلی)
- [فاز ۱: پایداری](#فاز-۱-پایداری)
- [فاز ۲: ویژگی‌ها](#فاز-۲-ویژگی‌ها)
- [فاز ۳: توسعه](#فاز-۳-توسعه)
- [فاز ۴: جامعه](#فاز-۴-جامعه)

---

## 🎯 وضعیت فعلی

### ✅ نسخه 5.0 منتشر شده

| ویژگی | وضعیت |
|--------|--------|
| رمزنگاری AES-GCM 256-bit | ✅ |
| PBKDF2 Key Derivation | ✅ |
| پنهان‌نگاری (Steganography) | ✅ |
| Dark/Light Theme | ✅ |
| Multi-language (FA/EN) | ✅ |
| PWA Support | ✅ |
| CI/CD Pipeline | ✅ |
| مستندات کامل | ✅ |

---

## 🔜 فاز ۱: پایداری

### 1.1 TypeScript Migration

**هدف:** بهبود type safety و DX

```typescript
// مثال: typing برای CryptoModule
interface EncryptedData {
    salt: string;
    iv: string;
    ciphertext: string;
}

interface CryptoConfig {
    iterations: number;
    keyLength: 256;
    algorithm: 'AES-GCM';
    hash: 'SHA-256';
}

class CryptoModule {
    encrypt(text: string, password: string): Promise<string>;
    decrypt(data: string, password: string): Promise<string>;
    generatePassword(length?: number): string;
}
```

**فایل‌ها:**
- [ ] `src/types/crypto.ts`
- [ ] `src/types/ui.ts`
- [ ] `src/types/models.ts`
- [ ] `tsconfig.json`

**Status:** 🟡 Planned

---

### 1.2 Unit Tests

**هدف:** پوشش تست بالا برای اطمینان از صحت

**Tools:** Vitest + Happy DOM

```typescript
// مثال تست
describe('CryptoModule', () => {
    it('should encrypt and decrypt text correctly', async () => {
        const text = 'Hello World';
        const password = 'test123';

        const encrypted = await Crypto.encrypt(text, password);
        const decrypted = await Crypto.decrypt(encrypted, password);

        expect(decrypted).toBe(text);
    });

    it('should throw on wrong password', async () => {
        await expect(
            Crypto.decrypt(encrypted, 'wrong')
        ).rejects.toThrow();
    });
});
```

**Status:** 🟡 Planned

---

### 1.3 E2E Tests

**هدف:** تست end-to-end با Playwright

```typescript
// مثال E2E test
test('encryption flow', async ({ page }) => {
    await page.goto('/');
    await page.fill('#inputText', 'Test message');
    await page.fill('#password', 'SecurePass123!');
    await page.click('#actionBtn');
    await expect(page.locator('.result-text')).toBeVisible();
});
```

**Status:** 🟡 Planned

---

## 🚀 فاز ۲: ویژگی‌ها

### 2.1 QR Code Generator

**هدف:** اشتراک‌گذاری آسان پیام‌ها

**الگوریتم:**
1. پیام رمز شده را به QR code تبدیل کنیم
2. QR code را به blob تبدیل کنیم
3. نمایش برای دانلود یا کپی

```javascript
// Library پیشنهادی: qrcode.js
async function generateQR(text) {
    const qr = await QRCode.toDataURL(text, {
        width: 512,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' }
    });
    return qr;
}
```

**Status:** 🟡 Planned
**Priority:** متوسط
**Effort:** ~4 hours

---

### 2.2 File Encryption

**هدف:** رمزنگاری فایل‌ها

**Features:**
- [ ] Drag & Drop فایل
- [ ] رمزنگاری با AES-GCM
- [ ] خروجی به صورت فایل رمز شده
- [ ] رمزگشایی فایل

```javascript
// مثال
async function encryptFile(file, password) {
    const buffer = await file.arrayBuffer();
    const encrypted = await Crypto.encrypt(buffer, password);
    return new Blob([encrypted], { type: 'application/octet-stream' });
}
```

**Status:** 🟡 Planned
**Priority:** پایین
**Effort:** ~8 hours

---

### 2.3 Message History (Local)

**هدف:** ذخیره تاریخچه پیام‌ها

**Storage:**
- IndexedDB برای ذخیره محلی
- رمزنگاری تاریخچه با Master Password
- Export/Import JSON

```javascript
// Library پیشنهادی: idb (IndexedDB wrapper)
const db = await openDB('cryptomsg-history', 1, {
    upgrade(db) {
        db.createObjectStore('messages', { keyPath: 'id' });
    }
});
```

**Status:** 🟡 Planned
**Priority:** پایین
**Effort:** ~6 hours

---

### 2.4 Image Steganography

**هدف:** مخفی کردن پیام در تصاویر

**Algorithm:**
1. پیام را رمز کنیم
2. بیت‌های پیام را در LSB پیکسل‌های تصویر مخفی کنیم
3. تصویر جدید را ذخیره کنیم

```javascript
// Library پیشنهادی: opencv.js یا stegano
async function hideInImage(imageFile, message, password) {
    const encrypted = await Crypto.encrypt(message, password);
    // Embed in image pixels...
}
```

**Status:** 🔴 Not Planned
**Priority:** پایین
**Effort:** ~16 hours

---

## 🔧 فاز ۳: توسعه

### 3.1 Translation Crowdsourcing

**هدف:** اضافه کردن زبان‌های بیشتر

**Languages:**
- [ ] 🇸🇦 عربی
- [ ] 🇹🇷 ترکی
- [ ] 🇷🇺 روسی
- [ ] 🇨🇳 چینی
- [ ] 🇪🇸 اسپانیایی
- [ ] 🇫🇷 فرانسوی

**Workflow:**
1. Translation on Crowdin
2. Automated PR
3. Community review

**Status:** 🟡 Planned
**Priority:** متوسط

---

### 3.2 Browser Extensions

**هدف:** دسترسی سریع از مرورگر

**Platforms:**
- [ ] Chrome Extension
- [ ] Firefox Add-on
- [ ] Edge Extension

**Features:**
- Quick access from toolbar
- Context menu integration
- Keyboard shortcuts

**Status:** 🟡 Planned
**Priority:** پایین

---

### 3.3 Mobile Apps

**هدف:** اپلیکیشن‌های Native

**Platforms:**
- [ ] Android (Kotlin)
- [ ] iOS (Swift)

**Benefits:**
- بهترین امنیت (WebView bypass)
- Push Notifications
- Widgets

**Status:** 🔴 Not Planned
**Priority:** پایین

---

### 3.4 Performance Optimization

**هدف:** افزایش سرعت

**Tasks:**
- [ ] Web Workers برای رمزنگاری (non-blocking)
- [ ] Virtual scrolling برای لیست‌ها
- [ ] Lazy loading برای تصاویر
- [ ] Compression (Brotli/Gzip)

```javascript
// Web Worker example
// workers/crypto.worker.js
self.onmessage = async (e) => {
    const { text, password, mode } = e.data;
    const result = await Crypto[mode](text, password);
    self.postMessage({ result });
};
```

**Status:** 🟡 Planned
**Priority:** متوسط

---

## 👥 فاز ۴: جامعه

### 4.1 Documentation Website

**هدف:** سایت مستندات کامل

**Tools:**
- VitePress
- GitBook
- Docusaurus

**Sections:**
- [ ] راهنمای شروع سریع
- [ ] API Reference
- [ ] Security Whitepaper
- [ ] Blog/News

**Status:** 🟡 Planned
**Priority:** متوسط

---

### 4.2 Security Bug Bounty

**هدف:** تشویق گزارش باگ‌های امنیتی

**Program:**
- https://huntr.dev/ (Free)
- https://bugcrowd.com/ (Paid)

**Scope:**
- XSS vulnerabilities
- CSRF
- Crypto implementation flaws
- Service Worker bypasses

**Status:** 🟡 Planned

---

### 4.3 Open Source Governance

**هدف:** مدیریت پروژه

**Tasks:**
- [ ] CODEOWNERS file
- [ ] Maintainers list
- [ ] Decision making process
- [ ] Release process

**Status:** 🟡 Planned

---

## 📊 Matrix Priority/Effort

```
                    Low Effort        High Effort
High Priority    ┌─────────────┐   ┌─────────────┐
                 │ TypeScript   │   │ File       │
                 │ Unit Tests   │   │ Encryption │
                 │              │   │            │
                 └─────────────┘   └─────────────┘
Low Priority     ┌─────────────┐   ┌─────────────┐
                 │ Translations│   │ Mobile App  │
                 │ E2E Tests   │   │ Image       │
                 │ History     │   │ Steganography│
                 └─────────────┘   └─────────────┘
```

---

## 🏷️ Labels

| Label | رنگ | توضیح |
|-------|------|-------|
| `enhancement` | 🟢 | ویژگی جدید |
| `bug` | 🔴 | باگ |
| `security` | 🟠 | امنیتی |
| `documentation` | 🔵 | مستندات |
| `good first issue` | 🟡 | برای مبتدیان |
| `help wanted` | 🟣 | کمک نیاز |
| `wontfix` | ⚫ | انجام نمی‌شود |

---

## 📅 Release Cadence

| Cycle | توضیح |
|-------|--------|
| **Major** | هر 6-12 ماه |
| **Minor** | هر 2-3 ماه |
| **Patch** | هر 2-4 هفته |

---

## 🤝 چطور کمک کنید

1. **Issues** را بررسی کنید
2. **Good First Issues** را انتخاب کنید
3. **Fork** کنید و تغییرات را اعمال کنید
4. **PR** ارسال کنید

---

*آخرین بروزرسانی: ۱۴۰۵/۰۴/۰۵*
*Maintainer: [@443a](https://github.com/443a)*

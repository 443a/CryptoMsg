# 🔒 Content Security Policy Configuration
# CryptoMsg Ultimate

این فایل حاوی تنظیمات CSP برای Deploy روی سرورهای مختلف است.

---

## ⚠️ مهم: CSP در Meta Tag

**توجه:** دایرکتیو `frame-ancestors` فقط در HTTP Header کار می‌کند و در Meta Tag نادیده گرفته می‌شود.

بنابراین برای امنیت کامل، باید CSP را از طریق HTTP Header تنظیم کنید.

---

## 🚀 Nginx Configuration

```nginx
# در بلاک server یا location
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self';
    style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
    font-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
    img-src 'self' data:;
    connect-src 'none';
    frame-ancestors 'none';
    form-action 'self';
    base-uri 'self';
" always;

# برای HSTS (اختیاری)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# برای X-Frame-Options (پشتیبانی از مرورگرهای قدیمی)
add_header X-Frame-Options "DENY" always;

# برای X-Content-Type-Options
add_header X-Content-Type-Options "nosniff" always;

# برای Referrer-Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## 🌐 Apache Configuration

```apache
# در .htaccess یا VirtualHost
<IfModule mod_headers.c>
    Header set Content-Security-Policy "
        default-src 'self';
        script-src 'self';
        style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
        font-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com;
        img-src 'self' data:;
        connect-src 'none';
        frame-ancestors 'none';
        form-action 'self';
        base-uri 'self';
    "

    Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header set X-Frame-Options "DENY"
    Header set X-Content-Type-Options "nosniff"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

---

## ☁️ Cloudflare Pages

در Cloudflare Pages، CSP را از طریق Rules تنظیم کنید:

1. **Dashborad → Pages → Your Site → Settings → Headers**
2. یک Rule جدید ایجاد کنید:

```
URL Pattern: /*
Headers:
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; font-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; img-src 'self' data:; connect-src 'none'; frame-ancestors 'none';
  Strict-Transport-Security: max-age=31536000
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
```

---

## 🟢 GitHub Pages

GitHub Pages از CSP پشتیبانی نمی‌کند. برای امنیت بیشتر:

1. از Cloudflare Pages استفاده کنید (CSP فعال می‌شود)
2. یا HTTPS را اجباری کنید (در Settings)

---

## 📋 CSP directives توضیح داده شده

| Directive | مقدار | توضیح |
|-----------|-------|-------|
| `default-src` | `'self'` | منبع پیش‌فرض فقط خود سایت |
| `script-src` | `'self'` | فقط JS خود سایت |
| `style-src` | `'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com` | استایل خود سایت + CDN fonts |
| `font-src` | `'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com` | فونت‌های CDN |
| `img-src` | `'self' data:` | تصاویر خود سایت + Base64 data URIs |
| `connect-src` | `'none'` | هیچ اتصال شبکه‌ای (Zero-Knowledge) |
| `frame-ancestors` | `'none'` | جلوگیری از iframe شدن سایت |
| `form-action` | `'self'` | فقط فرم‌های خود سایت |
| `base-uri` | `'self'` | فقط base URL خود سایت |

---

## 🔧 Testing CSP

برای تست CSP، از ابزارهای زیر استفاده کنید:

### Browser DevTools
1. Console را باز کنید
2. خطاهای CSP را بررسی کنید

### Online CSP Evaluator
- https://csp-evaluator.withgoogle.com/
- https://observatory.mozilla.org/

### CLI Testing
```bash
# با curl
curl -I https://your-site.com | grep -i content-security-policy
```

---

## ⚡ Troubleshooting

### خطای "Refused to execute inline script"
باید همه event handler ها از inline (`onclick="..."`) به `addEventListener` تغییر کنند.

### خطای "Refused to load script from 'self'"
مطمئن شوید مسیر اسکریپت‌ها صحیح است:
```html
<script src="./assets/js/app.js"></script>
```

### خطای "Refused to load stylesheet from 'self'"
فونت‌ها و CSS باید با مسیر صحیح لود شوند.

---

*این فایل بخشی از CryptoMsg Ultimate است.*

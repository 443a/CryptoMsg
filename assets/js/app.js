/**
 * CryptoMsg Ultimate - Core Module
 * نسخه 5.0 - امنیت پیشرفته و معماری ماژولار
 *
 * @author 443a
 * @license MIT
 * @version 5.0.0
 */

// ==========================================
// 1. CONFIGURATION & CONSTANTS
// ==========================================

const CONFIG = {
    // رمزنگاری
    CRYPTO: {
        ITERATIONS: 600000,
        KEY_LENGTH: 256,
        SALT_LENGTH: 16,
        IV_LENGTH: 12,
        ALGORITHM: 'AES-GCM',
        HASH: 'SHA-256'
    },
    // تم
    THEME: {
        DARK: 'dark',
        LIGHT: 'light',
        STORAGE_KEY: 'cryptomsg-theme'
    },
    // زبان
    I18N: {
        DEFAULT: 'fa',
        STORAGE_KEY: 'cryptomsg-lang'
    },
    // کلیپ‌بورد
    CLIPBOARD: {
        AUTO_CLEAR_DELAY: 60000, // 1 دقیقه
        SECURE_CLEAR_DELAY: 30000 // 30 ثانیه
    },
    // کاراکترهای Zero-Width برای Steganography
    ZW_CHARS: ['‌', '‍', '﻿', '⁠']
};

// ==========================================
// 2. DICTIONARIES
// ==========================================

const DICTIONARIES = {
    base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(''),

    farsiChars: [
        'ا','ب','پ','ت','ث','ج','چ','ح','خ','د','ذ','ر','ز','ژ','س','ش',
        'ص','ض','ط','ظ','ع','غ','ف','ق','ک','گ','ل','م','ن','و','ه','ی',
        'آ','أ','ؤ','إ','ة','ئ','ى','ء','۰','۱','۲','۳','۴','۵','۶','۷',
        '۸','۹','،','؛','?','!','@','#','$','%','^','&','*','(',')','='
    ],

    farsiWords: [
        "آسمان", "درخت", "سیب", "انار", "میز", "کتاب", "دفتر", "قلم", "خورشید", "ماه",
        "ستاره", "ابر", "باران", "برف", "باد", "خاک", "آتش", "دریا", "رود", "کوه",
        "جنگل", "دشت", "باغ", "گل", "پرنده", "ماهی", "شیر", "پلنگ", "اسب", "سگ",
        "گربه", "موش", "نان", "پنیر", "چای", "قهوه", "غذا", "آب", "هوا", "نور",
        "صدا", "سکوت", "روز", "شب", "صبح", "عصر", "فردا", "دیروز", "هفته", "ماه",
        "سال", "زمان", "ساعت", "دقیقه", "ثانیه", "خانه", "مدرسه", "شهر", "روستا",
        "خیابان", "کوچه", "پلاک", "دیوار", "پنجره", "صندلی", "پله", "زیرزمین", "بالکن"
    ],

    russian: [
        "А","Б","В","Г","Д","Е","Ё","Ж","З","И","Й","К","Л","М","Н","О","П","Р","С","Т",
        "У","Ф","Х","Ц","Ч","Ш","Щ","Ъ","Ы","Ь","Э","Ю","Я","а","б","в","г","д","е","ё",
        "ж","з","и","й","к","л","м","н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю","я"
    ],

    emoji: [
        "😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","☺","😚",
        "😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒",
        "🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕"
    ],

    chinese: [
        "的","一","是","在","不","了","有","和","人","这","中","大","为","上","个","国","我","以","要","他","时",
        "来","用","们","生","到","作","地","于","出","就","分","对","成","会","可","主","发","年","动","同",
        "工","也","能","下","过","子","说","产","种","面","而","方","后","多","定","行","学","法","所","民",
        "得","经","十","三","五","七","万","亿","日","月","年","山","水","火","木","金","土","风","雨","雷"
    ],

    englishFake: [
        "Action", "Bridge", "Cloud", "Drive", "Earth", "Fire", "Green", "House", "Iron", "Jump", "King", "Lion", "Moon", "Night",
        "Ocean", "Power", "Queen", "River", "Storm", "Tree", "Unity", "Voice", "Water", "Xray", "Yellow", "Zebra",
        "Apple", "Bread", "Chair", "Desk", "Eagle", "Fruit", "Grape", "Horse", "Ice", "Juice", "Kite", "Lemon",
        "Mouse", "Nest", "Orange", "Paper", "Quiet", "Radio", "Snake", "Table", "Uncle", "Video", "Watch", "Box",
        "Yard", "Zone", "Alpha", "Beta", "Gamma", "Delta", "Echo", "Fox", "Golf", "Hotel", "India", "Juliet", "Kilo", "Mike",
        "November", "Oscar", "Papa", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "Xray", "Yankee", "Zulu"
    ]
};

// ==========================================
// 3. TRANSLATIONS (i18n)
// ==========================================

const I18N = {
    fa: {
        // عناوین
        appTitle: 'CryptoMsg',
        appSubtitle: 'Ultimate',
        version: 'نسخه 5.0 (بروزرسانی)',
        tabEncrypt: 'ارسال (رمزنگاری)',
        tabDecrypt: 'دریافت (رمزگشایی)',

        // فرم‌ها
        encodingMethod: 'انتخاب روش مخفی‌سازی:',
        inputLabel: 'متن پیام:',
        inputPlaceholder: 'پیام محرمانه خود را بنویسید...',
        passwordLabel: 'رمز عبور (حیاتی):',
        passwordPlaceholder: 'حداقل ۱۲ کاراکتر...',
        coverTextLabel: 'متن پوششی (برای مخفی‌سازی):',
        coverTextPlaceholder: 'مثلاً: سلام چطوری؟ خوبی؟',

        // دکمه‌ها
        btnEncrypt: 'رمزنگاری پیام',
        btnDecrypt: 'رمزگشایی پیام',
        btnCopy: 'کپی',
        btnCopyAll: 'کپی کامل',
        btnCopied: 'کپی شد!',
        btnGeneratePass: 'ساخت رمز جادویی',
        btnInstall: 'نصب اپلیکیشن',
        btnUpdate: 'بروزرسانی کش',

        // امنیت
        strengthWeak: 'ضعیف',
        strengthMedium: 'متوسط',
        strengthStrong: 'بسیار قوی',
        strengthNone: 'قدرت: وارد نشده',
        crackTimePrefix: 'زمان تخمینی هک: ',
        crackTimeLess1s: 'کمتر از ۱ ثانیه 😱',
        crackTimeCenturies: 'قرن‌ها! 🛡️ (امن)',

        // پیشنهادات
        smartShort: 'متن کوتاه است (مناسب SMS). پیشنهاد:',
        smartLong: 'متن طولانی است. برای جلوگیری از مسدودی در پیامک، حتما از پارت‌بندی استفاده کنید.',
        smartSocial: 'برای ارسال در شبکه‌های اجتماعی، روش',
        smartAmazing: 'شگفت‌انگیز است!',

        // خطاها
        errorEmptyFields: '⚠️ لطفا متن و رمز عبور را وارد کنید',
        errorDecryptFail: '❌ خطا: رمز عبور اشتباه است یا متن دستکاری شده است.',
        errorLegacyVersion: '⚠️ خطا: این پیام قدیمی است و با نسخه جدید باز نمی‌شود.',
        errorProcessing: 'در حال پردازش...',
        errorNoInvisibleChars: '⚠️ هیچ کاراکتر نامرئی در متن یافت نشد.',

        // آمار
        chars: 'کاراکتر',
        smsApprox: 'پیامک (تقریبی)',

        // بخش‌ها
        guideTitle: 'راهنمای ساده (چطور کار کنم؟)',
        securityTitle: 'نکات مهم امنیتی (حتما بخوانید)',
        methodsTitle: 'راهنمای انتخاب روش‌ها',
        technicalTitle: 'مشخصات فنی',
        termsTitle: 'شرایط استفاده و سلب مسئولیت',

        // عناوین متدها
        methodBase64: 'استاندارد (Base64)',
        methodFarsiChars: 'حروف تصادفی فارسی',
        methodFarsiWords: 'جملات واقعی فارسی',
        methodInvisible: 'متن نامرئی (Steganography)',
        methodRussian: 'حروف روسی (Cyrillic)',
        methodEmoji: 'ایموجی (Emoji)',
        methodChinese: 'کاراکترهای چینی',
        methodEnglishFake: 'انگلیسی (Fake English)',

        // توضیحات متدها
        descBase64: 'استاندارد جهانی. مناسب برای ذخیره در فایل یا ارسال در واتساپ.',
        descFarsiChars: 'تبدیل به حروف تصادفی فارسی. عالی برای SMS.',
        descFarsiWords: 'تبدیل به جملات فارسی بی‌معنی. برای ربات‌های فیلترینگ طبیعی.',
        descInvisible: 'جادوی سیاه! پیام شما داخل یک متن عادی مخفی می‌شود.',
        descRussian: 'استفاده از الفبای سیریلیک. برای عبور از فیلترهای حساس.',
        descEmoji: 'پیام شما تماماً به شکلک تبدیل می‌شود.',
        descChinese: 'کاراکترهای چینی. فشرده‌ترین حالت.',
        descEnglishFake: 'کلمات انگلیسی بی‌ربط. شبیه Seed Phrase.',

        // هشدارها
        warnInvisible: 'هشدار مهم: حجم کاراکتر مخفی بسیار بالاست (هر حرف = ۴ کاراکتر مخفی). در پیامک استفاده نکنید.',
        warnChinese: 'ممکن است در برخی گوشی‌های قدیمی نمایش داده نشود.',
        warnLongText: 'حجم پیام نهایی کمی زیاد می‌شود.',

        // بخش‌های پارت
        partLabel: 'بخش',
        smsPart: 'پیامک',

        // چک‌باکس‌ها
        checkboxSplit: 'تقسیم هوشمند پیام‌های طولانی (پارت‌بندی)',
        checkboxAutoClear: 'پاکسازی خودکار کلیپ‌بورد بعد از ۶۰ ثانیه',

        // تنظیمات
        settings: 'تنظیمات',
        theme: 'تم',
        themeDark: 'تاریک',
        themeLight: 'روشن',
        language: 'زبان',
        langFa: 'فارسی',
        langEn: 'English',

        // نکات امنیتی
        securityTip1Title: 'رمز را جداگانه بفرستید',
        securityTip1Desc: 'هرگز رمز عبور را در همان پیامی که متن رمز شده را می‌فرستید، قرار ندهید.',
        securityTip2Title: 'مراقب کیبوردها باشید',
        securityTip2Desc: 'کیبوردهای گوشی کلمات شما را یاد می‌گیرند. از کیبوردهای امن استفاده کنید.',
        securityTip3Title: 'حافظه کپی را پاک کنید',
        securityTip3Desc: 'بعد از ارسال پیام، یک متن الکی کپی کنید تا پیام اصلی پاک شود.',
        securityTip4Title: 'فراموشی رمز = نابودی پیام',
        securityTip4Desc: 'چون سروری وجود ندارد، بازیابی پیام بدون رمز غیرممکن است.',

        // مشخصات فنی
        techEncryption: 'الگوریتم رمزنگاری: AES-GCM (256-bit)',
        techKeyDerivation: 'کلیدسازی: PBKDF2 با 600,000 تکرار',
        techNoServer: 'بدون سرور: تمام عملیات در دستگاه شما',

        // تنظیمات پیشرفته
        advancedSettings: 'تنظیمات پیشرفته',
        clearHistory: 'پاک کردن تاریخچه',
        exportSettings: 'خروجی تنظیمات',
        importSettings: 'ورود تنظیمات',

        // پیام‌های موفقیت
        successCleared: 'تاریخچه با موفقیت پاک شد.',
        successCopied: 'با موفقیت کپی شد.',
        successUpdated: 'کش برنامه پاک شد. صفحه ریلود می‌شود...'
    },

    en: {
        // Titles
        appTitle: 'CryptoMsg',
        appSubtitle: 'Ultimate',
        version: 'Version 5.0 (Updated)',
        tabEncrypt: 'Send (Encrypt)',
        tabDecrypt: 'Receive (Decrypt)',

        // Forms
        encodingMethod: 'Select Encoding Method:',
        inputLabel: 'Message Text:',
        inputPlaceholder: 'Write your confidential message...',
        passwordLabel: 'Password (Critical):',
        passwordPlaceholder: 'At least 12 characters...',
        coverTextLabel: 'Cover Text (for Steganography):',
        coverTextPlaceholder: 'e.g.: Hello, how are you?',

        // Buttons
        btnEncrypt: 'Encrypt Message',
        btnDecrypt: 'Decrypt Message',
        btnCopy: 'Copy',
        btnCopyAll: 'Copy All',
        btnCopied: 'Copied!',
        btnGeneratePass: 'Generate Strong Password',
        btnInstall: 'Install App',
        btnUpdate: 'Update Cache',

        // Security
        strengthWeak: 'Weak',
        strengthMedium: 'Medium',
        strengthStrong: 'Very Strong',
        strengthNone: 'Strength: Not entered',
        crackTimePrefix: 'Estimated crack time: ',
        crackTimeLess1s: 'Less than 1 second 😱',
        crackTimeCenturies: 'Centuries! 🛡️ (Secure)',

        // Suggestions
        smartShort: 'Short text (good for SMS). Suggestion:',
        smartLong: 'Long text. Use partitioning to avoid SMS blocking.',
        smartSocial: 'For social media,',
        smartAmazing: 'is amazing!',

        // Errors
        errorEmptyFields: '⚠️ Please enter both text and password',
        errorDecryptFail: '❌ Error: Wrong password or tampered text.',
        errorLegacyVersion: '⚠️ Error: This is an old message and cannot be opened with the new version.',
        errorProcessing: 'Processing...',
        errorNoInvisibleChars: '⚠️ No invisible characters found in the text.',

        // Stats
        chars: 'Characters',
        smsApprox: 'SMS (approx)',

        // Sections
        guideTitle: 'Quick Guide (How to use?)',
        securityTitle: 'Important Security Tips (Must Read)',
        methodsTitle: 'Method Selection Guide',
        technicalTitle: 'Technical Specifications',
        termsTitle: 'Terms of Use & Disclaimer',

        // Method titles
        methodBase64: 'Standard (Base64)',
        methodFarsiChars: 'Random Persian Letters',
        methodFarsiWords: 'Real Persian Sentences',
        methodInvisible: 'Invisible Text (Steganography)',
        methodRussian: 'Russian Letters (Cyrillic)',
        methodEmoji: 'Emoji',
        methodChinese: 'Chinese Characters',
        methodEnglishFake: 'Fake English',

        // Method descriptions
        descBase64: 'Universal standard. Good for file storage or WhatsApp.',
        descFarsiChars: 'Convert to random Persian letters. Great for SMS.',
        descFarsiWords: 'Convert to meaningless Persian sentences. Natural for filter bots.',
        descInvisible: 'Black magic! Your message is hidden inside normal text.',
        descRussian: 'Use Cyrillic alphabet. Bypasses sensitive word filters.',
        descEmoji: 'Your message becomes all emojis.',
        descChinese: 'Chinese characters. Most compact option.',
        descEnglishFake: 'Random English words. Looks like a wallet Seed Phrase.',

        // Warnings
        warnInvisible: 'Important: Hidden character volume is very high (each char = 4 hidden chars). Do not use in SMS.',
        warnChinese: 'May not display on some older phones.',
        warnLongText: 'Final message size increases slightly.',

        // Parts
        partLabel: 'Part',
        smsPart: 'SMS',

        // Checkboxes
        checkboxSplit: 'Smart splitting of long messages (Partitioning)',
        checkboxAutoClear: 'Auto-clear clipboard after 60 seconds',

        // Settings
        settings: 'Settings',
        theme: 'Theme',
        themeDark: 'Dark',
        themeLight: 'Light',
        language: 'Language',
        langFa: 'فارسی',
        langEn: 'English',

        // Security Tips
        securityTip1Title: 'Send password separately',
        securityTip1Desc: 'Never include the password in the same message as the encrypted text.',
        securityTip2Title: 'Be careful with keyboards',
        securityTip2Desc: 'Phone keyboards learn your words. Use secure keyboards.',
        securityTip3Title: 'Clear clipboard memory',
        securityTip3Desc: 'After sending, copy something random to clear the original message.',
        securityTip4Title: 'Forgot password = Message destroyed',
        securityTip4Desc: 'Without a server, recovery without password is impossible.',

        // Technical specs
        techEncryption: 'Encryption: AES-GCM (256-bit)',
        techKeyDerivation: 'Key Derivation: PBKDF2 with 600,000 iterations',
        techNoServer: 'No Server: All operations on your device',

        // Advanced settings
        advancedSettings: 'Advanced Settings',
        clearHistory: 'Clear History',
        exportSettings: 'Export Settings',
        importSettings: 'Import Settings',

        // Success messages
        successCleared: 'History cleared successfully.',
        successCopied: 'Copied successfully.',
        successUpdated: 'Cache cleared. Reloading...'
    }
};

// ==========================================
// 4. STATE MANAGEMENT
// ==========================================

class StateManager {
    constructor() {
        this.state = {
            currentMode: 'encrypt',
            currentLang: this.loadLanguage(),
            currentTheme: this.loadTheme(),
            clipboardTimer: null,
            autoClearEnabled: false
        };
    }

    loadLanguage() {
        return localStorage.getItem(CONFIG.I18N.STORAGE_KEY) || CONFIG.I18N.DEFAULT;
    }

    loadTheme() {
        return localStorage.getItem(CONFIG.THEME.STORAGE_KEY) || CONFIG.THEME.DARK;
    }

    setLanguage(lang) {
        this.state.currentLang = lang;
        localStorage.setItem(CONFIG.I18N.STORAGE_KEY, lang);
    }

    setTheme(theme) {
        this.state.currentTheme = theme;
        localStorage.setItem(CONFIG.THEME.STORAGE_KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);
    }

    toggleTheme() {
        const newTheme = this.state.currentTheme === CONFIG.THEME.DARK
            ? CONFIG.THEME.LIGHT
            : CONFIG.THEME.DARK;
        this.setTheme(newTheme);
        return newTheme;
    }

    toggleMode() {
        this.state.currentMode = this.state.currentMode === 'encrypt' ? 'decrypt' : 'encrypt';
        return this.state.currentMode;
    }

    get t() {
        return I18N[this.state.currentLang] || I18N.fa;
    }
}

const AppState = new StateManager();

// ==========================================
// 5. CRYPTO MODULE
// ==========================================

class CryptoModule {
    constructor() {
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
    }

    /**
     * Import password as key material for PBKDF2
     * @param {string} password - User password
     * @returns {Promise<CryptoKey>} Key material
     */
    async getKeyMaterial(password) {
        return window.crypto.subtle.importKey(
            "raw",
            this.encoder.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"]
        );
    }

    /**
     * Derive encryption key from password using PBKDF2
     * @param {CryptoKey} keyMaterial - Key material from password
     * @param {Uint8Array} salt - Random salt
     * @returns {Promise<CryptoKey>} Derived key
     */
    async deriveKey(keyMaterial, salt) {
        return window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: CONFIG.CRYPTO.ITERATIONS,
                hash: CONFIG.CRYPTO.HASH
            },
            keyMaterial,
            { name: CONFIG.CRYPTO.ALGORITHM, length: CONFIG.CRYPTO.KEY_LENGTH },
            true,
            ["encrypt", "decrypt"]
        );
    }

    /**
     * Encrypt text using AES-GCM
     * @param {string} text - Plain text to encrypt
     * @param {string} password - User password
     * @returns {Promise<string>} Base64 encoded encrypted data
     */
    async encrypt(text, password) {
        try {
            const salt = window.crypto.getRandomValues(new Uint8Array(CONFIG.CRYPTO.SALT_LENGTH));
            const iv = window.crypto.getRandomValues(new Uint8Array(CONFIG.CRYPTO.IV_LENGTH));
            const keyMaterial = await this.getKeyMaterial(password);
            const key = await this.deriveKey(keyMaterial, salt);

            const encryptedContent = await window.crypto.subtle.encrypt(
                { name: CONFIG.CRYPTO.ALGORITHM, iv: iv },
                key,
                this.encoder.encode(text)
            );

            // Package and return
            const encryptedData = {
                s: this.arrayBufferToBase64(salt),
                i: this.arrayBufferToBase64(iv),
                c: this.arrayBufferToBase64(encryptedContent)
            };

            return btoa(JSON.stringify(encryptedData));
        } catch (error) {
            console.error('Encryption error:', error);
            throw new Error('ENCRYPT_FAILED');
        }
    }

    /**
     * Decrypt encrypted data using password
     * @param {string} packedData - Base64 encoded encrypted data
     * @param {string} password - User password
     * @returns {Promise<string>} Decrypted text
     */
    async decrypt(packedData, password) {
        try {
            const cleanData = packedData.trim();
            const decodedString = atob(cleanData);

            // Check for legacy version
            if (decodedString.startsWith('Salted__')) {
                throw new Error('LEGACY_VERSION');
            }

            const dataObj = JSON.parse(decodedString);
            const salt = this.base64ToArrayBuffer(dataObj.s);
            const iv = this.base64ToArrayBuffer(dataObj.i);
            const ciphertext = this.base64ToArrayBuffer(dataObj.c);

            const keyMaterial = await this.getKeyMaterial(password);
            const key = await this.deriveKey(keyMaterial, salt);

            const decryptedContent = await window.crypto.subtle.decrypt(
                { name: CONFIG.CRYPTO.ALGORITHM, iv: iv },
                key,
                ciphertext
            );

            return this.decoder.decode(decryptedContent);
        } catch (error) {
            if (error.message === 'LEGACY_VERSION') {
                throw error;
            }
            console.error('Decryption error:', error);
            throw new Error('DECRYPT_FAIL');
        }
    }

    /**
     * Convert ArrayBuffer to Base64 string
     * @param {ArrayBuffer|Uint8Array} buffer - Buffer to convert
     * @returns {string} Base64 string
     */
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    /**
     * Convert Base64 string to ArrayBuffer
     * @param {string} base64 - Base64 string
     * @returns {ArrayBuffer} ArrayBuffer
     */
    base64ToArrayBuffer(base64) {
        const binary_string = window.atob(base64);
        const bytes = new Uint8Array(binary_string.length);
        for (let i = 0; i < binary_string.length; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    /**
     * Generate cryptographically secure random password
     * @param {number} length - Password length
     * @returns {string} Random password
     */
    generateSecurePassword(length = 24) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);

        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset[randomValues[i] % charset.length];
        }
        return password;
    }
}

const Crypto = new CryptoModule();

// ==========================================
// 6. ENCODING MODULE
// ==========================================

class EncodingModule {
    constructor() {
        this.zwChars = CONFIG.ZW_CHARS;
    }

    /**
     * Check if text contains invisible (zero-width) characters
     * @param {string} text - Text to check
     * @returns {boolean}
     */
    hasInvisibleChars(text) {
        for (const char of text) {
            if (this.zwChars.includes(char)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if text looks like v4 JSON format
     * @param {string} str - Text to check
     * @returns {boolean}
     */
    looksLikeV4JSON(str) {
        const clean = str.trim();
        if (!clean.startsWith('ey')) return false;
        try {
            return btoa(atob(clean)) === clean;
        } catch (e) {
            return false;
        }
    }

    /**
     * Convert Base64 to invisible text embedded in cover text
     * @param {string} base64 - Base64 string
     * @param {string} cover - Cover text
     * @returns {string}
     */
    textToInvisible(base64, cover) {
        // Convert to binary
        let binary = "";
        for (let i = 0; i < base64.length; i++) {
            let bin = base64.charCodeAt(i).toString(2);
            binary += "0".repeat(8 - bin.length) + bin;
        }

        // Convert binary to zero-width characters
        let invisibleStr = "";
        for (let i = 0; i < binary.length; i += 2) {
            invisibleStr += this.zwChars[parseInt(binary.substr(i, 2), 2)];
        }

        // Embed in cover text
        const mid = Math.floor(cover.length / 2);
        return cover.slice(0, mid) + invisibleStr + cover.slice(mid);
    }

    /**
     * Extract invisible text from cover
     * @param {string} str - Text with invisible characters
     * @returns {string} Base64 string
     */
    invisibleToText(str) {
        let invisiblePart = "";
        for (const char of str) {
            if (this.zwChars.includes(char)) {
                invisiblePart += char;
            }
        }

        if (invisiblePart.length === 0) {
            throw new Error("NO_INVISIBLE_CHARS");
        }

        // Convert zero-width to binary
        let binary = "";
        for (const char of invisiblePart) {
            binary += this.zwChars.indexOf(char).toString(2).padStart(2, '0');
        }

        // Convert binary to Base64
        let base64 = "";
        for (let i = 0; i < binary.length; i += 8) {
            base64 += String.fromCharCode(parseInt(binary.substr(i, 8), 2));
        }

        return base64;
    }

    /**
     * Map Base64 to a dictionary
     * @param {string} base64 - Base64 string
     * @param {string} modeName - Dictionary name
     * @returns {string} Mapped text
     */
    mapToDictionary(base64, modeName) {
        const targetDict = DICTIONARIES[modeName];
        const isWordBased = (modeName === 'farsiWords' || modeName === 'englishFake');
        const res = [];

        for (const char of base64) {
            if (char === '=') continue;
            const idx = DICTIONARIES.base64.indexOf(char);
            if (idx !== -1 && targetDict[idx]) {
                res.push(targetDict[idx]);
            }
        }

        let str = isWordBased ? res.join(" ") : res.join("");

        // Add random spaces for non-word-based (except chinese, emoji)
        if (!isWordBased && modeName !== 'chinese' && modeName !== 'emoji') {
            str = this.addRandomSpaces(str);
        }

        return str;
    }

    /**
     * Map text from dictionary to Base64
     * @param {string} text - Text to convert
     * @param {string} modeName - Dictionary name
     * @returns {string} Base64 string
     */
    mapFromDictionary(text, modeName) {
        const targetDict = DICTIONARIES[modeName];
        const isWordBased = (modeName === 'farsiWords' || modeName === 'englishFake');

        let tokens;
        if (isWordBased) {
            tokens = text.trim().split(/\s+/);
        } else if (modeName === 'emoji') {
            tokens = Array.from(text.replace(/\s+/g, ''));
        } else {
            tokens = text.replace(/\s+/g, '').split('');
        }

        let res = "";
        for (const t of tokens) {
            const idx = targetDict.indexOf(t);
            if (idx !== -1) {
                res += DICTIONARIES.base64[idx];
            }
        }

        // Add padding
        while (res.length % 4 !== 0) {
            res += '=';
        }

        return res;
    }

    /**
     * Auto-detect encoding mode from text
     * @param {string} text - Text to analyze
     * @returns {string} Detected mode
     */
    detectMode(text) {
        const t = text.trim();
        const firstToken = t.split(/\s+/)[0];

        // Word-based detection
        if (DICTIONARIES.farsiWords.includes(firstToken)) return 'farsiWords';
        if (DICTIONARIES.englishFake.includes(firstToken)) return 'englishFake';

        // Single character detection
        const firstChar = Array.from(t)[0];
        if (DICTIONARIES.emoji.includes(firstChar)) return 'emoji';
        if (DICTIONARIES.chinese.includes(firstChar)) return 'chinese';
        if (DICTIONARIES.russian.includes(firstChar)) return 'russian';

        // Default to farsiChars
        return 'farsiChars';
    }

    /**
     * Add random spaces to text for obfuscation
     * @param {string} str - Text
     * @returns {string}
     */
    addRandomSpaces(str) {
        let res = "";
        let count = 0;
        let limit = 5;

        for (const char of str) {
            res += char;
            count++;
            if (count >= limit) {
                res += " ";
                count = 0;
                limit = Math.floor(Math.random() * 5) + 3;
            }
        }

        return res;
    }
}

const Encoding = new EncodingModule();

// ==========================================
// 7. UI MODULE
// ==========================================

class UIModule {
    constructor() {
        this.elements = {};
        this.clipboardTimer = null;
    }

    /**
     * Cache DOM elements for performance
     */
    initElements() {
        this.elements = {
            // Tabs
            tabEnc: document.getElementById('tabEnc'),
            tabDec: document.getElementById('tabDec'),

            // Settings
            encSettings: document.getElementById('encSettings'),
            encodingMode: document.getElementById('encodingMode'),
            methodDesc: document.getElementById('methodDesc'),
            methodInfoBox: document.getElementById('methodInfoBox'),
            securityWarning: document.getElementById('securityWarning'),
            warningText: document.getElementById('warningText'),
            coverTextInput: document.getElementById('coverTextInput'),
            coverText: document.getElementById('coverText'),
            splitOutput: document.getElementById('splitOutput'),

            // Input
            inputText: document.getElementById('inputText'),
            inputLabel: document.getElementById('inputLabel'),
            password: document.getElementById('password'),
            toggleBtn: document.getElementById('toggleBtn'),
            autoClearClipboard: document.getElementById('autoClearClipboard'),

            // Strength meter
            strengthFill: document.getElementById('strengthFill'),
            strengthText: document.getElementById('strengthText'),
            crackTimeText: document.getElementById('crackTimeText'),

            // Suggestions
            smartSuggestion: document.getElementById('smartSuggestion'),
            suggestionText: document.getElementById('suggestionText'),

            // Action
            actionBtn: document.getElementById('actionBtn'),

            // Result
            resultArea: document.getElementById('resultArea'),
            charCount: document.getElementById('charCount'),
            smsCount: document.getElementById('smsCount'),
            outputParts: document.getElementById('outputParts'),

            // Header
            appTitle: document.querySelector('.app-title'),
            versionBadge: document.querySelector('.version-badge'),
            installBtn: document.getElementById('installBtn'),

            // Theme
            themeToggle: document.getElementById('themeToggle'),

            // Language
            langToggle: document.getElementById('langToggle')
        };
    }

    /**
     * Set active tab
     * @param {string} mode - 'encrypt' or 'decrypt'
     */
    setActiveTab(mode) {
        const t = AppState.t;

        if (mode === 'encrypt') {
            this.elements.tabEnc.className = 'tab-btn active enc';
            this.elements.tabDec.className = 'tab-btn';
            this.elements.encSettings.style.display = 'block';
            this.elements.actionBtn.innerHTML = `<i class="fas fa-lock"></i> ${t.btnEncrypt}`;
            this.elements.actionBtn.className = 'btn-main btn-enc';
            this.elements.inputLabel.innerHTML = `<i class="fas fa-pen"></i> ${t.inputLabel}`;
        } else {
            this.elements.tabEnc.className = 'tab-btn';
            this.elements.tabDec.className = 'tab-btn active dec';
            this.elements.encSettings.style.display = 'none';
            this.elements.actionBtn.innerHTML = `<i class="fas fa-unlock"></i> ${t.btnDecrypt}`;
            this.elements.actionBtn.className = 'btn-main btn-dec';
            this.elements.inputLabel.innerHTML = `<i class="fas fa-paste"></i> ${t.inputLabel}`;
        }

        // Clear input and hide result
        this.elements.inputText.value = '';
        this.elements.resultArea.style.display = 'none';
        this.elements.smartSuggestion.style.display = 'none';
    }

    /**
     * Update method info box
     * @param {string} mode - Selected encoding mode
     */
    updateMethodInfo(mode) {
        const t = AppState.t;
        const methodDescs = {
            base64: { text: t.descBase64, warn: '' },
            farsiChars: { text: t.descFarsiChars, warn: '' },
            farsiWords: { text: t.descFarsiWords, warn: t.warnLongText },
            invisible: { text: t.descInvisible, warn: t.warnInvisible },
            russian: { text: t.descRussian, warn: '' },
            emoji: { text: t.descEmoji, warn: '' },
            chinese: { text: t.descChinese, warn: t.warnChinese },
            englishFake: { text: t.descEnglishFake, warn: '' }
        };

        const info = methodDescs[mode];

        this.elements.methodDesc.innerText = info.text;

        if (info.warn) {
            this.elements.securityWarning.style.display = 'flex';
            this.elements.warningText.innerText = info.warn;
        } else {
            this.elements.securityWarning.style.display = 'none';
        }

        // Show/hide cover text input
        this.elements.coverTextInput.style.display = (mode === 'invisible') ? 'block' : 'none';

        // Re-analyze if there's input
        if (this.elements.inputText.value) {
            this.analyzeInput();
        }
    }

    /**
     * Show smart suggestion based on input
     */
    analyzeInput() {
        const text = this.elements.inputText.value;
        const t = AppState.t;

        if (AppState.state.currentMode !== 'encrypt' || text.length < 2) {
            this.elements.smartSuggestion.style.display = 'none';
            return;
        }

        this.elements.smartSuggestion.style.display = 'block';

        if (text.length < 60) {
            this.elements.suggestionText.innerHTML =
                `${t.smartShort} <span class="suggestion-tag">${t.methodFarsiChars}</span> یا <span class="suggestion-tag">${t.methodEnglishFake}</span>.`;
        } else if (text.length > 500) {
            this.elements.suggestionText.innerHTML = t.smartLong;
        } else {
            this.elements.suggestionText.innerHTML =
                `${t.smartSocial} <span class="suggestion-tag">${t.methodInvisible}</span> ${t.smartAmazing}`;
        }
    }

    /**
     * Toggle password visibility
     */
    togglePasswordVisibility() {
        const inp = this.elements.password;
        const icon = this.elements.toggleBtn;

        if (inp.type === "password") {
            inp.type = "text";
            icon.className = "fas fa-eye-slash password-toggle";
        } else {
            inp.type = "password";
            icon.className = "fas fa-eye password-toggle";
        }
    }

    /**
     * Check password strength
     */
    checkPasswordStrength() {
        const val = this.elements.password.value;
        const bar = this.elements.strengthFill;
        const txt = this.elements.strengthText;
        const timeEl = this.elements.crackTimeText;
        const t = AppState.t;

        if (!val) {
            bar.style.width = '0%';
            txt.innerText = t.strengthNone;
            timeEl.innerText = '';
            return;
        }

        // Calculate strength score
        let score = 0;
        if (val.length > 8) score += 10;
        if (val.length > 12) score += 20;
        if (/[A-Z]/.test(val)) score += 15;
        if (/[0-9]/.test(val)) score += 15;
        if (/[^A-Za-z0-9]/.test(val)) score += 20;
        if (val.length > 16) score += 20;

        // Calculate entropy
        let charset = 0;
        if (/[a-z]/.test(val)) charset += 26;
        if (/[A-Z]/.test(val)) charset += 26;
        if (/[0-9]/.test(val)) charset += 10;
        if (/[^A-Za-z0-9]/.test(val)) charset += 32;

        if (charset === 0) charset = 26;

        const combinations = BigInt(charset) ** BigInt(val.length);
        const speed = 10000000000n; // 10 billion guesses per second
        const seconds = combinations / speed;

        // Estimate crack time
        let timeString = t.crackTimeLess1s;
        if (seconds > 3153600000n) timeString = t.crackTimeCenturies;
        else if (seconds > 31536000n) timeString = `${(seconds / 31536000n).toString()} ${t.crackTimePrefix} ${Math.round(Number(seconds / 31536000n))} years ✅`;
        else if (seconds > 86400n) timeString = `${Math.round(Number(seconds / 86400n))} days ⚠️`;
        else if (seconds > 3600n) timeString = `${Math.round(Number(seconds / 3600n))} hours ❌`;

        timeEl.innerText = `${t.crackTimePrefix}${timeString}`;

        // Update UI
        bar.style.width = Math.min(score, 100) + '%';
        if (score < 40) {
            bar.style.background = '#ef4444';
            txt.innerText = t.strengthWeak;
        } else if (score < 70) {
            bar.style.background = '#f59e0b';
            txt.innerText = t.strengthMedium;
        } else {
            bar.style.background = '#10b981';
            txt.innerText = t.strengthStrong;
        }

        txt.style.color = bar.style.background;
    }

    /**
     * Generate random password
     */
    generatePassword() {
        const password = Crypto.generateSecurePassword(24);
        this.elements.password.value = password;
        this.elements.password.type = 'text';
        this.elements.toggleBtn.className = "fas fa-eye-slash password-toggle";
        this.checkPasswordStrength();
    }

    /**
     * Display encryption/decryption result
     * @param {string} text - Result text
     * @param {string} mode - Encoding mode
     */
    displayOutput(text, mode) {
        const len = Array.from(text).length;
        let limit = 70;

        if (mode === 'base64' || mode === 'englishFake') {
            limit = 160;
        }

        const sms = Math.ceil(len / limit);

        this.elements.charCount.innerText = len;
        this.elements.smsCount.innerText = sms;
        this.elements.outputParts.innerHTML = '';

        const doSplit = this.elements.splitOutput.checked;
        const splitSize = (limit === 160) ? 300 : 500;
        const t = AppState.t;

        if (doSplit && len > splitSize) {
            const chars = Array.from(text);
            for (let i = 0; i < chars.length; i += splitSize) {
                const part = chars.slice(i, i + splitSize).join("");
                const smsStart = Math.ceil((i + 1) / limit);
                const smsEnd = Math.ceil((i + part.length) / limit);

                const partEl = document.createElement('div');
                partEl.className = 'result-part';
                partEl.innerHTML = `
                    <span class="part-label">${t.partLabel} ${Math.floor(i / splitSize) + 1} (${t.smsPart} ${smsStart} تا ${smsEnd})</span>
                    <button class="copy-btn" onclick="UI.copyText(this)">${t.btnCopy}</button>
                    <div class="result-text">${this.sanitizeHTML(part)}</div>
                `;
                this.elements.outputParts.appendChild(partEl);
            }
        } else {
            const partEl = document.createElement('div');
            partEl.className = 'result-part';
            partEl.innerHTML = `
                <button class="copy-btn" onclick="UI.copyText(this)">${t.btnCopyAll}</button>
                <div class="result-text">${this.sanitizeHTML(text)}</div>
            `;
            this.elements.outputParts.appendChild(partEl);
        }

        this.elements.resultArea.style.display = 'block';
    }

    /**
     * Display decrypted message
     * @param {string} text - Decrypted text
     */
    displayDecrypted(text) {
        const len = text.length;
        const t = AppState.t;

        this.elements.charCount.innerText = len;
        this.elements.smsCount.innerText = '-';

        const partEl = document.createElement('div');
        partEl.className = 'result-part';
        partEl.innerHTML = `
            <button class="copy-btn" onclick="UI.copyText(this)">${t.btnCopyAll}</button>
            <div class="result-text">${this.sanitizeHTML(text)}</div>
        `;

        this.elements.outputParts.innerHTML = '';
        this.elements.outputParts.appendChild(partEl);
        this.elements.resultArea.style.display = 'block';
    }

    /**
     * Copy text to clipboard
     * @param {HTMLElement} btn - Copy button element
     */
    async copyText(btn) {
        const text = btn.parentElement.querySelector('.result-text').innerText;
        const t = AppState.t;

        try {
            await navigator.clipboard.writeText(text);
            const originalText = btn.innerText;
            btn.innerText = t.btnCopied;

            // Schedule clipboard clear if enabled
            if (AppState.state.autoClearEnabled) {
                this.scheduleClipboardClear();
            }

            setTimeout(() => {
                btn.innerText = originalText;
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    }

    /**
     * Schedule automatic clipboard clear
     */
    scheduleClipboardClear() {
        if (this.clipboardTimer) {
            clearTimeout(this.clipboardTimer);
        }

        this.clipboardTimer = setTimeout(async () => {
            try {
                await navigator.clipboard.writeText('');
            } catch (err) {
                console.error('Failed to clear clipboard:', err);
            }
        }, CONFIG.CLIPBOARD.AUTO_CLEAR_DELAY);
    }

    /**
     * Show loading state
     * @param {boolean} loading - Is loading
     */
    setLoading(loading) {
        const t = AppState.t;
        this.elements.actionBtn.disabled = loading;
        this.elements.actionBtn.innerHTML = loading
            ? `<i class="fas fa-spinner fa-spin"></i> ${t.errorProcessing}`
            : (AppState.state.currentMode === 'encrypt'
                ? `<i class="fas fa-lock"></i> ${t.btnEncrypt}`
                : `<i class="fas fa-unlock"></i> ${t.btnDecrypt}`);
    }

    /**
     * Show error alert
     * @param {string} message - Error message
     */
    showError(message) {
        alert(message);
    }

    /**
     * Sanitize HTML to prevent XSS
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    sanitizeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Apply theme to document
     * @param {string} theme - 'dark' or 'light'
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        if (this.elements.themeToggle) {
            const icon = this.elements.themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    }

    /**
     * Update all UI text based on current language
     */
    updateUIText() {
        const t = AppState.t;

        // Update static elements
        document.title = `${t.appTitle} | ${t.appSubtitle}`;

        if (this.elements.versionBadge) {
            this.elements.versionBadge.innerHTML = `<i class="fas fa-sync-alt"></i> ${t.version}`;
        }

        // Update method options
        const methodSelect = this.elements.encodingMode;
        if (methodSelect) {
            const options = methodSelect.querySelectorAll('option');
            const methods = [
                { value: 'base64', text: t.methodBase64 },
                { value: 'farsiChars', text: t.methodFarsiChars },
                { value: 'farsiWords', text: t.methodFarsiWords },
                { value: 'invisible', text: t.methodInvisible },
                { value: 'russian', text: t.methodRussian },
                { value: 'emoji', text: t.methodEmoji },
                { value: 'chinese', text: t.methodChinese },
                { value: 'englishFake', text: t.methodEnglishFake }
            ];

            methods.forEach((m, i) => {
                if (options[i]) {
                    options[i].textContent = m.text;
                }
            });
        }

        // Update checkboxes
        if (this.elements.splitOutput) {
            this.elements.splitOutput.nextElementSibling.textContent = t.checkboxSplit;
        }

        // Update labels
        if (this.elements.coverText) {
            this.elements.coverText.placeholder = t.coverTextPlaceholder;
        }
        if (this.elements.inputText) {
            this.elements.inputText.placeholder = t.inputPlaceholder;
        }
        if (this.elements.password) {
            this.elements.password.placeholder = t.passwordPlaceholder;
        }
    }
}

const UI = new UIModule();

// ==========================================
// 8. MAIN APPLICATION LOGIC
// ==========================================

/**
 * Process encryption or decryption
 */
async function processAction() {
    const text = AppState.state.currentMode === 'encrypt'
        ? document.getElementById('inputText').value.trim()
        : document.getElementById('inputText').value.trim();
    const pass = document.getElementById('password').value;
    const mode = document.getElementById('encodingMode')?.value || 'base64';
    const cover = document.getElementById('coverText')?.value.trim() || "سلام، پیام مخفی اینجاست.";
    const t = AppState.t;

    // Validate input
    if (!text || !pass) {
        UI.showError(t.errorEmptyFields);
        return;
    }

    UI.setLoading(true);

    try {
        if (AppState.state.currentMode === 'encrypt') {
            // Encrypt
            const encryptedBase64 = await Crypto.encrypt(text, pass);
            let finalStr = "";

            switch (mode) {
                case 'invisible':
                    finalStr = Encoding.textToInvisible(encryptedBase64, cover);
                    break;
                case 'base64':
                    finalStr = encryptedBase64;
                    break;
                default:
                    finalStr = Encoding.mapToDictionary(encryptedBase64, mode);
            }

            UI.displayOutput(finalStr, mode);
        } else {
            // Decrypt
            let base64Cipher = "";

            if (Encoding.hasInvisibleChars(text)) {
                base64Cipher = Encoding.invisibleToText(text);
            } else if (Encoding.looksLikeV4JSON(text)) {
                base64Cipher = text;
            } else {
                const detectedMode = Encoding.detectMode(text);
                base64Cipher = Encoding.mapFromDictionary(text, detectedMode);
            }

            const decrypted = await Crypto.decrypt(base64Cipher, pass);
            UI.displayDecrypted(decrypted);
        }
    } catch (e) {
        if (e.message === 'LEGACY_VERSION') {
            UI.showError(t.errorLegacyVersion);
        } else if (e.message === 'NO_INVISIBLE_CHARS') {
            UI.showError(t.errorNoInvisibleChars);
        } else {
            UI.showError(t.errorDecryptFail);
        }
    } finally {
        UI.setLoading(false);
    }
}

/**
 * Set application mode
 * @param {string} mode - 'encrypt' or 'decrypt'
 */
function setMode(mode) {
    AppState.state.currentMode = mode;
    UI.setActiveTab(mode);
    UI.updateMethodInfo(document.getElementById('encodingMode')?.value || 'base64');
}

/**
 * Update method info
 */
function updateMethodInfo() {
    const mode = document.getElementById('encodingMode')?.value || 'base64';
    UI.updateMethodInfo(mode);
}

/**
 * Analyze input for smart suggestion
 */
function analyzeInput() {
    UI.analyzeInput();
}

/**
 * Toggle password visibility
 */
function togglePass() {
    UI.togglePasswordVisibility();
}

/**
 * Check password strength
 */
function checkStrength() {
    UI.checkPasswordStrength();
}

/**
 * Generate strong password
 */
function generatePassword() {
    UI.generatePassword();
}

/**
 * Copy text to clipboard
 * @param {HTMLElement} btn - Button element
 */
function copyText(btn) {
    UI.copyText(btn);
}

/**
 * Update application (clear cache and reload)
 */
function updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for (let registration of registrations) {
                registration.unregister();
            }
            alert(AppState.t.successUpdated);
            window.location.reload(true);
        });
    } else {
        window.location.reload(true);
    }
}

/**
 * Toggle theme
 */
function toggleTheme() {
    const newTheme = AppState.toggleTheme();
    UI.applyTheme(newTheme);
}

/**
 * Toggle language
 */
function toggleLanguage() {
    const newLang = AppState.state.currentLang === 'fa' ? 'en' : 'fa';
    AppState.setLanguage(newLang);
    UI.updateUIText();
    UI.setActiveTab(AppState.state.currentMode);
    UI.updateMethodInfo(document.getElementById('encodingMode')?.value || 'base64');
    UI.applyTheme(AppState.state.currentTheme);
}

// ==========================================
// 9. INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI elements
    UI.initElements();

    // Apply saved theme
    UI.applyTheme(AppState.state.currentTheme);

    // Update UI text
    UI.updateUIText();

    // Initialize method info
    updateMethodInfo();

    // Register service worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(err => {
                console.log('SW registration failed:', err);
            });
        });
    }

    // Handle install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (UI.elements.installBtn) {
            UI.elements.installBtn.style.display = 'block';
        }
    });

    if (UI.elements.installBtn) {
        UI.elements.installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                UI.elements.installBtn.style.display = 'none';
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter = Process
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            processAction();
        }
        // Ctrl/Cmd + Shift + T = Toggle Theme
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleTheme();
        }
        // Ctrl/Cmd + Shift + L = Toggle Language
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            toggleLanguage();
        }
    });
});

// ==========================================
// 10. EXPORTS (for testing)
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        DICTIONARIES,
        I18N,
        StateManager,
        CryptoModule,
        EncodingModule,
        UIModule,
        Crypto,
        Encoding,
        UI,
        AppState
    };
}

/**
 * @fileoverview CryptoMsg - Internationalization (i18n)
 * @version 5.0.0
 * @license MIT
 */

import type { Translations, Language } from '../types';

// ==========================================
// TRANSLATIONS
// ==========================================

const translations: Translations = {
  fa: {
    // App
    appTitle: 'CryptoMsg',
    appSubtitle: 'Ultimate',
    version: 'نسخه 5.0',

    // Tabs
    tabEncrypt: 'ارسال (رمزنگاری)',
    tabDecrypt: 'دریافت (رمزگشایی)',

    // Form Labels
    encodingMethod: 'انتخاب روش مخفی‌سازی:',
    inputLabel: 'متن پیام:',
    inputPlaceholder: 'پیام محرمانه خود را بنویسید...',
    passwordLabel: 'رمز عبور (حیاتی):',
    passwordPlaceholder: 'حداقل ۱۲ کاراکتر...',
    fileVaultPasswordPlaceholder: 'یک رمز قوی و منحصربه‌فرد وارد کنید',
    coverTextLabel: 'متن پوششی (برای مخفی‌سازی):',
    coverTextPlaceholder: 'مثلاً: سلام چطوری؟ خوبی؟',
    coverTextHint: 'پیام اصلی شما لابلای این متن مخفی می‌شود.',

    // Buttons
    btnEncrypt: 'رمزنگاری پیام',
    btnDecrypt: 'رمزگشایی پیام',
    btnCopy: 'کپی',
    btnCopyAll: 'کپی کامل',
    btnCopied: 'کپی شد!',
    btnGeneratePass: 'ساخت رمز جادویی',
    btnInstall: 'نصب اپلیکیشن',
    btnInstallShort: 'نصب',
    btnUpdate: 'بروزرسانی کش',

    // Password Strength
    strengthWeak: 'ضعیف',
    strengthMedium: 'متوسط',
    strengthStrong: 'بسیار قوی',
    strengthNone: 'قدرت: وارد نشده',
    crackTimePrefix: 'زمان تخمینی هک: ',

    // Suggestions
    smartShort: 'متن کوتاه است (مناسب SMS). پیشنهاد:',
    smartLong: 'متن طولانی است. برای جلوگیری از مسدودی در پیامک، حتماً از پارت‌بندی استفاده کنید.',
    smartSocial: 'برای ارسال در شبکه‌های اجتماعی،',
    smartAmazing: 'شگفت‌انگیز است!',
    smartOr: 'یا',

    // Errors
    errorEmptyFields: '⚠️ لطفاً متن و رمز عبور را وارد کنید',
    errorDecryptFail: '❌ خطا: رمز عبور اشتباه است یا متن دستکاری شده است.',
    errorLegacyVersion: '⚠️ این پیام قدیمی است و با نسخه جدید باز نمی‌شود.',
    errorNoInvisibleChars: '⚠️ هیچ کاراکتر نامرئی یافت نشد.',
    errorProcessing: 'در حال پردازش...',
    errorFileTooBig: '⚠️ فایل خیلی بزرگ است. حداکثر ۱۰ مگابایت.',
    errorInvalidFile: '⚠️ فرمت فایل نامعتبر است.',

    // Stats
    chars: 'کاراکتر',
    smsApprox: 'پیامک (تقریبی)',
    partLabel: 'بخش',

    // Sections
    guideTitle: 'راهنمای ساده (چطور کار کنم؟)',
    securityTitle: 'نکات مهم امنیتی (حتماً بخوانید)',
    methodsTitle: 'راهنمای انتخاب روش‌ها',
    technicalTitle: 'مشخصات فنی',
    termsTitle: 'شرایط استفاده و سلب مسئولیت',
    guideSendTitle: 'برای ارسال پیام:',
    guideSendWrite: 'نوشتن: پیام محرمانه خود را در کادر بنویسید.',
    guideSendPassword: 'رمزگذاری: یک رمز عبور قوی انتخاب کنید.',
    guideSendAppearance: 'انتخاب ظاهر: روش نمایش خروجی را انتخاب کنید.',
    guideStandard: 'استاندارد: برای کپی و نگهداری ساده.',
    guideInvisible: 'متن نامرئی: برای مخفی‌سازی داخل متن پوششی.',
    guideSendAction: 'ارسال: دکمه رمزنگاری پیام را بزنید.',
    guideReceiveTitle: 'برای خواندن پیام:',
    guideReceiveTab: 'روی تب دریافت کلیک کنید.',
    guideReceivePaste: 'متن رمز شده را در کادر پیام وارد کنید.',
    guideReceivePassword: 'رمز عبور را وارد کنید و رمزگشایی را بزنید.',
    securitySeparate: 'رمز را جداگانه بفرستید: هرگز رمز را در همان پیام نفرستید.',
    securityKeyboard: 'مراقب کیبوردها باشید: از کیبوردها و دستگاه‌های قابل اعتماد استفاده کنید.',
    securityClipboard: 'حافظه کپی را پاک کنید: بعد از ارسال، یک متن دیگر کپی کنید.',
    securityForgot: 'فراموشی رمز یعنی از دست رفتن پیام: راه بازیابی رمز وجود ندارد.',
    termsOpenSource: 'این نرم‌افزار متن‌باز است و همه عملیات رمزنگاری داخل مرورگر انجام می‌شود.',
    termsNoServer: 'هیچ سروری وجود ندارد و داده‌ها برای رمزنگاری ارسال نمی‌شوند.',
    termsIrreversible: 'رمز فراموش‌شده قابل بازیابی نیست.',
    termsResponsibility: 'مسئولیت استفاده صحیح بر عهده کاربر است.',
    techAlgorithm: 'الگوریتم',
    techKdf: 'کلیدسازی',
    techIterations: '۶۰۰٬۰۰۰ تکرار',
    techRandom: 'تصادفی',
    techSteganography: 'پنهان‌نگاری',
    footerBuiltBy: 'ساخته شده توسط',

    // Encoding Methods
    methodBase64: 'استاندارد (Base64)',
    methodFarsiChars: 'حروف تصادفی فارسی',
    methodFarsiWords: 'جملات واقعی فارسی',
    methodInvisible: 'متن نامرئی (Steganography)',
    methodRussian: 'حروف روسی (Cyrillic)',
    methodEmoji: 'ایموجی (Emoji)',
    methodChinese: 'کاراکترهای چینی',
    methodEnglishFake: 'انگلیسی (Fake English)',

    // Method Descriptions
    descBase64: 'استاندارد جهانی. مناسب برای ذخیره در فایل یا ارسال در واتساپ.',
    descFarsiChars: 'تبدیل به حروف تصادفی فارسی. عالی برای SMS.',
    descFarsiWords: 'تبدیل به جملات فارسی بی‌معنی. برای ربات‌های فیلترینگ طبیعی.',
    descInvisible: 'پیام شما داخل یک متن عادی مخفی می‌شود.',
    descRussian: 'استفاده از الفبای سیریلیک. برای عبور از فیلترهای حساس.',
    descEmoji: 'پیام شما تماماً به شکلک تبدیل می‌شود.',
    descChinese: 'کاراکترهای چینی. فشرده‌ترین حالت.',
    descEnglishFake: 'کلمات انگلیسی بی‌ربط. شبیه Seed Phrase.',

    // Warnings
    warnInvisible: 'هشدار: حجم کاراکتر مخفی بسیار بالاست. در پیامک استفاده نکنید.',
    warnChinese: 'ممکن است در برخی گوشی‌های قدیمی نمایش داده نشود.',
    warnLongText: 'حجم پیام نهایی کمی زیاد می‌شود.',

    // Checkboxes
    checkboxSplit: 'تقسیم هوشمند پیام‌های طولانی (پارت‌بندی)',
    checkboxAutoClear: 'پاکسازی خودکار کلیپ‌بورد بعد از ۶۰ ثانیه',

    // Settings
    settings: 'تنظیمات',
    theme: 'تم',
    themeDark: 'تاریک',
    themeLight: 'روشن',
    language: 'زبان',

    // QR Code
    qrTitle: 'کد QR',
    qrDownload: 'دانلود QR',
    qrCopy: 'کپی تصویر',

    // File Encryption
    fileTitle: 'رمزنگاری فایل',
    fileSelect: 'انتخاب فایل',
    fileEncrypt: 'رمزنگاری فایل',
    fileDecrypt: 'رمزگشایی فایل',
    fileDownload: 'دانلود فایل رمز شده',
    fileVaultTitle: 'صندوق فایل به متن',
    fileVaultSubtitle: 'فایل‌های کوچک را به متن رمز شده قابل کپی تبدیل کنید و بعدا با همان رمز فایل اصلی را بازسازی کنید.',
    fileVaultPickLabel: 'فایل کوچک (حداکثر ۵ مگابایت):',
    fileVaultChooseFile: 'انتخاب فایل',
    fileVaultChangeFile: 'انتخاب فایل دیگر',
    fileVaultPasswordLabel: 'رمز فایل:',
    fileVaultTextLabel: 'متن رمز شده فایل:',
    fileVaultOutputLabel: 'خروجی قابل کپی:',
    fileVaultEncrypt: 'تبدیل فایل به متن',
    fileVaultDecrypt: 'بازسازی و دانلود فایل',
    fileVaultCopy: 'کپی متن فایل',
    fileVaultTextPlaceholder: 'متن CMF1. را اینجا وارد کنید...',
    fileVaultNoFile: 'هنوز فایلی انتخاب نشده است.',
    fileVaultProcessing: 'در حال پردازش فایل...',
    errorFileVaultFields: 'لطفا فایل و رمز را وارد کنید.',
    errorFileVaultDecryptFields: 'لطفا متن رمز شده فایل و رمز را وارد کنید.',
    errorFileVaultTooBig: 'فایل بزرگ است. حداکثر اندازه مجاز ۵ مگابایت است.',
    errorFileVaultInvalid: 'متن وارد شده قالب معتبر CMF1 ندارد.',
    errorFileVaultEncrypt: 'رمزنگاری فایل ناموفق بود.',
    errorFileVaultDecrypt: 'رمزگشایی فایل ناموفق بود؛ رمز اشتباه است یا متن تغییر کرده است.',
    errorFileVaultNoOutput: 'خروجی برای کپی وجود ندارد.',
    errorFileVaultCopy: 'کپی کردن خروجی ناموفق بود.',
    successFileVaultEncrypted: 'فایل به متن رمز شده تبدیل شد.',
    successFileVaultDecrypted: 'فایل بازسازی و دانلود شد:',

    // History
    historyTitle: 'تاریخچه',
    historyClear: 'پاک کردن تاریخچه',
    historyEmpty: 'تاریخچه خالی است.',
    historyConfirmClear: 'آیا مطمئن هستید؟',

    // Success Messages
    successCleared: 'تاریخچه با موفقیت پاک شد.',
    successCopied: 'با موفقیت کپی شد.',
    successUpdated: 'کش برنامه پاک شد. صفحه ریلود می‌شود...',
    successFileEncrypted: 'فایل با موفقیت رمزنگاری شد.',
    successFileDecrypted: 'فایل با موفقیت رمزگشایی شد.',

    // Accessibility
    ariaThemeToggle: 'تغییر تم',
    ariaLangToggle: 'تغییر زبان',
    ariaPasswordToggle: 'نمایش یا مخفی کردن رمز',
    ariaProcessing: 'در حال پردازش',
    ariaResult: 'نتیجه عملیات',
  },

  en: {
    // App
    appTitle: 'CryptoMsg',
    appSubtitle: 'Ultimate',
    version: 'Version 5.0',

    // Tabs
    tabEncrypt: 'Send (Encrypt)',
    tabDecrypt: 'Receive (Decrypt)',

    // Form Labels
    encodingMethod: 'Select Encoding Method:',
    inputLabel: 'Message Text:',
    inputPlaceholder: 'Write your confidential message...',
    passwordLabel: 'Password (Critical):',
    passwordPlaceholder: 'At least 12 characters...',
    fileVaultPasswordPlaceholder: 'Use a strong unique password',
    coverTextLabel: 'Cover Text (for Steganography):',
    coverTextPlaceholder: 'e.g.: Hello, how are you?',
    coverTextHint: 'Your real message is hidden inside this cover text.',

    // Buttons
    btnEncrypt: 'Encrypt Message',
    btnDecrypt: 'Decrypt Message',
    btnCopy: 'Copy',
    btnCopyAll: 'Copy All',
    btnCopied: 'Copied!',
    btnGeneratePass: 'Generate Strong Password',
    btnInstall: 'Install App',
    btnInstallShort: 'Install',
    btnUpdate: 'Update Cache',

    // Password Strength
    strengthWeak: 'Weak',
    strengthMedium: 'Medium',
    strengthStrong: 'Very Strong',
    strengthNone: 'Strength: Not entered',
    crackTimePrefix: 'Estimated crack time: ',

    // Suggestions
    smartShort: 'Short text (good for SMS). Suggestion:',
    smartLong: 'Long text. Use partitioning to avoid SMS blocking.',
    smartSocial: 'For social media,',
    smartAmazing: 'is amazing!',
    smartOr: 'or',

    // Errors
    errorEmptyFields: '⚠️ Please enter both text and password',
    errorDecryptFail: '❌ Error: Wrong password or tampered text.',
    errorLegacyVersion: '⚠️ This is an old message and cannot be opened with the new version.',
    errorNoInvisibleChars: '⚠️ No invisible characters found in the text.',
    errorProcessing: 'Processing...',
    errorFileTooBig: '⚠️ File is too large. Maximum 10MB.',
    errorInvalidFile: '⚠️ Invalid file format.',

    // Stats
    chars: 'Characters',
    smsApprox: 'SMS (approx)',
    partLabel: 'Part',

    // Sections
    guideTitle: 'Quick Guide (How to use?)',
    securityTitle: 'Important Security Tips (Must Read)',
    methodsTitle: 'Method Selection Guide',
    technicalTitle: 'Technical Specifications',
    termsTitle: 'Terms of Use & Disclaimer',
    guideSendTitle: 'To send a message:',
    guideSendWrite: 'Write: enter your confidential message in the box.',
    guideSendPassword: 'Password: choose a strong password.',
    guideSendAppearance: 'Appearance: choose the output encoding method.',
    guideStandard: 'Standard: best for simple copy and storage.',
    guideInvisible: 'Invisible text: hides the message inside cover text.',
    guideSendAction: 'Send: press Encrypt Message.',
    guideReceiveTitle: 'To read a message:',
    guideReceiveTab: 'Open the Receive tab.',
    guideReceivePaste: 'Paste the encrypted text into the message box.',
    guideReceivePassword: 'Enter the password and decrypt.',
    securitySeparate: 'Send the password separately: never include it in the same message.',
    securityKeyboard: 'Be careful with keyboards: use trusted devices and input methods.',
    securityClipboard: 'Clear the clipboard: copy another text after sending.',
    securityForgot: 'Forgotten password means lost data: there is no recovery path.',
    termsOpenSource: 'This app is open source and all cryptography runs inside the browser.',
    termsNoServer: 'There is no server and data is not sent away for encryption.',
    termsIrreversible: 'Forgotten passwords cannot be recovered.',
    termsResponsibility: 'Correct usage is the user responsibility.',
    techAlgorithm: 'Algorithm',
    techKdf: 'Key derivation',
    techIterations: '600,000 iterations',
    techRandom: 'random',
    techSteganography: 'Steganography',
    footerBuiltBy: 'Built by',

    // Encoding Methods
    methodBase64: 'Standard (Base64)',
    methodFarsiChars: 'Random Persian Letters',
    methodFarsiWords: 'Real Persian Sentences',
    methodInvisible: 'Invisible Text (Steganography)',
    methodRussian: 'Russian Letters (Cyrillic)',
    methodEmoji: 'Emoji',
    methodChinese: 'Chinese Characters',
    methodEnglishFake: 'Fake English',

    // Method Descriptions
    descBase64: 'Universal standard. Good for file storage or WhatsApp.',
    descFarsiChars: 'Convert to random Persian letters. Great for SMS.',
    descFarsiWords: 'Convert to meaningless Persian sentences. Natural for filter bots.',
    descInvisible: 'Your message is hidden inside normal text.',
    descRussian: 'Use Cyrillic alphabet. Bypasses sensitive word filters.',
    descEmoji: 'Your message becomes all emojis.',
    descChinese: 'Chinese characters. Most compact option.',
    descEnglishFake: 'Random English words. Looks like a Seed Phrase.',

    // Warnings
    warnInvisible: 'Warning: Hidden character volume is very high. Do not use in SMS.',
    warnChinese: 'May not display on some older phones.',
    warnLongText: 'Final message size increases slightly.',

    // Checkboxes
    checkboxSplit: 'Smart splitting of long messages (Partitioning)',
    checkboxAutoClear: 'Auto-clear clipboard after 60 seconds',

    // Settings
    settings: 'Settings',
    theme: 'Theme',
    themeDark: 'Dark',
    themeLight: 'Light',
    language: 'Language',

    // QR Code
    qrTitle: 'QR Code',
    qrDownload: 'Download QR',
    qrCopy: 'Copy Image',

    // File Encryption
    fileTitle: 'File Encryption',
    fileSelect: 'Select File',
    fileEncrypt: 'Encrypt File',
    fileDecrypt: 'Decrypt File',
    fileDownload: 'Download Encrypted File',
    fileVaultTitle: 'File-to-Text Vault',
    fileVaultSubtitle: 'Turn a small file into copyable encrypted text, then restore the original file with the same password.',
    fileVaultPickLabel: 'Small file (5MB max):',
    fileVaultChooseFile: 'Choose File',
    fileVaultChangeFile: 'Choose Another File',
    fileVaultPasswordLabel: 'File password:',
    fileVaultTextLabel: 'Encrypted file text:',
    fileVaultOutputLabel: 'Copyable output:',
    fileVaultEncrypt: 'Convert File to Text',
    fileVaultDecrypt: 'Restore and Download File',
    fileVaultCopy: 'Copy File Text',
    fileVaultTextPlaceholder: 'Paste CMF1. text here...',
    fileVaultNoFile: 'No file selected yet.',
    fileVaultProcessing: 'Processing file...',
    errorFileVaultFields: 'Please choose a file and enter a password.',
    errorFileVaultDecryptFields: 'Please paste encrypted file text and enter the password.',
    errorFileVaultTooBig: 'File is too large. Maximum size is 5MB.',
    errorFileVaultInvalid: 'The text is not a valid CMF1 file vault payload.',
    errorFileVaultEncrypt: 'File encryption failed.',
    errorFileVaultDecrypt: 'File decryption failed; the password is wrong or text was changed.',
    errorFileVaultNoOutput: 'There is no output to copy.',
    errorFileVaultCopy: 'Could not copy the output.',
    successFileVaultEncrypted: 'File was converted to encrypted text.',
    successFileVaultDecrypted: 'File restored and downloaded:',

    // History
    historyTitle: 'History',
    historyClear: 'Clear History',
    historyEmpty: 'History is empty.',
    historyConfirmClear: 'Are you sure?',

    // Success Messages
    successCleared: 'History cleared successfully.',
    successCopied: 'Copied successfully.',
    successUpdated: 'Cache cleared. Reloading...',
    successFileEncrypted: 'File encrypted successfully.',
    successFileDecrypted: 'File decrypted successfully.',

    // Accessibility
    ariaThemeToggle: 'Toggle theme',
    ariaLangToggle: 'Toggle language',
    ariaPasswordToggle: 'Show or hide password',
    ariaProcessing: 'Processing',
    ariaResult: 'Operation result',
  },
};

// ==========================================
// I18N CLASS
// ==========================================

export class I18nModule {
  private currentLang: Language = 'fa';

  constructor() {
    this.detectLanguage();
  }

  /**
   * Detect browser language
   */
  private detectLanguage(): void {
    const stored = localStorage.getItem('cryptomsg-lang');
    if (stored === 'fa' || stored === 'en') {
      this.currentLang = stored;
      return;
    }

    this.currentLang = 'fa';
  }

  /**
   * Set current language
   */
  setLanguage(lang: Language): void {
    this.currentLang = lang;
    localStorage.setItem('cryptomsg-lang', lang);
  }

  /**
   * Get current language
   */
  getLanguage(): Language {
    return this.currentLang;
  }

  /**
   * Get translation by key
   */
  t(key: string): string {
    return translations[this.currentLang]?.[key] ?? translations.fa[key] ?? key;
  }

  /**
   * Get all translations for current language
   */
  getAllTranslations(): Record<string, string> {
    return translations[this.currentLang] ?? translations.fa;
  }

  /**
   * Get method descriptions
   */
  getMethodDescription(mode: string): { text: string; warn: string } {
    const keyMap: Record<string, string> = {
      base64: 'descBase64',
      farsiChars: 'descFarsiChars',
      farsiWords: 'descFarsiWords',
      invisible: 'descInvisible',
      russian: 'descRussian',
      emoji: 'descEmoji',
      chinese: 'descChinese',
      englishFake: 'descEnglishFake',
    };

    const textKey = keyMap[mode] ?? 'descBase64';
    const warnKey = `warn${mode.charAt(0).toUpperCase() + mode.slice(1)}`;

    const warn = translations[this.currentLang]?.[warnKey] ?? translations.fa[warnKey] ?? '';

    return {
      text: this.t(textKey),
      warn,
    };
  }
}

// ==========================================
// EXPORTS
// ==========================================

export const i18n = new I18nModule();
export { translations };

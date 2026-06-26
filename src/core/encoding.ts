/**
 * @fileoverview CryptoMsg Core - Encoding Module
 * @version 5.0.0
 * @license MIT
 */

import type { EncodingMethod } from '../types';

// ==========================================
// DICTIONARIES
// ==========================================

const DICTIONARIES = {
  base64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split(''),

  farsiChars: [
    'ا','ب','پ','ت','ث','ج','چ','ح','خ','د','ذ','ر','ز','ژ','س','ش',
    'ص','ض','ط','ظ','ع','غ','ف','ق','ک','گ','ل','م','ن','و','ه','ی',
    'آ','أ','ؤ','إ','ة','ئ','ى','ء','۰','۱','۲','۳','۴','۵','۶','۷',
    '۸','۹','،','؛','?','!','@','#','$','%','^','&','*','(',')','='
  ],

  farsiWords: [
    'آسمان', 'درخت', 'سیب', 'انار', 'میز', 'کتاب', 'دفتر', 'قلم', 'خورشید', 'ماه',
    'ستاره', 'ابر', 'باران', 'برف', 'باد', 'خاک', 'آتش', 'دریا', 'رود', 'کوه',
    'جنگل', 'دشت', 'باغ', 'گل', 'پرنده', 'ماهی', 'شیر', 'پلنگ', 'اسب', 'سگ',
    'گربه', 'موش', 'نان', 'پنیر', 'چای', 'قهوه', 'غذا', 'آب', 'هوا', 'نور',
    'صدا', 'سکوت', 'روز', 'شب', 'صبح', 'عصر', 'فردا', 'دیروز', 'هفته', 'ماه',
    'سال', 'زمان', 'ساعت', 'دقیقه', 'ثانیه', 'خانه', 'مدرسه', 'شهر', 'روستا',
    'خیابان', 'کوچه', 'پلاک', 'دیوار', 'پنجره', 'صندلی', 'پله', 'زیرزمین', 'بالکن'
  ],

  russian: [
    'А','Б','В','Г','Д','Е','Ё','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т',
    'У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я','а','б','в','г','д','е','ё',
    'ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я'
  ],

  emoji: [
    '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','☺','😚',
    '😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒',
    '🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐','😕'
  ],

  chinese: [
    '的','一','是','在','不','了','有','和','人','这','中','大','为','上','个','国','我','以','要','他','时',
    '来','用','们','生','到','作','地','于','出','就','分','对','成','会','可','主','发','年','动','同',
    '工','也','能','下','过','子','说','产','种','面','而','方','后','多','定','行','学','法','所','民',
    '得','经','十','三','五','七','万','亿','日','月','年','山','水','火','木','金','土','风','雨','雷'
  ],

  englishFake: [
    'Action', 'Bridge', 'Cloud', 'Drive', 'Earth', 'Fire', 'Green', 'House', 'Iron', 'Jump', 'King', 'Lion', 'Moon', 'Night',
    'Ocean', 'Power', 'Queen', 'River', 'Storm', 'Tree', 'Unity', 'Voice', 'Water', 'Xray', 'Yellow', 'Zebra',
    'Apple', 'Bread', 'Chair', 'Desk', 'Eagle', 'Fruit', 'Grape', 'Horse', 'Ice', 'Juice', 'Kite', 'Lemon',
    'Mouse', 'Nest', 'Orange', 'Paper', 'Quiet', 'Radio', 'Snake', 'Table', 'Uncle', 'Video', 'Watch', 'Box',
    'Yard', 'Zone', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Echo', 'Fox', 'Golf', 'Hotel', 'India', 'Juliet', 'Kilo', 'Mike',
    'November', 'Oscar', 'Papa', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'Xray', 'Yankee', 'Zulu'
  ],
};

// Zero-width characters for steganography
const ZW_CHARS: string[] = ['‌', '‍', '﻿', '⁠'];

// ==========================================
// ENCODING MODULE
// ==========================================

export class EncodingModule {
  /**
   * Check if text contains invisible (zero-width) characters
   */
  hasInvisibleChars(text: string): boolean {
    return text.split('').some((char) => ZW_CHARS.includes(char));
  }

  /**
   * Check if text looks like v4 JSON format
   */
  looksLikeV4JSON(str: string): boolean {
    const clean = str.trim();
    if (!clean.startsWith('ey')) return false;
    try {
      return window.atob(window.btoa(clean)) === clean;
    } catch {
      return false;
    }
  }

  /**
   * Convert Base64 to invisible text embedded in cover text
   */
  textToInvisible(base64: string, cover: string): string {
    // Convert to binary
    let binary = '';
    for (let i = 0; i < base64.length; i++) {
      const bin = base64.charCodeAt(i).toString(2);
      binary += '0'.repeat(8 - bin.length) + bin;
    }

    // Convert binary to zero-width characters
    let invisibleStr = '';
    for (let i = 0; i < binary.length; i += 2) {
      const index = parseInt(binary.substring(i, i + 2), 2);
      invisibleStr += ZW_CHARS[index] ?? ZW_CHARS[0];
    }

    // Embed in cover text
    const mid = Math.floor(cover.length / 2);
    return cover.slice(0, mid) + invisibleStr + cover.slice(mid);
  }

  /**
   * Extract invisible text from cover
   */
  invisibleToText(str: string): string {
    let invisiblePart = '';
    for (const char of str.split('')) {
      if (ZW_CHARS.includes(char)) {
        invisiblePart += char;
      }
    }

    if (invisiblePart.length === 0) {
      throw new EncodingError('No invisible characters found', 'NO_INVISIBLE_CHARS');
    }

    // Convert zero-width to binary
    let binary = '';
    for (const char of invisiblePart.split('')) {
      const index = ZW_CHARS.indexOf(char);
      binary += index.toString(2).padStart(2, '0');
    }

    // Convert binary to Base64
    let base64 = '';
    for (let i = 0; i < binary.length; i += 8) {
      base64 += String.fromCharCode(parseInt(binary.substring(i, i + 8), 2));
    }

    return base64;
  }

  /**
   * Map Base64 to a dictionary
   */
  mapToDictionary(base64: string, modeName: EncodingMethod): string {
    // invisible is handled separately, not via dictionary mapping
    if (modeName === 'invisible') {
      return base64;
    }

    const targetDict = DICTIONARIES[modeName];
    if (!targetDict) {
      throw new EncodingError(`Unknown encoding mode: ${modeName}`, 'UNKNOWN_MODE');
    }

    const isWordBased = modeName === 'farsiWords' || modeName === 'englishFake';
    const result: string[] = [];

    for (const char of base64.split('')) {
      if (char === '=') continue;
      const idx = DICTIONARIES.base64.indexOf(char);
      if (idx !== -1 && targetDict[idx]) {
        result.push(targetDict[idx]);
      }
    }

    let str = isWordBased ? result.join(' ') : result.join('');

    // Add random spaces for non-word-based (except chinese, emoji)
    if (!isWordBased && modeName !== 'chinese' && modeName !== 'emoji') {
      str = this.addRandomSpaces(str);
    }

    return str;
  }

  /**
   * Map text from dictionary to Base64
   */
  mapFromDictionary(text: string, modeName: EncodingMethod): string {
    // invisible is handled separately
    if (modeName === 'invisible') {
      return text;
    }

    const targetDict = DICTIONARIES[modeName];
    if (!targetDict) {
      throw new EncodingError(`Unknown encoding mode: ${modeName}`, 'UNKNOWN_MODE');
    }

    const isWordBased = modeName === 'farsiWords' || modeName === 'englishFake';

    let tokens: string[];
    if (isWordBased) {
      tokens = text.trim().split(/\s+/);
    } else if (modeName === 'emoji') {
      tokens = text.replace(/\s+/g, '').split('');
    } else {
      tokens = text.replace(/\s+/g, '').split('');
    }

    let result = '';
    for (const t of tokens) {
      const idx = targetDict.indexOf(t);
      if (idx !== -1) {
        result += DICTIONARIES.base64[idx];
      }
    }

    // Add padding
    while (result.length % 4 !== 0) {
      result += '=';
    }

    return result;
  }

  /**
   * Auto-detect encoding mode from text
   */
  detectMode(text: string): EncodingMethod {
    const trimmed = text.trim();
    const firstToken = trimmed.split(/\s+/)[0] ?? '';
    const firstChar = trimmed.split('')[0] ?? '';

    // Word-based detection
    if (DICTIONARIES.farsiWords.includes(firstToken)) return 'farsiWords';
    if (DICTIONARIES.englishFake.includes(firstToken)) return 'englishFake';

    // Single character detection
    if (DICTIONARIES.emoji.includes(firstChar)) return 'emoji';
    if (DICTIONARIES.chinese.includes(firstChar)) return 'chinese';
    if (DICTIONARIES.russian.includes(firstChar)) return 'russian';

    // Default to farsiChars
    return 'farsiChars';
  }

  /**
   * Add random spaces to text for obfuscation
   */
  private addRandomSpaces(str: string): string {
    let result = '';
    let count = 0;
    let limit = 5;

    for (const char of str.split('')) {
      result += char;
      count++;
      if (count >= limit) {
        result += ' ';
        count = 0;
        limit = Math.floor(Math.random() * 5) + 3;
      }
    }

    return result;
  }

  /**
   * Get all available encoding methods
   */
  getAvailableMethods(): { value: EncodingMethod; label: string }[] {
    return [
      { value: 'base64', label: 'Standard (Base64)' },
      { value: 'farsiChars', label: 'Random Persian Letters' },
      { value: 'farsiWords', label: 'Real Persian Sentences' },
      { value: 'invisible', label: 'Invisible Text' },
      { value: 'russian', label: 'Russian Letters' },
      { value: 'emoji', label: 'Emoji' },
      { value: 'chinese', label: 'Chinese Characters' },
      { value: 'englishFake', label: 'Fake English' },
    ];
  }

  /**
   * Get method description
   */
  getMethodDescription(mode: EncodingMethod): { text: string; warn: string } {
    const descriptions: Record<EncodingMethod, { text: string; warn: string }> = {
      base64: { text: 'Universal standard. Good for file storage or WhatsApp.', warn: '' },
      farsiChars: { text: 'Convert to random Persian letters. Great for SMS.', warn: '' },
      farsiWords: { text: 'Convert to meaningless Persian sentences. Natural for filter bots.', warn: 'Message size increases slightly.' },
      invisible: { text: 'Your message is hidden inside normal text.', warn: 'Important: Character volume is very high. Do not use in SMS.' },
      russian: { text: 'Use Cyrillic alphabet. Bypasses sensitive word filters.', warn: '' },
      emoji: { text: 'Your message becomes all emojis.', warn: '' },
      chinese: { text: 'Chinese characters. Most compact option.', warn: 'May not display on older phones.' },
      englishFake: { text: 'Random English words. Looks like a wallet Seed Phrase.', warn: '' },
    };

    return descriptions[mode];
  }
}

// ==========================================
// CUSTOM ERROR CLASS
// ==========================================

export class EncodingError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'EncodingError';
  }
}

// ==========================================
// EXPORTS
// ==========================================

export const Encoding = new EncodingModule();
export { DICTIONARIES, ZW_CHARS };

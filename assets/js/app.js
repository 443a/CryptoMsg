// --- دیکشنری‌ها ---
const dictionaries = {
    base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(''),
    farsiChars: ['ا','ب','پ','ت','ث','ج','چ','ح','خ','د','ذ','ر','ز','ژ','س','ش','ص','ض','ط','ظ','ع','غ','f','ق','k','گ','ل','م','ن','و','ه','ی','آ','أ','ؤ','إ','ة','ک','ى','ء','۰','۱','۲','۳','۴','۵','۶','۷','۸','۹','،','؛','?','!','@','#','$','%','^','&','*','(',')','='],
    farsiWords: ["آسمان", "درخت", "سیب", "انار", "میز", "کتاب", "دفتر", "قلم", "خورشید", "ماه", "ستاره", "ابر", "باران", "برف", "باد", "خاک", "آتش", "دریا", "رود", "کوه", "جنگل", "دشت", "باغ", "گل", "پرنده", "ماهی", "شیر", "پلنگ", "اسب", "سگ", "گربه", "موش", "نان", "پنیر", "چای", "قهوه", "غذا", "آب", "هوا", "نور", "صدا", "سکوت", "روز", "شب", "صبح", "عصر", "فردا", "دیروز", "هفته", "ماه", "سال", "زمان", "ساعت", "دقیقه", "ثانیه", "خانه", "مدرسه", "شهر", "روستا", "خیابان", "کوچه", "پلاک", "دیوار", "پنجره"],
    russian: ["А","Б","В","Г","Д","Е","Ё","Ж","З","И","Й","К","Л","М","Н","О","П","Р","С","Т","У","Ф","Х","Ц","Ч","Ш","Щ","Ъ","Ы","Ь","Э","Ю","Я","а","б","в","г","д","е","ё","ж","з","и","й","к","л","м","н","о","п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю"],
    emoji: ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","☺","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕"],
    chinese: ["的","一","是","在","不","了","有","和","人","这","中","大","为","上","个","国","我","以","要","他","时","来","用","们","生","到","作","地","于","出","就","分","对","成","会","可","主","发","年","动","同","工","也","能","下","过","子","说","产","种","面","而","方","后","多","定","行","学","法","所","民","得","经","十三"],
    englishFake: ["Action", "Bridge", "Cloud", "Drive", "Earth", "Fire", "Green", "House", "Iron", "Jump", "King", "Lion", "Moon", "Night", "Ocean", "Power", "Queen", "River", "Storm", "Tree", "Unity", "Voice", "Water", "Xray", "Yellow", "Zebra", "Apple", "Bread", "Chair", "Desk", "Eagle", "Fruit", "Grape", "Horse", "Ice", "Juice", "Kite", "Lemon", "Mouse", "Nest", "Orange", "Paper", "Quiet", "Radio", "Snake", "Table", "Uncle", "Video", "Watch", "Box", "Yard", "Zone", "Alpha", "Beta", "Gamma", "Delta", "Echo", "Fox", "Golf", "Hotel", "India", "Juliet", "Kilo", "Mike"]
};

const zwChars = ['\u200C', '\u200D', '\uFEFF', '\u2060']; 
let currentMode = 'encrypt';

const enc = new TextEncoder();
const dec = new TextDecoder();

// --- توابع رمزنگاری (Web Crypto API) ---
async function getKeyMaterial(password) {
    return window.crypto.subtle.importKey("raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);
}

async function getKey(keyMaterial, salt) {
    return window.crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
        keyMaterial, { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
    );
}

async function encryptData(text, password) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const keyMaterial = await getKeyMaterial(password);
    const key = await getKey(keyMaterial, salt);
    const encryptedContent = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, enc.encode(text));

    return btoa(JSON.stringify({
        s: arrayBufferToBase64(salt),
        i: arrayBufferToBase64(iv),
        c: arrayBufferToBase64(encryptedContent)
    }));
}

async function decryptData(packedData, password) {
    try {
        // تمیزکاری ورودی
        const cleanData = packedData.trim();
        const decodedString = atob(cleanData);
        
        // تشخیص پیام‌های نسخه قدیمی (v3)
        if (decodedString.startsWith('Salted__')) {
            throw new Error("LEGACY_VERSION");
        }

        const dataObj = JSON.parse(decodedString);
        const salt = base64ToArrayBuffer(dataObj.s);
        const iv = base64ToArrayBuffer(dataObj.i);
        const ciphertext = base64ToArrayBuffer(dataObj.c);
        
        const keyMaterial = await getKeyMaterial(password);
        const key = await getKey(keyMaterial, salt);
        
        const decryptedContent = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, ciphertext);
        return dec.decode(decryptedContent);
    } catch (e) {
        if (e.message === "LEGACY_VERSION") throw e;
        console.error("Decryption low-level error:", e);
        throw new Error("DECRYPT_FAIL");
    }
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const bytes = new Uint8Array(binary_string.length);
    for (let i = 0; i < binary_string.length; i++) bytes[i] = binary_string.charCodeAt(i);
    return bytes.buffer;
}

// --- منطق UI ---
function setMode(mode) {
    currentMode = mode;
    const els = { encSet: document.getElementById('encSettings'), actBtn: document.getElementById('actionBtn'), lbl: document.getElementById('inputLabel'), tabEnc: document.getElementById('tabEnc'), tabDec: document.getElementById('tabDec'), res: document.getElementById('resultArea'), inp: document.getElementById('inputText') };
    els.inp.value = ''; els.res.style.display = 'none'; document.getElementById('smartSuggestion').style.display = 'none';

    if(mode === 'encrypt') {
        els.tabEnc.className = 'tab-btn active enc'; els.tabDec.className = 'tab-btn'; els.encSet.style.display = 'block';
        els.actBtn.innerHTML = '<i class="fas fa-lock"></i> تولید پیام امن'; els.actBtn.className = 'btn-main btn-enc'; els.lbl.innerHTML = '<i class="fas fa-pen"></i> متن پیام:';
    } else {
        els.tabEnc.className = 'tab-btn'; els.tabDec.className = 'tab-btn active dec'; els.encSet.style.display = 'none';
        els.actBtn.innerHTML = '<i class="fas fa-unlock"></i> رمزگشایی پیام'; els.actBtn.className = 'btn-main btn-dec'; els.lbl.innerHTML = '<i class="fas fa-paste"></i> متن رمز شده (کپی کنید):';
    }
}

function toggleCoverInput() {
    document.getElementById('coverTextInput').style.display = (document.getElementById('encodingMode').value === 'invisible') ? 'block' : 'none';
}

function analyzeInput() {
    const text = document.getElementById('inputText').value;
    const box = document.getElementById('smartSuggestion');
    if (currentMode !== 'encrypt' || text.length < 3) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    let msg = text.length < 50 ? "متن کوتاه است. برای پیامک، <span class='suggestion-tag'>حروف تصادفی فارسی</span> عالی است." : "برای توییتر/اینستاگرام، <span class='suggestion-tag'>متن نامرئی</span> پیشنهاد می‌شود.";
    document.getElementById('suggestionText').innerHTML = msg;
}

// --- پردازش اصلی (اصلاح شده) ---
async function process() {
    const text = document.getElementById('inputText').value.trim();
    const pass = document.getElementById('password').value;
    const mode = document.getElementById('encodingMode').value;
    const cover = document.getElementById('coverText').value.trim() || "سلام، پیام مخفی اینجاست."; 

    if (!text || !pass) { alert("⚠️ لطفا متن و رمز عبور را وارد کنید"); return; }
    
    const btn = document.getElementById('actionBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ...'; btn.disabled = true;

    try {
        if (currentMode === 'encrypt') {
            const encryptedBase64 = await encryptData(text, pass);
            let finalStr = "";
            if (mode === 'invisible') finalStr = textToInvisible(encryptedBase64, cover);
            else if (mode === 'base64') finalStr = encryptedBase64;
            else finalStr = mapToDictionary(encryptedBase64, mode);
            displayOutput(finalStr, mode);
        } else {
            let base64Cipher = "";
            
            // تشخیص هوشمند فرمت ورودی
            if (hasInvisibleChars(text)) {
                base64Cipher = invisibleToText(text);
            } else if (looksLikeV4JSON(text)) {
                // اگر متن شبیه JSON نسخه ۴ است (با ey شروع می‌شود)
                base64Cipher = text; 
            } else {
                let detectedMode = detectMode(text);
                base64Cipher = mapFromDictionary(text, detectedMode);
            }

            const decrypted = await decryptData(base64Cipher, pass);
            document.getElementById('outputParts').innerHTML = `<div class="result-part"><button class="copy-btn" onclick="copyText(this)">کپی</button><div class="result-text">${decrypted}</div></div>`;
            document.getElementById('resultArea').style.display = 'block';
        }
    } catch (e) {
        if (e.message === "LEGACY_VERSION") {
            alert("⚠️ خطا: این پیام با نسخه قدیمی (v3) رمز شده است و با نسخه ۴ باز نمی‌شود.");
        } else {
            alert("❌ خطا: رمز عبور اشتباه است یا متن ورودی معتبر نیست.");
        }
    } finally {
        btn.innerHTML = originalText; btn.disabled = false;
    }
}

// --- توابع کمکی ---
function looksLikeV4JSON(str) {
    // چک ساده: آیا با ey شروع می‌شود؟ (نشانه Base64 برای { )
    // و آیا کاراکترهای مجاز Base64 دارد؟
    const clean = str.trim();
    if (!clean.startsWith('ey')) return false;
    try { return btoa(atob(clean)) == clean; } catch(e) { return false; }
}

function textToInvisible(base64, cover) {
    let binary = "";
    for (let i = 0; i < base64.length; i++) {
        let bin = base64.charCodeAt(i).toString(2);
        binary += "0".repeat(8 - bin.length) + bin;
    }
    let invisibleStr = "";
    for (let i = 0; i < binary.length; i += 2) invisibleStr += zwChars[parseInt(binary.substr(i, 2), 2)];
    const mid = Math.floor(cover.length / 2);
    return cover.slice(0, mid) + invisibleStr + cover.slice(mid);
}

function invisibleToText(str) {
    let invisiblePart = "";
    for (let char of str) if (zwChars.includes(char)) invisiblePart += char;
    if (invisiblePart.length === 0) throw new Error("No invisible chars");
    let binary = "";
    for (let char of invisiblePart) binary += zwChars.indexOf(char).toString(2).padStart(2, '0');
    let base64 = "";
    for (let i = 0; i < binary.length; i += 8) base64 += String.fromCharCode(parseInt(binary.substr(i, 8), 2));
    return base64;
}

function hasInvisibleChars(text) { for (let char of text) if (zwChars.includes(char)) return true; return false; }

function mapToDictionary(base64, modeName) {
    const targetDict = dictionaries[modeName];
    let isWordBased = (modeName === 'farsiWords' || modeName === 'englishFake');
    let res = [];
    for (let char of base64) {
        if (char === '=') continue; 
        res.push(targetDict[dictionaries.base64.indexOf(char)]);
    }
    let str = isWordBased ? res.join(" ") : res.join("");
    if (!isWordBased && modeName !== 'chinese' && modeName !== 'emoji') str = addRandomSpaces(str);
    return str;
}

function mapFromDictionary(text, modeName) {
    const targetDict = dictionaries[modeName];
    let isWordBased = (modeName === 'farsiWords' || modeName === 'englishFake');
    let tokens;
    if (isWordBased) tokens = text.trim().split(/\s+/);
    else if (modeName === 'emoji') tokens = Array.from(text.replace(/\s+/g, ''));
    else tokens = text.replace(/\s+/g, '').split('');

    let res = "";
    for (let t of tokens) {
        let idx = targetDict.indexOf(t);
        if (idx !== -1) res += dictionaries.base64[idx];
    }
    while (res.length % 4 !== 0) res += '=';
    return res;
}

function detectMode(text) {
    const t = text.trim();
    if (dictionaries.farsiWords.includes(t.split(/\s+/)[0])) return 'farsiWords';
    if (dictionaries.englishFake.includes(t.split(/\s+/)[0])) return 'englishFake';
    const firstChar = Array.from(t)[0];
    if (dictionaries.emoji.includes(firstChar)) return 'emoji';
    if (dictionaries.chinese.includes(firstChar)) return 'chinese';
    if (dictionaries.russian.includes(firstChar)) return 'russian';
    return 'farsiChars';
}

function addRandomSpaces(str) {
    let res = ""; let count = 0; let limit = 5;
    for (let char of str) {
        res += char; count++;
        if (count >= limit) { res += " "; count = 0; limit = Math.floor(Math.random() * 5) + 3; }
    }
    return res;
}

function displayOutput(text, mode) {
    const out = document.getElementById('outputParts');
    const len = Array.from(text).length;
    document.getElementById('charCount').innerText = `${len} کاراکتر`;
    document.getElementById('smsCount').innerText = `~${Math.ceil(len / (mode === 'englishFake' ? 160 : 70))} پیامک`;
    
    out.innerHTML = '';
    const doSplit = document.getElementById('splitOutput').checked;
    
    if (doSplit && len > 500) {
        const chars = Array.from(text);
        for (let i = 0; i < chars.length; i += 500) {
            let part = chars.slice(i, i + 500).join("");
            out.innerHTML += `<div class="result-part"><span style="color:var(--primary); font-size:0.8rem; display:block; margin-bottom:5px;">بخش ${Math.floor(i/500) + 1}</span><button class="copy-btn" onclick="copyText(this)">کپی</button><div class="result-text">${part}</div></div>`;
        }
    } else {
        out.innerHTML = `<div class="result-part"><button class="copy-btn" onclick="copyText(this)">کپی کامل</button><div class="result-text">${text}</div></div>`;
    }
    document.getElementById('resultArea').style.display = 'block';
}

function copyText(btn) {
    navigator.clipboard.writeText(btn.parentElement.querySelector('.result-text').innerText).then(() => {
        let t = btn.innerText; btn.innerText = "کپی شد!"; setTimeout(() => btn.innerText = t, 2000);
    });
}

function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    const arr = new Uint32Array(20); window.crypto.getRandomValues(arr);
    let pass = ""; for(let i=0; i<20; i++) pass += chars[arr[i] % chars.length];
    document.getElementById('password').value = pass; checkStrength();
}
function togglePass() {
    const inp = document.getElementById('password'); inp.type = inp.type === "password" ? "text" : "password";
}
function checkStrength() {
    const val = document.getElementById('password').value;
    const bar = document.getElementById('strengthFill');
    if(!val) { bar.style.width = '0%'; return; }
    let s = 0; if(val.length > 8) s++; if(/[A-Z]/.test(val)) s++; if(/[0-9]/.test(val)) s++; if(/[^A-Za-z0-9]/.test(val)) s++;
    bar.style.width = Math.min((s+1)*25, 100) + '%'; 
    bar.style.background = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'][Math.min(s, 3)];
}
// PWA
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
let deferredPrompt; window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; document.getElementById('installBtn').style.display = 'block'; });
document.getElementById('installBtn').addEventListener('click', () => { document.getElementById('installBtn').style.display = 'none'; deferredPrompt.prompt(); });
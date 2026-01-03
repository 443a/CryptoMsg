// Dictionaries and Constants
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

// UI Management
function setMode(mode) {
    currentMode = mode;
    const els = {
        encSet: document.getElementById('encSettings'),
        actBtn: document.getElementById('actionBtn'),
        lbl: document.getElementById('inputLabel'),
        tabEnc: document.getElementById('tabEnc'),
        tabDec: document.getElementById('tabDec'),
        res: document.getElementById('resultArea'),
        inp: document.getElementById('inputText')
    };
    
    els.inp.value = '';
    els.res.style.display = 'none';
    document.getElementById('smartSuggestion').style.display = 'none';

    if(mode === 'encrypt') {
        els.tabEnc.className = 'tab-btn active enc';
        els.tabDec.className = 'tab-btn';
        els.encSet.style.display = 'block';
        els.actBtn.innerHTML = '<i class="fas fa-lock"></i> تولید پیام';
        els.actBtn.className = 'btn-main btn-enc';
        els.lbl.innerHTML = '<i class="fas fa-pen"></i> متن پیام:';
    } else {
        els.tabEnc.className = 'tab-btn';
        els.tabDec.className = 'tab-btn active dec';
        els.encSet.style.display = 'none';
        els.actBtn.innerHTML = '<i class="fas fa-unlock"></i> رمزگشایی پیام';
        els.actBtn.className = 'btn-main btn-dec';
        els.lbl.innerHTML = '<i class="fas fa-paste"></i> متن رمز شده (کپی کنید):';
    }
}

function toggleCoverInput() {
    const mode = document.getElementById('encodingMode').value;
    const coverInput = document.getElementById('coverTextInput');
    coverInput.style.display = (mode === 'invisible') ? 'block' : 'none';
}

function analyzeInput() {
    const text = document.getElementById('inputText').value;
    const suggestionBox = document.getElementById('smartSuggestion');
    const suggestionText = document.getElementById('suggestionText');
    
    if (currentMode !== 'encrypt' || text.length < 5) {
        suggestionBox.style.display = 'none';
        return;
    }

    suggestionBox.style.display = 'block';
    let msg = "";

    if (text.length < 50) {
        msg = `متن کوتاه است. روش <span class="suggestion-tag">حروف تصادفی فارسی</span> اقتصادی‌تر است.`;
    } else if (text.length > 500) {
        msg = `متن طولانی است. برای جلوگیری از مسدودی، از روش <span class="suggestion-tag">کلمات فارسی</span> یا <span class="suggestion-tag">حروف روسی</span> استفاده کنید.`;
    } else {
        msg = `برای مخفی‌کاری در توییتر/اینستاگرام، بهترین گزینه <span class="suggestion-tag">متن نامرئی</span> است.`;
    }
    suggestionText.innerHTML = msg;
}

// Core Logic
function process() {
    const text = document.getElementById('inputText').value.trim();
    const pass = document.getElementById('password').value;
    const mode = document.getElementById('encodingMode').value;
    const cover = document.getElementById('coverText').value.trim() || "سلام، پیام مخفی اینجاست."; 

    if (!text || !pass) { alert("⚠️ لطفا متن و رمز عبور را وارد کنید"); return; }

    try {
        if (currentMode === 'encrypt') {
            const encrypted = CryptoJS.AES.encrypt(text, pass).toString();
            let finalStr = "";

            if (mode === 'invisible') {
                finalStr = textToInvisible(encrypted, cover);
            } else {
                finalStr = mapToDictionary(encrypted, mode);
            }
            
            displayOutput(finalStr, mode);
        } else {
            let decryptedBase64 = "";
            
            if (hasInvisibleChars(text)) {
                decryptedBase64 = invisibleToText(text);
            } else {
                let detectedMode = detectMode(text);
                decryptedBase64 = mapFromDictionary(text, detectedMode);
            }

            let decrypted = CryptoJS.AES.decrypt(decryptedBase64, pass).toString(CryptoJS.enc.Utf8);
            if(!decrypted) throw new Error();
            
            document.getElementById('outputParts').innerHTML = `<div class="result-part"><button class="copy-btn" onclick="copyText(this)">کپی</button><div class="result-text">${decrypted}</div></div>`;
            document.getElementById('resultArea').style.display = 'block';
            document.getElementById('charCount').innerText = ""; 
            document.getElementById('smsCount').innerText = "";
        }
    } catch (e) {
        console.error(e);
        alert("❌ خطا: رمز عبور اشتباه است یا متن ورودی معتبر نیست.");
    }
}

// Encoding Helpers
function textToInvisible(base64, coverText) {
    let binary = "";
    for (let i = 0; i < base64.length; i++) {
        let bin = base64.charCodeAt(i).toString(2);
        binary += "0".repeat(8 - bin.length) + bin;
    }

    let invisibleStr = "";
    for (let i = 0; i < binary.length; i += 2) {
        let chunk = binary.substr(i, 2);
        if (chunk.length < 2) chunk += "0"; 
        let idx = parseInt(chunk, 2);
        invisibleStr += zwChars[idx];
    }
    
    const mid = Math.floor(coverText.length / 2);
    return coverText.slice(0, mid) + invisibleStr + coverText.slice(mid);
}

function invisibleToText(str) {
    let invisiblePart = "";
    for (let char of str) {
        if (zwChars.includes(char)) invisiblePart += char;
    }
    if (invisiblePart.length === 0) throw new Error("No invisible chars");

    let binary = "";
    for (let char of invisiblePart) {
        let idx = zwChars.indexOf(char);
        let bin = idx.toString(2);
        binary += "0".repeat(2 - bin.length) + bin;
    }

    let base64 = "";
    for (let i = 0; i < binary.length; i += 8) {
        let byte = binary.substr(i, 8);
        if (byte.length === 8) {
            base64 += String.fromCharCode(parseInt(byte, 2));
        }
    }
    return base64;
}

function hasInvisibleChars(text) {
    for (let char of text) {
        if (zwChars.includes(char)) return true;
    }
    return false;
}

function mapToDictionary(base64, modeName) {
    const targetDict = dictionaries[modeName];
    let isWordBased = (modeName === 'farsiWords' || modeName === 'englishFake');
    let res = [];
    for (let char of base64) {
        if (char === '=') continue; 
        let idx = dictionaries.base64.indexOf(char);
        res.push(targetDict[idx]);
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
    const firstToken = text.trim().split(/\s+/)[0];
    const firstChar = Array.from(text.trim())[0];
    if (dictionaries.farsiWords.includes(firstToken)) return 'farsiWords';
    if (dictionaries.englishFake.includes(firstToken)) return 'englishFake';
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

// Display & Utils
function displayOutput(text, mode) {
    const outputDiv = document.getElementById('outputParts');
    const charLen = Array.from(text).length;
    
    let smsCount = Math.ceil(charLen / 70);
    if (mode === 'englishFake') smsCount = Math.ceil(charLen / 160);

    document.getElementById('charCount').innerText = `${charLen} کاراکتر`;
    document.getElementById('smsCount').innerText = `~${smsCount} پیامک`;

    outputDiv.innerHTML = '';
    
    const doSplit = document.getElementById('splitOutput').checked;
    const splitLimit = 500; 

    if (doSplit && charLen > splitLimit) {
        let parts = splitString(text, splitLimit); 
        parts.forEach((part, index) => {
            let html = `
            <div class="result-part">
                <span style="color:var(--primary); font-size:0.8rem; display:block; margin-bottom:5px;">
                    بخش ${index + 1} از ${parts.length}
                </span>
                <button class="copy-btn" onclick="copyText(this)">کپی</button>
                <div class="result-text">${part}</div>
            </div>`;
            outputDiv.innerHTML += html;
        });
    } else {
        outputDiv.innerHTML = `
        <div class="result-part">
            <button class="copy-btn" onclick="copyText(this)">کپی کامل</button>
            <div class="result-text">${text}</div>
        </div>`;
    }
    document.getElementById('resultArea').style.display = 'block';
}

function splitString(str, len) {
    const chars = Array.from(str);
    let parts = [];
    for (let i = 0; i < chars.length; i += len) parts.push(chars.slice(i, i + len).join(""));
    return parts;
}

function copyText(btn) {
    const text = btn.parentElement.querySelector('.result-text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        let original = btn.innerText; btn.innerText = "کپی شد!";
        setTimeout(() => btn.innerText = original, 2000);
    });
}

function generatePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 20; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const input = document.getElementById('password');
    input.value = password;
    
    input.type = "text"; 
    document.getElementById('toggleBtn').className = "fas fa-eye-slash password-toggle";
    
    checkStrength();
}

function togglePass() {
    const input = document.getElementById('password');
    const icon = document.getElementById('toggleBtn');
    if (input.type === "password") {
        input.type = "text";
        icon.className = "fas fa-eye-slash password-toggle";
    } else {
        input.type = "password";
        icon.className = "fas fa-eye password-toggle";
    }
}

function checkStrength() {
    const val = document.getElementById('password').value;
    const fill = document.getElementById('strengthFill');
    const txt = document.getElementById('strengthText');
    const crackTimeEl = document.getElementById('crackTimeText');
    
    let strength = 0;
    if(val.length > 0) strength = 1; 
    if(val.length > 4) strength++;
    if(val.length > 8) strength++;
    if(/[A-Z]/.test(val)) strength++;
    if(/[0-9]/.test(val)) strength++;
    if(/[^A-Za-z0-9]/.test(val)) strength++;
    
    let colors = ['transparent', '#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981', '#3b82f6'];
    let texts = ['وارد نشده', 'خیلی ضعیف', 'ضعیف', 'متوسط', 'خوب', 'عالی', 'فوق امن'];
    
    let charsetSize = 0;
    if(/[a-z]/.test(val)) charsetSize += 26;
    if(/[A-Z]/.test(val)) charsetSize += 26;
    if(/[0-9]/.test(val)) charsetSize += 10;
    if(/[^A-Za-z0-9]/.test(val)) charsetSize += 30;

    let timeText = "";
    if (val.length === 0) {
        fill.style.width = '0%';
        txt.innerText = 'قدرت: وارد نشده';
        txt.style.color = '#64748b';
        crackTimeEl.innerText = "";
    } else {
        let combinations = Math.pow(charsetSize, val.length);
        let seconds = combinations / 1000000000; 
        
        if (seconds < 1) timeText = "هک: لحظه‌ای! 😱";
        else if (seconds < 60) timeText = `هک: ${Math.round(seconds)} ثانیه ⚠️`;
        else if (seconds < 3600) timeText = `هک: ${Math.round(seconds/60)} دقیقه ⚠️`;
        else if (seconds < 86400) timeText = `هک: ${Math.round(seconds/3600)} ساعت`;
        else if (seconds < 31536000) timeText = `هک: ${Math.round(seconds/86400)} روز`;
        else if (seconds < 3153600000) timeText = `هک: ${Math.round(seconds/31536000)} سال ✅`;
        else timeText = "هک: قرن‌ها (غیرممکن) 🛡️";

        let idx = Math.min(strength, 6);
        fill.style.width = (idx * 16.6) + '%'; 
        fill.style.background = colors[idx]; 
        txt.innerText = 'قدرت: ' + texts[idx]; 
        txt.style.color = colors[idx];
        
        crackTimeEl.innerText = timeText;
        crackTimeEl.style.color = (seconds < 86400) ? '#ef4444' : '#10b981';
    }
}

// PWA & Updates
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('installBtn');
    installBtn.style.display = 'block';
    
    installBtn.addEventListener('click', () => {
        installBtn.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => { deferredPrompt = null; });
    });
});

function updateApp() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            }
            alert("کش برنامه پاک شد. صفحه ریلود می‌شود...");
            window.location.reload(true);
        });
    } else {
        window.location.reload(true);
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW Fail'));
    });
}
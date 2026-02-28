const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const lengthValEl = document.getElementById('length-val');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');
const toastEl = document.getElementById('toast');

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// --- Enhancing the Slider ---
// This function colors the left side of the slider thumb white, and right side gray
function updateSliderVisuals() {
    const min = lengthEl.min || 8;
    const max = lengthEl.max || 100;
    const val = lengthEl.value;
    const percentage = ((val - min) / (max - min)) * 100;
    // Update the background to have a filled track effect
    lengthEl.style.background = `linear-gradient(to right, #ffffff ${percentage}%, #2a2a2a ${percentage}%)`;
}

lengthEl.addEventListener('input', (e) => {
    lengthValEl.innerText = e.target.value;
    updateSliderVisuals(); // Fill the track dynamically
    generateBtnClick();    // Auto-generate as user slides
});

clipboardEl.addEventListener('click', () => {
    const password = resultEl.innerText;
    if (!password || password === 'Click generate' || password === 'Select an option') {
        return;
    }

    navigator.clipboard.writeText(password).then(() => {
        showToast();
    });
});

generateEl.addEventListener('click', generateBtnClick);

[uppercaseEl, lowercaseEl, numbersEl, symbolsEl].forEach(el => {
    el.addEventListener('change', generateBtnClick);
});

function generateBtnClick() {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    resultEl.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
}

function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;

    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);

    if (typesCount === 0) {
        return 'Select an option';
    }

    typesArr.forEach(type => {
        const funcName = Object.keys(type)[0];
        generatedPassword += randomFunc[funcName]();
    });

    for (let i = typesCount; i < length; i++) {
        const randomTypeSelector = Math.floor(Math.random() * typesArr.length);
        const funcName = Object.keys(typesArr[randomTypeSelector])[0];
        generatedPassword += randomFunc[funcName]();
    }

    return shuffleString(generatedPassword);
}

function shuffleString(str) {
    let arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.+-_~|';
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function showToast() {
    toastEl.classList.add('show');
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 2500);
}

// Initial setup on page load
updateSliderVisuals();
generateBtnClick();

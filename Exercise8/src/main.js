import './style.css';

let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;

let display, previousCalculation;

document.addEventListener('DOMContentLoaded', function () {
    display = document.getElementById('display');
    previousCalculation = document.getElementById('previousCalculation');
    updateDisplay();

    const calculatorContainer = document.querySelector('.calculator-container');
    if (calculatorContainer) {
        calculatorContainer.classList.add('calculator-bounce');
    }
});

function updateDisplay() {
    if (!display) return;
    display.textContent = formatNumber(currentInput);
    if (previousInput && operation && previousCalculation) {
        previousCalculation.textContent = `${formatNumber(previousInput)} ${operation}`;
    } else if (previousCalculation) {
        previousCalculation.textContent = '';
    }
}

function formatNumber(num) {
    if (num === '' || num === undefined) return '0';
    const numValue = parseFloat(num);
    if (isNaN(numValue)) return '0';

    if (Number.isInteger(numValue) && !num.includes('.')) {
        return numValue.toLocaleString();
    }

    if (num.includes('.')) {
        const parts = num.split('.');
        const integerPart = parseInt(parts[0]);
        const decimalPart = parts[1];
        const formattedInteger = integerPart.toLocaleString();
        return `${formattedInteger}.${decimalPart}`;
    }

    return numValue.toLocaleString();
}

function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }

    if (currentInput === '0') {
        currentInput = num;
    } else {
        const cleanInput = currentInput.replace(/,/g, '');
        if (cleanInput.length < 12) {
            currentInput += num;
        }
    }
    updateDisplay();
}

function appendDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}

function setOperation(op) {
    if (operation && !shouldResetDisplay) {
        calculate();
    }
    operation = op;
    previousInput = currentInput;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculate() {
    if (!operation) return;

    const prev = parseFloat(previousInput.replace(/,/g, ''));
    const current = parseFloat(currentInput.replace(/,/g, ''));

    if (isNaN(prev) || isNaN(current)) {
        showError('Invalid calculation');
        return;
    }

    let result;
    switch (operation) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '×': result = prev * current; break;
        case '÷':
            if (current === 0) {
                showError('Cannot divide by zero!');
                return;
            }
            result = prev / current;
            break;
        default: return;
    }

    result = roundToSignificantDigits(result, 10);

    if (Math.abs(result) >= 1e10) {
        currentInput = result.toExponential(5);
    } else if (result.toString().length > 12) {
        currentInput = parseFloat(result.toFixed(8)).toString();
    } else {
        currentInput = result.toString();
    }

    operation = null;
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay();
}

function roundToSignificantDigits(num, digits) {
    if (num === 0) return 0;
    const magnitude = Math.floor(Math.log10(Math.abs(num)));
    const factor = Math.pow(10, digits - magnitude - 1);
    return Math.round(num * factor) / factor;
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function toggleSign() {
    if (currentInput !== '0') {
        currentInput = currentInput.startsWith('-') ? currentInput.slice(1) : '-' + currentInput;
        updateDisplay();
    }
}

function percentage() {
    const current = parseFloat(currentInput.replace(/,/g, ''));
    if (isNaN(current)) return;
    const result = current / 100;
    currentInput = result.toString();
    shouldResetDisplay = true;
    updateDisplay();
}

window.appendNumber = appendNumber;
window.appendDecimal = appendDecimal;
window.setOperation = setOperation;
window.calculate = calculate;
window.clearAll = clearAll;
window.toggleSign = toggleSign;
window.percentage = percentage;

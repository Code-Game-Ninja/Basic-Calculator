// Calculator functions
let calculationHistory = [];

function appendToDisplay(value) {
    const display = document.getElementById("display");
    display.value += value;
    display.scrollLeft = display.scrollWidth;
}

function clearDisplay() {
    document.getElementById("display").value = "";
}

function backspace() {
    const display = document.getElementById("display");
    display.value = display.value.slice(0, -1);
}

function calculateResult() {
    const display = document.getElementById("display");
    try {
        const expression = display.value;
        const result = eval(expression);

        if (isNaN(result) || !isFinite(result)) {
            throw new Error("Invalid result");
        }

        display.value = result;

        // Add to history
        calculationHistory.unshift({
            expression: expression,
            result: result
        });

        updateHistory();
    } catch (error) {
        display.value = "Error";
        setTimeout(() => {
            display.value = "";
        }, 1000);
    }
}

function updateHistory() {
    const historyElement = document.getElementById("calc-history");
    historyElement.innerHTML = "";

    // Show only last 5 calculations
    const recentHistory = calculationHistory.slice(0, 5);

    recentHistory.forEach(item => {
        const historyItem = document.createElement("div");
        historyItem.className = "history-item";
        historyItem.textContent = `${item.expression} = ${item.result}`;
        historyElement.appendChild(historyItem);
    });
}

// Navigation functions
document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function () {
        // Remove active class from all buttons and content
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.content').forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to clicked button and corresponding content
        this.classList.add('active');
        const target = this.getAttribute('data-target');
        document.getElementById(`${target}-content`).classList.add('active');
    });
});

// Unit conversion functions
function swapUnits(type) {
    const fromSelect = document.getElementById(`${type}-from`);
    const toSelect = document.getElementById(`${type}-to`);
    const fromValue = fromSelect.value;
    const toValue = toSelect.value;

    fromSelect.value = toValue;
    toSelect.value = fromValue;

    // Trigger conversion
    if (type === 'length') convertLength();
    else if (type === 'weight') convertWeight();
    else if (type === 'temp') convertTemperature();
    else if (type === 'currency') convertCurrency();
}

// Length conversion
const lengthFactors = {
    mm: 1,
    cm: 10,
    m: 1000,
    km: 1000000,
    in: 25.4,
    ft: 304.8,
    yd: 914.4,
    mi: 1609344
};

function convertLength() {
    const input = parseFloat(document.getElementById("length-input").value) || 0;
    const fromUnit = document.getElementById("length-from").value;
    const toUnit = document.getElementById("length-to").value;

    // Convert to mm first
    const inMm = input * lengthFactors[fromUnit];
    // Convert to target unit
    const result = inMm / lengthFactors[toUnit];

    document.getElementById("length-output").value = result.toFixed(6);
}

// Weight conversion
const weightFactors = {
    mg: 1,
    g: 1000,
    kg: 1000000,
    t: 1000000000,
    oz: 28349.5,
    lb: 453592,
    st: 6350290
};

function convertWeight() {
    const input = parseFloat(document.getElementById("weight-input").value) || 0;
    const fromUnit = document.getElementById("weight-from").value;
    const toUnit = document.getElementById("weight-to").value;

    // Convert to mg first
    const inMg = input * weightFactors[fromUnit];
    // Convert to target unit
    const result = inMg / weightFactors[toUnit];

    document.getElementById("weight-output").value = result.toFixed(6);
}

// Temperature conversion
function convertTemperature() {
    const input = parseFloat(document.getElementById("temp-input").value) || 0;
    const fromUnit = document.getElementById("temp-from").value;
    const toUnit = document.getElementById("temp-to").value;

    let result;

    // Convert to Celsius first
    let inCelsius;
    switch (fromUnit) {
        case 'c':
            inCelsius = input;
            break;
        case 'f':
            inCelsius = (input - 32) * 5 / 9;
            break;
        case 'k':
            inCelsius = input - 273.15;
            break;
    }

    // Convert from Celsius to target unit
    switch (toUnit) {
        case 'c':
            result = inCelsius;
            break;
        case 'f':
            result = (inCelsius * 9 / 5) + 32;
            break;
        case 'k':
            result = inCelsius + 273.15;
            break;
    }

    document.getElementById("temp-output").value = result.toFixed(2);
}

// Currency conversion (using fixed rates for demo)
const currencyRates = {
    USD: { USD: 1, EUR: 0.85, GBP: 0.73, JPY: 110.15, CAD: 1.25, AUD: 1.30 },
    EUR: { USD: 1.18, EUR: 1, GBP: 0.86, JPY: 129.53, CAD: 1.47, AUD: 1.53 },
    GBP: { USD: 1.37, EUR: 1.16, GBP: 1, JPY: 150.50, CAD: 1.71, AUD: 1.78 },
    JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0066, JPY: 1, CAD: 0.011, AUD: 0.012 },
    CAD: { USD: 0.80, EUR: 0.68, GBP: 0.58, JPY: 87.27, CAD: 1, AUD: 1.04 },
    AUD: { USD: 0.77, EUR: 0.65, GBP: 0.56, JPY: 84.62, CAD: 0.96, AUD: 1 }
};

function convertCurrency() {
    const input = parseFloat(document.getElementById("currency-input").value) || 0;
    const fromCurrency = document.getElementById("currency-from").value;
    const toCurrency = document.getElementById("currency-to").value;

    const rate = currencyRates[fromCurrency][toCurrency];
    const result = input * rate;

    document.getElementById("currency-output").value = result.toFixed(2);
}

// Keyboard support
document.addEventListener("keydown", function (event) {
    const key = event.key;
    const validKeys = "0123456789+-*/().";

    if (validKeys.includes(key)) {
        appendToDisplay(key);
    } else if (key === "Enter") {
        calculateResult();
    } else if (key === "Backspace") {
        backspace();
    } else if (key.toLowerCase() === "c" && !event.ctrlKey && !event.metaKey) {
        clearDisplay();
    } else if (key === "Escape") {
        clearDisplay();
    }
});

// Initialize converters
convertLength();
convertWeight();
convertTemperature();
convertCurrency();
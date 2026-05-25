// js/assistant.js

// Исходная база ответов с восстановленными оригинальными текстами (Вариант 1)
const assistantDatabase = [
    {
        keywords: ['документ', 'доки', 'паспорт', 'справка', 'аттестат', 'фото', 'что нести'],
        answer: 'Для подачи заявления в приемную комиссию тебе понадобятся следующие документы:<br>' +
            '1. Оригинал документа об образовании (аттестат или диплом).<br>' +
            '2. Медицинская справка установленной формы (форма 1 здр/у-10).<br>' +
            '3. Паспорт (или свидетельство о рождении, если нет 16 лет).<br>' +
            '4. 6 фотографий размером 3х4 см.<br>' +
            '5. Документы, подтверждающие право на льготы (при их наличии).'
    },
    {
        keywords: ['срок', 'когда', 'дата', 'прием', 'до какого', 'числа', 'календарь'],
        answer: 'Прием документов в 2025 году осуществляется в следующие сроки:<br>' +
            '• <strong>На бюджет (ССО):</strong> с 20 июля по 3 августа.<br>' +
            '• <strong>На платное (ССО):</strong> с 20 июля по 14 августа.<br>' +
            '• <strong>Высшее образование (ВО):</strong> с 17 июля по 25 июля.<br>' +
            '<i>Рекомендуем подавать документы заранее, чтобы вовремя отслеживать свою позицию в конкурсе!</i>'
    },
    {
        keywords: ['общежитие', 'общага', 'жилье', 'заселение', 'где жить'],
        answer: 'Да, всем иногородним абитуриентам дневной формы получения образования (как ССО, так и ВО) предоставляется благоустроенное общежитие!<br>Подача заявлений на заселение происходит одновременно с подачей документов в приемную комиссию.'
    },
    {
        keywords: ['калькулятор', 'шанс', 'балл', 'как работать', 'позиция', 'поиск', 'как пользоваться'],
        answer: 'Наш интерактивный калькулятор анализирует загруженный файл Excel в реальном времени.<br>' +
            '1. Перейди во вкладку нужного уровня образования (например, ССО после 9 класса).<br>' +
            '2. Введи свой средний балл в строку поиска.<br>' +
            '3. Скрипт мгновенно определит твою позицию среди других абитуриентов, уже подавших документы, и подсветит шансы цветом (зеленый — проходишь, желтый — на грани, красный — высокое соперничество).'
    },
    {
        keywords: ['привет', 'здравствуй', 'добрый день', 'ку', 'хай', 'hello', 'бот'],
        answer: 'Привет! Я виртуальный ассистент приемной комиссии. Готов помочь тебе разобраться в вопросах поступления. О чем бы ты хотел узнать?'
    },
    {
        keywords: ['сокращен', 'ссо', 'после колледжа', 'вышка после'],
        answer: 'Для выпускников колледжей (ССО) у нас открыт прием на сокращенный срок обучения высшего образования (ВО) на дневную и заочную формы.<br>Максимальный балл по конкурсу на эти специальности равен 300.'
    },
    {
        keywords: ['платн', 'оплат', 'стоимость', 'цена', 'обучение стоит'],
        answer: 'Прием на платной основе открыт на большинство специальностей. Информацию о планах приема и текущем конкурсе ты можешь увидеть, переключив соответствующую вкладку внутри карты интересующей тебя специальности.'
    }
];

// Конфигурации всех специальностей (ССО 9, ССО 11, ВО, ВО после ССО)
const sso9Specs = [
    { name: "Тестирование программного обеспечения", offset: 148, offsetPaid: 164 },
    { name: "Разработка и сопровождение веб-ресурсов", offset: 116, offsetPaid: 132 },
    { name: "Техническая эксплуатация систем и сетей телекоммуникаций", offset: 180, offsetPaid: 196 },
    { name: "Информационные кабельные сети", offset: 212, offsetPaid: 228 },
    { name: "Техническая эксплуатация систем радиосвязи, вещания и ТВ", offset: 244, offsetPaid: 260 },
    { name: "Техническая эксплуатация мультимедийных систем", offset: 276, offsetPaid: null },
    { name: "Почтовая деятельность", offset: 292, offsetPaid: 308 }
];

const sso11Specs = [
    { name: "Телекоммуникации (Дневное)", offset: 356, offsetPaid: 372 },
    { name: "Радиосвязь и ТВ (Дневное)", offset: 388, offsetPaid: 404 },
    { name: "Почтовая деятельность (Дневное)", offset: 420, offsetPaid: 436 },
    { name: "Тестирование ПО (Дневное)", offset: 324, offsetPaid: 340 }
];

const voSpecs = [
    { name: "Автоматизация технологических процессов и производств", offset: 32, offsetPaid: 48, isVo: true },
    { name: "Системы и сети инфокоммуникаций", offset: 33, offsetPaid: 49, isVo: true },
    { name: "Прикладная информатика", offset: 34, offsetPaid: 50, isVo: true },
    { name: "Цифровые клиентские сервисы и почтово-логистические системы", offset: 35, offsetPaid: null, isVo: true },
    { name: "Маркетинг", offset: 36, offsetPaid: 52, isVo: true }
];

const voSsoSpecs = [
    { name: "Системы и сети инфокоммуникаций (Дневное сокращенное)", offset: 64, offsetPaid: 79, isVo: true, isVoSso: true },
    { name: "Прикладная информатика (Дневное сокращенное)", offset: 66, offsetPaid: 81, isVo: true, isVoSso: true },
    { name: "Почтовая связь (Дневное сокращенное)", offset: 67, offsetPaid: null, isVo: true, isVoSso: true },
    { name: "Системы и сети инфокоммуникаций (Заочное сокращенное)", offset: 93, offsetPaid: 108, isVo: true, isVoSso: true },
    { name: "Почтовая связь (Заочное сокращенное)", offset: 96, offsetPaid: 111, isVo: true, isVoSso: true }
];

const ASSISTANT_SHEET_ID = '1uFwZs-jzJiUkZk6U266bo4QbmwjAjoUcc0pKAabWhos';
const ASSISTANT_XLSX_URL = `https://docs.google.com/spreadsheets/d/${ASSISTANT_SHEET_ID}/export?format=xlsx`;
let assistantWorkbook = null;

// Динамическое подключение XLSX
function ensureXlsxLoaded(callback) {
    if (typeof XLSX !== 'undefined') {
        callback();
        return;
    }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.onload = callback;
    document.head.appendChild(script);
}

// Загрузка Excel в фоновом режиме
function initAssistantDatabase() {
    ensureXlsxLoaded(() => {
        fetch(ASSISTANT_XLSX_URL)
            .then(res => {
                if (res.ok) return res.arrayBuffer();
                throw new Error();
            })
            .then(buffer => {
                assistantWorkbook = XLSX.read(buffer, { type: 'array' });
                console.log("Интерактивная база данных ассистента успешно загружена.");
            })
            .catch(err => {
                console.error("Ошибка загрузки данных Excel.", err);
            });
    });
}

// Чтение ячеек
function getCell(sheet, r, c) {
    if (!sheet) return '';
    const addr = XLSX.utils.encode_cell({ r, c });
    return sheet[addr] ? sheet[addr].v : '';
}

// Сбор объединенных планов для уровня ВО
function getGroupedPlans(sheet, currentOffset) {
    let totalPlan = 0;
    let startRow = currentOffset;
    let endRow = currentOffset;

    while (startRow > 0) {
        const currentTotalVal = getCell(sheet, startRow, 6);
        const prevTotalVal = getCell(sheet, startRow - 1, 6);
        const prevName = getCell(sheet, startRow - 1, 3);

        if (currentTotalVal !== "" && (prevTotalVal === "" || !prevName)) {
            break;
        }
        if (currentTotalVal === "" && prevName !== "") {
            startRow--;
        } else {
            break;
        }
    }

    let checkRow = startRow + 1;
    while (checkRow < 1000) {
        const checkTotalVal = getCell(sheet, checkRow, 6);
        const checkName = getCell(sheet, checkRow, 3);

        if (checkName !== "" && checkTotalVal === "") {
            endRow = checkRow;
            checkRow++;
        } else {
            break;
        }
    }

    for (let r = startRow; r <= endRow; r++) {
        totalPlan += parseInt(getCell(sheet, r, 4), 10) || 0;
    }

    return {
        sumPlan: totalPlan,
        dataRow: startRow
    };
}

// Парсинг блоков ССО и ВО
function parseSsoBlock(sheet, offset) {
    const plan = parseInt(getCell(sheet, offset + 10, 2), 10) || 0;
    let applications = [];
    for (let col = 4, score = 10.0; col <= 74; col++, score = +(score - 0.1).toFixed(1)) {
        let count = parseInt(getCell(sheet, offset + 10, col), 10) || 0;
        if (count > 0) applications.push({ score: +score.toFixed(1), count });
    }
    return { plan, applications };
}

function parseVoBlock(sheet, offset, isVoSso) {
    const groupInfo = getGroupedPlans(sheet, offset);
    const plan = groupInfo.sumPlan;
    const mainRow = groupInfo.dataRow;

    let applications = [];
    let startCol = 11;
    let currentMax = isVoSso ? 300 : 400;
    const h1 = isVoSso ? 63 : 31;
    const h2 = isVoSso ? 62 : 30;

    for (let col = startCol; col <= 100; col++) {
        let count = parseInt(getCell(sheet, mainRow, col), 10) || 0;
        let currentMin = currentMax - 4;
        let headerVal = getCell(sheet, h1, col) || getCell(sheet, h2, col);
        if (!headerVal && count === 0 && currentMax < (isVoSso ? 250 : 350)) {
            break;
        }
        if (count > 0) {
            applications.push({ score: currentMax, minScore: currentMin, count });
        }
        currentMax -= 5;
        if (currentMax < 0) break;
    }
    return { plan, applications };
}

// Подсчет позиций
function getSsoPosition(applications, userScore) {
    const count = applications
        .filter(app => app.score >= userScore)
        .reduce((sum, app) => sum + app.count, 0);
    return count + 1;
}

function getVoPosition(applications, userScore) {
    let countAhead = 0;
    applications.forEach(app => {
        if (userScore < app.minScore) {
            countAhead += app.count;
        } else if (userScore >= app.minScore && userScore <= app.score) {
            countAhead += app.count;
        }
    });
    return countAhead + 1;
}

// Вычисление текущего проходного балла
function getPassingScore(blockData, isVo) {
    let allScores = [];

    if (isVo) {
        blockData.applications.forEach(app => {
            for (let i = 0; i < app.count; i++) {
                allScores.push(app.minScore);
            }
        });
    } else {
        blockData.applications.forEach(app => {
            for (let i = 0; i < app.count; i++) {
                allScores.push(app.score);
            }
        });
    }

    allScores.sort((a, b) => b - a);

    if (allScores.length === 0) return "Нет заявлений";
    if (blockData.plan === 0) return "Нет бюджетных мест";

    if (allScores.length < blockData.plan) {
        const lowest = allScores[allScores.length - 1];
        return isVo ? `${lowest}+ (места свободны)` : `${lowest.toFixed(1)} (места свободны)`;
    } else {
        const cutoff = allScores[blockData.plan - 1];
        return isVo ? `${cutoff}` : `${cutoff.toFixed(1)}`;
    }
}

// Сопоставление введенной строки со специальностями по строго разделенным маскам
function findMatchingSpecialties(text) {
    const allSpecs = [
        ...sso9Specs.map(s => ({ ...s, category: 'ССО (после 9 кл.)', parser: parseSsoBlock, isVo: false, isVoSso: false })),
        ...sso11Specs.map(s => ({ ...s, category: 'ССО (после 11 кл.)', parser: parseSsoBlock, isVo: false, isVoSso: false })),
        ...voSpecs.map(s => ({ ...s, category: 'ВО (11 кл.)', parser: parseVoBlock, isVo: true, isVoSso: false })),
        ...voSsoSpecs.map(s => ({ ...s, category: 'ВО после ССО (сокращенная)', parser: parseVoBlock, isVo: true, isVoSso: true }))
    ];

    const specKeywords = [
        { pattern: /веб|web|ресурс/i, key: "web" },
        { pattern: /тестир|тест|тпо|qa|софт/i, key: "test" },
        { pattern: /кабель|икс/i, key: "cable" },
        { pattern: /мультимеди/i, key: "multi" },
        { pattern: /почт/i, key: "post" }, // Почтовая связь и деятельность сопоставляется только по корню "почт"
        { pattern: /радио|вещ|телевиден/i, key: "radio" },
        { pattern: /телеком|сеть|коммун|инфоком/i, key: "telecom" },
        { pattern: /автоматиз/i, key: "auto" },
        { pattern: /информатик/i, key: "info" },
        { pattern: /маркетинг/i, key: "marketing" }
    ];

    let matchedSpecs = [];
    specKeywords.forEach(k => {
        if (k.pattern.test(text)) {
            allSpecs.forEach(spec => {
                let isMatch = false;
                if (k.key === "web" && /веб|ресурс/i.test(spec.name)) isMatch = true;
                if (k.key === "test" && /тестир|тест/i.test(spec.name)) isMatch = true;
                if (k.key === "cable" && /кабель/i.test(spec.name)) isMatch = true;
                if (k.key === "multi" && /мультимеди/i.test(spec.name)) isMatch = true;
                if (k.key === "post" && /почт|связь/i.test(spec.name)) {
                    // Исключаем совпадение с "радиосвязью" в почтовом фильтре
                    if (!/радио/i.test(spec.name)) isMatch = true;
                }
                if (k.key === "auto" && /автоматиз/i.test(spec.name)) isMatch = true;
                if (k.key === "info" && /информатик/i.test(spec.name)) isMatch = true;
                if (k.key === "marketing" && /маркетинг/i.test(spec.name)) isMatch = true;
                if (k.key === "telecom" && /телеком|инфоком/i.test(spec.name)) isMatch = true;
                if (k.key === "radio" && /радио|вещ|телевиден/i.test(spec.name)) isMatch = true;

                if (isMatch && !matchedSpecs.some(m => m.offset === spec.offset && m.category === spec.category)) {
                    matchedSpecs.push(spec);
                }
            });
        }
    });

    return matchedSpecs;
}

// Безопасное сопоставление коротких ключевых слов
function matchesKeyword(text, keyword) {
    const textLower = text.toLowerCase();
    const kwLower = keyword.toLowerCase();

    if (kwLower.length <= 3) {
        const regex = new RegExp(`\\b${kwLower}\\b`, 'i');
        return regex.test(textLower);
    }
    return textLower.includes(kwLower);
}

// Переключение видимости чата
function toggleAssistant() {
    const windowEl = document.getElementById('ai-window');
    const isHidden = windowEl.style.display === 'none';
    windowEl.style.display = isHidden ? 'flex' : 'none';

    if (isHidden) {
        document.getElementById('ai-user-input').focus();
        if (!assistantWorkbook) {
            initAssistantDatabase();
        }
    }
}

// Отправка быстрого вопроса по кнопке
function sendQuickQuestion(questionText) {
    appendMessage(questionText, 'user');
    generateBotResponse(questionText);
}

// Отправка сообщения из поля ввода
function sendMessageFromInput() {
    const inputEl = document.getElementById('ai-user-input');
    const text = inputEl.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    inputEl.value = '';
    generateBotResponse(text);
}

// Отслеживание нажатия Enter
function handleAssistantKey(e) {
    if (e.key === 'Enter') {
        sendMessageFromInput();
    }
}

// Добавление сообщения в чат
function appendMessage(text, sender) {
    const messagesContainer = document.getElementById('ai-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${sender}`;
    msgDiv.innerHTML = text;
    messagesContainer.appendChild(msgDiv);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Обработка ввода конкретного балла (Вариант 2)
function handleScoreCalculation(userScore, isVoScore, originalText) {
    if (!assistantWorkbook) {
        initAssistantDatabase();
        setTimeout(() => {
            generateBotResponse(originalText);
        }, 1200);
        appendMessage('Секунду, я загружаю актуальную базу данных конкурса, чтобы рассчитать ваши шансы...', 'bot');
        return;
    }

    try {
        const sheet = assistantWorkbook.Sheets[assistantWorkbook.SheetNames[0]];
        let responseHtml = '';

        if (isVoScore) {
            responseHtml = `<strong>Высшее образование ВО (11 классов)</strong> с баллом <strong>${userScore}</strong>:<br><br>`;
            voSpecs.forEach((spec, index) => {
                const budgetData = parseVoBlock(sheet, spec.offset, false);
                const budgetPos = getVoPosition(budgetData.applications, userScore);
                const budgetStatus = budgetPos <= budgetData.plan
                    ? '<span style="color: #2e7d32; font-weight: bold;">Проходите</span>'
                    : '<span style="color: #c62828; font-weight: bold;">Не проходите</span>';

                let paidHtml = '';
                if (spec.offsetPaid) {
                    const paidData = parseVoBlock(sheet, spec.offsetPaid, false);
                    const paidPos = getVoPosition(paidData.applications, userScore);
                    const paidStatus = paidPos <= paidData.plan
                        ? '<span style="color: #2e7d32; font-weight: bold;">Проходите</span>'
                        : '<span style="color: #c62828; font-weight: bold;">Не проходите</span>';
                    paidHtml = `  - Платно: ${paidPos} из ${paidData.plan} мест (${paidStatus})<br>`;
                } else {
                    paidHtml = `  - Платно: прием не осуществляется<br>`;
                }

                responseHtml += `${index + 1}. <strong>${spec.name}:</strong><br>` +
                    `  - Бюджет: ${budgetPos} из ${budgetData.plan} мест (${budgetStatus})<br>` +
                    paidHtml + `<br>`;
            });

            if (userScore <= 300) {
                responseHtml += `<strong>ВО на базе ССО (Сокращенная форма)</strong> с баллом <strong>${userScore}</strong>:<br><br>`;
                voSsoSpecs.forEach((spec, index) => {
                    const budgetData = parseVoBlock(sheet, spec.offset, true);
                    const budgetPos = getVoPosition(budgetData.applications, userScore);
                    const budgetStatus = budgetPos <= budgetData.plan
                        ? '<span style="color: #2e7d32; font-weight: bold;">Проходите</span>'
                        : '<span style="color: #c62828; font-weight: bold;">Не проходите</span>';

                    let paidHtml = '';
                    if (spec.offsetPaid) {
                        const paidData = parseVoBlock(sheet, spec.offsetPaid, true);
                        const paidPos = getVoPosition(paidData.applications, userScore);
                        const paidStatus = paidPos <= paidData.plan
                            ? '<span style="color: #2e7d32; font-weight: bold;">Проходите</span>'
                            : '<span style="color: #c62828; font-weight: bold;">Не проходите</span>';
                        paidHtml = `  - Платно: ${paidPos} из ${paidData.plan} мест (${paidStatus})<br>`;
                    } else {
                        paidHtml = `  - Платно: прием не осуществляется<br>`;
                    }

                    responseHtml += `${index + 1}. <strong>${spec.name}:</strong><br>` +
                        `  - Бюджет: ${budgetPos} из ${budgetData.plan} мест (${budgetStatus})<br>` +
                        paidHtml + `<br>`;
                });
            }
        } else {
            responseHtml = `<strong>База 9 классов ССО</strong> с вашим баллом <strong>${userScore}</strong>:<br><br>`;
            sso9Specs.forEach((spec, index) => {
                const budgetData = parseSsoBlock(sheet, spec.offset);
                const budgetPos = getSsoPosition(budgetData.applications, userScore);
                const budgetStatus = budgetPos <= budgetData.plan
                    ? '<span style="color: #2e7d32; font-weight: bold;">Проходите</span>'
                    : '<span style="color: #c62828; font-weight: bold;">Не проходите</span>';

                let paidHtml = '';
                if (spec.offsetPaid) {
                    const paidData = parseSsoBlock(sheet, spec.offsetPaid);
                    const paidPos = getSsoPosition(paidData.applications, userScore);
                    const paidStatus = paidPos <= paidData.plan
                        ? '<span style="color: #2e7d32; font-weight: bold;">Проходите</span>'
                        : '<span style="color: #c62828; font-weight: bold;">Не проходите</span>';
                    paidHtml = `  - Платно: ${paidPos} из ${paidData.plan} мест (${paidStatus})<br>`;
                } else {
                    paidHtml = `  - Платно: прием не осуществляется<br>`;
                }

                responseHtml += `${index + 1}. <strong>${spec.name}:</strong><br>` +
                    `  - Бюджет: ${budgetPos} из ${budgetData.plan} мест (${budgetStatus})<br>` +
                    paidHtml + `<br>`;
            });

            responseHtml += `<strong>База 11 классов ССО (дневное)</strong>:<br><br>`;
            sso11Specs.forEach((spec, index) => {
                const budgetData = parseSsoBlock(sheet, spec.offset);
                const budgetPos = getSsoPosition(budgetData.applications, userScore);
                const budgetStatus = budgetPos <= budgetData.plan
                    ? '<span style="color: #2e7d32; font-weight: bold;">Проходите</span>'
                    : '<span style="color: #c62828; font-weight: bold;">Не проходите</span>';

                let paidHtml = '';
                if (spec.offsetPaid) {
                    const paidData = parseSsoBlock(sheet, spec.offsetPaid);
                    const paidPos = getSsoPosition(paidData.applications, userScore);
                    const paidStatus = paidPos <= paidData.plan
                        ? '<span style="color: #2e7d32; font-weight: bold;">Проходите</span>'
                        : '<span style="color: #c62828; font-weight: bold;">Не проходите</span>';
                    paidHtml = `  - Платно: ${paidPos} из ${paidData.plan} мест (${paidStatus})<br>`;
                } else {
                    paidHtml = `  - Платно: прием не осуществляется<br>`;
                }

                responseHtml += `${index + 1}. <strong>${spec.name}:</strong><br>` +
                    `  - Бюджет: ${budgetPos} из ${budgetData.plan} мест (${budgetStatus})<br>` +
                    paidHtml + `<br>`;
            });
        }

        setTimeout(() => {
            appendMessage(responseHtml, 'bot');
        }, 300);
    } catch (e) {
        console.error(e);
        appendMessage('Произошла ошибка при расчете позиций.', 'bot');
    }
}

// Обработка запросов о проходных баллах в реальном времени
function handlePassingScoreQuery(normalizedText, originalText) {
    if (!assistantWorkbook) {
        initAssistantDatabase();
        setTimeout(() => {
            generateBotResponse(originalText);
        }, 1200);
        appendMessage('Секунду, я загружаю актуальную базу данных конкурса, чтобы узнать текущие проходные баллы...', 'bot');
        return;
    }

    try {
        const sheet = assistantWorkbook.Sheets[assistantWorkbook.SheetNames[0]];
        const matchedSpecs = findMatchingSpecialties(normalizedText);

        if (matchedSpecs.length > 0) {
            let reply = 'Актуальный проходной балл на данный момент:<br><br>';
            matchedSpecs.forEach(spec => {
                const budgetBlock = spec.isVo ? parseVoBlock(sheet, spec.offset, spec.isVoSso) : parseSsoBlock(sheet, spec.offset);
                const budgetPassing = getPassingScore(budgetBlock, spec.isVo);

                let paidPassing = "прием не осуществляется";
                if (spec.offsetPaid) {
                    const paidBlock = spec.isVo ? parseVoBlock(sheet, spec.offsetPaid, spec.isVoSso) : parseSsoBlock(sheet, spec.offsetPaid);
                    paidPassing = getPassingScore(paidBlock, spec.isVo);
                }

                reply += `• <strong>${spec.name}</strong> (${spec.category}):<br>` +
                    `  - Бюджет: <strong>${budgetPassing}</strong><br>` +
                    `  - Платно: <strong>${paidPassing}</strong><br><br>`;
            });
            reply += `<i>Примечание: Проходной балл формируется динамически на основе поданных заявлений и меняется каждый день.</i>`;
            appendMessage(reply, 'bot');
        } else {
            let reply = 'На данный момент (ССО, после 9 классов) складываются следующие проходные баллы:<br><br>';
            sso9Specs.forEach((spec, index) => {
                const budgetBlock = parseSsoBlock(sheet, spec.offset);
                const budgetPassing = getPassingScore(budgetBlock, false);

                let paidPassing = "прием не осуществляется";
                if (spec.offsetPaid) {
                    const paidBlock = parseSsoBlock(sheet, spec.offsetPaid);
                    paidPassing = getPassingScore(paidBlock, false);
                }

                reply += `${index + 1}. <strong>${spec.name}:</strong><br>` +
                    `   - Бюджет: <strong>${budgetPassing}</strong><br>` +
                    `   - Платно: <strong>${paidPassing}</strong><br><br>`;
            });
            reply += `<i>Чтобы узнать балл на ВО или ССО (11 кл.), напишите название конкретной специальности (например: "какой балл на прикладную информатику").</i>`;
            appendMessage(reply, 'bot');
        }
    } catch (e) {
        console.error(e);
        appendMessage('Не удалось выполнить расчет проходных баллов.', 'bot');
    }
}

// Логика генерации ответа
function generateBotResponse(userText) {
    const textLower = userText.toLowerCase();
    const normalizedText = textLower.replace(',', '.');

    // 1. ПРИОРИТЕТ: Ввод балла абитуриентом (например, 8.5 или 320)
    let isScoreQuery = false;
    let userScore = null;
    let isVoScore = false;

    const voMatch = normalizedText.match(/\b([1-3]\d{2}|400)\b/);
    if (voMatch) {
        userScore = parseInt(voMatch[1], 10);
        isVoScore = true;
        isScoreQuery = true;
    } else {
        const gpaMatchWithDot = normalizedText.match(/\b(10\.0|[1-9]\.\d)\b/);
        if (gpaMatchWithDot) {
            userScore = parseFloat(gpaMatchWithDot[1]);
            isScoreQuery = true;
        } else {
            const gpaMatchInt = normalizedText.match(/\b(10|[1-9])\b/);
            const scoreKeywords = /балл|шанс|проход|оценк|средн|пройд/i;
            if (gpaMatchInt && scoreKeywords.test(normalizedText) && !/класс|документ|справк/i.test(normalizedText)) {
                userScore = parseFloat(gpaMatchInt[1]);
                isScoreQuery = true;
            }
        }
    }

    if (isScoreQuery && userScore !== null) {
        handleScoreCalculation(userScore, isVoScore, userText);
        return;
    }

    // 2. ПРИОРИТЕТ: Запрос проходных баллов на специальность (например, "Какой балл на веб-ресурсы")
    const isAskingForCutoff = /проходн|какой балл|какие балл|балл.*выходит|балл.*сейчас/i.test(normalizedText);
    if (isAskingForCutoff) {
        handlePassingScoreQuery(normalizedText, userText);
        return;
    }

    // 3. ПРИОРИТЕТ: Поиск по статической базе ответов
    let bestMatch = null;
    let maxScore = 0;

    for (const item of assistantDatabase) {
        let currentScore = 0;
        for (const keyword of item.keywords) {
            if (matchesKeyword(normalizedText, keyword)) {
                currentScore += 1;
            }
        }
        if (currentScore > maxScore) {
            maxScore = currentScore;
            bestMatch = item.answer;
        }
    }

    if (bestMatch && maxScore > 0) {
        setTimeout(() => {
            appendMessage(bestMatch, 'bot');
        }, 400);
        return;
    }

    // Дефолтный ответ
    const defaultReply = 'Хм, я не до конца понял твой вопрос. Попробуй спросить подробнее, используя ключевые слова, например: <strong>документы</strong>, <strong>сроки подачи</strong>, <strong>общежитие</strong> или напиши свой средний балл (например, <b>8.5</b>), чтобы я оценил шансы.';
    setTimeout(() => {
        appendMessage(defaultReply, 'bot');
    }, 400);
}
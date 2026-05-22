// js/assistant.js

// База ответов на часто задаваемые вопросы
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

// Функция переключения видимости чата
function toggleAssistant() {
    const windowEl = document.getElementById('ai-window');
    const isHidden = windowEl.style.display === 'none';
    windowEl.style.display = isHidden ? 'flex' : 'none';

    if (isHidden) {
        document.getElementById('ai-user-input').focus();
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

// Отслеживание нажатия Enter в поле ввода
function handleAssistantKey(e) {
    if (e.key === 'Enter') {
        sendMessageFromInput();
    }
}

// Добавление сообщения в окно чата
function appendMessage(text, sender) {
    const messagesContainer = document.getElementById('ai-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${sender}`;
    msgDiv.innerHTML = text;
    messagesContainer.appendChild(msgDiv);

    // Плавная прокрутка вниз
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Логика генерации ответа псевдо-ИИ на основе поиска по ключам
function generateBotResponse(userText) {
    const textLower = userText.toLowerCase();
    let bestMatch = null;

    // Ищем наиболее подходящий ответ по ключевым словам
    for (const item of assistantDatabase) {
        for (const keyword of item.keywords) {
            if (textLower.includes(keyword)) {
                bestMatch = item.answer;
                break;
            }
        }
        if (bestMatch) break;
    }

    // Если совпадений не найдено, даем стандартный умный ответ-заглушку
    if (!bestMatch) {
        bestMatch = 'Хм, я не до конца понял твой вопрос. Попробуй переформулировать его, используя ключевые слова, например: <strong>документы</strong>, <strong>сроки подачи</strong>, <strong>общежитие</strong> или <strong>калькулятор</strong>.';
    }

    // Имитируем небольшую задержку ответа (эффект "печатания")
    setTimeout(() => {
        appendMessage(bestMatch, 'bot');
    }, 400);
}
// monitoring.js

// Глобальные переменные для переключения бюджета/платного
let currentCategory = 'budget';

// Чтение ячейки Excel
function getCell(sheet, r, c) {
    const addr = XLSX.utils.encode_cell({ r, c });
    return sheet[addr] ? sheet[addr].v : '';
}

// Парсинг данных из Excel
function parseBlock(sheet, offset) {
    // Проверяем, включен ли режим Высшего Образования (ВО) в HTML-файле специальности
    const isVoMode = typeof IS_VO !== 'undefined' && IS_VO;

    if (isVoMode) {
        // --- ЛОГИКА ДЛЯ ВЫСШЕГО ОБРАЗОВАНИЯ (ВО) ---
        const maxScore = typeof VO_MAX_SCORE !== 'undefined' ? VO_MAX_SCORE : 400;

        // В ВО название специальности в колонке D (индекс 3)
        const name = getCell(sheet, offset, 3);

        // План приема в колонке E (индекс 4)
        const plan = parseInt(getCell(sheet, offset, 4), 10) || 0;

        // План целевого приема в колонке F (индекс 5)
        const planTarget = parseInt(getCell(sheet, offset, 5), 10) || 0;

        // Всего подано заявлений в колонке G (индекс 6)
        const total = parseInt(getCell(sheet, offset, 6), 10) || 0;

        // Для ВО целевой прием и льготы (без вступительных / вне конкурса) считываются из столбцов H (7), I (8), J (9)
        const targetTotal = parseInt(getCell(sheet, offset, 7), 10) || 0;
        const noExamsTotal = parseInt(getCell(sheet, offset, 8), 10) || 0;
        const outOfCompetitionTotal = parseInt(getCell(sheet, offset, 9), 10) || 0;
        const totalLgota = noExamsTotal + outOfCompetitionTotal;

        // Парсинг заявлений по интервалам баллов (шаг 5 баллов, колонки начинаются с L (индекс 11))
        let applications = [];
        let startCol = 11;
        let currentMax = maxScore;

        for (let col = startCol; col <= 100; col++) {
            let count = parseInt(getCell(sheet, offset, col), 10) || 0;
            let currentMin = currentMax - 4;
            let label = `${currentMax}-${currentMin}`;

            // Проверяем наличие заголовка, чтобы случайно не уйти в бесконечное чтение пустых ячеек
            let headerVal = getCell(sheet, offset - 1, col) || getCell(sheet, offset - 2, col);
            if (!headerVal && count === 0 && currentMax < (maxScore - 50)) {
                break;
            }

            if (count > 0) {
                // Сохраняем и строковый ярлык интервала, и числовое значение (для правильной сортировки)
                applications.push({ score: currentMax, label: label, count });
            }
            currentMax -= 5;
            if (currentMax < 0) break;
        }

        // Для ВО заполняем льготные и целевые списки на основе суммарных ячеек
        let lgota = [];
        if (totalLgota > 0) {
            lgota.push({ score: 0, label: "Льготный", count: totalLgota });
        }

        let target = [];
        if (targetTotal > 0) {
            target.push({ score: 0, label: "Целевой", count: targetTotal });
        }

        const type = "Высшее образование";
        const educationForm = "дневная";
        const base = maxScore === 300 ? "среднего специального образования (сокращенный срок)" : "общего среднего образования (11 классов)";
        const duration = maxScore === 300 ? "3-3.5 года" : "4 года";

        return {
            name, type, educationForm, base, duration, plan, planTarget,
            total, targetTotal, applications, lgota, target, isVo: true
        };

    } else {
        // --- КЛАССИЧЕСКАЯ ЛОГИКА ДЛЯ СРЕДНЕГО СПЕЦИАЛЬНОГО ОБРАЗОВАНИЯ (ССО) ---
        const name = getCell(sheet, offset + 10, 0);
        const plan = parseInt(getCell(sheet, offset + 10, 2), 10) || 0;
        const type = getCell(sheet, offset + 0, 2);
        const educationForm = getCell(sheet, offset + 2, 2);
        const base = getCell(sheet, offset + 4, 2);
        const duration = getCell(sheet, offset + 6, 2);
        const planTarget = parseInt(getCell(sheet, offset + 10, 3), 10) || 0;
        const total = parseInt(getCell(sheet, offset + 10, 75), 10) || 0;
        const targetTotal = parseInt(getCell(sheet, offset + 13, 75), 10) || 0;

        let applications = [];
        for (let col = 4, score = 10.0; col <= 74; col++, score = +(score - 0.1).toFixed(1)) {
            let count = parseInt(getCell(sheet, offset + 10, col), 10) || 0;
            if (count > 0) applications.push({ score: +score.toFixed(1), label: score.toFixed(1), count });
        }
        let lgota = [];
        for (let col = 4, score = 10.0; col <= 74; col++, score = +(score - 0.1).toFixed(1)) {
            let count = parseInt(getCell(sheet, offset + 12, col), 10) || 0;
            if (count > 0) lgota.push({ score: +score.toFixed(1), label: score.toFixed(1), count });
        }
        let target = [];
        for (let col = 4, score = 10.0; col <= 74; col++, score = +(score - 0.1).toFixed(1)) {
            let count = parseInt(getCell(sheet, offset + 13, col), 10) || 0;
            if (count > 0) target.push({ score: +score.toFixed(1), label: score.toFixed(1), count });
        }

        return {
            name, type, educationForm, base, duration, plan, planTarget,
            total, targetTotal, applications, lgota, target, isVo: false
        };
    }
}

// Генерация HTML-структуры под твой дизайн
function renderMonitoringPage(s) {
    const isVoMode = !!s.isVo;

    // Проверяем условия для вывода сообщения об отсутствии набора на платное отделение
    const noPaidExists = (typeof SPEC_OFFSET_PAID === 'undefined');
    const isPaidPlanZero = (s.plan === 0);

    if (currentCategory === 'paid' && (noPaidExists || isPaidPlanZero)) {
        return `
        <div class="spec-card">
            <h1 class="spec-title">${s.name}</h1>
            <div class="info-line">
                <strong>Прием:</strong>
                <div class="badge-container">
                    <button class="badge badge-budget ${currentCategory === 'budget' ? 'active' : ''}" onclick="switchCategory('budget')">за счет средств бюджета</button>
                    <button class="badge badge-paid ${currentCategory === 'paid' ? 'active' : ''}" onclick="switchCategory('paid')">на платной основе</button>
                </div>
            </div>
            <div class="info-line"><strong>Форма обучения:</strong> ${s.educationForm}</div>
            <div class="info-line"><strong>Прием осуществляется на основе:</strong> ${s.base}</div>
            <div class="info-line"><strong>Срок обучения:</strong> ${s.duration}</div>
            <div class="no-paid-msg">
                Набор на платной основе не осуществляется
            </div>
        </div>`;
    }

    let lgotaCount = 0;
    s.lgota.forEach(app => { lgotaCount += app.count; });

    const acceptedTargetCount = Math.min(s.targetTotal, s.planTarget);
    const planForCommon = Math.max(s.plan - lgotaCount - acceptedTargetCount, 0);

    let allApps = [];
    s.applications.forEach(app => { for (let i = 0; i < app.count; i++) allApps.push(app.score); });
    allApps.sort((a, b) => b - a);

    let totalApplications = 0;
    s.applications.forEach(app => { totalApplications += app.count; });

    let totalLgota = lgotaCount;
    let totalTarget = s.isVo ? s.targetTotal : 0;
    if (!s.isVo) {
        s.target.forEach(app => { totalTarget += app.count; });
    }

    let totalCommon = totalApplications;
    if (!isVoMode) {
        totalCommon = totalApplications - totalLgota - totalTarget;
        if (totalCommon < 0) totalCommon = 0;
    }

    let totalAll = isVoMode ? s.total : (totalCommon + totalLgota + totalTarget);

    let html = `
    <div class="spec-card">
        <h1 class="spec-title">${s.name}</h1>
        <div class="info-line">
            <strong>Прием:</strong>
            <div class="badge-container">
                <!-- Кнопки выбора категории (бюджет / платно) -->
                <button class="badge badge-budget ${currentCategory === 'budget' ? 'active' : ''}" onclick="switchCategory('budget')">за счет средств бюджета</button>
                <button class="badge badge-paid ${currentCategory === 'paid' ? 'active' : ''}" onclick="switchCategory('paid')">на платной основе</button>
            </div>
        </div>
        <div class="info-line"><strong>Форма обучения:</strong> ${s.educationForm}</div>
        <div class="info-line"><strong>Прием осуществляется на основе:</strong> ${s.base}</div>
        <div class="info-line"><strong>Срок обучения:</strong> ${s.duration}</div>
        <div class="info-line"><strong>План приема:</strong> ${s.plan} | <strong>Целевой план:</strong> ${s.planTarget}</div>
        <div class="stat-box">
            <div class="info-line"><strong>Всего заявлений подано:</strong> ${totalAll}</div>
            <div class="stat-row">По общему конкурсу: ${isVoMode ? (totalAll - totalLgota - totalTarget) : totalCommon}</div>
            <div class="stat-row">Льготные вне конкурса: ${totalLgota}</div>
            <div class="stat-row">Целевые: ${totalTarget}</div>
        </div>
    </div>`;

    if (s.applications.length > 0) {
        html += `\n<h2 class="section-title">Заявления по баллам:</h2>
        <div class="bar-table-wrapper"><table class="bar-table"><thead><tr>`;
        s.applications.forEach(a => html += `<th>${a.label}</th>`);
        html += `</tr></thead><tbody><tr>`;
        s.applications.forEach(a => {
            let cellClass = 'cell-red';
            if (planForCommon > 0) {
                if (allApps.length < planForCommon) {
                    cellClass = 'cell-green';
                } else if (allApps.length === planForCommon) {
                    cellClass = (a.score === allApps[allApps.length - 1]) ? 'cell-yellow' : 'cell-green';
                } else if (allApps.length > planForCommon) {
                    if (a.score > allApps[planForCommon - 1]) cellClass = 'cell-green';
                    else if (a.score === allApps[planForCommon - 1]) cellClass = 'cell-yellow';
                    else cellClass = 'cell-red';
                }
            }
            html += `<td class="${cellClass}">${a.count}</td>`;
        });
        html += `</tr></tbody></table></div>`;
    }

    if (!isVoMode && s.lgota.length > 0) {
        html += `\n<h2 class="section-title">Льготные вне конкурса по баллам:</h2>
        <div class="bar-table-wrapper" style="max-width: 250px;"><table class="bar-table"><thead><tr>`;
        s.lgota.forEach(a => html += `<th>${a.label}</th>`);
        html += `</tr></thead><tbody><tr>`;
        s.lgota.forEach(a => html += `<td class="cell-green">${a.count}</td>`);
        html += `</tr></tbody></table></div>`;
    }

    if (!isVoMode && s.target.length > 0) {
        let allTargetScores = [];
        s.target.forEach(app => { for (let i = 0; i < app.count; i++) allTargetScores.push(app.score); });
        allTargetScores.sort((a, b) => b - a);

        const coloredTarget = {
            colored: allTargetScores.map((score, idx) => {
                if (idx < s.planTarget - 1) return { score, color: 'cell-green' };
                if (idx === s.planTarget - 1) return { score, color: 'cell-yellow' };
                return { score, color: 'cell-red' };
            })
        };

        html += `\n<h2 class="section-title">Целевые по баллам:</h2>
        <div class="bar-table-wrapper" style="max-width: 150px;"><table class="bar-table"><thead><tr>`;
        s.target.forEach(a => html += `<th>${a.label}</th>`);
        html += `</tr></thead><tbody><tr>`;
        s.target.forEach(a => {
            let cellClass = '';
            let idxs = [];
            coloredTarget.colored.forEach((app, idx) => { if (app.score === a.score) idxs.push(idx); });
            if (idxs.length > 0) cellClass = coloredTarget.colored[idxs[0]].color;
            html += `<td class="${cellClass}">${a.count}</td>`;
        });
        html += `</tr></tbody></table></div>`;
    }

    return html;
}

// Загрузка конкретного листа и рендеринг страницы
async function loadAndRender(gid, offset) {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx&id=${SHEET_ID}&gid=${gid}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Ошибка загрузки");
        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const currentSpecData = parseBlock(sheet, offset);

        if (currentSpecData) {
            document.getElementById('monitor-content').innerHTML = renderMonitoringPage(currentSpecData);
            document.getElementById('loading-overlay').style.display = 'none';
            document.getElementById('monitor-content').style.display = 'block';
        }
    } catch (error) {
        console.error(error);
        document.getElementById('loading-overlay').innerHTML = `
            <div style="color: red; padding: 20px; font-weight: 500;">
                ⚠️ Ошибка загрузки данных мониторинга.
            </div>`;
    }
}

// Функция переключения направления приема (Бюджет / Платно)
async function switchCategory(category) {
    if (currentCategory === category) return;
    currentCategory = category;

    document.getElementById('monitor-content').style.display = 'none';
    document.getElementById('loading-overlay').style.display = 'block';
    document.getElementById('loading-overlay').innerHTML = `
        <div style="text-align: center; padding: 20px; color: #666; font-style: italic;">
            Загрузка данных...
        </div>`;

    let targetGid = '0';
    let targetOffset = 0;

    if (category === 'budget') {
        targetGid = typeof GID_BUDGET !== 'undefined' ? GID_BUDGET : (typeof GID !== 'undefined' ? GID : '0');
        targetOffset = typeof SPEC_OFFSET_BUDGET !== 'undefined' ? SPEC_OFFSET_BUDGET : (typeof SPEC_OFFSET !== 'undefined' ? SPEC_OFFSET : 0);
    } else {
        // Если платный офсет не определен, безопасно задействуем бюджетный офсет,
        // чтобы считать название специальности и корректно отрисовать заглушку "Нет набора"
        if (typeof SPEC_OFFSET_PAID === 'undefined') {
            targetGid = typeof GID_BUDGET !== 'undefined' ? GID_BUDGET : (typeof GID !== 'undefined' ? GID : '0');
            targetOffset = typeof SPEC_OFFSET_BUDGET !== 'undefined' ? SPEC_OFFSET_BUDGET : (typeof SPEC_OFFSET !== 'undefined' ? SPEC_OFFSET : 0);
        } else {
            targetGid = typeof GID_PAID !== 'undefined' ? GID_PAID : (typeof GID !== 'undefined' ? GID : '0');
            targetOffset = SPEC_OFFSET_PAID;
        }
    }

    await loadAndRender(targetGid, targetOffset);
}

// Первоначальный запуск при открытии страницы
async function initMonitoring() {
    const startGid = typeof GID_BUDGET !== 'undefined' ? GID_BUDGET : (typeof GID !== 'undefined' ? GID : '0');
    const startOffset = typeof SPEC_OFFSET_BUDGET !== 'undefined' ? SPEC_OFFSET_BUDGET : (typeof SPEC_OFFSET !== 'undefined' ? SPEC_OFFSET : 0);

    await loadAndRender(startGid, startOffset);
}

window.addEventListener('DOMContentLoaded', initMonitoring);

// Автоматическое исправление регистра кнопки "Назад" и удаление дублирующихся домиков
document.addEventListener('DOMContentLoaded', () => {
    // 1. Принудительно меняем строчную "← назад" на заглавную "← Назад"
    const backBtn = document.querySelector('.btn-back');
    if (backBtn) {
        backBtn.innerHTML = '← Назад';
    }

    // 2. Находим все кнопки "Домой" на странице и удаляем дубликаты (оставляем только первую)
    const homeButtons = document.querySelectorAll('.btn-home');
    if (homeButtons.length > 1) {
        for (let i = 1; i < homeButtons.length; i++) {
            homeButtons[i].remove();
        }
    }
});

// Автоматическое сохранение текущей страницы в историю просмотров
(function () {
    const specTitle = document.title;
    const specUrl = window.location.pathname;

    if (specTitle && specUrl && !specUrl.endsWith('index.html') && !specUrl.endsWith('/')) {
        let history = JSON.parse(localStorage.getItem('recently_viewed_specs')) || [];
        history = history.filter(item => item.url !== specUrl);
        history.unshift({ title: specTitle, url: specUrl });
        if (history.length > 3) {
            history.pop();
        }
        localStorage.setItem('recently_viewed_specs', JSON.stringify(history));
    }
})();
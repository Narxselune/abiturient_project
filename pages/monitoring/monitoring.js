// monitoring.js

// Глобальные переменные для переключения бюджета/платного
let currentCategory = 'budget';
let timerInterval = null;

// ==========================================================================
// НАСТРОЙКИ СРОКОВ ПРИЕМНОЙ КАМПАНИИ 2026
// (Вы можете менять эти даты для тестирования таймера)
// ==========================================================================
function getCampaignDates() {
    const isVo = typeof IS_VO !== 'undefined' && IS_VO;
    const year = 2026; // Расчетный год

    let startDate, endDate, startLabel;

    // Обратите внимание: месяцы в JS Date начинаются с 0 (0 - январь, 6 - июль, 7 - август)
    if (isVo) {
        // --- ВЫСШЕЕ ОБРАЗОВАНИЕ (ВО) ---
        if (currentCategory === 'budget') {
            // Бюджет ВО: с 17 июля по 25 июля включительно (отсчет до 26 июля)
            startDate = new Date(year, 6, 17, 9, 0, 0);   // <<< НАЧАЛО ПРИЕМА ВО БЮДЖЕТ (17 июля 09:00)
            endDate = new Date(year, 6, 26, 0, 0, 0);     // <<< КОНЕЦ ПРИЕМА ВО БЮДЖЕТ (по 25 июля включительно)
            startLabel = "17 июля";
        } else {
            // Платно ВО: с 17 июля по 2 августа включительно (отсчет до 3 августа)
            startDate = new Date(year, 6, 17, 9, 0, 0);   // <<< НАЧАЛО ПРИЕМА ВО ПЛАТНО (17 июля 09:00)
            endDate = new Date(year, 7, 3, 0, 0, 0);      // <<< КОНЕЦ ПРИЕМА ВО ПЛАТНО (по 2 августа включительно)
            startLabel = "17 июля";
        }
    } else {
        // --- СРЕДНЕЕ СПЕЦИАЛЬНОЕ ОБРАЗОВАНИЕ (ССО) ---
        if (currentCategory === 'budget') {
            // Бюджет ССО: с 20 июля по 3августа включительно (отсчет до 4 августа)
            startDate = new Date(year, 6, 20, 9, 0, 0);   // <<< НАЧАЛО ПРИЕМА ССО БЮДЖЕТ (20 июля 09:00)
            endDate = new Date(year, 7, 4, 0, 0, 0);      // <<< КОНЕЦ ПРИЕМА ССО БЮДЖЕТ (по 3 августа включительно)
            startLabel = "20 июля";
        } else {
            // Платно ССО: с 20 июля по 14 августа включительно (отсчет до 15 августа)
            startDate = new Date(year, 6, 20, 9, 0, 0);   // <<< НАЧАЛО ПРИЕМА ССО ПЛАТНО (20 июля 09:00)
            endDate = new Date(year, 7, 15, 0, 0, 0);     // <<< КОНЕЦ ПРИЕМА ССО ПЛАТНО (по 14 августа включительно)
            startLabel = "20 июля";
        }
    }

    return { startDate, endDate, startLabel };
}
// ==========================================================================

// Запуск и обновление обратного отсчета
function startCountdown() {
    if (timerInterval) clearInterval(timerInterval);

    const timerEl = document.getElementById('countdown-timer');
    if (!timerEl) return;

    const update = () => {
        const { startDate, endDate, startLabel } = getCampaignDates();
        const now = new Date();

        // 1. Состояние: Прием документов еще не начался
        if (now < startDate) {
            timerEl.className = 'countdown-timer not-started';
            timerEl.innerHTML = `
                <svg class="timer-icon" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                Прием документов начнется ${startLabel}
            `;
            return;
        }

        const diff = endDate - now;

        // 2. Состояние: Прием документов завершен
        if (diff <= 0) {
            timerEl.className = 'countdown-timer expired';
            timerEl.innerHTML = `
                <svg class="timer-icon" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                Прием документов завершен
            `;
            return;
        }

        // 3. Состояние: Активный прием документов
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        timerEl.className = 'countdown-timer';
        timerEl.innerHTML = `
            <svg class="timer-icon" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            До конца приема: ${days}д ${hours}ч ${minutes}м ${seconds}с
        `;
    };

    update();
    timerInterval = setInterval(update, 1000);
}

// Встраивание элемента таймера в шапку страницы
function injectTimerElement() {
    const header = document.querySelector('header');
    if (!header) return;

    let timerEl = document.getElementById('countdown-timer');
    if (!timerEl) {
        timerEl = document.createElement('div');
        timerEl.id = 'countdown-timer';
        timerEl.className = 'countdown-timer';
        header.appendChild(timerEl);
    }

    startCountdown();
}

// Чтение ячейки Excel
function getCell(sheet, r, c) {
    const addr = XLSX.utils.encode_cell({ r, c });
    return sheet[addr] ? sheet[addr].v : '';
}

// Вспомогательная функция: проверяет, объединена ли ячейка по вертикали, и находит суммарный план
function getGroupedPlans(sheet, currentOffset) {
    let totalPlan = 0;
    let totalPlanTarget = 0;
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
        totalPlanTarget += parseInt(getCell(sheet, r, 5), 10) || 0;
    }

    return {
        sumPlan: totalPlan,
        sumPlanTarget: totalPlanTarget,
        dataRow: startRow
    };
}

// Парсинг данных из Excel
function parseBlock(sheet, offset) {
    const isVoMode = typeof IS_VO !== 'undefined' && IS_VO;

    if (isVoMode) {
        // --- ЛОГИКА ДЛЯ ВЫСШЕГО ОБРАЗОВАНИЯ (ВО) ---
        const maxScore = typeof VO_MAX_SCORE !== 'undefined' ? VO_MAX_SCORE : 400;
        const groupInfo = getGroupedPlans(sheet, offset);

        let rawName = getCell(sheet, offset, 3);
        const name = rawName.replace(/\s*\(.*?\)\s*/g, '').trim();

        const plan = groupInfo.sumPlan;
        const planTarget = groupInfo.sumPlanTarget;

        const mainRow = groupInfo.dataRow;
        const total = parseInt(getCell(sheet, mainRow, 6), 10) || 0;

        const targetTotal = parseInt(getCell(sheet, mainRow, 7), 10) || 0;
        const noExamsTotal = parseInt(getCell(sheet, mainRow, 8), 10) || 0;
        const outOfCompetitionTotal = parseInt(getCell(sheet, mainRow, 9), 10) || 0;
        const totalLgota = noExamsTotal + outOfCompetitionTotal;

        let applications = [];
        let startCol = 12;
        let currentMax = maxScore;

        const headerRowIndex = maxScore === 300 ? 63 : 31;

        for (let col = startCol; col <= 100; col++) {
            let count = parseInt(getCell(sheet, mainRow, col), 10) || 0;
            let rawHeader = getCell(sheet, headerRowIndex, col);
            let label = rawHeader ? rawHeader.toString().trim() : "";

            if (!label) {
                break;
            }

            if (count > 0) {
                applications.push({ score: currentMax, label: label, count });
            }
            currentMax -= 5;
            if (currentMax < 0) break;
        }

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
        const duration = typeof DURATION !== 'undefined' ? DURATION : (maxScore === 300 ? "3-3.5 года" : "4 года");

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

// Генерация HTML-структуры под дизайн
function renderMonitoringPage(s) {
    const isVoMode = !!s.isVo;
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

            // Проверяем, активен ли прием для выбранной вкладки (бюджет/платно)
            const noPaidExists = (typeof SPEC_OFFSET_PAID === 'undefined');
            const isPaidPlanZero = (currentSpecData.plan === 0);
            const isPaidNotActive = (currentCategory === 'paid' && (noPaidExists || isPaidPlanZero));

            if (isPaidNotActive) {
                // Если прием на платной основе не осуществляется, удаляем таймер
                const existingTimer = document.getElementById('countdown-timer');
                if (existingTimer) existingTimer.remove();
                if (timerInterval) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                }
            } else {
                // Иначе встраиваем таймер в шапку
                injectTimerElement();
            }
        }
    } catch (error) {
        console.error(error);
        document.getElementById('loading-overlay').innerHTML = `
            <div style="color: red; padding: 20px; font-weight: 500;">
                ⚠️ Ошибка загрузки данных мониторинга.
            </div>`;
    }
}

// Функция переключения направления приема
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

// Первоначальный запуск
async function initMonitoring() {
    const startGid = typeof GID_BUDGET !== 'undefined' ? GID_BUDGET : (typeof GID !== 'undefined' ? GID : '0');
    const startOffset = typeof SPEC_OFFSET_BUDGET !== 'undefined' ? SPEC_OFFSET_BUDGET : (typeof SPEC_OFFSET !== 'undefined' ? SPEC_OFFSET : 0);

    await loadAndRender(startGid, startOffset);
}

window.addEventListener('DOMContentLoaded', initMonitoring);

// Автоматическое исправление интерфейса
document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.querySelector('.btn-back');
    if (backBtn) {
        backBtn.innerHTML = '← Назад';
    }

    const homeButtons = document.querySelectorAll('.btn-home');
    if (homeButtons.length > 1) {
        for (let i = 1; i < homeButtons.length; i++) {
            homeButtons[i].remove();
        }
    }
});

// Сохранение в историю просмотров
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
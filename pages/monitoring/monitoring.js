// Переменная GID берется из настроек конкретной страницы (если задана) или по умолчанию 0
const CURRENT_GID = typeof GID !== 'undefined' ? GID : '0';
const XLSX_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx&id=${SHEET_ID}&gid=${CURRENT_GID}`;

// Чтение ячейки Excel
function getCell(sheet, r, c) {
    const addr = XLSX.utils.encode_cell({ r, c });
    return sheet[addr] ? sheet[addr].v : '';
}

// Парсинг данных из Excel
function parseBlock(sheet, offset) {
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
        if (count > 0) applications.push({ score: +score.toFixed(1), count });
    }
    let lgota = [];
    for (let col = 4, score = 10.0; col <= 74; col++, score = +(score - 0.1).toFixed(1)) {
        let count = parseInt(getCell(sheet, offset + 12, col), 10) || 0;
        if (count > 0) lgota.push({ score: +score.toFixed(1), count });
    }
    let target = [];
    for (let col = 4, score = 10.0; col <= 74; col++, score = +(score - 0.1).toFixed(1)) {
        let count = parseInt(getCell(sheet, offset + 13, col), 10) || 0;
        if (count > 0) target.push({ score: +score.toFixed(1), count });
    }

    return { name, type, educationForm, base, duration, plan, planTarget, total, targetTotal, applications, lgota, target };
}

// Генерация HTML-структуры под твой дизайн
function renderMonitoringPage(s) {
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
    let totalTarget = 0;
    s.target.forEach(app => { totalTarget += app.count; });
    let totalCommon = totalApplications - totalLgota - totalTarget;
    if (totalCommon < 0) totalCommon = 0;
    let totalAll = totalCommon + totalLgota + totalTarget;

    let html = `
    <div class="spec-card">
        <h1 class="spec-title">${s.name}</h1>
        <div class="info-line">
            <strong>Прием:</strong>
            <div class="badge-container">
                <span class="badge badge-budget">за счет средств бюджета</span>
                <span class="badge badge-paid">на платной основе</span>
            </div>
        </div>
        <div class="info-line"><strong>Форма обучения:</strong> ${s.educationForm}</div>
        <div class="info-line"><strong>Прием осуществляется на основе:</strong> ${s.base}</div>
        <div class="info-line"><strong>Срок обучения:</strong> ${s.duration}</div>
        <div class="info-line"><strong>План приема:</strong> ${s.plan} | <b>Целевой план:</b> ${s.planTarget}</div>
        <div class="stat-box">
            <div class="stat-title">Всего заявлений подано: ${totalAll}</div>
            <div class="stat-row">По общему конкурсу: ${totalCommon}</div>
            <div class="stat-row">Льготные вне конкурса: ${totalLgota}</div>
            <div class="stat-row">Целевые: ${totalTarget}</div>
        </div>
    </div>`;

    if (s.applications.length > 0) {
        html += `\n<h2 class="section-title">Заявления по баллам:</h2>
        <div class="bar-table-wrapper"><table class="bar-table"><thead><tr>`;
        s.applications.forEach(a => html += `<th>${a.score.toFixed(1)}</th>`);
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

    if (s.lgota.length > 0) {
        html += `\n<h2 class="section-title">Льготные вне конкурса по баллам:</h2>
        <div class="bar-table-wrapper" style="max-width: 250px;"><table class="bar-table"><thead><tr>`;
        s.lgota.forEach(a => html += `<th>${a.score.toFixed(1)}</th>`);
        html += `</tr></thead><tbody><tr>`;
        s.lgota.forEach(a => html += `<td class="cell-green">${a.count}</td>`);
        html += `</tr></tbody></table></div>`;
    }

    if (s.target.length > 0) {
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
        s.target.forEach(a => html += `<th>${a.score.toFixed(1)}</th>`);
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

// Запуск при загрузке
async function initMonitoring() {
    try {
        const response = await fetch(XLSX_URL);
        if (!response.ok) throw new Error("Ошибка загрузки");

        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const currentSpecData = parseBlock(sheet, SPEC_OFFSET);

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

window.addEventListener('DOMContentLoaded', initMonitoring);
// ==================== 学习日历功能 ====================

// 获取今天的日期字符串 YYYY-MM-DD
function getTodayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// 初始化今天的学习记录
function initTodayRecord() {
    const today = getTodayDateString();
    if (!AppState.studyCalendar[today]) {
        AppState.studyCalendar[today] = {
            date: today,
            learnCount: 0,      // 背单词数量
            testCount: 0,       // 测试单词数量
            challengeCount: 0,  // 挑战模式数量
            totalScore: 0,      // 总得分
            correctCount: 0,    // 正确数量
            wrongCount: 0,      // 错误数量
            slashedCount: 0,    // 斩词数量
            studyMinutes: 0,    // 学习时长（分钟）
            startTime: Date.now()
        };
    }
    return AppState.studyCalendar[today];
}

// 更新今天的学习记录
function updateTodayRecord(updates) {
    const today = getTodayDateString();
    const record = initTodayRecord();
    
    Object.keys(updates).forEach(key => {
        if (key === 'learnCount' || key === 'testCount' || key === 'challengeCount' || 
            key === 'correctCount' || key === 'wrongCount' || key === 'slashedCount') {
            record[key] += updates[key];
        } else if (key === 'totalScore') {
            record[key] += updates[key];
        } else {
            record[key] = updates[key];
        }
    });
    
    // 计算学习时长
    if (record.startTime) {
        record.studyMinutes = Math.floor((Date.now() - record.startTime) / 60000);
    }
    
    saveStudyCalendar();
    return record;
}

// 保存学习日历到本地存储
function saveStudyCalendar() {
    try {
        localStorage.setItem('studyCalendar', JSON.stringify(AppState.studyCalendar));
    } catch (error) {
        console.warn('保存学习日历失败:', error);
    }
}

// 加载学习日历
function loadStudyCalendar() {
    try {
        const saved = localStorage.getItem('studyCalendar');
        if (saved) {
            AppState.studyCalendar = JSON.parse(saved);
            console.log('已加载学习日历数据');
        }
    } catch (error) {
        console.warn('加载学习日历失败:', error);
        AppState.studyCalendar = {};
    }
}

// 显示学习日历
function showStudyCalendar() {
    document.getElementById('studyCalendar').classList.remove('hidden');
    renderCalendar();
    updateCalendarStats();
}

// 关闭学习日历
function closeStudyCalendar() {
    document.getElementById('studyCalendar').classList.add('hidden');
}

// 渲染日历
function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYear = document.getElementById('currentMonthYear');
    
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // 设置月份标题
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                        '七月', '八月', '九月', '十月', '十一月', '十二月'];
    currentMonthYear.textContent = `${year}年 ${monthNames[month]}`;
    
    // 获取本月第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0=周日, 1=周一, ...
    
    // 清空日历
    calendarGrid.innerHTML = '';
    
    // 添加星期标题
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    weekDays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // 添加空白日期（本月1号之前的）
    for (let i = 0; i < startDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // 添加本月每一天
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = AppState.studyCalendar[dateStr];
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // 判断是否是今天
        if (dateStr === getTodayDateString()) {
            dayElement.classList.add('today');
        }
        
        // 判断是否有学习记录
        if (dayData && (dayData.learnCount > 0 || dayData.testCount > 0 || dayData.challengeCount > 0)) {
            dayElement.classList.add('has-data');
            
            // 根据学习量设置不同的强度等级
            const totalWords = dayData.learnCount + dayData.testCount + dayData.challengeCount;
            if (totalWords >= 50) {
                dayElement.classList.add('level-high');
            } else if (totalWords >= 20) {
                dayElement.classList.add('level-medium');
            } else {
                dayElement.classList.add('level-low');
            }
        }
        
        dayElement.innerHTML = `
            <div class="day-number">${day}</div>
            ${dayData ? `<div class="day-indicator">✨</div>` : ''}
        `;
        
        // 点击显示详情
        dayElement.addEventListener('click', () => showDayDetail(dateStr, dayData));
        
        calendarGrid.appendChild(dayElement);
    }
}

// 显示某一天的详细信息
function showDayDetail(dateStr, dayData) {
    const detailPanel = document.getElementById('dayDetailPanel');
    const detailContent = document.getElementById('dayDetailContent');
    
    if (!dayData) {
        detailContent.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">📅</div>
                <p>这一天还没有学习记录哦~</p>
            </div>
        `;
    } else {
        const accuracy = dayData.testCount > 0 
            ? Math.round((dayData.correctCount / (dayData.correctCount + dayData.wrongCount)) * 100) 
            : 0;
        
        detailContent.innerHTML = `
            <div class="day-detail-header">
                <h3>📅 ${dateStr}</h3>
            </div>
            <div class="day-stats-grid">
                <div class="day-stat-item">
                    <div class="stat-icon">📚</div>
                    <div class="stat-info">
                        <div class="stat-value">${dayData.learnCount}</div>
                        <div class="stat-label">背单词</div>
                    </div>
                </div>
                <div class="day-stat-item">
                    <div class="stat-icon">✍️</div>
                    <div class="stat-info">
                        <div class="stat-value">${dayData.testCount}</div>
                        <div class="stat-label">测试</div>
                    </div>
                </div>
                <div class="day-stat-item">
                    <div class="stat-icon">⚡</div>
                    <div class="stat-info">
                        <div class="stat-value">${dayData.challengeCount}</div>
                        <div class="stat-label">挑战</div>
                    </div>
                </div>
                <div class="day-stat-item">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-info">
                        <div class="stat-value">${dayData.totalScore}</div>
                        <div class="stat-label">得分</div>
                    </div>
                </div>
                <div class="day-stat-item">
                    <div class="stat-icon">✅</div>
                    <div class="stat-info">
                        <div class="stat-value">${dayData.correctCount}</div>
                        <div class="stat-label">正确</div>
                    </div>
                </div>
                <div class="day-stat-item">
                    <div class="stat-icon">❌</div>
                    <div class="stat-info">
                        <div class="stat-value">${dayData.wrongCount}</div>
                        <div class="stat-label">错误</div>
                    </div>
                </div>
                <div class="day-stat-item">
                    <div class="stat-icon">⚔️</div>
                    <div class="stat-info">
                        <div class="stat-value">${dayData.slashedCount}</div>
                        <div class="stat-label">斩词</div>
                    </div>
                </div>
                <div class="day-stat-item">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-info">
                        <div class="stat-value">${dayData.studyMinutes}</div>
                        <div class="stat-label">分钟</div>
                    </div>
                </div>
                ${dayData.testCount > 0 ? `
                <div class="day-stat-item accuracy">
                    <div class="stat-icon">💯</div>
                    <div class="stat-info">
                        <div class="stat-value">${accuracy}%</div>
                        <div class="stat-label">正确率</div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    detailPanel.classList.remove('hidden');
}

// 关闭日期详情面板
function closeDayDetail() {
    document.getElementById('dayDetailPanel').classList.add('hidden');
}

// 更新日历统计信息
function updateCalendarStats() {
    const dates = Object.keys(AppState.studyCalendar);
    const totalDays = dates.length;
    
    let totalWords = 0;
    let totalScore = 0;
    let totalMinutes = 0;
    
    dates.forEach(date => {
        const data = AppState.studyCalendar[date];
        totalWords += data.learnCount + data.testCount + data.challengeCount;
        totalScore += data.totalScore;
        totalMinutes += data.studyMinutes;
    });
    
    document.getElementById('totalStudyDays').textContent = totalDays;
    document.getElementById('totalStudyWords').textContent = totalWords;
    document.getElementById('totalStudyScore').textContent = totalScore;
    document.getElementById('totalStudyMinutes').textContent = totalMinutes;
}

// 更新日历按钮的提示红点
function updateCalendarNotification() {
    const today = getTodayDateString();
    const todayData = AppState.studyCalendar[today];
    const calendarBtn = document.querySelector('.calendar-btn');
    
    if (calendarBtn) {
        // 如果今天有学习记录，显示红点
        if (todayData && (todayData.learnCount > 0 || todayData.testCount > 0)) {
            calendarBtn.classList.add('has-notification');
        } else {
            calendarBtn.classList.remove('has-notification');
        }
    }
}

// 导出日历数据为CSV
function exportCalendarData() {
    const dates = Object.keys(AppState.studyCalendar).sort();
    if (dates.length === 0) {
        alert('还没有学习记录哦~');
        return;
    }
    
    let csv = '日期,背单词,测试,挑战,得分,正确,错误,斩词,学习时长(分钟)\n';
    
    dates.forEach(date => {
        const data = AppState.studyCalendar[date];
        csv += `${date},${data.learnCount},${data.testCount},${data.challengeCount},${data.totalScore},${data.correctCount},${data.wrongCount},${data.slashedCount},${data.studyMinutes}\n`;
    });
    
    // 下载CSV文件
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `学习日历_${getTodayDateString()}.csv`;
    link.click();
    
    showToast('导出成功！', 'success');
}

// 清空日历数据
function confirmClearCalendar() {
    if (confirm('确定要清空所有学习日历数据吗？此操作不可恢复！')) {
        AppState.studyCalendar = {};
        saveStudyCalendar();
        renderCalendar();
        updateCalendarStats();
        showToast('日历数据已清空', 'info');
    }
}

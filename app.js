// 应用状态管理
const AppState = {
    currentMode: null, // 'learn', 'test', 'challenge', 'wrongbook-learn', 'wrongbook-test'
    selectedCategories: [],
    wordList: [],
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    knownWords: [],
    unknownWords: [],
    timer: null,
    timeLeft: 60,
    combo: 0,
    importedFile: null,
    parsedData: null,
    slashedWords: new Set(), // 已斩词的单词集合 (存储单词的小写形式)
    slashedWordsData: [], // 已斩词的完整数据 (用于显示和恢复)
    wrongWords: new Set(), // 错误单词集合 (存储单词的小写形式)
    wrongWordsData: [], // 错误单词的完整数据
    wordLimit: null, // 单词数量限制（null表示不限制）
    studyCalendar: {} // 学习日历数据 { '2025-11-26': { learnCount, testCount, score, wrongCount, ... } }
};

// 单词数据库 - 示例数据
const WordDatabase = {
    "个人情况": [
        { word: "name", phonetic: "/neɪm/", translation: "名字", example: "My name is Tom. 我的名字是汤姆。" },
        { word: "age", phonetic: "/eɪdʒ/", translation: "年龄", example: "I am 10 years old. 我10岁了。" },
        { word: "boy", phonetic: "/bɔɪ/", translation: "男孩", example: "He is a boy. 他是一个男孩。" },
        { word: "girl", phonetic: "/ɡɜːl/", translation: "女孩", example: "She is a girl. 她是一个女孩。" }
    ],
    "家庭与朋友": [
        { word: "family", phonetic: "/ˈfæməli/", translation: "家庭", example: "I love my family. 我爱我的家人。" },
        { word: "father", phonetic: "/ˈfɑːðə/", translation: "父亲", example: "My father is a teacher. 我爸爸是老师。" },
        { word: "mother", phonetic: "/ˈmʌðə/", translation: "母亲", example: "My mother cooks well. 我妈妈做饭很好。" },
        { word: "friend", phonetic: "/frend/", translation: "朋友", example: "She is my friend. 她是我的朋友。" }
    ],
    "身体部位": [
        { word: "head", phonetic: "/hed/", translation: "头", example: "I have a big head. 我有一个大脑袋。" },
        { word: "eye", phonetic: "/aɪ/", translation: "眼睛", example: "I have two eyes. 我有两只眼睛。" },
        { word: "ear", phonetic: "/ɪə/", translation: "耳朵", example: "My ears are big. 我的耳朵很大。" },
        { word: "nose", phonetic: "/nəʊz/", translation: "鼻子", example: "My nose is small. 我的鼻子很小。" },
        { word: "mouth", phonetic: "/maʊθ/", translation: "嘴巴", example: "Open your mouth. 张开你的嘴巴。" },
        { word: "hand", phonetic: "/hænd/", translation: "手", example: "Wash your hands. 洗你的手。" },
        { word: "foot", phonetic: "/fʊt/", translation: "脚", example: "My foot hurts. 我的脚受伤了。" }
    ],
    "食物与饮料": [
        { word: "apple", phonetic: "/ˈæpl/", translation: "苹果", example: "I like apples. 我喜欢苹果。" },
        { word: "banana", phonetic: "/bəˈnɑːnə/", translation: "香蕉", example: "The banana is yellow. 香蕉是黄色的。" },
        { word: "milk", phonetic: "/mɪlk/", translation: "牛奶", example: "I drink milk every day. 我每天喝牛奶。" },
        { word: "water", phonetic: "/ˈwɔːtə/", translation: "水", example: "Water is important. 水很重要。" },
        { word: "bread", phonetic: "/bred/", translation: "面包", example: "I eat bread for breakfast. 我早餐吃面包。" },
        { word: "cake", phonetic: "/keɪk/", translation: "蛋糕", example: "The cake is delicious. 蛋糕很好吃。" }
    ],
    "动物": [
        { word: "cat", phonetic: "/kæt/", translation: "猫", example: "I have a cat. 我有一只猫。" },
        { word: "dog", phonetic: "/dɒɡ/", translation: "狗", example: "The dog is cute. 这只狗很可爱。" },
        { word: "bird", phonetic: "/bɜːd/", translation: "鸟", example: "The bird can fly. 鸟会飞。" },
        { word: "fish", phonetic: "/fɪʃ/", translation: "鱼", example: "Fish live in water. 鱼生活在水里。" },
        { word: "elephant", phonetic: "/ˈelɪfənt/", translation: "大象", example: "The elephant is big. 大象很大。" },
        { word: "tiger", phonetic: "/ˈtaɪɡə/", translation: "老虎", example: "The tiger is strong. 老虎很强壮。" }
    ],
    "颜色": [
        { word: "red", phonetic: "/red/", translation: "红色", example: "The apple is red. 苹果是红色的。" },
        { word: "blue", phonetic: "/bluː/", translation: "蓝色", example: "The sky is blue. 天空是蓝色的。" },
        { word: "green", phonetic: "/ɡriːn/", translation: "绿色", example: "The grass is green. 草是绿色的。" },
        { word: "yellow", phonetic: "/ˈjeləʊ/", translation: "黄色", example: "The sun is yellow. 太阳是黄色的。" },
        { word: "black", phonetic: "/blæk/", translation: "黑色", example: "My hair is black. 我的头发是黑色的。" },
        { word: "white", phonetic: "/waɪt/", translation: "白色", example: "Snow is white. 雪是白色的。" }
    ],
    "数字": [
        { word: "one", phonetic: "/wʌn/", translation: "一", example: "I have one book. 我有一本书。" },
        { word: "two", phonetic: "/tuː/", translation: "二", example: "I have two eyes. 我有两只眼睛。" },
        { word: "three", phonetic: "/θriː/", translation: "三", example: "There are three apples. 有三个苹果。" },
        { word: "four", phonetic: "/fɔː/", translation: "四", example: "I have four pencils. 我有四支铅笔。" },
        { word: "five", phonetic: "/faɪv/", translation: "五", example: "Five fingers on one hand. 一只手有五个手指。" },
        { word: "ten", phonetic: "/ten/", translation: "十", example: "I am ten years old. 我十岁了。" }
    ],
    "学校用品": [
        { word: "book", phonetic: "/bʊk/", translation: "书", example: "This is my book. 这是我的书。" },
        { word: "pen", phonetic: "/pen/", translation: "钢笔", example: "I write with a pen. 我用钢笔写字。" },
        { word: "pencil", phonetic: "/ˈpensl/", translation: "铅笔", example: "I have a red pencil. 我有一支红铅笔。" },
        { word: "ruler", phonetic: "/ˈruːlə/", translation: "尺子", example: "Use the ruler to draw. 用尺子画。" },
        { word: "bag", phonetic: "/bæɡ/", translation: "书包", example: "My bag is heavy. 我的书包很重。" }
    ]
};

// 获取话题图标 - 宝可梦主题
function getCategoryIcon(category) {
    const icons = {
        "个人情况": "⚡",      // 皮卡丘
        "家庭与朋友": "💖",    // 爱心
        "身体部位": "🌟",      // 星星
        "食物与饮料": "🍎",    // 苹果
        "动物": "🐉",          // 龙（喷火龙）
        "颜色": "🌈",          // 彩虹
        "数字": "💎",          // 钻石
        "学校用品": "🎒"       // 书包
    };
    return icons[category] || "✨";
}

// 初始化话题分类
function initializeCategories() {
    const categoryGrid = document.getElementById('categoryGrid');
    categoryGrid.innerHTML = '';
    
    Object.keys(WordDatabase).forEach(category => {
        const count = WordDatabase[category].length;
        const item = document.createElement('div');
        item.className = 'category-item';
        item.onclick = () => toggleCategory(category, item);
        item.innerHTML = `
            <div class="category-icon">${getCategoryIcon(category)}</div>
            <div class="category-name">${category}</div>
            <div class="category-count">${count}个单词</div>
        `;
        categoryGrid.appendChild(item);
    });
}

// 切换话题选择
function toggleCategory(category, element) {
    const index = AppState.selectedCategories.indexOf(category);
    if (index > -1) {
        AppState.selectedCategories.splice(index, 1);
        element.classList.remove('selected');
    } else {
        AppState.selectedCategories.push(category);
        element.classList.add('selected');
    }
}

// 显示话题选择界面
function showCategorySelection(mode) {
    AppState.currentMode = mode;
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('categorySelection').classList.remove('hidden');
    initializeCategories();
}

// 返回主菜单
function backToMainMenu() {
    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('categorySelection').classList.add('hidden');
    document.getElementById('learnMode').classList.add('hidden');
    document.getElementById('testMode').classList.add('hidden');
    document.getElementById('challengeMode').classList.add('hidden');
    document.getElementById('resultScreen').classList.add('hidden');
    resetAppState();
}

// 重置应用状态
function resetAppState() {
    AppState.selectedCategories = [];
    AppState.wordList = [];
    AppState.currentIndex = 0;
    AppState.score = 0;
    AppState.correctCount = 0;
    AppState.wrongCount = 0;
    AppState.knownWords = [];
    AppState.unknownWords = [];
    AppState.combo = 0;
    AppState.wordLimit = null;
    if (AppState.timer) {
        clearInterval(AppState.timer);
        AppState.timer = null;
    }
}

// 获取全量词库（所有话题的所有单词）
function getAllWords() {
    const allWords = [];
    Object.values(WordDatabase).forEach(words => {
        allWords.push(...words);
    });
    return allWords;
}

// 开始学习（优化版：支持只输入数量，从全量词库选择）
function startLearning() {
    // 获取单词数量限制
    const wordLimitInput = document.getElementById('wordLimitInput');
    const wordLimit = wordLimitInput && wordLimitInput.value ? parseInt(wordLimitInput.value) : null;
    
    if (wordLimit !== null && wordLimit <= 0) {
        alert('请输入有效的单词数量（大于0）！');
        return;
    }
    
    // 收集单词：如果输入了数量，从全量词库选择；否则需要选择话题
    if (wordLimit !== null && wordLimit > 0) {
        // 从全量词库中随机选择指定数量的单词
        AppState.wordList = getAllWords();
    } else if (AppState.selectedCategories.length > 0) {
        // 使用选中的话题
        AppState.wordList = [];
        AppState.selectedCategories.forEach(category => {
            AppState.wordList.push(...WordDatabase[category]);
        });
    } else {
        // 既没有输入数量，也没有选择话题
        alert('请输入单词数量或选择话题分类！');
        return;
    }
    
    // 过滤已斩词的单词
    AppState.wordList = filterSlashedWords(AppState.wordList);
    
    if (AppState.wordList.length === 0) {
        alert('所选单词都已被斩词，请取回已斩词的单词！');
        return;
    }
    
    // 打乱单词顺序
    AppState.wordList = shuffleArray(AppState.wordList);
    
    // 如果指定了数量限制，随机选择指定数量的单词
    if (wordLimit !== null && wordLimit < AppState.wordList.length) {
        AppState.wordList = AppState.wordList.slice(0, wordLimit);
    }
    
    AppState.currentIndex = 0;
    
    document.getElementById('categorySelection').classList.add('hidden');
    
    if (AppState.currentMode === 'learn') {
        startLearnMode();
    } else if (AppState.currentMode === 'test') {
        startTestMode();
    } else if (AppState.currentMode === 'challenge') {
        startChallengeMode();
    }
}

// 打乱数组
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// ==================== 背单词模式 ====================
function startLearnMode() {
    document.getElementById('learnMode').classList.remove('hidden');
    displayCurrentWord();
}

function displayCurrentWord() {
    if (AppState.currentIndex >= AppState.wordList.length) {
        showResults();
        return;
    }
    
    const word = AppState.wordList[AppState.currentIndex];
    document.getElementById('currentWord').textContent = word.word;
    document.getElementById('phonetic').textContent = word.phonetic;
    document.getElementById('translation').textContent = word.translation;
    document.getElementById('example').textContent = word.example;
    document.getElementById('cardCounter').textContent = 
        `${AppState.currentIndex + 1}/${AppState.wordList.length}`;
    
    updateProgress();
}

function markAsKnown() {
    AppState.knownWords.push(AppState.wordList[AppState.currentIndex]);
    AppState.score += 10;
    updateScore();
    nextWord();
}

function markAsUnknown() {
    const currentWordData = AppState.wordList[AppState.currentIndex];
    AppState.unknownWords.push(currentWordData);
    
    // 添加到错词本
    addToWrongBook(currentWordData);
    
    nextWord();
}

























// 查找单词所属分类
function findWordCategory(word) {
    for (const [category, words] of Object.entries(WordDatabase)) {
        if (words.some(w => w.word.toLowerCase() === word.toLowerCase())) {
            return category;
        }
    }
    return '未分类';
}

function nextWord() {
    AppState.currentIndex++;
    displayCurrentWord();
}

// ==================== 检查模式 ====================
function startTestMode() {
    document.getElementById('testMode').classList.remove('hidden');
    displayTestWord();
}

function displayTestWord() {
    if (AppState.currentIndex >= AppState.wordList.length) {
        showResults();
        return;
    }
    
    const word = AppState.wordList[AppState.currentIndex];
    document.getElementById('testTranslation').textContent = word.translation;
    document.getElementById('testCounter').textContent = 
        `${AppState.currentIndex + 1}/${AppState.wordList.length}`;
    document.getElementById('correctCount').textContent = AppState.correctCount;
    document.getElementById('wordInput').value = '';
    document.getElementById('wordInput').focus();
    document.getElementById('testFeedback').classList.add('hidden');
    
    updateProgress();
}

function checkAnswer() {
    const userInput = document.getElementById('wordInput').value.trim().toLowerCase();
    const correctWord = AppState.wordList[AppState.currentIndex].word.toLowerCase();
    const currentWordData = AppState.wordList[AppState.currentIndex];
    const feedback = document.getElementById('testFeedback');
    const feedbackContent = feedback.querySelector('.feedback-content');
    
    if (userInput === '') {
        alert('请输入单词！');
        return;
    }
    
    if (userInput === correctWord) {
        feedback.className = 'test-feedback correct';
        feedbackContent.innerHTML = `
            <div style=\"font-size: 48px; margin-bottom: 10px;\">✅</div>
            <div>太棒了！答对了！</div>
            <div class=\"correct-answer\">${currentWordData.word}</div>
        `;
        AppState.correctCount++;
        AppState.score += 20;
    } else {
        feedback.className = 'test-feedback wrong';
        feedbackContent.innerHTML = `
            <div style=\"font-size: 48px; margin-bottom: 10px;\">❌</div>
            <div>答错了，再接再厉！</div>
            <div class=\"wrong-answer\">你的答案: ${userInput}</div>
            <div class=\"correct-answer\">正确答案: ${currentWordData.word}</div>
        `;
        AppState.wrongCount++;
        
        // 添加到错词本
        addToWrongBook(currentWordData);
        
        // 添加抖动动画
        document.getElementById('wordInput').classList.add('shake');
        setTimeout(() => {
            document.getElementById('wordInput').classList.remove('shake');
        }, 500);
    }
    
    feedback.classList.remove('hidden');
    updateScore();
}

function nextTestWord() {
    AppState.currentIndex++;
    displayTestWord();
}

// ==================== 挑战模式 ====================
function startChallengeMode() {
    document.getElementById('challengeMode').classList.remove('hidden');
    AppState.timeLeft = 60;
    AppState.correctCount = 0;
    AppState.wrongCount = 0;
    AppState.combo = 0;
    
    displayChallengeWord();
    startTimer();
    
    // 监听输入
    const input = document.getElementById('challengeInput');
    input.value = '';
    input.focus();
    input.onkeypress = (e) => {
        if (e.key === 'Enter') {
            checkChallengeAnswer();
        }
    };
}

function displayChallengeWord() {
    if (AppState.currentIndex >= AppState.wordList.length) {
        AppState.currentIndex = 0;
        AppState.wordList = shuffleArray(AppState.wordList);
    }
    
    const word = AppState.wordList[AppState.currentIndex];
    document.getElementById('challengeTranslation').textContent = word.translation;
    document.getElementById('challengeInput').value = '';
    document.getElementById('challengeInput').focus();
}

function startTimer() {
    AppState.timer = setInterval(() => {
        AppState.timeLeft--;
        document.getElementById('timer').textContent = `⏱️ ${AppState.timeLeft}s`;
        
        if (AppState.timeLeft <= 0) {
            clearInterval(AppState.timer);
            showResults();
        }
    }, 1000);
}

function checkChallengeAnswer() {
    const userInput = document.getElementById('challengeInput').value.trim().toLowerCase();
    const correctWord = AppState.wordList[AppState.currentIndex].word.toLowerCase();
    
    if (userInput === '') return;
    
    if (userInput === correctWord) {
        AppState.correctCount++;
        AppState.combo++;
        AppState.score += 10 + (AppState.combo * 2);
        
        // 显示成功反馈
        showQuickFeedback('✅', 'correct');
    } else {
        AppState.wrongCount++;
        AppState.combo = 0;
        
        // 显示错误反馈
        showQuickFeedback('❌', 'wrong');
    }
    
    updateChallengeStats();
    AppState.currentIndex++;
    displayChallengeWord();
}

function showQuickFeedback(emoji, type) {
    const challenge = document.querySelector('.challenge-translation');
    const original = challenge.textContent;
    challenge.textContent = emoji;
    challenge.style.fontSize = '72px';
    
    setTimeout(() => {
        challenge.style.fontSize = '42px';
    }, 200);
}

function updateChallengeStats() {
    document.getElementById('challengeScore').textContent = AppState.score;
    document.getElementById('combo').textContent = AppState.combo;
    document.getElementById('challengeCorrect').textContent = AppState.correctCount;
    document.getElementById('challengeWrong').textContent = AppState.wrongCount;
    updateScore();
}

// ==================== 通用功能 ====================
function updateScore() {
    document.getElementById('totalScore').textContent = AppState.score;
}

function updateProgress() {
    document.getElementById('progress').textContent = 
        `${AppState.currentIndex + 1}/${AppState.wordList.length}`;
}

function exitMode() {
    if (confirm('确定要退出当前模式吗？')) {
        backToMainMenu();
    }
}

function playPronunciation() {
    const word = AppState.wordList[AppState.currentIndex].word;
    speakWord(word);
}

function playTestPronunciation() {
    const word = AppState.wordList[AppState.currentIndex].word;
    speakWord(word);
}

function playChallengePronunciation() {
    const word = AppState.wordList[AppState.currentIndex].word;
    speakWord(word);
}

function speakWord(word) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    } else {
        alert('您的浏览器不支持语音播放功能');
    }
}

function showResults() {
    // 清除计时器
    if (AppState.timer) {
        clearInterval(AppState.timer);
    }
    
    document.getElementById('learnMode').classList.add('hidden');
    document.getElementById('testMode').classList.add('hidden');
    document.getElementById('challengeMode').classList.add('hidden');
    document.getElementById('resultScreen').classList.remove('hidden');
    
    // 计算统计数据
    const total = AppState.correctCount + AppState.wrongCount;
    const accuracy = total > 0 ? Math.round((AppState.correctCount / total) * 100) : 0;
    
    document.getElementById('finalScore').textContent = AppState.score;
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('completedWords').textContent = AppState.currentIndex;
    
    // 记录到学习日历
    const updates = {
        totalScore: AppState.score,
        correctCount: AppState.correctCount,
        wrongCount: AppState.wrongCount
    };
    
    if (AppState.currentMode === 'learn' || AppState.currentMode === 'wrongbook-learn') {
        updates.learnCount = AppState.currentIndex;
    } else if (AppState.currentMode === 'test' || AppState.currentMode === 'wrongbook-test') {
        updates.testCount = AppState.currentIndex;
    } else if (AppState.currentMode === 'challenge') {
        updates.challengeCount = AppState.currentIndex;
    }
    
    updateTodayRecord(updates);
    updateCalendarNotification();
}

function restartMode() {
    const mode = AppState.currentMode;
    resetAppState();
    AppState.currentMode = mode;
    showCategorySelection(mode);
}

// 页面加载完成后初始化
window.addEventListener('load', () => {
    console.log('单词王比赛应用已启动！');
    updateScore();
    
    // 加载本地存储的单词库
    loadWordDatabase();
    
    // 加载斩词数据
    loadSlashedWords();
    
    // 加载错词本数据
    loadWrongWords();
    
    // 加载学习日历数据
    loadStudyCalendar();
    
    // 设置拖拽上传
    setupDragAndDrop();
    
    // 更新统计信息
    updateSlashedCount();
    updateWrongBookCount();
    
    // 初始化今天的学习记录
    initTodayRecord();
    
    // 更新日历通知
    updateCalendarNotification();
});

// 键盘快捷键支持
document.addEventListener('keydown', (e) => {
    // 在测试模式下，按Enter提交答案
    if (!document.getElementById('testMode').classList.contains('hidden')) {
        if (e.key === 'Enter' && !document.getElementById('testFeedback').classList.contains('hidden')) {
            nextTestWord();
        } else if (e.key === 'Enter') {
            checkAnswer();
        }
    }
    
    // ESC键关闭导入对话框
    if (e.key === 'Escape' && !document.getElementById('importDialog').classList.contains('hidden')) {
        closeImportDialog();
    }
});

// ==================== Excel导入功能 ====================

// 显示导入对话框
function showImportDialog() {
    document.getElementById('importDialog').classList.remove('hidden');
    resetImportDialog();
}

// 关闭导入对话框
function closeImportDialog() {
    document.getElementById('importDialog').classList.add('hidden');
    resetImportDialog();
}

// 重置导入对话框
function resetImportDialog() {
    AppState.importedFile = null;
    AppState.parsedData = null;
    
    document.getElementById('fileInput').value = '';
    document.getElementById('fileInfo').classList.add('hidden');
    document.getElementById('importProgress').classList.add('hidden');
    document.getElementById('previewSection').classList.add('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
    document.getElementById('importBtn').disabled = true;
}

// 处理文件选择
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
}

// 处理文件
function processFile(file) {
    // 验证文件类型
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
    ];
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['xlsx', 'xls', 'csv'];
    
    if (!validExtensions.includes(fileExtension)) {
        showError('不支持的文件格式！请选择 .xlsx、.xls 或 .csv 文件。');
        return;
    }
    
    AppState.importedFile = file;
    
    // 显示文件信息
    displayFileInfo(file);
    
    // 解析文件
    parseExcelFile(file);
}

// 显示文件信息
function displayFileInfo(file) {
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = formatFileSize(file.size);
    document.getElementById('fileInfo').classList.remove('hidden');
    document.getElementById('errorMessage').classList.add('hidden');
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// 移除文件
function removeFile() {
    resetImportDialog();
}

// 解析Excel文件
function parseExcelFile(file) {
    // 显示进度
    showProgress(0, '正在读取文件...');
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            showProgress(30, '正在解析数据...');
            
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            showProgress(60, '正在处理单词数据...');
            
            // 获取第一个工作表
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // 转换为JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
            
            if (jsonData.length === 0) {
                throw new Error('Excel文件为空或格式不正确！');
            }
            
            showProgress(80, '正在格式化数据...');
            
            // 解析并格式化数据
            const parsedData = parseWordData(jsonData);
            
            showProgress(100, '解析完成！');
            
            // 保存解析后的数据
            AppState.parsedData = parsedData;
            
            // 延迟隐藏进度条，显示预览
            setTimeout(() => {
                document.getElementById('importProgress').classList.add('hidden');
                displayPreview(parsedData);
                document.getElementById('importBtn').disabled = false;
            }, 500);
            
        } catch (error) {
            console.error('解析错误:', error);
            showError('文件解析失败：' + error.message);
            document.getElementById('importProgress').classList.add('hidden');
        }
    };
    
    reader.onerror = function() {
        showError('文件读取失败，请重试！');
        document.getElementById('importProgress').classList.add('hidden');
    };
    
    reader.readAsArrayBuffer(file);
}

// 解析单词数据
function parseWordData(jsonData) {
    const wordDatabase = {};
    let totalWords = 0;
    const errors = [];
    
    // 识别列名（支持中英文）
    const columnMapping = identifyColumns(jsonData[0]);
    
    jsonData.forEach((row, index) => {
        try {
            // 获取字段值
            const word = getFieldValue(row, columnMapping.word);
            const translation = getFieldValue(row, columnMapping.translation);
            const category = getFieldValue(row, columnMapping.category) || '未分类';
            const phonetic = getFieldValue(row, columnMapping.phonetic);
            const example = getFieldValue(row, columnMapping.example);
            
            // 验证必填字段
            if (!word || !translation) {
                if (word || translation) { // 只在有部分数据时记录错误
                    errors.push(`第${index + 2}行：缺少必填字段（单词或中文释义）`);
                }
                return;
            }
            
            // 初始化分类
            if (!wordDatabase[category]) {
                wordDatabase[category] = [];
            }
            
            // 格式化音标
            let formattedPhonetic = '';
            if (phonetic) {
                formattedPhonetic = phonetic.trim();
                if (formattedPhonetic && !formattedPhonetic.startsWith('/')) {
                    formattedPhonetic = `/${formattedPhonetic}/`;
                }
            }
            
            // 添加单词数据
            wordDatabase[category].push({
                word: word.trim(),
                phonetic: formattedPhonetic,
                translation: translation.trim(),
                example: example ? example.trim() : ''
            });
            
            totalWords++;
            
        } catch (error) {
            errors.push(`第${index + 2}行：${error.message}`);
        }
    });
    
    return {
        database: wordDatabase,
        totalWords: totalWords,
        totalCategories: Object.keys(wordDatabase).length,
        errors: errors
    };
}

// 识别列名
function identifyColumns(firstRow) {
    const columns = Object.keys(firstRow);
    const mapping = {
        word: null,
        translation: null,
        category: null,
        phonetic: null,
        example: null
    };
    
    // 单词列的可能名称
    const wordNames = ['单词', 'word', 'Word', 'WORD', '英文', 'english', 'English'];
    // 中文列的可能名称
    const translationNames = ['中文', '中文释义', '释义', 'translation', 'Translation', 'chinese', 'Chinese', '意思'];
    // 分类列的可能名称
    const categoryNames = ['话题', '分类', '类别', 'category', 'Category', 'topic', 'Topic'];
    // 音标列的可能名称
    const phoneticNames = ['音标', 'phonetic', 'Phonetic', '发音'];
    // 例句列的可能名称
    const exampleNames = ['例句', 'example', 'Example', '示例', 'sentence'];
    
    columns.forEach(col => {
        if (wordNames.includes(col)) mapping.word = col;
        else if (translationNames.includes(col)) mapping.translation = col;
        else if (categoryNames.includes(col)) mapping.category = col;
        else if (phoneticNames.includes(col)) mapping.phonetic = col;
        else if (exampleNames.includes(col)) mapping.example = col;
    });
    
    // 如果没有识别到，尝试使用第一列作为单词，第二列作为翻译
    if (!mapping.word && columns.length > 0) mapping.word = columns[0];
    if (!mapping.translation && columns.length > 1) mapping.translation = columns[1];
    if (!mapping.category && columns.length > 2) mapping.category = columns[2];
    
    return mapping;
}

// 获取字段值
function getFieldValue(row, columnName) {
    if (!columnName) return '';
    const value = row[columnName];
    if (value === null || value === undefined || value === '') return '';
    return String(value).trim();
}

// 显示进度
function showProgress(percent, text) {
    document.getElementById('importProgress').classList.remove('hidden');
    document.getElementById('progressFill').style.width = percent + '%';
    document.getElementById('progressText').textContent = text;
}

// 显示错误
function showError(message) {
    document.getElementById('errorMessage').classList.remove('hidden');
    document.getElementById('errorText').textContent = message;
}

// 显示预览
function displayPreview(parsedData) {
    const { database, totalWords, totalCategories, errors } = parsedData;
    
    // 显示统计信息
    const statsHTML = `
        <div class="stat-badge">
            <strong>${totalCategories}</strong> 个分类
        </div>
        <div class="stat-badge">
            <strong>${totalWords}</strong> 个单词
        </div>
        ${errors.length > 0 ? `<div class="stat-badge" style="color: #ff9800;">
            <strong>${errors.length}</strong> 个警告
        </div>` : ''}
    `;
    document.getElementById('previewStats').innerHTML = statsHTML;
    
    // 显示分类预览
    let previewHTML = '';
    Object.keys(database).forEach(category => {
        const words = database[category];
        const displayWords = words.slice(0, 10); // 只显示前10个
        const hasMore = words.length > 10;
        
        previewHTML += `
            <div class="preview-category">
                <div class="category-header">${getCategoryIcon(category)} ${category} (${words.length}个单词)</div>
                <div class="word-list">
                    ${displayWords.map(w => `<span class="word-tag">${w.word}</span>`).join('')}
                    ${hasMore ? `<span class="word-tag" style="background: #fff; color: #999; border: 1px dashed #ddd;">+${words.length - 10}个...</span>` : ''}
                </div>
            </div>
        `;
    });
    
    document.getElementById('previewData').innerHTML = previewHTML;
    document.getElementById('previewSection').classList.remove('hidden');
    
    // 如果有错误，显示警告
    if (errors.length > 0) {
        const errorSummary = errors.slice(0, 5).join('\n');
        const moreErrors = errors.length > 5 ? `\n... 还有 ${errors.length - 5} 个警告` : '';
        showError(`发现 ${errors.length} 个问题（已跳过这些行）：\n${errorSummary}${moreErrors}`);
    }
}

// 开始导入
function startImport() {
    if (!AppState.parsedData) {
        showError('没有可导入的数据！');
        return;
    }
    
    try {
        // 合并到现有单词库
        const { database } = AppState.parsedData;
        
        Object.keys(database).forEach(category => {
            if (WordDatabase[category]) {
                // 分类已存在，合并单词（去重）
                const existingWords = new Set(WordDatabase[category].map(w => w.word.toLowerCase()));
                const newWords = database[category].filter(w => !existingWords.has(w.word.toLowerCase()));
                WordDatabase[category].push(...newWords);
            } else {
                // 新分类，直接添加
                WordDatabase[category] = database[category];
            }
        });
        
        // 保存到本地存储
        saveWordDatabase();
        
        // 显示成功消息
        showSuccess();
        
        // 延迟关闭对话框
        setTimeout(() => {
            closeImportDialog();
        }, 2000);
        
    } catch (error) {
        console.error('导入错误:', error);
        showError('导入失败：' + error.message);
    }
}

// 显示成功消息
function showSuccess() {
    const { totalWords, totalCategories } = AppState.parsedData;
    
    // 替换预览区域为成功消息
    const previewSection = document.getElementById('previewSection');
    previewSection.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 72px; margin-bottom: 20px;">✅</div>
            <h3 style="color: #28a745; margin-bottom: 15px;">导入成功！</h3>
            <p style="color: #666; font-size: 16px;">
                已成功导入 <strong style="color: #667eea;">${totalCategories}</strong> 个分类，
                共 <strong style="color: #667eea;">${totalWords}</strong> 个单词
            </p>
        </div>
    `;
    
    document.getElementById('importBtn').disabled = true;
    document.getElementById('importBtn').textContent = '导入完成';
}

// 保存单词库到本地存储
function saveWordDatabase() {
    try {
        localStorage.setItem('customWordDatabase', JSON.stringify(WordDatabase));
        console.log('单词库已保存到本地存储');
    } catch (error) {
        console.warn('无法保存到本地存储:', error);
    }
}

// ==================== 斩词功能 ====================

// 保存斩词数据
function saveSlashedWords() {
    try {
        const slashedData = {
            words: Array.from(AppState.slashedWords),
            wordsData: AppState.slashedWordsData
        };
        localStorage.setItem('slashedWords', JSON.stringify(slashedData));
        console.log(`已保存 ${AppState.slashedWords.size} 个斩词`);
        updateSlashedCount();
    } catch (error) {
        console.warn('无法保存斩词数据:', error);
    }
}

// 加载斩词数据
function loadSlashedWords() {
    try {
        const saved = localStorage.getItem('slashedWords');
        if (saved) {
            const slashedData = JSON.parse(saved);
            AppState.slashedWords = new Set(slashedData.words || []);
            AppState.slashedWordsData = slashedData.wordsData || [];
            console.log(`已加载 ${AppState.slashedWords.size} 个斩词`);
            updateSlashedCount();
        }
    } catch (error) {
        console.warn('无法加载斩词数据:', error);
    }
}

// 斩词（标记单词为已学会）
function slashWord(wordData, category, skipAnimation = false) {
    const wordKey = wordData.word.toLowerCase();
    
    if (AppState.slashedWords.has(wordKey)) {
        alert('该单词已经被斩过了！');
        return false;
    }
    
    // 添加到斩词集合
    AppState.slashedWords.add(wordKey);
    
    // 保存完整数据用于显示和恢复
    AppState.slashedWordsData.push({
        ...wordData,
        category: category,
        slashedAt: new Date().toISOString()
    });
    
    // 保存到本地存储
    saveSlashedWords();
    
    // 记录到学习日历
    updateTodayRecord({ slashedCount: 1 });
    updateCalendarNotification();
    
    // 显示斩词动画（可选）
    if (!skipAnimation) {
        showSlashAnimation();
    } else {
        // 简单提示
        showToast(`单词 "${wordData.word}" 已斩！`, 'success');
        AppState.score += 10;
        updateScore();
    }
    
    return true;
}

// 取回斩词（恢复单词到学习中）
function unslashWord(word) {
    const wordKey = word.toLowerCase();
    
    if (!AppState.slashedWords.has(wordKey)) {
        return false;
    }
    
    // 从斩词集合中移除
    AppState.slashedWords.delete(wordKey);
    
    // 从数据数组中移除
    AppState.slashedWordsData = AppState.slashedWordsData.filter(
        w => w.word.toLowerCase() !== wordKey
    );
    
    // 保存到本地存储
    saveSlashedWords();
    
    return true;
}

// 检查单词是否已斩
function isWordSlashed(word) {
    return AppState.slashedWords.has(word.toLowerCase());
}

// 过滤已斩词的单词（用于学习模式）
function filterSlashedWords(words) {
    return words.filter(w => !isWordSlashed(w.word));
}

// 显示斩词动画
function showSlashAnimation() {
    const container = document.querySelector('.word-card, .test-card, .challenge-card');
    if (!container) return;
    
    // 创建斩词特效元素
    const slashEffect = document.createElement('div');
    slashEffect.className = 'slash-effect';
    slashEffect.innerHTML = `
        <div class="slash-animation">
            <div class="slash-icon">⚔️</div>
            <div class="slash-text">单词已斩！</div>
            <div class="slash-subtext">+10 经验值</div>
        </div>
    `;
    
    container.appendChild(slashEffect);
    
    // 动画结束后移除
    setTimeout(() => {
        slashEffect.remove();
    }, 2000);
    
    // 增加得分
    AppState.score += 10;
    updateScore();
}

// 更新斩词数量显示
function updateSlashedCount() {
    const countElement = document.getElementById('slashedCount');
    if (countElement) {
        countElement.textContent = AppState.slashedWords.size;
    }
}

// 从本地存储加载单词库
function loadWordDatabase() {
    try {
        const saved = localStorage.getItem('customWordDatabase');
        if (saved) {
            const loadedDatabase = JSON.parse(saved);
            // 合并加载的数据
            Object.keys(loadedDatabase).forEach(category => {
                if (!WordDatabase[category]) {
                    WordDatabase[category] = loadedDatabase[category];
                }
            });
            console.log('已从本地存储加载自定义单词库');
        }
    } catch (error) {
        console.warn('无法从本地存储加载:', error);
    }
}

// 拖拽上传支持
function setupDragAndDrop() {
    const uploadArea = document.getElementById('fileUploadArea');
    
    if (!uploadArea) return;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('dragover');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('dragover');
        }, false);
    });
    
    uploadArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }, false);
}

// ==================== 斩词管理界面 ====================

// 显示斩词管理器
function showSlashedManager() {
    document.getElementById('slashedManager').classList.remove('hidden');
    updateSlashedManagerStats();
    displaySlashedList();
}

// 关闭斩词管理器
function closeSlashedManager() {
    document.getElementById('slashedManager').classList.add('hidden');
}

// 更新斩词管理器统计信息
function updateSlashedManagerStats() {
    // 计算单词总数
    let totalWords = 0;
    Object.values(WordDatabase).forEach(words => {
        totalWords += words.length;
    });
    
    const slashedCount = AppState.slashedWords.size;
    const slashRate = totalWords > 0 ? Math.round((slashedCount / totalWords) * 100) : 0;
    
    document.getElementById('totalSlashed').textContent = slashedCount;
    document.getElementById('totalWords').textContent = totalWords;
    document.getElementById('slashRate').textContent = slashRate + '%';
}

// 显示已斩单词列表
function displaySlashedList() {
    const listContainer = document.getElementById('slashedList');
    const emptyState = document.getElementById('emptySlashed');
    
    if (AppState.slashedWordsData.length === 0) {
        listContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    listContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    // 按斩词时间倒序排列
    const sortedWords = [...AppState.slashedWordsData].sort((a, b) => 
        new Date(b.slashedAt) - new Date(a.slashedAt)
    );
    
    let html = '';
    sortedWords.forEach((wordData, index) => {
        const slashedDate = new Date(wordData.slashedAt);
        const timeAgo = getTimeAgo(slashedDate);
        
        html += `
            <div class="slashed-item" data-word="${wordData.word.toLowerCase()}">
                <div class="slashed-word-info">
                    <div class="slashed-word-main">
                        <span class="slashed-word">${wordData.word}</span>
                        <span class="slashed-phonetic">${wordData.phonetic}</span>
                    </div>
                    <div class="slashed-translation">${wordData.translation}</div>
                    <div class="slashed-meta">
                        <span class="slashed-category">📁 ${wordData.category}</span>
                        <span class="slashed-time">⏰ ${timeAgo}</span>
                    </div>
                </div>
                <div class="slashed-actions">
                    <button class="btn-unslash" onclick="unslashWordFromList('${wordData.word}')" title="取回单词">
                        ↩️ 取回
                    </button>
                </div>
            </div>
        `;
    });
    
    listContainer.innerHTML = html;
}

// 从列表中取回单词
function unslashWordFromList(word) {
    if (confirm(`确定要取回单词 "${word}" 吗？\n取回后该单词将重新出现在学习中。`)) {
        if (unslashWord(word)) {
            displaySlashedList();
            updateSlashedManagerStats();
            updateSlashedCount();
            
            // 显示提示
            showToast(`单词 "${word}" 已取回！`, 'success');
        }
    }
}

// 过滤已斩单词列表
function filterSlashedList() {
    const searchText = document.getElementById('searchSlashed').value.toLowerCase();
    const items = document.querySelectorAll('.slashed-item');
    
    items.forEach(item => {
        const word = item.getAttribute('data-word');
        if (word.includes(searchText)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// 确认清空全部斩词
function confirmClearAll() {
    if (AppState.slashedWords.size === 0) {
        alert('没有可清空的斩词！');
        return;
    }
    
    const count = AppState.slashedWords.size;
    if (confirm(`确定要清空全部 ${count} 个斩词吗？\n此操作不可恢复！`)) {
        if (confirm('再次确认：真的要清空吗？')) {
            AppState.slashedWords.clear();
            AppState.slashedWordsData = [];
            saveSlashedWords();
            displaySlashedList();
            updateSlashedManagerStats();
            showToast('已清空全部斩词！', 'success');
        }
    }
}

// 导出斩词数据
function exportSlashedWords() {
    if (AppState.slashedWordsData.length === 0) {
        alert('没有可导出的数据！');
        return;
    }
    
    // 准备导出数据
    const exportData = AppState.slashedWordsData.map(w => ({
        单词: w.word,
        音标: w.phonetic,
        中文: w.translation,
        分类: w.category,
        例句: w.example,
        斩词时间: new Date(w.slashedAt).toLocaleString('zh-CN')
    }));
    
    // 转换为CSV格式
    const headers = ['单词', '音标', '中文', '分类', '例句', '斩词时间'];
    let csv = headers.join(',') + '\n';
    
    exportData.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            // 转义逗号和引号
            return `"${value.replace(/"/g, '""')}"`;
        });
        csv += values.join(',') + '\n';
    });
    
    // 创建下载链接
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `斩词记录_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('导出成功！', 'success');
}

// 获取相对时间
function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
}

// 显示提示消息
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 触发动画
    setTimeout(() => toast.classList.add('show'), 10);
    
    // 自动消失
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== 错词本功能 ====================

// 添加到错词本
function addToWrongBook(wordData) {
    const wordKey = wordData.word.toLowerCase();
    
    // 如果已经在错词本中，更新错误次数
    if (AppState.wrongWords.has(wordKey)) {
        const existingWord = AppState.wrongWordsData.find(w => w.word.toLowerCase() === wordKey);
        if (existingWord) {
            existingWord.wrongCount = (existingWord.wrongCount || 1) + 1;
            existingWord.lastWrongAt = new Date().toISOString();
        }
    } else {
        // 添加到错词本
        AppState.wrongWords.add(wordKey);
        
        const category = findWordCategory(wordData.word);
        AppState.wrongWordsData.push({
            ...wordData,
            category: category,
            wrongCount: 1,
            addedAt: new Date().toISOString(),
            lastWrongAt: new Date().toISOString()
        });
    }
    
    // 保存到本地存储
    saveWrongWords();
}

// 从错词本移除
function removeFromWrongBook(word) {
    const wordKey = word.toLowerCase();
    
    if (!AppState.wrongWords.has(wordKey)) {
        return false;
    }
    
    // 从错词本集合中移除
    AppState.wrongWords.delete(wordKey);
    
    // 从数据数组中移除
    AppState.wrongWordsData = AppState.wrongWordsData.filter(
        w => w.word.toLowerCase() !== wordKey
    );
    
    // 保存到本地存储
    saveWrongWords();
    
    return true;
}

// 保存错词本数据
function saveWrongWords() {
    try {
        const wrongData = {
            words: Array.from(AppState.wrongWords),
            wordsData: AppState.wrongWordsData
        };
        localStorage.setItem('wrongWords', JSON.stringify(wrongData));
        console.log(`已保存 ${AppState.wrongWords.size} 个错词`);
        updateWrongBookCount();
    } catch (error) {
        console.warn('无法保存错词本数据:', error);
    }
}

// 加载错词本数据
function loadWrongWords() {
    try {
        const saved = localStorage.getItem('wrongWords');
        if (saved) {
            const wrongData = JSON.parse(saved);
            AppState.wrongWords = new Set(wrongData.words || []);
            AppState.wrongWordsData = wrongData.wordsData || [];
            console.log(`已加载 ${AppState.wrongWords.size} 个错词`);
            updateWrongBookCount();
        }
    } catch (error) {
        console.warn('无法加载错词本数据:', error);
    }
}

// 更新错词本数量显示
function updateWrongBookCount() {
    const countElement = document.getElementById('wrongBookCount');
    if (countElement) {
        countElement.textContent = AppState.wrongWords.size;
    }
}

// 显示错词本管理器
function showWrongBookManager() {
    document.getElementById('wrongBookManager').classList.remove('hidden');
    updateWrongBookStats();
    displayWrongWordsList();
}

// 关闭错词本管理器
function closeWrongBookManager() {
    document.getElementById('wrongBookManager').classList.add('hidden');
}

// 更新错词本统计信息
function updateWrongBookStats() {
    const wrongCount = AppState.wrongWords.size;
    const totalWrongCount = AppState.wrongWordsData.reduce((sum, w) => sum + (w.wrongCount || 1), 0);
    
    document.getElementById('totalWrong').textContent = wrongCount;
    document.getElementById('totalWrongCount').textContent = totalWrongCount;
}

// 显示错词列表
function displayWrongWordsList() {
    const listContainer = document.getElementById('wrongWordsList');
    const emptyState = document.getElementById('emptyWrongBook');
    
    if (AppState.wrongWordsData.length === 0) {
        listContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    listContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    // 按错误次数倒序排列
    const sortedWords = [...AppState.wrongWordsData].sort((a, b) => 
        (b.wrongCount || 1) - (a.wrongCount || 1)
    );
    
    let html = '';
    sortedWords.forEach((wordData, index) => {
        const addedDate = new Date(wordData.addedAt);
        const timeAgo = getTimeAgo(addedDate);
        const wrongCount = wordData.wrongCount || 1;
        
        html += `
            <div class="wrong-item" data-word="${wordData.word.toLowerCase()}">
                <div class="wrong-word-info">
                    <div class="wrong-word-main">
                        <span class="wrong-word">${wordData.word}</span>
                        <span class="wrong-phonetic">${wordData.phonetic}</span>
                        <span class="wrong-count-badge">${wrongCount}次</span>
                    </div>
                    <div class="wrong-translation">${wordData.translation}</div>
                    <div class="wrong-meta">
                        <span class="wrong-category">📁 ${wordData.category}</span>
                        <span class="wrong-time">⏰ ${timeAgo}</span>
                    </div>
                </div>
                <div class="wrong-actions">
                    <button class="btn-remove-wrong" onclick="removeWrongFromList('${wordData.word}')" title="移除">
                        ✕ 移除
                    </button>
                </div>
            </div>
        `;
    });
    
    listContainer.innerHTML = html;
}

// 从列表中移除错词
function removeWrongFromList(word) {
    if (confirm(`确定要从错词本移除单词 "${word}" 吗？`)) {
        if (removeFromWrongBook(word)) {
            displayWrongWordsList();
            updateWrongBookStats();
            updateWrongBookCount();
            showToast(`单词 "${word}" 已从错词本移除！`, 'success');
        }
    }
}

// 过滤错词列表
function filterWrongWordsList() {
    const searchText = document.getElementById('searchWrongWords').value.toLowerCase();
    const items = document.querySelectorAll('.wrong-item');
    
    items.forEach(item => {
        const word = item.getAttribute('data-word');
        if (word.includes(searchText)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// 清空错词本
function confirmClearWrongBook() {
    if (AppState.wrongWords.size === 0) {
        alert('错词本是空的！');
        return;
    }
    
    const count = AppState.wrongWords.size;
    if (confirm(`确定要清空全部 ${count} 个错词吗？\\n此操作不可恢复！`)) {
        if (confirm('再次确认：真的要清空吗？')) {
            AppState.wrongWords.clear();
            AppState.wrongWordsData = [];
            saveWrongWords();
            displayWrongWordsList();
            updateWrongBookStats();
            showToast('已清空错词本！', 'success');
        }
    }
}

// 导出错词本数据
function exportWrongWords() {
    if (AppState.wrongWordsData.length === 0) {
        alert('没有可导出的数据！');
        return;
    }
    
    // 准备导出数据
    const exportData = AppState.wrongWordsData.map(w => ({
        单词: w.word,
        音标: w.phonetic,
        中文: w.translation,
        分类: w.category,
        例句: w.example,
        错误次数: w.wrongCount || 1,
        添加时间: new Date(w.addedAt).toLocaleString('zh-CN'),
        最后错误: new Date(w.lastWrongAt).toLocaleString('zh-CN')
    }));
    
    // 转换为CSV格式
    const headers = ['单词', '音标', '中文', '分类', '例句', '错误次数', '添加时间', '最后错误'];
    let csv = headers.join(',') + '\\n';
    
    exportData.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            // 转义逗号和引号
            return `\"${value.replace(/\"/g, '\"\"')}\"`;
        });
        csv += values.join(',') + '\\n';
    });
    
    // 创建下载链接
    const blob = new Blob(['\\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `错词本_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('导出成功！', 'success');
}

// 开始错词本学习（背单词模式）
function startWrongBookLearn() {
    if (AppState.wrongWordsData.length === 0) {
        alert('错词本是空的！请先在学习过程中积累错词。');
        return;
    }
    
    // 获取单词数量限制
    const wrongBookLimitInput = document.getElementById('wrongBookLimitInput');
    const wordLimit = wrongBookLimitInput && wrongBookLimitInput.value ? parseInt(wrongBookLimitInput.value) : null;
    
    if (wordLimit !== null && wordLimit <= 0) {
        alert('请输入有效的单词数量（大于0）！');
        return;
    }
    
    // 设置模式和单词列表
    AppState.currentMode = 'wrongbook-learn';
    AppState.wordList = shuffleArray([...AppState.wrongWordsData]);
    
    // 如果指定了数量限制，随机选择指定数量的单词
    if (wordLimit !== null && wordLimit < AppState.wordList.length) {
        AppState.wordList = AppState.wordList.slice(0, wordLimit);
    }
    
    AppState.currentIndex = 0;
    
    // 关闭错词本管理器
    closeWrongBookManager();
    
    // 启动背单词模式
    document.getElementById('mainMenu').classList.add('hidden');
    startLearnMode();
}

// 开始错词本测试（检查模式）
function startWrongBookTest() {
    if (AppState.wrongWordsData.length === 0) {
        alert('错词本是空的！请先在学习过程中积累错词。');
        return;
    }
    
    // 获取单词数量限制
    const wrongBookLimitInput = document.getElementById('wrongBookLimitInput');
    const wordLimit = wrongBookLimitInput && wrongBookLimitInput.value ? parseInt(wrongBookLimitInput.value) : null;
    
    if (wordLimit !== null && wordLimit <= 0) {
        alert('请输入有效的单词数量（大于0）！');
        return;
    }
    
    // 设置模式和单词列表
    AppState.currentMode = 'wrongbook-test';
    AppState.wordList = shuffleArray([...AppState.wrongWordsData]);
    
    // 如果指定了数量限制，随机选择指定数量的单词
    if (wordLimit !== null && wordLimit < AppState.wordList.length) {
        AppState.wordList = AppState.wordList.slice(0, wordLimit);
    }
    
    AppState.currentIndex = 0;
    
    // 关闭错词本管理器
    closeWrongBookManager();
    
    // 启动检查模式
    document.getElementById('mainMenu').classList.add('hidden');
    startTestMode();
}
// 斩词当前单词（优化版：直接斩词并跳转）
function slashCurrentWord() {
    const currentWord = AppState.wordList[AppState.currentIndex];
    const category = findWordCategory(currentWord.word);
    
    // 斩词（不需要确认，skipAnimation=true）
    if (slashWord(currentWord, category, true)) {
        // 从当前学习列表中移除
        AppState.wordList.splice(AppState.currentIndex, 1);
        
        // 如果没有单词了，显示结果
        if (AppState.wordList.length === 0) {
            showResults();
        } else {
            // 调整索引
            if (AppState.currentIndex >= AppState.wordList.length) {
                AppState.currentIndex = 0;
            }
            displayCurrentWord();
        }
    }
}
